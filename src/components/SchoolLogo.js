import React from "react";
import { Image } from "@chakra-ui/core";
import { firebaseStorage } from "../firebase";
import { useAppState, useAppDispatch, ACTION_TYPES } from "../store";

const SchoolLogo = ({ schoolId, fallback, src, ...rest }) => {
  const dispatch = useAppDispatch();
  const state = useAppState();
  const [logo, setLogo] = React.useState(null);

  const getSchoolLogo = React.useCallback(() => {
    if (state.schools[schoolId] && state.schools[schoolId].logo) {
      setLogo(state.schools[schoolId].logo);
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
        })
        .catch(error => {
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
    if (schoolId && !logo) {
      getSchoolLogo();
    }
  }, [schoolId, logo, dispatch, setLogo, getSchoolLogo]);

  return logo ? <Image src={logo} {...rest} /> : fallback ? fallback : null;
};

export default SchoolLogo;
