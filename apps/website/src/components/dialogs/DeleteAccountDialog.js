// Libraries
import React from 'react';
import {
  Button,
  Text,
  useToast,
  Input,
  FormLabel,
  FormControl,
  FormErrorMessage,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  useBoolean,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { signOut } from 'firebase/auth';
import { doc, deleteDoc } from 'firebase/firestore';
import { validateDeleteAccount } from '@campus-gaming-network/tools';

// Other
import { auth, db } from 'src/firebase';

// Constants
import { COLLECTIONS } from 'src/constants/firebase';

////////////////////////////////////////////////////////////////////////////
// DeleteAccountDialog

const DeleteAccountDialog = (props) => {
  const router = useRouter();
  const toast = useToast();
  const cancelRef = React.useRef();
  const [deleteConfirmation, setDeleteConfirmation] = React.useState('');
  const [isSubmitting, setIsSubmitting] = useBoolean();
  const [errors, setErrors] = React.useState({});

  const handleOnClose = () => {
    setDeleteConfirmation('');
    setIsSubmitting.off();
    setErrors({});
    props.onClose();
  };

  const onDeleteAccountConfirm = async () => {
    const { error } = validateDeleteAccount({ deleteConfirmation });

    if (error) {
      const errors = error.details.reduce((acc, curr) => ({ ...acc, [curr.path[0]]: curr.message }), {});
      setErrors(errors);
      return;
    }

    setIsSubmitting.on();

    try {
      await deleteDoc(doc(db, COLLECTIONS.USERS, props.user.id));
      props.onClose();
      setIsSubmitting.off();
      toast({
        title: 'Account deleted.',
        description: 'Your account has been deleted. You will be redirected...',
        status: 'success',
        isClosable: true,
      });
      setTimeout(() => {
        signOut(auth).then(() => router.push('/'));
      }, 2000);
    } catch (error) {
      console.error(error);
      props.onClose();
      setIsSubmitting.off();
      toast({
        title: 'An error occurred.',
        description: error.message,
        status: 'error',
        isClosable: true,
      });
    }
  };

  return (
    <AlertDialog isOpen={props.isOpen} leastDestructiveRef={cancelRef} onClose={handleOnClose}>
      <AlertDialogOverlay />
      <AlertDialogContent rounded="lg" borderWidth="1px" boxShadow="lg">
        <AlertDialogHeader>Delete Account</AlertDialogHeader>

        <AlertDialogBody>
          <Text pb={4}>
            Are you sure you want to delete your account and all related data? There is <Text as="strong">no</Text>{' '}
            coming back from this.
          </Text>
          <FormControl isRequired isInvalid={errors.deleteConfirmation}>
            <FormLabel htmlFor="deleteConfirmation" fontWeight="bold">
              Type "DELETE" to confirm account deletion.
            </FormLabel>
            <Input
              id="deleteConfirmation"
              name="deleteConfirmation"
              type="text"
              placeholder="DELETE"
              onChange={(e) => setDeleteConfirmation(e.target.value)}
              value={deleteConfirmation}
            />
            <FormErrorMessage>{errors.deleteConfirmation}</FormErrorMessage>
          </FormControl>
        </AlertDialogBody>

        <AlertDialogFooter>
          {isSubmitting ? (
            <Button colorScheme="red" disabled={true}>
              Deleting...
            </Button>
          ) : (
            <React.Fragment>
              <Button ref={cancelRef} onClick={handleOnClose}>
                No, nevermind
              </Button>
              <Button colorScheme="red" onClick={onDeleteAccountConfirm} ml={3}>
                Yes, delete my account.
              </Button>
            </React.Fragment>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteAccountDialog;
