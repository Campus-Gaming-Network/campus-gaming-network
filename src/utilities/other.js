////////////////////////////////////////////////////////////////////////////////
// Other Utilities

import React from "react";

import { GOOGLE_MAPS_QUERY_URL } from "src/constants/other";

export const useFormFields = initialState => {
  const [fields, setValues] = React.useState(initialState);

  return [
    fields,
    event => {
      setValues({
        ...fields,
        [event.target.id]: event.target.value
      });
    }
  ];
};

export const noop = () => {};

export const isValidUrl = url =>
  url.startsWith("http://") || url.startsWith("https://");

// Move an array element from one array index to another
export const move = (array, from, to) => {
  if (from === to) {
    return array;
  }

  const newArray = [...array];

  const target = newArray[from];
  const inc = to < from ? -1 : 1;

  for (let i = from; i !== to; i += inc) {
    newArray[i] = newArray[i + inc];
  }

  newArray[to] = target;

  return newArray;
};

export const googleMapsLink = query => {
  if (!query) {
    return null;
  }

  return `${GOOGLE_MAPS_QUERY_URL}${encodeURIComponent(query)}`;
};
