import React from "react";
import { firebaseFirestore } from "../firebase";
import { mapEvent } from "../utilities";

const initialState = {
  loading: true,
  error: null,
  data: null
};

const useFetchEventDetails = id => {
  const [state, setState] = React.useState({ ...initialState });

  React.useEffect(() => {
    const fetchEventDetails = async () => {
      console.log("fetchEventDetails...");
      setState({ ...initialState });
      firebaseFirestore
        .collection("events")
        .doc(id)
        .get()
        .then(doc => {
          if (doc.exists) {
            setState({
              ...initialState,
              loading: false,
              data: mapEvent(doc.data(), doc)
            });
          } else {
            setState({ ...initialState, loading: false });
          }
        })
        .catch(error => {
          console.error({ error });
          setState({ ...initialState, loading: false, error });
        });
    };

    if (id) {
      fetchEventDetails();
    }
  }, [id]);

  return [state.data, state.loading, state.error];
};

export default useFetchEventDetails;
