// Libraries
import React from "react";
import { useBoolean, useToast } from "@chakra-ui/react";
import { useRouter } from "next/router";
import nookies from "nookies";
import { httpsCallable } from "firebase/functions";
import safeJsonStringify from "safe-json-stringify";

// API
import { getTeamDetails, getTeamUsers } from "src/api/team";

// Other
import { db, functions } from "src/firebase";
import firebaseAdmin from "src/firebaseAdmin";

// Utilities
import { validateCreateTeam } from "src/utilities/validation";

// Constants
import { COOKIES, NOT_FOUND } from "src/constants/other";
import { COLLECTIONS, CALLABLES } from "src/constants/firebase";

// Components
import TeamForm from "src/components/TeamForm";

// Providers
import { useAuth } from "src/providers/auth";

////////////////////////////////////////////////////////////////////////////////
// getServerSideProps

export const getServerSideProps = async (context) => {
  let token;

  try {
    const cookies = nookies.get(context);
    token = Boolean(cookies?.[COOKIES.AUTH_TOKEN])
      ? await firebaseAdmin.auth().verifyIdToken(cookies[COOKIES.AUTH_TOKEN])
      : null;

    if (!Boolean(token?.uid)) {
      return NOT_FOUND;
    }
  } catch (error) {
    return NOT_FOUND;
  }

  const [teamResponse, teamUsersResponse] = await Promise.all([
    getTeamDetails(context.params.id),
    getTeamUsers(context.params.id),
  ]);
  const { team } = teamResponse;
  const { teammates } = teamUsersResponse;

  if (!Boolean(team)) {
    return NOT_FOUND;
  }

  if (team?.roles?.leader?.id !== token.uid) {
    return NOT_FOUND;
  }

  const data = {
    params: context.params,
    team,
    teammates,
  };

  return { props: JSON.parse(safeJsonStringify(data)) };
};

////////////////////////////////////////////////////////////////////////////////
// EditTeam

const EditTeam = (props) => {
  const router = useRouter();
  const [errors, setErrors] = React.useState({});
  const [isSubmitting, setIsSubmitting] = useBoolean();
  const toast = useToast();

  const handleSubmit = (e) => {
    e.preventDefault();

    setIsSubmitting.on();
  };

  return (
    <TeamForm
      state="edit"
      team={props.team}
      teammates={props.teammates}
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
      errors={errors}
    />
  );
};

export default EditTeam;
