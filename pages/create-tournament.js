// Libraries
import React from "react";
import { useBoolean, useToast } from "@chakra-ui/react";
import { useRouter } from "next/router";
import nookies from "nookies";
import { httpsCallable } from "firebase/functions";

// Other
import { db, functions } from "src/firebase";
import firebaseAdmin from "src/firebaseAdmin";

// Utilities

// Constants
import { COOKIES, NOT_FOUND } from "src/constants/other";
import { COLLECTIONS, CALLABLES } from "src/constants/firebase";

// Components
import TournamentForm from "src/components/TournamentForm";

// Providers
import { useAuth } from "src/providers/auth";

////////////////////////////////////////////////////////////////////////////////
// getServerSideProps

export const getServerSideProps = async (context) => {
  try {
    const cookies = nookies.get(context);
    const token = Boolean(cookies?.[COOKIES.AUTH_TOKEN])
      ? await firebaseAdmin.auth().verifyIdToken(cookies[COOKIES.AUTH_TOKEN])
      : null;

    if (!Boolean(token?.uid)) {
      return NOT_FOUND;
    }
  } catch (error) {
    return NOT_FOUND;
  }

  return { props: {} };
};

////////////////////////////////////////////////////////////////////////////////
// CreateTournament

const CreateTournament = () => {
  const router = useRouter();
  const [errors, setErrors] = React.useState({});
  const [isSubmitting, setIsSubmitting] = useBoolean();
  const toast = useToast();

  const handleSubmitError = (error) => {
    setIsSubmitting.off();
    toast({
      title: "An error occurred.",
      description: error.message,
      status: "error",
      isClosable: true,
    });
  };

  const handleSubmit = async (e, formState) => {
    e.preventDefault();

    setIsSubmitting.on();
  };

  return (
    <TournamentForm
      state="create"
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
      errors={errors}
    />
  );
};

export default CreateTournament;
