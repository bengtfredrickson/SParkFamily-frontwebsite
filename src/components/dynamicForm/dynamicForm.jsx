import { Button, InputLabel, TextField } from "@mui/material";
import { React, useState } from "react";
import AddFieldPopper from "./addFieldPopper";
import { Editor } from "react-draft-wysiwyg";
import { useLocation } from "react-router-dom";
import {
  uploadAddLessonPlanImage,
  addCustomLessonPlan,
} from "../../services/web/webServices";
import { Store } from "react-notifications-component";
import { EditorState } from "draft-js";

const DynamicForm = () => {
  const location = useLocation();

  const [formFields, setFormFields] = useState([]);
  const [openDialog, setOpenDialog] = useState(null);
  const [editorData, setEditor] = useState(EditorState.createEmpty());
  const [editData, setEditData] = useState({});
  const [editKey, setEditKey] = useState();
  const [isEdit, setIsEdit] = useState(false);
  const [draggingItem, setDraggingItem] = useState(null);
  const [getImageUrl, setImageUrl] = useState("");
  const [getState, setState] = useState(false);
  const [getImage, setImage] = useState({});
  const [textField, setTextField] = useState("");
  const [lessonPlanImg, setLessonPlanImg] = useState("");

  const openAddFieldDialog = () => {
    setOpenDialog(true);
  };
  const closeAddFieldDialog = () => {
    setOpenDialog(false);
  };

  const addNewField = (values) => {
    const { name, type, label } = values;
    setFormFields([
      ...formFields,
      { fieldName: name, fieldType: type, fieldLabel: label },
    ]);
  };

  const onEditField = (index) => {
    let data = formFields[index];

    setEditData(data);
    setEditKey(index);
    setIsEdit(true);
    openAddFieldDialog();
  };

  const onEditSave = (value) => {
    const { name, type, label } = value;

    let data = [...formFields];
    data[editKey] = { fieldName: name, fieldType: type, fieldLabel: label };

    setFormFields([...data]);
    setEditData({});
    setEditKey();
    setIsEdit(false);
  };

  const onDeleteField = (index) => {
    let data = [...formFields];

    if (index > -1) {
      data.splice(index, 1); // 2nd parameter means remove one item only
      setFormFields([...data]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDragEnd = () => {
    setDraggingItem(null);
  };

  const handleDragStart = (e, item) => {
    setDraggingItem(item);
    e.dataTransfer.setData("text/plain", "");
  };

  const handleDrop = (e, targetItem) => {
    if (!draggingItem) return;

    const currentIndex = formFields.indexOf(draggingItem);
    const targetIndex = formFields.indexOf(targetItem);

    if (currentIndex !== -1 && targetIndex !== -1) {
      const newItems = [...formFields];
      newItems.splice(currentIndex, 1);
      newItems.splice(targetIndex, 0, draggingItem);
      setFormFields(newItems);
    }
  };

  const submitForm = () => {
    let data = {
      curriculum_id: location.state.curriculum_id,
      suboption_id: location.state.suboption_id,
      data: formFields.map((item, i) => ({
        key: item?.fieldLabel,
        value:
          item?.fieldType === "text"
            ? textField
            : item?.fieldType === "textArea"
            ? editorData
            : lessonPlanImg,
        key_type: item?.fieldType === "text" ? 1 : 2,
        order: i + 1,
        position: "top",
      })),
    };
    console.log(data, "data");
    if (!getImage?.imageAsFile) return;

    uploadImage(getImage?.imageAsFile);

    if (Object.keys(data)?.length > 0) {
      addCustomLessonPlan(data)
        .then((res) => {
          Store.addNotification({
            title: "Success",
            message: res?.data?.message,
            type: "success",
            insert: "top",
            container: "top-right",
            className: "rnc__notification-container--top-right",
            animationIn: ["animate__animated", "animate__fadeIn"],
            animationOut: ["animate__animated", "animate__fadeOut"],
            dismiss: {
              duration: 5000,
              onScreen: true,
            },
          });
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const onChangeText = (e) => {
    setTextField(e.target.value);
  };
  // const onChangeEditor = (editorState) => {
  //   console.log(editorState.getCurrentContent(), "editorState");
  //   setEditor(editorState);
  // };

  const uploadImage = (image) => {
    if (image) {
      let formData = new FormData();
      formData.append("image_url", image);

      uploadAddLessonPlanImage(formData)
        .then((res) => {
          setLessonPlanImg(res.data.result.data);
        })
        .catch((err) => {
          console.log(err, "err");
        });
    }
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

  const handleEditorChange = (editorState) => {
    const content = editorState.getCurrentContent().getPlainText();
    console.log(content, "editor content");
    setEditor(editorState);
  };

  console.log(editorData, "editorData");
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
            <Button onClick={() => onEditField(i)}>edit</Button>
            <Button onClick={() => onDeleteField(i)}>delete</Button>
            <Button>drag</Button>
          </div>
          <InputLabel>{field.fieldLabel}</InputLabel>
          <TextField
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
            <Button onClick={() => onEditField(i)}>edit</Button>
            <Button onClick={() => onDeleteField(i)}>delete</Button>
            <Button>drag</Button>
          </div>
          <InputLabel>{field.fieldLabel}</InputLabel>
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
            <Button onClick={() => onEditField(i)}>edit</Button>
            <Button onClick={() => onDeleteField(i)}>delete</Button>
            <Button>drag</Button>
          </div>
          <InputLabel>{field.fieldLabel}</InputLabel>
          <input
            type="file"
            accept="image/*"
            className="form-control"
            name={field.fieldName}
            onChange={(e) => onChangeImage(e)}
          />
          {getImageUrl !== "" ? (
            <img src={getImageUrl} className=" w-30 p-3" alt="" />
          ) : null}
          {getState ? (
            <p style={{ color: "red" }}>Only Image is allowed !</p>
          ) : null}
        </div>
      );
    }

    return null;
  };

  return (
    <div>
      {/* DynamicForm */}
      <Button onClick={openAddFieldDialog} data-dismiss="modal">
        {isEdit ? "Edit Item" : "Add New Item"}
      </Button>
      {openDialog && (
        <AddFieldPopper
          open={openDialog}
          onClose={closeAddFieldDialog}
          addNewField={addNewField}
          isEdit={isEdit}
          onEditSave={onEditSave}
          editData={editData}
        />
      )}
      {formFields.map((field, index) => (
        <div
          key={index}
          className={`item ${field === draggingItem ? "dragging" : ""}`}
          draggable="true"
          onDragStart={(e) => handleDragStart(e, field)}
          onDragEnd={handleDragEnd}
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, field)}
        >
          {renderFormField(field, index)}
        </div>
      ))}
      {/* <Button onClick={submitFormData}>Submit Form</Button> */}
      {formFields?.length > 0 && (
        <Button onClick={submitForm}>Submit Form</Button>
      )}
    </div>
  );
};
export default DynamicForm;
