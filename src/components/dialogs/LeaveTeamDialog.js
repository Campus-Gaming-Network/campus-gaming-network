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
// LeaveTeamDialog

const LeaveTeamDialog = (props) => {
  const router = useRouter();
  const toast = useToast();
  const cancelRef = React.useRef();
  const leaveTeamRef = React.useRef();
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
        <AlertDialogHeader>Leave Team</AlertDialogHeader>

        <AlertDialogBody as="form" onSubmit={handleSubmit}>
          Are you sure you want to leave{" "}
          <Text as="span" fontWeight="bold">
            {props.team ? props.team.name : ""}
          </Text>
          ?
        </AlertDialogBody>

        <AlertDialogFooter>
          {isSubmitting ? (
            <Button colorScheme="red" disabled>
              Leaving...
            </Button>
          ) : (
            <React.Fragment>
              <Button ref={leaveTeamRef} onClick={props.onClose}>
                No, nevermind
              </Button>
              <Button colorScheme="red" type="submit" ml={3}>
                Yes, I want to leave the team
              </Button>
            </React.Fragment>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default LeaveTeamDialog;
