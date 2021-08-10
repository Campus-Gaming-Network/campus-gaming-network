// Libraries
import React from "react";
import { useToast } from "@chakra-ui/react";
import { useRouter } from "next/router";
import nookies from "nookies";
import { doc, updateDoc, setDoc, collection } from "firebase/firestore";

// Other
import { db } from "src/firebase";
import firebaseAdmin from "src/firebaseAdmin";

// Utilities
import { validateCreateTeam } from "src/utilities/validation";

// Constants
import { AUTH_STATUS } from "src/constants/auth";
import { COOKIES, NOT_FOUND } from "src/constants/other";
import { COLLECTIONS } from "src/constants/firebase";

// Components
import TeamForm from "src/components/TeamForm";

// Providers
import { useAuth } from "src/providers/auth";

////////////////////////////////////////////////////////////////////////////////
// getServerSideProps

export const getServerSideProps = async (context) => {
  if (process.env.NODE_ENV === "production") {
    return NOT_FOUND;
  }

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
  const { user, school } = useAuth();
  const router = useRouter();
  const [errors, setErrors] = React.useState({});
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const toast = useToast();

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

    const userDocRef = doc(db, COLLECTIONS.USERS, user.id);

    const teamData = {
      creator: { id: user.id, ref: userDocRef },
      name: formState.name?.trim(),
      shortName: formState.shortName?.trim(),
      description: formState.description?.trim(),
      website: formState.website?.trim(),
    };

    let teamId;

    setDoc(doc(collection(db, COLLECTIONS.TEAMS)), teamData)
      .then((teamDocRef) => {
        teamId = teamDocRef.id;

        updateDoc(doc(db, COLLECTIONS.TEAMS, teamId), { id: teamId })
          .then(() => {
            const teammateData = {
              user: {
                id: user.id,
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
              team: {
                id: teamId,
                ref: teamDocRef,
                name: teamData.name,
                shortName: teamData.shortName,
              },
            };

            setDoc(doc(collection(db, COLLECTIONS.TEAMMATES)), teammateData)
              .then(() => {
                toast({
                  title: "Team created.",
                  description:
                    "Your team has been created. You will be redirected...",
                  status: "success",
                  isClosable: true,
                });
                setTimeout(() => {
                  router.push(`/team/${teamId}`);
                }, 2000);
              })
              .catch((error) => {
                setIsSubmitting(false);
                toast({
                  title: "An error occurred.",
                  description: error.message,
                  status: "error",
                  isClosable: true,
                });
              });
          })
          .catch((error) => {
            setIsSubmitting(false);
            toast({
              title: "An error occurred.",
              description: error.message,
              status: "error",
              isClosable: true,
            });
          });
      })
      .catch((error) => {
        setIsSubmitting(false);
        toast({
          title: "An error occurred.",
          description: error.message,
          status: "error",
          isClosable: true,
        });
      });
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
