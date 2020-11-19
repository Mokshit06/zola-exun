import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogCloseButton,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Box,
  Button,
  Text,
  useColorModeValue,
  useToast,
} from '@chakra-ui/react';
import { useRef } from 'react';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  code: string;
}

export default function ShareModal({ isOpen, onClose, code }: ShareModalProps) {
  const cancelRef = useRef<HTMLButtonElement>();
  const toast = useToast();
  const codeColor = useColorModeValue('#edf2f7', '#ffffff14');

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(code);
      toast({
        title: 'Copied to Clipboard!',
        description: `The class code has been copied your clipboard!`,
        status: 'info',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <AlertDialog
      onOverlayClick={onClose}
      leastDestructiveRef={cancelRef}
      isOpen={isOpen}
      onClose={onClose}
      isCentered
    >
      <AlertDialogOverlay />
      <AlertDialogContent>
        <AlertDialogHeader>Share this code!</AlertDialogHeader>
        <AlertDialogCloseButton />
        <AlertDialogBody>
          Share this code with your students to join.
          <br />
          <Box
            py={2}
            px={3}
            bgColor={codeColor}
            borderRadius={5}
            mt={3}
            cursor='pointer'
            onClick={copyLink}
          >
            <Text>{code}</Text>
          </Box>
        </AlertDialogBody>
        <AlertDialogFooter>
          <Button ref={cancelRef} onClick={onClose}>
            Close
          </Button>
          <Button ml={3} colorScheme='red' onClick={copyLink}>
            Copy
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
