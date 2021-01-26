////////////////////////////////////////////////////////////////////////////////
// Style Utilities

import { isDev } from "../utilities";

export const classNames = (_classNames = []) => {
  if (isDev()) {
    if (!Array.isArray(_classNames)) {
      throw new Error(
        `classNames() was expecting value with type 'array' but got type '${typeof _classNames}'.`,
        _classNames
      );
    }
  }
  return _classNames
    .map(str => str.trim())
    .filter(str => str)
    .join(" ")
    .trim();
};
