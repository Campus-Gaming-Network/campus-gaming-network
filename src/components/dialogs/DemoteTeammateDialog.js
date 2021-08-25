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
// DemoteTeammateDialog

const DemoteTeammateDialog = (props) => {
  const router = useRouter();
  const toast = useToast();
  const cancelRef = React.useRef();
  const demoteTeammateRef = React.useRef();
  const [isSubmitting, setIsSubmitting] = useBoolean();

  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsSubmitting.on();
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
        <AlertDialogHeader>Demote Teammate</AlertDialogHeader>

        <AlertDialogBody>
          Are you sure you want to demote{" "}
          <Text as="span" fontWeight="bold">
            {props.user ? props.user.fullName : ""}
          </Text>
          ?
        </AlertDialogBody>

        <AlertDialogFooter>
          {isSubmitting ? (
            <Button colorScheme="red" disabled>
              Demoting...
            </Button>
          ) : (
            <React.Fragment>
              <Button ref={demoteTeammateRef} onClick={props.onClose}>
                No, nevermind
              </Button>
              <Button colorScheme="red" type="submit" ml={3}>
                Yes, I want to demote team
              </Button>
            </React.Fragment>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DemoteTeammateDialog;
