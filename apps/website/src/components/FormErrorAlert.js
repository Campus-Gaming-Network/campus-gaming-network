// Libraries
import React from "react";
import { Alert, AlertIcon, AlertDescription } from "src/components/common";

////////////////////////////////////////////////////////////////////////////////
// FormErrorAlert

const FormErrorAlert = () => {
  return (
    <Alert status="error" mb={4} rounded="lg">
      <AlertIcon />
      <AlertDescription>
        There are errors in the form below. Please review and correct before
        submitting again.
      </AlertDescription>
    </Alert>
  );
};

export default FormErrorAlert;
