// Libraries
import React from "react";
import { Box, Heading, Flex, List, ListItem } from "@chakra-ui/react";
import sortBy from "lodash.sortby";
import { functions } from "src/firebase";
import { httpsCallable } from "firebase/functions";

// Components
import SiteLayout from "src/components/SiteLayout";
import Article from "src/components/Article";
import Link from "src/components/Link";
import { mapSchool } from "src/utilities/school";

////////////////////////////////////////////////////////////////////////////////
// getStaticProps

export const getStaticProps = async () => {
  return { props: {} };
};

////////////////////////////////////////////////////////////////////////////////
// Schools

const Schools = () => {
  const [schools, setSchools] = React.useState(null);

  const fetchSchools = async () => {
    const getAllSchools = httpsCallable(functions, "getAllSchools");

    try {
      const response = await getAllSchools();

      if (response?.data?.success) {
        const schools = sortBy(response.data.schools.map(mapSchool), "name");
        setSchools(schools);
      }
    } catch (error) {
      console.log(error);
    }
  };

  React.useEffect(() => {
    fetchSchools();
  }, []);

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
          {schools?.map((school) => (
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
