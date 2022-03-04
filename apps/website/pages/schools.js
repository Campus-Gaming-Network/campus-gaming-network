// Libraries
import React from "react";
import sortBy from "lodash.sortby";
import safeJsonStringify from "safe-json-stringify";

// Constants
import { NOT_FOUND } from "src/constants/other";

// Components
import SiteLayout from "src/components/SiteLayout";
import Article from "src/components/Article";
import Link from "src/components/Link";
import { mapSchool } from "src/utilities/school";
import { Box, Heading, Flex, List, ListItem } from "src/components/common";
import { API } from "src/api/new";

////////////////////////////////////////////////////////////////////////////////
// getStaticProps

export const getStaticProps = async () => {
  let schools = [];

  try {
    const response = await API().Schools.getAll();

    if (response?.data?.count) {
      schools = sortBy(response.data.schools.map(mapSchool), "name");
    }
  } catch (error) {
    return NOT_FOUND;
  }

  const data = {
    schools,
  };

  return { props: JSON.parse(safeJsonStringify(data)) };
};

////////////////////////////////////////////////////////////////////////////////
// Schools

const Schools = (props) => {
  return (
    <SiteLayout>
      <Article>
        <Flex as="header" align="center" justify="space-between" mb={12}>
          <Box>
            <Heading
              as="h2"
              fontSize="5xl"
              fontWeight="bold"
              pb={2}
              display="flex"
              alignItems="center"
            >
              Schools
            </Heading>
          </Box>
        </Flex>
        <List>
          {props.schools?.map((school) => (
            <ListItem key={school.id}>
              <Link href={school.meta.og.url}>{school.formattedName}</Link>
            </ListItem>
          ))}
        </List>
      </Article>
    </SiteLayout>
  );
};

export default Schools;
