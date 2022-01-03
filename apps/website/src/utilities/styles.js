////////////////////////////////////////////////////////////////////////////////
// Style Utilities

export const classNames = (_classNames = []) => {
  if (process.env.NODE_ENV !== 'production') {
    if (!Array.isArray(_classNames)) {
      throw new Error(
        `classNames() was expecting value with type 'array' but got type '${typeof _classNames}'.`,
        _classNames,
      );
    }
  }
  return _classNames
    .map((str) => str.trim())
    .filter((str) => str)
    .join(' ')
    .trim();
};
