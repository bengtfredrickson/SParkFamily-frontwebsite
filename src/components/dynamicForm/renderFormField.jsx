import { Button, InputLabel, TextField } from "@mui/material";
import React, { memo, useEffect, useState } from "react";
import drag from "../../../src/image/drag.svg";
import { Editor } from "react-draft-wysiwyg";
import { ContentState, convertToRaw, EditorState } from "draft-js";
import draftToHtml from "draftjs-to-html";
import htmlToDraft from "html-to-draftjs";

const RenderFormField = ({
  onDeleteField,
  onEditField,
  field,
  index,
  setEditorHtml,

  setFormFields,
  formFields,
  fieldValue,
  setImageAsFile,
  editFormFields,
  setEditFormFields,
}) => {
  const [getState, setState] = useState(false);
  const [editorData, setEditor] = useState("");

  const convertHtmlToDraft = (data) => {
    if (data) {
      const blocksFromHTML = htmlToDraft(data);
      const contentState = ContentState.createFromBlockArray(
        blocksFromHTML.contentBlocks,
        blocksFromHTML.entityMap
      );
      return EditorState.createWithContent(contentState);
    }
  };

  const removeHtmlTags = (str) => {
    if (str === null || str === "") return false;
    else str = str.toString();

    return str.replace(/(<([^>]+)>)/gi, "");
  };

  useEffect(() => {
    const { fieldType } = field;
    if (fieldType === "textArea" && fieldValue && fieldType !== "image") {
      const data = convertHtmlToDraft(fieldValue);

      let prevData = [...formFields];
      prevData[index].value = `<p>${fieldValue}</p>`;

      setFormFields(prevData);
      setEditor(data);
    } else if (fieldType === "text" && fieldValue && fieldType !== "image") {
      const data = removeHtmlTags(fieldValue);

      let prevData = [...formFields];
      prevData[index].value = data;

      setFormFields(prevData);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [field]);

  const updateFormField = (data) => {
    if (editFormFields && editFormFields?.length > 0) {
      let prevEditFormData = [...editFormFields];

      prevEditFormData[index].value = data;

      setEditFormFields(prevEditFormData);
    } else if (formFields && formFields?.length > 0) {
      let prevAddFormData = [...formFields];

      prevAddFormData[index].value = data;

      setFormFields(prevAddFormData);
    }
    return null;
  };

  const onChangeText = (e) => {
    updateFormField(e.target.value);
  };

  const handleEditorChange = (value) => {
    let html = draftToHtml(convertToRaw(value.getCurrentContent()));
    setEditorHtml(html);
    setEditor(value);
    updateFormField(html);
  };

  const onChangeImage = (e) => {
    if (e?.target?.files?.[0]?.type?.includes("image")) {
      setImageAsFile({ imageAsFile: e?.target?.files?.[0] });
      setState(false);
      updateFormField(URL?.createObjectURL(e?.target?.files?.[0]));
    } else {
      setState(true);
      // updateFormField("");
    }

    // updateFormField(URL?.createObjectURL(e?.target?.files?.[0]));
  };

  const renderFormField = (field, i) => {
    if (field.fieldType === "text") {
      return (
        <div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-start",
              alignItems: "start",
              width: "100%",
              margin: "10px 0",
              borderBottom: "solid 1px #ccc",
              paddingBottom: "15px",
              paddingTop: "15px",
            }}
          >
            <div
              style={{
                display: "flex",
                width: "100%",
                justifyContent: "center",
                flexDirection: "row",
                margin: "10px",
              }}
            >
              <div>
                <InputLabel className="label-text">
                  {field?.fieldLabel}
                </InputLabel>
              </div>
              <div
                style={{
                  display: "flex",
                  marginRight: "0",
                  marginLeft: "auto",
                  justifyContent: "center",
                }}
              >
                <Button
                  color="primary"
                  className="custom_hyperlink"
                  sx={{ mr: 1 }}
                  onClick={() => onEditField(i)}
                >
                  edit
                </Button>
                <Button
                  color="primary"
                  className="custom_hyperlink"
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
            </div>

            <div>
              <TextField
                className="text-feild-input"
                sx={{ marginTop: 1, marginBottom: 1 }}
                fullWidth
                name={field?.fieldLabel}
                defaultValue={fieldValue}
                value={fieldValue}
                onChange={onChangeText}
              />
            </div>
          </div>
        </div>
      );
    }

    if (field?.fieldType === "textArea") {
      return (
        <div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-start",
              alignItems: "start",
              width: "100%",
              margin: "10px 0",
              borderBottom: "solid 1px #ccc",
              paddingBottom: "15px",
              paddingTop: "15px",
            }}
          >
            <div
              style={{
                display: "flex",
                width: "100%",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "row",
                margin: "10px",
              }}
            >
              <div>
                <InputLabel className="label-text">
                  {field?.fieldLabel}
                </InputLabel>
              </div>
              <div
                style={{
                  display: "flex",
                  marginRight: "0",
                  marginLeft: "auto",
                }}
              >
                <Button
                  color="primary"
                  className="custom_hyperlink"
                  sx={{ mr: 1 }}
                  onClick={() => onEditField(i)}
                >
                  edit
                </Button>
                <Button
                  color="primary"
                  className="custom_hyperlink"
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
            </div>
            <div>
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
                onEditorStateChange={handleEditorChange}
              />
            </div>
          </div>
        </div>
      );
    }

    if (field?.fieldType === "image") {
      return (
        <div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-start",
              alignItems: "start",
              width: "100%",
              margin: "10px 0",
              borderBottom: "solid 1px #ccc",
              paddingBottom: "15px",
              paddingTop: "15px",
            }}
          >
            <div
              style={{
                display: "flex",
                width: "100%",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "row",
              }}
            >
              <div>
                <InputLabel className="label-text">
                  {field?.fieldLabel}
                </InputLabel>
              </div>

              <div
                style={{
                  display: "flex",
                  marginRight: "0",
                  marginLeft: "auto",
                }}
              >
                <Button
                  color="primary"
                  className="custom_hyperlink"
                  sx={{ mr: 1 }}
                  onClick={() => onEditField(i)}
                >
                  edit
                </Button>
                <Button
                  color="primary"
                  className="custom_hyperlink"
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
            </div>
            <div>
              <input
                className="text-feild"
                type="file"
                accept="image/*"
                name={field?.fieldLabel}
                onChange={(e) => onChangeImage(e)}
              />
              {fieldValue !== "" ? (
                <p>
                  <img
                    src={fieldValue || ""}
                    className="p-3 text-image"
                    alt={field?.fieldLabel}
                  />
                </p>
              ) : null}

              {!fieldValue && getState ? (
                <p style={{ color: "red" }}>Only Image is allowed !</p>
              ) : null}
            </div>
          </div>
        </div>
      );
    }

    return null;
  };

  return renderFormField(field, index);
};

export default memo(RenderFormField);
