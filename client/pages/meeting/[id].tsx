import useSocket from 'contexts/SocketProvider';
import { useSingleMeeting } from 'hooks/api-hooks';
import useAuth from 'hooks/useAuth';
import { User } from 'interfaces';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';

export default function Meeting() {
  const socket = useSocket();
  const [shouldStart, setShouldStart] = useState(false);
  const [error, setError] = useState('');
  const [videoStreams, setVideoStreams] = useState<MediaStream[]>([]);
  const [peerClient, setPeerClient] = useState<any>(null);
  const videoRef = useRef<HTMLVideoElement>();
  const { query } = useRouter();
  const { user } = useAuth();
  const { id: meetingId } = query;
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
    console.log('CONNECTED', user.id);
    const call = peerClient.call(user.id, stream);
    console.log(stream);

    call?.on('stream', (userVideoStream: MediaStream) => {
      console.log('CALL STREAM');
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
    <div>
      {shouldStart && (
        <>
          <video
            ref={videoRef}
            muted
            onLoadedMetadata={() => videoRef.current.play()}
          />
          {videoStreams.map(stream => (
            <Video key={stream.id} stream={stream} />
          ))}
        </>
      )}
    </div>
  );
}

function Video({ stream }: { stream: MediaStream }) {
  const videoRef = useRef<HTMLVideoElement>();

  useEffect(() => {
    videoRef.current.srcObject = stream;
  }, []);

  return (
    <video ref={videoRef} onLoadedMetadata={() => videoRef.current.play()} />
  );
}
