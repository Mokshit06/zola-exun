import {
  AspectRatio,
  Box,
  Flex,
  Grid,
  useColorModeValue,
  useToast,
} from '@chakra-ui/react';
import { Auth } from 'components/Auth';
import Loader from 'components/Loader';
import useSocket from 'contexts/SocketProvider';
import { useSingleMeeting } from 'hooks/api-hooks';
import useAuth from 'hooks/useAuth';
import { User } from 'interfaces';
import { useRouter } from 'next/router';
import React, { useEffect, useRef, useState, VideoHTMLAttributes } from 'react';

function Meeting() {
  const socket = useSocket();
  const [shouldStart, setShouldStart] = useState(false);
  const [error, setError] = useState('');
  const [videoStreams, setVideoStreams] = useState<MediaStream[]>([]);
  const [peerClient, setPeerClient] = useState<any>(null);
  const videoRef = useRef<HTMLVideoElement>();
  const { query } = useRouter();
  const { user } = useAuth();
  const toast = useToast();
  const { id: meetingId } = query;
  const bgColor = useColorModeValue('gray.100', 'gray.700');
  const { data: meeting, error: meetingError } = useSingleMeeting(
    meetingId as string,
    {
      revalidateOnFocus: false,
      shouldRetryOnError: false,
    }
  );

  const addVideoStream = (stream: MediaStream) => {
    setVideoStreams([...videoStreams, stream]);
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
      addVideoStream(userVideoStream);
    });

    call?.on('close', () => {
      setVideoStreams(videoStreams.filter(s => s === stream));
    });
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
        call.on('stream', (userVideoStream: MediaStream) => {
          addVideoStream(userVideoStream);
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

        const peerClient = new Peer(user.id, {
          path: '/peerjs',
          host: process.env.NODE_ENV !== 'production' ? 'localhost' : '/',
          port: process.env.NODE_ENV === 'production' ? 443 : 5000,
        });

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

    peerClient.on('open', (id: string) => {
      console.log('OPEN');
      socket.emit('video-join', meetingId, id);
    });

    getVideo();

    socket.on('video-disconnected', (userId: string) => {
      console.log('DISCONNECTING');
    });
  }, [meetingId, socket, user, peerClient, shouldStart]);

  return (
    <Flex flex={1} width='full' maxH='calc(100vh - 90px)' overflow='hidden'>
      {!error || shouldStart ? (
        <Grid
          width='full'
          templateColumns='repeat(auto-fit, minmax(500px, 1fr))'
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
            <AspectRatio key={stream.id} maxw='100%' ratio={16 / 9}>
              <VideoStream stream={stream} />
            </AspectRatio>
          ))}
        </Grid>
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
