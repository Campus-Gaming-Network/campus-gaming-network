import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeartBroken } from "@fortawesome/free-solid-svg-icons";
import PageWrapper from "../components/PageWrapper";

const NotFound = () => {
  return (
    <PageWrapper>
      <p className="text-center text-3xl">
        Sorry, nothing here{" "}
        <FontAwesomeIcon icon={faHeartBroken} className="text-red-500" />
      </p>
    </PageWrapper>
  );
};

export default NotFound;
