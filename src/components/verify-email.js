// Libraries
import React from "react";
import {
  Box,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription
} from "@chakra-ui/react";

// Components
import Article from "src/components/Article";
import SiteLayout from "src/components/SiteLayout";

////////////////////////////////////////////////////////////////////////////////
// VerifyEmail

const VerifyEmail = () => {
  const [verifyState] = React.useState("success");
  const [verificationError] = React.useState("");

  return (
    <SiteLayout title="Verify Email" hideNav hideFooter>
      <Article>
        <Alert
          status={verifyState}
          variant="subtle"
          flexDirection="column"
          justifyContent="center"
          textAlign="center"
          height="200px"
        >
          <AlertIcon height="40px" width="40px" mr={0} />
          <AlertTitle mt={4} mb={1} fontSize="lg">
            {verifyState === "success"
              ? "Email verified!"
              : "Email verification unsuccessful."}
          </AlertTitle>
          <AlertDescription maxWidth="sm">
            {verifyState === "success"
              ? "Thank you for verifying your email address."
              : verificationError}
          </AlertDescription>
        </Alert>
      </Article>
    </SiteLayout>
  );
};

export default VerifyEmail;
