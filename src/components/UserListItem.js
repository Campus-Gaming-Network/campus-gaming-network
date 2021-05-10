// Libraries
import React from "react";
import { Box, Avatar, Flex } from "@chakra-ui/react";

// Components
import Link from "src/components/Link";
import SliderCard from "src/components/SliderCard";

////////////////////////////////////////////////////////////////////////////////
// RecentlyCreatedUsers

const RecentlyCreatedUsers = (props) => {
  return (
    <React.Fragment>
      <SliderCard h="125px">
        <Flex direction="column" align="center" justify="space-between">
          <Avatar
            name={props.user.fullName}
            title={props.user.fullName}
            src={props.user.gravatarUrl}
            size="md"
          />
          <Box d="inline-flex">
            <Link
              href={`/user/${props.user.id}`}
              color="brand.500"
              fontWeight="bold"
              mt={4}
              fontSize="sm"
              lineHeight="1.2"
              textAlign="center"
            >
              {props.user.fullName}
            </Link>
          </Box>
        </Flex>
      </SliderCard>
    </React.Fragment>
  );
};

export default RecentlyCreatedUsers;
