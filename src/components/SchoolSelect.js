import React from "react";
import startCase from "lodash.startcase";
import { Select } from "@chakra-ui/core";

import { useAppState } from "../store";

const SchoolSelect = props => {
  const state = useAppState();
  const schoolOptions = React.useMemo(
    () => [
      { value: "", label: "Select your school" },
      ...Object.values(state.schools).map(school => ({
        value: school.id,
        label: startCase(school.name.toLowerCase())
      }))
    ],
    []
  );

  if (!schoolOptions || !schoolOptions.length) {
    return null;
  }

  return (
    <Select
      id="school"
      name="school"
      onChange={props.onChange}
      value={props.value}
      size="lg"
    >
      <option value="">Select Your School</option>
      {schoolOptions.map(option => (
        <option key={option.value} value={option.value}>
          {startCase(option.label.toLowerCase())}
        </option>
      ))}
    </Select>
  );
};

export default SchoolSelect;
