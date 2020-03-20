import React from "react";
import { firebaseFirestore } from "../firebase";

const useFetchUserProfile = id => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [profile, setProfile] = React.useState(null);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    const fetchUserProfile = async () => {
      console.log("fetchUserProfile...");
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

            setProfile({
              ref: doc,
              ...data,
              ...{
                hasFavoriteGames,
                hasCurrentlyPlaying
              }
            });
          }
          setIsLoading(false);
        })
        .catch(error => {
          console.error({ error });
          setError(error);
          setIsLoading(false);
        });
    };

    if (id) {
      fetchUserProfile();
    }
  }, [id]);

  return [profile, isLoading, error];
};

export default useFetchUserProfile;
