import React, { useState } from 'react';

import {
  EditorState,
  convertToRaw,
} from 'draft-js';

import { Editor } from 'react-draft-wysiwyg';

import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

const TextEditor = ({ onChange }) => {

  const [editorState, setEditorState] =
    useState(EditorState.createEmpty());

  const handleEditorChange = (state) => {
    setEditorState(state);

    const rawContent = convertToRaw(
      state.getCurrentContent()
    );

    onChange(rawContent);
  };

  return (
    <div className="text-editor">

      <Editor
        editorState={editorState}
        onEditorStateChange={handleEditorChange}

        toolbar={{
          options: [
            'inline',
            'blockType',
            'fontSize',
            'list',
            'textAlign',
            'colorPicker',
            'link',
            'emoji',
            'remove',
            'history',
          ],

          inline: {
            options: [
              'bold',
              'italic',
              'underline',
              'strikethrough',
            ],
          },

          colorPicker: {
            colors: [
              'yellow',
              'red',
              'blue',
              'green',
              'black',
            ],
          },
        }}

        editorStyle={{
          minHeight: '300px',
          padding: '10px 15px',
          border: '1px solid #ddd',
          borderTop: 'none',
        }}
      />

    </div>
  );
};

export default TextEditor;