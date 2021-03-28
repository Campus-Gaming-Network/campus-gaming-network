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
      <Flex
        shadow="sm"
        borderWidth={1}
        rounded="lg"
        bg="white"
        pos="relative"
        direction="column"
        align="center"
        justifty="space-between"
        mr={4}
        p={4}
        height="125px"
      >
        <Avatar
          name={props.user.fullName}
          title={props.user.fullName}
          src={props.user.gravatarUrl}
          size="md"
        />
        <Popover trigger="hover" openDelay={600} isLazy>
          <PopoverTrigger>
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
          </PopoverTrigger>
          <Portal>
            <PopoverContent>
              <PopoverHeader>
                <Flex align="center">
                  <Avatar
                    name={props.user.fullName}
                    title={props.user.fullName}
                    src={props.user.gravatarUrl}
                    size="sm"
                    mr={2}
                  />
                  <Box>
                    <Text fontWeight="bold">{props.user.fullName}</Text>
                    {hasSchool && Boolean(props.user.status) ? (
                      <Text lineHeight="1.2" fontSize="sm" color="gray.500">
                        {props.user.displayStatus}
                        <Link
                          href={`/school/${props.user.school.id}`}
                          color="brand.500"
                        >
                          {props.user.school.formattedName}
                        </Link>
                      </Text>
                    ) : Boolean(props.user.status) ? (
                      <Text
                        lineHeight="1.2"
                        fontSize="sm"
                        fontWeight="bold"
                        color="gray.400"
                        display="flex"
                        alignItems="center"
                      >
                        {capitalize(props.user.status)}
                      </Text>
                    ) : null}
                  </Box>
                </Flex>
              </PopoverHeader>
              {hasBodyInformation ? (
                <PopoverBody>
                  <Box as="dl">
                    {props.user.bio ? (
                      <Box pb={2} pt={1}>
                        <VisuallyHidden as="dt">Bio</VisuallyHidden>
                        <Text as="dd" fontSize="sm" noOfLines={3}>
                          {props.user.bio}
                        </Text>
                      </Box>
                    ) : null}
                    {props.user.major ? (
                      <React.Fragment>
                        <Text as="dt" fontSize="xs" fontWeight="bold">
                          Major
                        </Text>
                        <Text as="dd" fontSize="xs" noOfLines={1}>
                          {props.user.major}
                        </Text>
                      </React.Fragment>
                    ) : null}
                    {props.user.minor ? (
                      <React.Fragment>
                        <Text as="dt" fontSize="xs" fontWeight="bold">
                          Minor
                        </Text>
                        <Text as="dd" fontSize="xs" noOfLines={1}>
                          {props.user.minor}
                        </Text>
                      </React.Fragment>
                    ) : null}
                  </Box>
                </PopoverBody>
              ) : null}
            </PopoverContent>
          </Portal>
        </Popover>
      </Flex>
    </React.Fragment>
  );
};

export default RecentlyCreatedUsers;
