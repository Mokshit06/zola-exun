import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
} from '@chakra-ui/react';
import useChats from 'contexts/ChatsProvider';
import { useChatSelectOptions } from 'hooks/api-hooks';
import { useRef, useState } from 'react';

interface ChatModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ChatModal({ onClose, isOpen }: ChatModalProps) {
  const initialRef = useRef<HTMLSelectElement>();
  const [selectedTeacher, setSelectedTeacher] = useState('');
  const { joinRoom } = useChats();
  const { data } = useChatSelectOptions();

  const handleCreate = () => {
    if (!selectedTeacher) return;

    joinRoom({ secondUser: selectedTeacher });

    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Talk to a teacher</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          If you have any doubts related to your studies, you can talk to one of
          your teachers
          <Select
            ref={initialRef}
            mt={6}
            placeholder='Select the teacher'
            variant='filled'
            value={selectedTeacher}
            onChange={e => setSelectedTeacher(e.target.value)}
          >
            {data?.map(teacher => (
              <option key={teacher.id} value={teacher.id}>
                {teacher.name}
              </option>
            ))}
          </Select>
        </ModalBody>
        <ModalFooter>
          <Button onClick={handleCreate}>Create Room</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
