// Libraries
import React from "react";
import { useToast, useBoolean } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { doc, deleteDoc } from "firebase/firestore";

// Other
import { db } from "src/firebase";

// Components
import {
  Button,
  Text,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
} from "src/components/common";

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

  const handleSubmit = async (e) => {
    e.preventDefault();

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
      <AlertDialogContent
        rounded="lg"
        borderWidth="1px"
        boxShadow="lg"
        as="form"
        onSubmit={handleSubmit}
      >
        <AlertDialogHeader>Delete '{props.tournament.name}'</AlertDialogHeader>

        <AlertDialogBody>
          Are you sure you want to delete the tournament{" "}
          <Text as="span" fontWeight="bold">
            {props.tournament.name}
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
              <Button colorScheme="red" type="submit" ml={3}>
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
