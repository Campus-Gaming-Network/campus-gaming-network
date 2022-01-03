////////////////////////////////////////////////////////////////////////////////
// Other Utilities

// Libraries
import React from 'react';
import Filter from 'bad-words';

// Constans
import { GOOGLE_MAPS_QUERY_URL } from 'src/constants/other';

const badWordFilter = new Filter();

export const cleanBadWords = (text = '') => {
  if (!text || typeof text !== 'string' || (typeof text === 'string' && text.trim() === '')) {
    return text;
  }

  try {
    const cleaned = badWordFilter.clean(text);
    return cleaned;
  } catch (error) {
    return text;
  }
};

export const useFormFields = (initialState) => {
  const [fields, setValues] = React.useState(initialState);

  return [
    fields,
    (event) => {
      setValues({
        ...fields,
        [event.target.id]: event.target.value,
      });
    },
  ];
};

export const noop = () => {};

export const isValidUrl = (url) => Boolean(url) && (url.startsWith('http://') || url.startsWith('https://'));

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

export const googleMapsLink = (query) => {
  if (!query) {
    return undefined;
  }

  return `${GOOGLE_MAPS_QUERY_URL}${encodeURIComponent(query)}`;
};

// NOTE: This method mutates the original object, otherwise the `delete` would not work.
export const sanitizePrivateProperties = (obj = {}) => {
  for (const prop in obj) {
    // Assuming a private property starts with an underscore.
    // In the case of Firebase ref properties, they do.
    if (prop.startsWith('_')) {
      delete obj[prop];
    } else if (typeof obj[prop] === 'object') {
      sanitizePrivateProperties(obj[prop]);
    }
  }

  return obj;
};

export const cleanObjectOfBadWords = (obj = {}) => {
  const _obj = { ...obj };

  for (const prop in _obj) {
    // Assuming a private property starts with an underscore.
    // In the case of Firebase ref properties, they do.
    if (!prop.startsWith('_') && typeof _obj[prop] === 'string' && _obj[prop].trim() !== '') {
      cleanBadWords(_obj[prop]);
    } else if (['meta', 'school', 'user', 'event', 'twitter', 'og'].includes(prop)) {
      cleanObjectOfBadWords(_obj[prop]);
    }
  }

  return _obj;
};
