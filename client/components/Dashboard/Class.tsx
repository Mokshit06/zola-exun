import { Button, useDisclosure } from '@chakra-ui/react';
import ShareModal from 'components/Class/ShareModal';
import { NextChakraLink } from 'components/Link';
import { useClass } from 'hooks/api-hooks';
import useAuth from 'hooks/useAuth';
import { Meeting } from 'interfaces';
import api from 'lib/axios';
import { useState } from 'react';
import { MdClass, MdVideoCall } from 'react-icons/md';
import { Card, CardGrid, CardsContainer, CardButton } from './styles';

export default function Class() {
  const { user } = useAuth();
  const { data: userClass } = useClass();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [url, setURL] = useState('');

  async function createMeeting() {
    const { data: meeting } = await api.post<Meeting>('/api/meetings', {});
    const url = `${window.location.origin}/meeting/${meeting.code}`;
    setURL(url);
    onOpen();
  }

  const isTeacher = user?.isTeacher;

  return (
    <CardsContainer title='Your Class'>
      <ShareModal isOpen={isOpen} onClose={onClose} code={url} />
      <CardGrid>
        {user?.class ? (
          <>
            <NextChakraLink href='/class'>
              <Card
                card={{
                  icon: MdClass,
                  title: `${userClass?.grade} ${userClass?.section}`,
                }}
              />
            </NextChakraLink>
            {isTeacher && (
              <CardButton
                card={{
                  icon: MdVideoCall,
                  title: 'Create a Meeting',
                }}
                onClick={createMeeting}
              />
            )}
          </>
        ) : (
          <NextChakraLink href={`/class/${isTeacher ? 'create' : 'join'}`}>
            <Card
              card={{
                icon: MdClass,
                title: `${isTeacher ? 'Create' : 'Join'} your class`,
              }}
            />
          </NextChakraLink>
        )}
      </CardGrid>
    </CardsContainer>
  );
}
