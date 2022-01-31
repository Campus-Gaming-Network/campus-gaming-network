// Libraries
import React from "react";
import { useToast, useBoolean } from "@chakra-ui/react";
import { httpsCallable } from "firebase/functions";
import { useRouter } from "next/router";

// Constants
import { CALLABLES } from "src/constants/firebase";

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

// Other
import { functions } from "src/firebase";

////////////////////////////////////////////////////////////////////////////
// KickTeammateDialog

const KickTeammateDialog = (props) => {
  const router = useRouter();
  const toast = useToast();
  const cancelRef = React.useRef();
  const kickTeammateRef = React.useRef();
  const [isSubmitting, setIsSubmitting] = useBoolean();

  const handleSubmitError = (error) => {
    props.onClose();
    setIsSubmitting.off();
    toast({
      title: "An error occurred.",
      description: error.message,
      status: "error",
      isClosable: true,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsSubmitting.on();

    const data = {
      teamId: props.team.id,
      teammateId: props.teammate.id,
    };

    const kickTeammate = httpsCallable(functions, CALLABLES.KICK_TEAMMATE);

    try {
      const result = await kickTeammate(data);

      if (Boolean(result?.data?.success)) {
        toast({
          title: "Teammate kicked.",
          description: `You have kicked ${props.teammate.fullName}. You will be redirected...`,
          status: "success",
          isClosable: true,
        });
        setTimeout(() => {
          router.push(`/team/${props.team.id}/edit`);
        }, 2000);
      } else {
        handleSubmitError(result?.data?.error);
      }
    } catch (error) {
      handleSubmitError(error);
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
        <AlertDialogHeader>
          Kick {props.user.fullName} from team
        </AlertDialogHeader>

        <AlertDialogBody>
          Are you sure you want to kick{" "}
          <Text as="span" fontWeight="bold">
            {props.user.fullName}
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
