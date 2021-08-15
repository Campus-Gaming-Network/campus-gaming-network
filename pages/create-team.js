// Libraries
import React from "react";
import { useToast } from "@chakra-ui/react";
import { useRouter } from "next/router";
import nookies from "nookies";
import { doc, updateDoc, collection, addDoc } from "firebase/firestore";
import { httpsCallable } from "firebase/functions";

// Other
import { db, functions } from "src/firebase";
import firebaseAdmin from "src/firebaseAdmin";

// Utilities
import { validateCreateTeam } from "src/utilities/validation";

// Constants
import { AUTH_STATUS } from "src/constants/auth";
import { COOKIES, NOT_FOUND } from "src/constants/other";
import { COLLECTIONS, CALLABLES } from "src/constants/firebase";

// Components
import TeamForm from "src/components/TeamForm";

// Providers
import { useAuth } from "src/providers/auth";

////////////////////////////////////////////////////////////////////////////////
// getServerSideProps

export const getServerSideProps = async (context) => {
  try {
    const cookies = nookies.get(context);
    const token =
      Boolean(cookies) && Boolean(cookies[COOKIES.AUTH_TOKEN])
        ? await firebaseAdmin.auth().verifyIdToken(cookies[COOKIES.AUTH_TOKEN])
        : null;
    const authStatus =
      Boolean(token) && Boolean(token.uid)
        ? AUTH_STATUS.AUTHENTICATED
        : AUTH_STATUS.UNAUTHENTICATED;

    if (authStatus === AUTH_STATUS.UNAUTHENTICATED) {
      return NOT_FOUND;
    }
  } catch (error) {
    return NOT_FOUND;
  }

  return { props: {} };
};

////////////////////////////////////////////////////////////////////////////////
// CreateTeam

const CreateTeam = () => {
  const router = useRouter();
  const [errors, setErrors] = React.useState({});
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const toast = useToast();

  const handleSubmitError = (error) => {
    setIsSubmitting(false);
    toast({
      title: "An error occurred.",
      description: error.message,
      status: "error",
      isClosable: true,
    });
  };

  const handleSubmit = async (e, formState) => {
    e.preventDefault();

    setIsSubmitting(true);

    // TODO
    // const { isValid, errors } = validateCreateEvent({
    //   ...formState,
    //   startDateTime: DateTime.local(formState.startDateTime),
    //   endDateTime: DateTime.local(formState.endDateTime),
    // });

    // setErrors(errors);

    // if (!isValid) {
    //   setIsSubmitting(false);
    //   window.scrollTo(0, 0);
    //   return;
    // }

    const teamData = {
      name: formState.name?.trim(),
      shortName: formState.shortName?.trim(),
      description: formState.description?.trim(),
      website: formState.website?.trim(),
      password: formState.password?.trim(),
    };

    const createTeam = httpsCallable(functions, CALLABLES.CREATE_TEAM);

    try {
      const {
        result: { teamId },
      } = await createTeam(teamData);
      toast({
        title: "Team created.",
        description: "Your team has been created. You will be redirected...",
        status: "success",
        isClosable: true,
      });
      setTimeout(() => {
        router.push(`/team/${teamId}`);
      }, 2000);
    } catch (error) {
      handleSubmitError(error);
    }
  };

  return (
    <TeamForm
      state="create"
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
      errors={errors}
    />
  );
};

export default CreateTeam;
