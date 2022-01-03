// Libraries
import React from "react";
import { Editor as DraftEditor, EditorState } from "draft-js";
import "draft-js/dist/Draft.css";

// Components

////////////////////////////////////////////////////////////////////////////////
// Editor

const Editor = () => {
  const [editorState, setEditorState] = React.useState(() =>
    EditorState.createEmpty()
  );

  return <DraftEditor editorState={editorState} onChange={setEditorState} />;
};

export default Editor;
