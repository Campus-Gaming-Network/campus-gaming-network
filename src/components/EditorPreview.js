// Libraries
import React from "react";
import { Box } from "@chakra-ui/react";
import DOMPurify from "dompurify";

////////////////////////////////////////////////////////////////////////////////
// EditorPreview

const EditorPreview = ({ content, ...rest }) => {
  const createMarkup = (html) => {
    return {
      __html: DOMPurify.sanitize(html),
    };
  };

  return <Box dangerouslySetInnerHTML={createMarkup(content)} {...rest} />;
};

export default EditorPreview;
