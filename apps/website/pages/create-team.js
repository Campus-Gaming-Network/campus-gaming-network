// Libraries
import React from 'react';
import { useBoolean, useToast } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import nookies from 'nookies';
import { httpsCallable } from 'firebase/functions';
import { validateCreateTeam } from '@campus-gaming-network/tools';

// Other
import { db, functions } from 'src/firebase';
import firebaseAdmin from 'src/firebaseAdmin';

// Constants
import { COOKIES, NOT_FOUND } from 'src/constants/other';
import { COLLECTIONS, CALLABLES } from 'src/constants/firebase';

// Components
import TeamForm from 'src/components/TeamForm';

// Providers
import { useAuth } from 'src/providers/auth';

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
// CreateTeam

const CreateTeam = () => {
  const router = useRouter();
  const [errors, setErrors] = React.useState({});
  const [isSubmitting, setIsSubmitting] = useBoolean();
  const toast = useToast();

  const handleSubmitError = (error) => {
    setIsSubmitting.off();
    toast({
      title: 'An error occurred.',
      description: error?.message || 'There was an error creating the team. Please try again.',
      status: 'error',
      isClosable: true,
    });
  };

  const handleSubmit = async (e, formState) => {
    e.preventDefault();

    setIsSubmitting.on();

    const { error } = validateCreateTeam(formState);

    if (error) {
      const errors = error.details.reduce((acc, curr) => ({ ...acc, [curr.path[0]]: curr.message }), {});
      setErrors(errors);
      setIsSubmitting.off();
      window.scrollTo(0, 0);
      return;
    }

    const teamData = {
      name: formState.name?.trim(),
      shortName: formState.shortName?.trim(),
      description: formState.description?.trim(),
      website: formState.website?.trim(),
      password: formState.password?.trim(),
    };

    const createTeam = httpsCallable(functions, CALLABLES.CREATE_TEAM);

    try {
      const result = await createTeam(teamData);

      if (Boolean(result?.data?.teamId)) {
        toast({
          title: 'Team created.',
          description: 'Your team has been created. You will be redirected...',
          status: 'success',
          isClosable: true,
        });
        setTimeout(() => {
          router.push(`/team/${result.data.teamId}`);
        }, 2000);
      } else {
        handleSubmitError(result?.data?.error);
      }
    } catch (error) {
      handleSubmitError(error);
    }
  };

  return <TeamForm state="create" onSubmit={handleSubmit} isSubmitting={isSubmitting} errors={errors} />;
};

export default CreateTeam;
