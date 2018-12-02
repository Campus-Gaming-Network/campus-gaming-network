// Dynamic sorting
// Source: https://www.sitepoint.com/sort-an-array-of-objects-in-javascript/
export const compareValues = (key, order = "asc") => {
  return (a, b) => {
    if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
      // property doesn't exist on either object
      return 0;
    }

    const varA = typeof a[key] === "string" ? a[key].toUpperCase() : a[key];
    const varB = typeof b[key] === "string" ? b[key].toUpperCase() : b[key];

    let comparison = 0;
    if (varA > varB) {
      comparison = 1;
    } else if (varA < varB) {
      comparison = -1;
    }
    return order === "desc" ? comparison * -1 : comparison;
  };
};


// Converts string to kebab case
// e.g. Foo bar => foo-bar
// Source: https://gist.github.com/thevangelist/8ff91bac947018c9f3bfaad6487fa149#gistcomment-2063326
export const kebabCase = str => {
  return str
    .replace(/([a-z])([A-Z])/g, "$1-$2") // get all lowercase letters that are near to uppercase ones
    .replace(/[\s_]+/g, "-") // replace all spaces and low dash
    .toLowerCase(); // convert to lower case
};
