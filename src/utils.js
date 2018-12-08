// Gets data from submitted form, returns object
export const getFormData = form => {
  const formData = new FormData(form);
  const data = {};

  for (const entry of formData.entries()) {
    data[entry[0]] = entry[1];
  }

  return data;
};
