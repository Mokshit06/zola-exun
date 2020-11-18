import useSocket from 'contexts/SocketProvider';
import useAuth from 'hooks/useAuth';
import { User } from 'interfaces';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';

export default function Meeting() {
  const socket = useSocket();
  const [videoStreams, setVideoStreams] = useState<MediaStream[]>([]);
  const videoRef = useRef<HTMLVideoElement>();
  const { query } = useRouter();
  const { user } = useAuth();

  const { id: meetingId } = query;

  const getVideo = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,
      });

      videoRef.current.srcObject = stream;
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (!socket || !meetingId) return;

    socket.emit('video-join', meetingId, user.id);

    getVideo();

    socket.on('video-disconnected', (userId: string) => {
      console.log('DISCONNECTING');
    });

    socket.on('video-connected', (user: User) => {
      console.log('CONNECTING');
    });
  }, [meetingId, socket]);

  return (
    <div>
      <video
        ref={videoRef}
        muted
        onLoadedMetadata={() => videoRef.current.play()}
      />
      {videoStreams.map(stream => (
        <Video stream={stream} />
      ))}
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
