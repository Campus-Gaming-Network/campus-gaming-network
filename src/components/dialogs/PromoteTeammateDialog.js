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
import { httpsCallable } from "firebase/functions";
import { useRouter } from "next/router";

// Constants
import { CALLABLES } from "src/constants/firebase";

// Other
import { functions } from "src/firebase";

////////////////////////////////////////////////////////////////////////////
// PromoteTeammateDialog

const PromoteTeammateDialog = (props) => {
  const router = useRouter();
  const toast = useToast();
  const cancelRef = React.useRef();
  const promoteTeammateRef = React.useRef();
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
      role: props.promotion,
    };

    const promoteTeammate = httpsCallable(
      functions,
      CALLABLES.PROMOTE_TEAMMATE
    );

    try {
      const result = await promoteTeammate(data);

      if (Boolean(result?.data?.success)) {
        toast({
          title: "Teammate promoted.",
          description: `You have promoted "${props.teammate.fullName}". You will be redirected...`,
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
        <AlertDialogHeader>Promote Teammate</AlertDialogHeader>

        <AlertDialogBody>
          Are you sure you want to promote{" "}
          <Text as="span" fontWeight="bold">
            {props.user ? props.user.fullName : ""}
          </Text>
          ?
        </AlertDialogBody>

        <AlertDialogFooter>
          {isSubmitting ? (
            <Button colorScheme="brand" disabled>
              Promoting...
            </Button>
          ) : (
            <React.Fragment>
              <Button ref={promoteTeammateRef} onClick={props.onClose}>
                No, nevermind
              </Button>
              <Button colorScheme="brand" type="submit" ml={3}>
                Yes, I want to promote them
              </Button>
            </React.Fragment>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default PromoteTeammateDialog;
