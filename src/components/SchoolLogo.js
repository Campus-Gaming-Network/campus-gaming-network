import React from "react";
import { Image } from "@chakra-ui/core";
import { firebaseStorage } from "../firebase";
import { useAppState, useAppDispatch, ACTION_TYPES } from "../store";

const SchoolLogo = React.memo(
  ({ schoolId, schoolName, fallback, src, ...rest }) => {
    const dispatch = useAppDispatch();
    const state = useAppState();
    const [logo, setLogo] = React.useState(null);
    const [isFetching, setIsFetching] = React.useState(false);

    const getSchoolLogo = React.useCallback(() => {
      setIsFetching(true);

      if (state.schools[schoolId] && state.schools[schoolId].logo) {
        setLogo(state.schools[schoolId].logo);
        setIsFetching(false);
      } else {
        const storageRef = firebaseStorage.ref();
        const pathRef = storageRef.child(`schools/${schoolId}/images/logo.jpg`);

        pathRef
          .getDownloadURL()
          .then(url => {
            if (url) {
              setLogo(url);
              dispatch({
                type: ACTION_TYPES.SET_SCHOOL_LOGO,
                payload: {
                  id: schoolId,
                  logo: url
                }
              });
            }
            setIsFetching(false);
          })
          .catch(error => {
            setIsFetching(false);

            if (error.code !== "storage/object-not-found") {
              if (error.message) {
                console.error(error.message);
              } else {
                console.error(error);
              }
            }
          });
      }
    }, [schoolId, state.schools, dispatch]);

    React.useEffect(() => {
      if (schoolId && !logo && !isFetching) {
        getSchoolLogo();
      }
    }, [schoolId, logo, dispatch, setLogo, getSchoolLogo, isFetching]);

    return fallback;

    // TODO: Revisit
    // return logo ? (
    //   <Image src={logo} alt={`The school logo for ${schoolName}`} {...rest} />
    // ) : fallback ? (
    //   fallback
    // ) : null;
  }
);

export default SchoolLogo;
