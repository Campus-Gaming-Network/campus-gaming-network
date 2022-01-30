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
// DeleteTeamDialog

const DeleteTeamDialog = (props) => {
  const router = useRouter();
  const toast = useToast();
  const cancelRef = React.useRef();
  const deleteTeamRef = React.useRef();
  const [isSubmitting, setIsSubmitting] = useBoolean();

  const onDeleteTeamConfirm = async () => {
    setIsSubmitting.on();

    try {
      await deleteDoc(doc(db, COLLECTIONS.TEAMS, props.team.id));

      props.onClose();
      setIsSubmitting.off();
      toast({
        title: "Team deleted.",
        description: `Team '${props.team.name}' has been deleted. You will be redirected...`,
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
        <AlertDialogHeader>Delete '{props.team.name}'</AlertDialogHeader>

        <AlertDialogBody>
          Are you sure you want to delete the team{" "}
          <Text as="span" fontWeight="bold">
            {props.team.name}
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
              <Button ref={deleteTeamRef} onClick={props.onClose}>
                No, nevermind
              </Button>
              <Button colorScheme="red" onClick={onDeleteTeamConfirm} ml={3}>
                Yes, I want to delete the team
              </Button>
            </React.Fragment>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteTeamDialog;
