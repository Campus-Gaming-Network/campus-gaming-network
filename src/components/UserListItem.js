// Libraries
import React from "react";
import {
  Box,
  Avatar,
  Flex,
  Text,
  Tooltip,
  VisuallyHidden,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
  Portal,
} from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCrown, faEllipsisV } from "@fortawesome/free-solid-svg-icons";

// Components
import Link from "src/components/Link";
import SliderCard from "src/components/SliderCard";

////////////////////////////////////////////////////////////////////////////////
// UserListItem

const UserListItem = (props) => {
  return (
    <React.Fragment>
      <SliderCard h="125px" w="150px">
        {Boolean(props.options?.length) ? (
          <Box pos="absolute" top={2} right={2}>
            <Menu>
              <MenuButton
                as={IconButton}
                size="sm"
                icon={<FontAwesomeIcon icon={faEllipsisV} />}
                aria-label="Options"
                variant="ghost"
              />
              <Portal>
                <MenuList fontSize="md">
                  {props.options.map(({ option }) => {
                    const { onClick, ...rest } = option.props;
                    return (
                      <MenuItem {...rest} onClick={() => onClick(props.user)} />
                    );
                  })}
                </MenuList>
              </Portal>
            </Menu>
          </Box>
        ) : null}
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
          {props.teamLeader ? (
            <Tooltip label="Team leader">
              <Text
                as="span"
                color="yellow.500"
                d="flex"
                fontSize="xs"
                pos="absolute"
                top="-11px"
                align="center"
                justify="center"
                rounded="full"
                shadow="sm"
                borderWidth={1}
                bg="white"
                px="2px"
                py="3px"
              >
                <FontAwesomeIcon icon={faCrown} />
                <VisuallyHidden>Team leader</VisuallyHidden>
              </Text>
            </Tooltip>
          ) : null}
        </Flex>
      </SliderCard>
    </React.Fragment>
  );
};

export default UserListItem;
