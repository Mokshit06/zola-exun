import {
  AspectRatio,
  Box,
  Flex,
  Grid,
  IconButton,
  useColorModeValue,
  useToast,
} from '@chakra-ui/react';
import { Auth } from 'components/Auth';
import Loader from 'components/Loader';
import useSocket from 'contexts/SocketProvider';
import { useSingleMeeting } from 'hooks/api-hooks';
import useAuth from 'hooks/useAuth';
import { User } from 'interfaces';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Peer from 'peerjs';
import React, { useEffect, useRef, useState, VideoHTMLAttributes } from 'react';
import { MdCallEnd } from 'react-icons/md';

interface VideoStream {
  stream: MediaStream;
  user: string;
}

function Meeting() {
  const socket = useSocket();
  const [shouldStart, setShouldStart] = useState(false);
  const [error, setError] = useState('');
  const [videoStreams, setVideoStreams] = useState<VideoStream[]>([]);
  const [peerClient, setPeerClient] = useState<any>(null);
  const videoRef = useRef<HTMLVideoElement>();
  const router = useRouter();
  const { user } = useAuth();
  const peers = {};
  const [hangMeeting, setHangMeeting] = useState<() => void>(null);
  const toast = useToast();
  const { id: meetingId } = router.query;
  const bgColor = useColorModeValue('gray.100', 'gray.700');
  const { data: meeting, error: meetingError } = useSingleMeeting(
    meetingId as string,
    {
      revalidateOnFocus: false,
      shouldRetryOnError: false,
    }
  );

  const addVideoStream = (userId: string, stream: MediaStream) => {
    setVideoStreams([
      ...videoStreams,
      {
        user: userId,
        stream,
      },
    ]);
  };

  const connectNewUser = (user: User, stream: MediaStream) => {
    const call = peerClient.call(user.id, stream);

    toast({
      title: `${user.name} joined the meeting`,
      status: 'info',
      duration: 3000,
      isClosable: true,
    });

    call?.on('stream', (userVideoStream: MediaStream) => {
      addVideoStream(user.id, userVideoStream);
    });

    call?.on('close', () => {
      console.log('CLOSE');
      setVideoStreams(videoStreams.filter(s => s.user === user.id));
    });

    peers[user.id] = call;
  };

  const getVideo = async () => {
    try {
      if (!peerClient) return;

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,
      });

      videoRef.current.srcObject = stream;

      peerClient.on('call', call => {
        console.log('ANSWER');
        call.answer(stream);
        console.log(call);
        call.on('stream', (userVideoStream: MediaStream) => {
          addVideoStream(call.peer, userVideoStream);
        });
      });

      socket.on('video-connected', (user: User) => {
        console.log('CONNECTING');
        setTimeout(() => {
          console.log('CONNECT');
          connectNewUser(user, stream);
        }, 4000);
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (!shouldStart || !user) return;

    if (typeof window !== 'undefined') {
      const peerRun = async () => {
        const { default: Peer } = await import('peerjs');
        const opts: Peer.PeerJSOption = {
          path: '/peerjs',
          host:
            process.env.NODE_ENV == 'production'
              ? 'api.zola.mokshitjain.co'
              : 'localhost',
        };

        if (process.env.NODE_ENV !== 'production') {
          opts.port = 5000;
        }

        const peerClient = new Peer(user.id, opts);

        console.log('CLIENT CREATED');
        setPeerClient(peerClient);
      };

      peerRun();
    }
  }, [shouldStart, user]);

  useEffect(() => {
    if (!meetingError && !meeting) return;

    if (meetingError) {
      return setError(meetingError.message);
    }

    setShouldStart(true);
  }, [meeting, meetingError]);

  useEffect(() => {
    if (!socket || !meetingId || !peerClient || !shouldStart) return;

    const disconnectUser = () => {
      socket.emit('disconnected-video');
    };

    setHangMeeting(() => () => {
      disconnectUser();
      const myStream = videoRef.current.srcObject;
      const tracks = (myStream as any).getTracks();

      tracks.forEach(track => {
        track.stop();
      });

      videoRef.current.srcObject = null;

      router.push('/');
    });

    router.events.on('routeChangeStart', disconnectUser);

    peerClient.on('open', (id: string) => {
      console.log('OPEN');
      socket.emit('video-join', meetingId, id);
    });

    getVideo();

    socket.on('video-disconnected', (userId: string) => {
      console.log('DISCONNECTING');
      setTimeout(() => {
        peers[userId]?.close();

        setVideoStreams(videoStreams =>
          videoStreams.filter(s => s.user == userId)
        );
      }, 3000);
    });

    return () => {
      router.events.off('routeChangeStart', disconnectUser);
      socket.off('video-disconnected');
    };
  }, [meetingId, socket, user, peerClient, shouldStart]);

  return (
    <Flex flex={1} width='full' maxH='calc(100vh - 90px)' overflow='hidden'>
      <Head>
        <title>Meeting | Zola</title>
      </Head>
      {!error || shouldStart ? (
        <>
          <Grid
            width='full'
            templateColumns='repeat(auto-fit, minmax(400px, 1fr))'
            alignContent='center'
            bgColor={bgColor}
            overflowX='hidden'
          >
            <AspectRatio overflow='hidden' maxw='100%' ratio={16 / 9}>
              <video
                ref={videoRef}
                muted
                onLoadedMetadata={() => videoRef.current.play()}
              />
            </AspectRatio>
            {videoStreams.map(stream => (
              <AspectRatio key={stream.user} maxw='100%' ratio={16 / 9}>
                <VideoStream stream={stream.stream} />
              </AspectRatio>
            ))}
          </Grid>
          <Box
            pos='absolute'
            bottom='30px'
            left='50%'
            transform='translateX(-50%)'
            zIndex={1000}
          >
            <IconButton
              onClick={hangMeeting}
              size='lg'
              colorScheme='red'
              fontSize={25}
              isRound
              aria-label='End meeting'
              icon={<MdCallEnd />}
            />
          </Box>
        </>
      ) : (
        <Loader />
      )}
    </Flex>
  );
}

export default Auth(Meeting);

function VideoStream({
  stream,
  ...rest
}: { stream: MediaStream } & VideoHTMLAttributes<HTMLVideoElement>) {
  const videoRef = useRef<any>();

  useEffect(() => {
    videoRef.current.srcObject = stream;
  }, []);

  return (
    <video
      ref={videoRef}
      {...rest}
      onLoadedMetadata={() => videoRef.current.play()}
    />
  );
}
