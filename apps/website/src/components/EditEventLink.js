// Libraries
import React from "react";
import { Box } from "src/components/common";

// Components
import Link from "src/components/Link";

////////////////////////////////////////////////////////////////////////////////
// EditEventLink

const EditEventLink = (props) => {
  return (
    <Box mb={10} textAlign="center" display="flex" justifyContent="center">
      <Link
        href={`/event/${props.eventId}/edit`}
        fontWeight="bold"
        width="100%"
        borderRadius="md"
        bg="gray.100"
        _focus={{ bg: "gray.200", boxShadow: "outline" }}
        _hover={{ bg: "gray.200" }}
        p={8}
      >
        Edit Event
      </Link>
    </Box>
  );
};

export default EditEventLink;
