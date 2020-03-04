import React from "react";
import { firebaseFirestore } from "../firebase";

const useFetchUserProfile = id => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [userProfile, setUserProfile] = React.useState(null);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    const loadUserProfile = async () => {
      setIsLoading(true);
      firebaseFirestore
        .collection("users")
        .doc(id)
        .get()
        .then(doc => {
          if (doc.exists) {
            const data = doc.data();
            const hasFavoriteGames =
              data.favoriteGames && data.favoriteGames.length;
            const hasCurrentlyPlaying =
              data.currentlyPlaying && data.currentlyPlaying.length;

            setUserProfile({
              ref: doc,
              ...data,
              ...{
                hasFavoriteGames,
                hasCurrentlyPlaying
              }
            });
            setIsLoading(false);
          }
        })
        .catch(error => {
          console.error({ error });
          setError(error);
          setIsLoading(false);
        });
    };

    if (id) {
      loadUserProfile();
    }
  }, [id]);

  console.log({ isLoading, userProfile, error });

  return [userProfile, isLoading, error];
};

export default useFetchUserProfile;
