import React from "react";
import { Link as ReachLink } from "@reach/router";
import { Link as ChakraLink } from "@chakra-ui/core";

const Link = props => <ChakraLink as={ReachLink} {...props} />;

export default Link;
