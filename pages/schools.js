// Libraries
import React from "react";
import { Box, Heading, Flex, List, ListItem } from "@chakra-ui/react";
import firebaseAdmin from "src/firebaseAdmin";
import sortBy from "lodash.sortby";
import safeJsonStringify from "safe-json-stringify";

// Constants
import { NOT_FOUND } from "src/constants/other";

// Components
import SiteLayout from "src/components/SiteLayout";
import Article from "src/components/Article";
import Link from "src/components/Link";
import { mapSchool } from "src/utilities/school";

////////////////////////////////////////////////////////////////////////////////
// getStaticProps

export const getStaticProps = async () => {
  let schools = [];

  try {
    const response = await firebaseAdmin
      .storage()
      .bucket(process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET)
      .file("schools.json")
      .download();

    if (response && response.length) {
      try {
        const data = JSON.parse(response[0].toString()).map(mapSchool);
        schools = sortBy(data, "name");
      } catch (error) {
        return NOT_FOUND;
      }
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
