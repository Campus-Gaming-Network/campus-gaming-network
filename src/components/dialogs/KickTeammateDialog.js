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
// KickTeammateDialog

const KickTeammateDialog = (props) => {
  const router = useRouter();
  const toast = useToast();
  const cancelRef = React.useRef();
  const kickTeammateRef = React.useRef();
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
      <AlertDialogContent rounded="lg" borderWidth="1px" boxShadow="lg">
        <AlertDialogHeader>Kick Teammate</AlertDialogHeader>

        <AlertDialogBody as="form" onSubmit={handleSubmit}>
          Are you sure you want to kick{" "}
          <Text as="span" fontWeight="bold">
            {props.user ? props.user.fullName : ""}
          </Text>
          ?
        </AlertDialogBody>

        <AlertDialogFooter>
          {isSubmitting ? (
            <Button colorScheme="red" disabled>
              Kicking...
            </Button>
          ) : (
            <React.Fragment>
              <Button ref={kickTeammateRef} onClick={props.onClose}>
                No, nevermind
              </Button>
              <Button colorScheme="red" type="submit" ml={3}>
                Yes, I want to kick them from the team
              </Button>
            </React.Fragment>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default KickTeammateDialog;
