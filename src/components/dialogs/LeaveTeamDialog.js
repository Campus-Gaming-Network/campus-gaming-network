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
import { httpsCallable } from "firebase/firestore";

// Constants
import { CALLABLES } from "src/constants/firebase";

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

    const leaveTeam = httpsCallable(functions, CALLABLES.LEAVE_TEAM);

    try {
      await leaveTeam({ teamId: props.team.id });

      props.onClose();
      setIsSubmitting.off();
      toast({
        title: "Team left.",
        description: `You have left team ${props.team.name}. You will be redirected...`,
        status: "success",
        isClosable: true,
      });
      setTimeout(() => {
        router.push("/teams");
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
        <AlertDialogHeader>Leave Team</AlertDialogHeader>

        <AlertDialogBody>
          Are you sure you want to leave{" "}
          <Text as="span" fontWeight="bold">
            {props?.team?.name || ""}
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
