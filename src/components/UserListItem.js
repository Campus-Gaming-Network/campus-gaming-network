// Libraries
import React from "react";
import {
  Box,
  Text,
  Avatar,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  Flex,
  VisuallyHidden,
  Portal,
} from "@chakra-ui/react";
import capitalize from "lodash.capitalize";

// Components
import Link from "src/components/Link";
import SliderCard from "src/components/SliderCard";

const RecentlyCreatedUsers = (props) => {
  const hasBodyInformation = React.useMemo(() => {
    return (
      [props.user.bio, props.user.major, props.user.minor].filter((s) => s)
        .length > 0
    );
  }, [props.user]);
  const hasSchool = React.useMemo(() => {
    return Boolean(props.user.school) && Boolean(props.user.school.name);
  }, [props.user]);

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
