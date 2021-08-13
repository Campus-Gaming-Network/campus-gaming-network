// Libraries
import React from "react";
import { Box, Flex, Button } from "@chakra-ui/react";

const START_PAGE = 0;

////////////////////////////////////////////////////////////////////////////////
// Pagination

const Pagination = (props) => {
  const [page, setPage] = React.useState(START_PAGE);
  const isFirstPage = React.useMemo(() => page === START_PAGE, [page]);
  // const isLastPage = React.useMemo(
  //     () => hasUsers && users.length === DEFAULT_USERS_LIST_PAGE_SIZE,
  //     [hasUsers, users]
  // );
  const isValidPage = React.useMemo(() => page >= START_PAGE, [page]);
  const nextPage = () => {
    // if (!isLastPage) {
    //     setPage(page + 1);
    // }
  };

  const prevPage = () => {
    // if (!isFirstPage) {
    //     setPage(page - 1);
    // }
  };

  return (
    <Box>
      <Flex>
        {!isFirstPage ? (
          <Button
            variant="ghost"
            size="sm"
            leftIcon={<ArrowBack />}
            colorScheme="brand"
            disabled={isFirstPage}
            onClick={prevPage}
          >
            Prev Page
          </Button>
        ) : null}
        {!isLastPage ? (
          <Button
            variant="ghost"
            size="sm"
            rightIcon={<ArrowForward />}
            colorScheme="brand"
            disabled={isLastPage}
            onClick={nextPage}
            ml="auto"
          >
            Next Page
          </Button>
        ) : null}
      </Flex>
    </Box>
  );
};

export default Pagination;
