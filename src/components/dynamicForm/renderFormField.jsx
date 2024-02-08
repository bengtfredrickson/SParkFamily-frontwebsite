import { Button, InputLabel, TextField } from "@mui/material";
import React, { memo, useEffect, useState } from "react";
import drag from "../../../src/image/drag.svg";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { ContentState, convertToRaw, EditorState } from "draft-js";
import draftToHtml from "draftjs-to-html";
import htmlToDraft from "html-to-draftjs";
import { uploadAddLessonPlanImage } from "../../services/web/webServices";

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
  imageAsFile,
  setIsButtonDisabled,
  // handleFileChange,
  // imageErrorMsg,
  // isImageError,
}) => {
  // const [getState, setState] = useState(false);
  const [editorData, setEditor] = useState("");
  const [isImageError, setIsImageError] = useState(false);
  const [imageErrorMsg, setImageErrorMsg] = useState("");

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
      prevData[index].value = `${fieldValue}`;

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

  const onChangeImg = async (e) => {
    const res = await handleFileChange(e);

    if (res?.code === 200) {
      updateFormField(res?.data);
    }
  };

  const handleFileChange = async (event) => {
    setIsButtonDisabled(true);

    const selectedFile = event.target.files[0];
    // setIsSuccess(false);

    // Checking if the file type is allowed or not
    const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
    if (!allowedTypes.includes(selectedFile?.type)) {
      setIsImageError(true);
      setImageErrorMsg("Only images are allowed.");
      return;
    }

    setIsImageError(false);

    let formData = new FormData();
    formData.append("image_url", selectedFile);
    const res = await uploadAddLessonPlanImage(formData);

    if (res?.data?.result?.code === 200) {
      setIsButtonDisabled(false);

      let prevData = [...imageAsFile];
      prevData.push(selectedFile);
      setImageAsFile(prevData);

      return res?.data?.result;
    }

    setIsButtonDisabled(false);
    // setIsSuccess(true);

    // updateFormField(URL?.createObjectURL(event?.target?.files?.[0]));
  };

  const renderFormField = (field, i) => {
    if (field.fieldType === "text") {
      return (
        <div 
           style={{
              width: "100%",
              }}
        >
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
                alignItems:"start",
                flexDirection: "row",
                margin: "10px 0",
              }}
            >
              <div 
                style={{
                  marginRight: "10px",}}
                  >
                <InputLabel className="label-text" 
                 style={{
                    whiteSpace: "pre-wrap",
                    color: "#727077",
                    fontWeight: "400",
                    letterSpacing: "normal",
                    marginRight: "10px;"
                  }}
                  >
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
                  style={{
                    height: "auto",
                    backgroundColor: "none",
                  }}
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

            <div 
              style={{width:'100%',
              }}
            >
              <TextField
                className="text-feild-input"
                sx={{ marginTop: 1, marginBottom: 1 }}
                fullWidth
                name={field?.fieldLabel}
                defaultValue={fieldValue}
                value={fieldValue}
                onChange={onChangeText}
                style={{ 
                  maxWidth: "unset" }}
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
                alignItems:"start",
                flexDirection: "row",
                margin: "10px 0",
              }}
            >
              <div>
                <InputLabel className="label-text"
                  style={{
                    whiteSpace: "pre-wrap",
                    color: "#727077",
                    fontWeight: "400",
                    letterSpacing: "normal",
                  }}
                >
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
                alignItems:"start",
                flexDirection: "row",
                margin: "10px 0",
              }}
            >
              <div>
                <InputLabel className="label-text"
                  style={{
                    whiteSpace: "pre-wrap",
                    color: "#727077",
                    fontWeight: "400",
                    letterSpacing: "normal",
                  }}
                >
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
                // accept="image/*"
                accept="image/x-png,image/gif,image/jpeg,image/heic"
                name={field?.fieldLabel}
                onChange={(e) => onChangeImg(e)}
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

              {/* {!fieldValue && getState ? (
                <p style={{ color: "red" }}>Only Image is allowed !</p>
              ) : null} */}

              {isImageError && (
                <div style={{ color: "red" }}>{imageErrorMsg}</div>
              )}
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
