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
  const { user, school } = useAuth();
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

    const userDocRef = doc(db, COLLECTIONS.USERS, user.id);
    const schoolDocRef = doc(db, COLLECTIONS.SCHOOLS, school.id);

    const tournamentData = {
      name: formState.name?.trim(),
      description: formState.description?.trim(),
      tournamentFormat: formState.tournamentFormat,
      holdThirdPlaceMatch: formState.holdThirdPlaceMatch,
      grandFinalsModifier: formState.grandFinalsModifier,
      rankedBy: formState.rankedBy,
      ptsForMatchWin: formState.ptsForMatchWin,
      ptsForMatchTie: formState.ptsForMatchTie,
      ptsForGameWin: formState.ptsForGameWin,
      ptsForGameTie: formState.ptsForGameTie,
      ptsForBye: formState.ptsForBye,
      rrPtsForMatchWin: formState.rrPtsForMatchWin,
      rrPtsForMatchTie: formState.rrPtsForMatchTie,
      rrPtsForGameWin: formState.rrPtsForGameWin,
      rrPtsForGameTie: formState.rrPtsForGameTie,
      creator: {
        id: userDocRef.id,
        ref: userDocRef,
        firstName: user.firstName,
        lastName: user.lastName,
        gravatar: user.gravatar,
        status: user.status,
        school: {
          ref: user.school.ref,
          id: user.school.id,
          name: user.school.name,
        },
      },
      school: {
        ref: schoolDocRef,
        id: schoolDocRef.id,
        name: school.name,
      },
      participants: 0,
    };

    const createTournament = httpsCallable(
      functions,
      CALLABLES.CREATE_TOURNAMENT
    );

    try {
      const result = await createTournament(tournamentData);

      if (Boolean(result?.data?.tournamentId)) {
        toast({
          title: "Tournament created.",
          description:
            "Your tournament has been created. You will be redirected...",
          status: "success",
          isClosable: true,
        });
        setTimeout(() => {
          router.push(`/tournament/${result.data.tournamentId}`);
        }, 2000);
      } else {
        handleSubmitError(result?.data?.error);
      }
    } catch (error) {
      handleSubmitError(error);
    }
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
