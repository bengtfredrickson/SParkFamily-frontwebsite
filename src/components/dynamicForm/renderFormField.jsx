import { Button, InputLabel, TextField } from "@mui/material";
import React, { useState } from "react";
import drag from "../../../src/image/drag.svg";
import { Editor } from "react-draft-wysiwyg";
import { convertToRaw } from "draft-js";
import draftToHtml from "draftjs-to-html";

const RenderFormField = ({
  onDeleteField,
  onEditField,
  field,
  index,
  getImage,
  setImage,
  setEditorHtml,
}) => {
  const [textField, setTextField] = useState("");
  const [editorData, setEditor] = useState();
  const [getImageUrl, setImageUrl] = useState("");
  const [getState, setState] = useState(false);
  //   const [getImage, setImage] = useState({});

  const onChangeText = (e) => {
    setTextField(e.target.value);
  };

  const handleEditorChange = (value) => {
    let html = draftToHtml(convertToRaw(value.getCurrentContent()));
    // console.log(draftToHtml(convertToRaw(value.getCurrentContent())), "data1");
    // const content = editorState.getCurrentContent();
    // const rawContentState = convertToRaw(content);
    // console.log(rawContentState, "rawcontentState");
    // const plainText = rawContentState.blocks
    //   .map((block) => block.text)
    //   .join("\n");

    // console.log(plainText, "editor content");
    setEditorHtml(html);
    setEditor(value);
  };

  const onChangeImage = (e) => {
    if (e.target.files[0].type.includes("image")) {
      setImage({ imageAsFile: e.target.files[0] });
      setState(false);
    } else {
      setState(true);
    }
    setImageUrl(URL.createObjectURL(e.target.files[0]));
  };
  const renderFormField = (field, i) => {
    if (field.fieldType === "text") {
      return (
        <div>
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
            }}
          >
            <Button
              className="btn-primary-blue"
              sx={{ mr: 1 }}
              onClick={() => onEditField(i)}
            >
              edit
            </Button>
            <Button
              className="btn-primary-blue"
              sx={{ mr: 1 }}
              onClick={() => onDeleteField(i)}
            >
              delete
            </Button>
            <Button
              style={{ minWidth: "36px" }}
              className="drag-btn"
              sx={{ mt: 1 }}
            >
              <img alt="drag" src={drag} />
            </Button>
          </div>
          <InputLabel className="label-text">{field.fieldLabel}</InputLabel>
          <TextField
            className="text-feild-input"
            sx={{ marginTop: 1, marginBottom: 1 }}
            fullWidth
            // id={i}
            name={field.fieldName}
            // label={field.fieldLabel}
            value={textField}
            onChange={onChangeText}
            // onBlur={formData.handleBlur}
            // error={formik.touched.name && Boolean(formik.errors.name)}
            // helperText={formik.touched.name && formik.errors.name}
          />
        </div>
      );
    }

    if (field.fieldType === "textArea") {
      return (
        <div>
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
            }}
          >
            <Button
              className="btn-primary-blue"
              sx={{ mr: 1 }}
              onClick={() => onEditField(i)}
            >
              edit
            </Button>
            <Button
              className="btn-primary-blue"
              sx={{ mr: 1 }}
              onClick={() => onDeleteField(i)}
            >
              delete
            </Button>
            <Button
              style={{ minWidth: "36px" }}
              className="drag-btn"
              sx={{ mt: 1 }}
            >
              <img alt="drag" src={drag} />
            </Button>
          </div>
          <InputLabel className="label-text">{field.fieldLabel}</InputLabel>
          <Editor
            toolbarClassName="toolbarClassName"
            wrapperClassName="wrapperClassName"
            editorClassName="editorClassName"
            wrapperStyle={{
              border: "1px solid #d6d6d6",
              padding: 10,
              borderRadius: 10,
            }}
            toolbarStyle={{
              border: 0,
              borderBottom: "1px solid #d6d6d6",
            }}
            editorState={editorData}
            // onEditorStateChange={(editorState) =>
            //   onChangeEditor(editorState, 1, 1)
            // }
            onEditorStateChange={handleEditorChange}

            // onBlur={() => helpers.setTouched(true)}
          />
        </div>
      );
    }

    if (field.fieldType === "image") {
      return (
        <div>
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
            }}
          >
            <Button
              className="btn-primary-blue"
              sx={{ mr: 1 }}
              onClick={() => onEditField(i)}
            >
              edit
            </Button>
            <Button
              className="btn-primary-blue"
              sx={{ mr: 1 }}
              onClick={() => onDeleteField(i)}
            >
              delete
            </Button>
            <Button
              style={{ minWidth: "36px" }}
              className="drag-btn"
              sx={{ mt: 1 }}
            >
              <img alt="drag" src={drag} />
            </Button>
          </div>
          <InputLabel className="label-text">{field.fieldLabel}</InputLabel>
          <input
            className="text-feild"
            type="file"
            accept="image/*"
            name={field.fieldName}
            onChange={(e) => onChangeImage(e)}
          />
          {getImageUrl !== "" ? (
            <p>
              <img src={getImageUrl} className="p-3 text-image" alt="" />
            </p>
          ) : null}
          {getState ? (
            <p style={{ color: "red" }}>Only Image is allowed !</p>
          ) : null}
        </div>
      );
    }

    return null;
  };
  return renderFormField(field, index);
};

export default RenderFormField;
