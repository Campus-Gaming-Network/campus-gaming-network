import React from "react";
import { Image } from "@chakra-ui/core";
import { firebaseStorage } from "../firebase";
import { useAppState, useAppDispatch, ACTION_TYPES } from "../store";
import { getSchoolLogoPath } from "../utilities";

const ERRORED_LOGOS = {};

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
        const pathRef = storageRef.child(getSchoolLogoPath(schoolId));

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
            ERRORED_LOGOS[schoolId] = error;
          });
      }
    }, [schoolId, state.schools, dispatch]);

    React.useEffect(() => {
      if (schoolId && !logo && !isFetching && !ERRORED_LOGOS[schoolId]) {
        getSchoolLogo();
      }
    }, [schoolId, logo, dispatch, setLogo, getSchoolLogo, isFetching]);

    // TODO: Revisit
    return logo ? (
      <Image
        src={logo}
        alt={`The school logo for ${schoolName}`}
        loading="lazy"
        {...rest}
      />
    ) : fallback ? (
      fallback
    ) : null;
  }
);

export default SchoolLogo;
