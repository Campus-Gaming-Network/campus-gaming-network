// Libraries
import React from "react";
import {
  Button,
  Text,
  useToast,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  useBoolean,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { doc, deleteDoc } from "firebase/firestore";

// Other
import { db } from "src/firebase";

// Constants
import { COLLECTIONS } from "src/constants/firebase";

////////////////////////////////////////////////////////////////////////////
// DeleteTournamentDialog

const DeleteTournamentDialog = (props) => {
  const router = useRouter();
  const toast = useToast();
  const cancelRef = React.useRef();
  const deleteTournamentRef = React.useRef();
  const [isSubmitting, setIsSubmitting] = useBoolean();

  const onDeleteTournamentConfirm = async () => {
    setIsSubmitting.on();

    try {
      await deleteDoc(doc(db, COLLECTIONS.TOURNAMENT, props.tournament.id));

      props.onClose();
      setIsSubmitting.off();
      toast({
        title: "Tournament deleted.",
        description: `Tournament ${props.tournament.name} has been deleted. You will be redirected...`,
        status: "success",
        isClosable: true,
      });
      setTimeout(() => {
        router.push("/");
      }, 2000);
    } catch (error) {
      console.error(error);
      props.onClose();
      setIsSubmitting.off();
      toast({
        title: "An error occurred.",
        description: error.message,
        status: "error",
        isClosable: true,
      });
    }
  };

  return (
    <AlertDialog
      isOpen={props.isOpen}
      leastDestructiveRef={cancelRef}
      onClose={props.onClose}
    >
      <AlertDialogOverlay />
      <AlertDialogContent rounded="lg" borderWidth="1px" boxShadow="lg">
        <AlertDialogHeader>Delete Tournament</AlertDialogHeader>

        <AlertDialogBody>
          Are you sure you want to delete the tournament{" "}
          <Text as="span" fontWeight="bold">
            {props.tournament ? props.tournament.name : ""}
          </Text>
          ?
        </AlertDialogBody>

        <AlertDialogFooter>
          {isSubmitting ? (
            <Button colorScheme="red" disabled={true}>
              Deleting...
            </Button>
          ) : (
            <React.Fragment>
              <Button ref={deleteTournamentRef} onClick={props.onClose}>
                No, nevermind
              </Button>
              <Button
                colorScheme="red"
                onClick={onDeleteTournamentConfirm}
                ml={3}
              >
                Yes, I want to delete the tournament
              </Button>
            </React.Fragment>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteTournamentDialog;
