import { Button } from "@mui/material";
import { React, memo, useEffect, useState } from "react";
import AddFieldPopper from "./addFieldPopper";
import { useLocation } from "react-router-dom";
import {
  uploadAddLessonPlanImage,
  addCustomLessonPlan,
  updateCustomLessonPlan,
} from "../../services/web/webServices";
import { Store } from "react-notifications-component";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import RenderFormField from "./renderFormField";

const css = `
   

    .btn-primary-blue{
      background-color:#1976d2 !important;
      color:#fff !important;
      text-transform: uppercase;
      font-size:14px;
      font-weight:500;
      padding:6px 12px;
  }

.btn-primary-blue:focus:active,.btn-primary-blue:hover{
      background-color:#0d60b2 !important;
  }
  .border-btn {
    background: #48aee114;
    padding: 4.5px 12px;
    display: block;
    color: #58555E;
    border-radius: 5px;
    text-decoration: none;
    border: 1px solid #1846b9;
}

.border-btn:hover {
    background: none;
    border: 1px solid #1846b9;
    color: #58555E;
}
input.text-feild {
  padding:13px 8px;
  border: 1px solid gray;
  border-radius: 4px;
  width:100%;
  max-width:323px;
}
.text-feild-input {
  border-radius: 4px;
  width:100%;
  max-width:323px;
}
.drag-btn,.drag-btn:hover{
  background: transparent !important;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    max-width: 20px;
}
.drag-btn img{
  max-width: 80% !important;
  margin-bottom:7px;
}
.label-text{
  font-weight: 600;
  color: #34395e;
  font-size: 14px;
  letter-spacing: .5px;
}
.text-image {
  max-width: 134px;
}
    `;

const DynamicForm = ({
  closeModal,
  dynamicFormEditData,
  lessonPlanData,
  getCustomLessons,
}) => {
  const location = useLocation();

  const [formFields, setFormFields] = useState([]);
  const [openDialog, setOpenDialog] = useState(null);
  const [editData, setEditData] = useState({});
  const [editKey, setEditKey] = useState();
  const [isEdit, setIsEdit] = useState(false);
  const [draggingItem, setDraggingItem] = useState(null);
  const [imageAsFile, setImageAsFile] = useState({});
  const [textField, setTextField] = useState(
    dynamicFormEditData?.data[0]?.value
  );
  // const [lessonPlanImg, setLessonPlanImg] = useState("");
  const [editorHtml, setEditorHtml] = useState();
  const [editFormFields, setEditFormFields] = useState([]);

  useEffect(() => {
    // setEditFormFields(dynamicFormEditData?.data);
    createEditFormData();
  }, []);

  const openAddFieldDialog = () => {
    setOpenDialog(true);
  };

  const closeAddFieldDialog = () => {
    setOpenDialog(false);
  };

  const onEditField = (index) => {
    let data = formFields[index];

    setEditData(data);
    setEditKey(index);
    setIsEdit(true);
    openAddFieldDialog();
  };

  const onEditSave = (value) => {
    const { type, label } = value;

    let data = [...formFields];
    data[editKey] = { fieldType: type, fieldLabel: label, value: "" };

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

  const addNewField = (values) => {
    try {
      const { type, label } = values;

      setFormFields([
        ...formFields,
        { fieldType: type, fieldLabel: label, value: "" },
      ]);
    } catch (error) {
      console.log(error);
    }
  };

  const createEditFormData = () => {
    const data =
      dynamicFormEditData &&
      dynamicFormEditData?.data?.length > 0 &&
      dynamicFormEditData?.data.map((item) => ({
        fieldType: item?.key_type === 1 ? "text" : "image",
        fieldLabel: item?.key,
        value: item?.value,
      }));

    setEditFormFields(data);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDragEnd = () => {
    setDraggingItem(null);
  };

  const handleDragStart = (e, item) => {
    setDraggingItem(item);
    e?.dataTransfer?.setData("text/html", "");
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

  const showNotification = (message, type) => {
    Store.addNotification({
      title: "Success",
      message: message,
      type: type,
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
  };

  const addCustomLesson = async (data) => {
    await addCustomLessonPlan(data)
      .then((res) => {
        if (res?.data) {
          closeModal();
          showNotification();
          getCustomLessons();
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const uploadImage = async (formData) => {
    await uploadAddLessonPlanImage(formData)
      .then((res) => {
        if (res?.data?.message) {
          console.log(res.data);

          let data = {
            curriculum_id: location.state.curriculum_id,
            suboption_id: location.state.suboption_id,

            data: formFields.map((item, i) => ({
              key: item?.fieldLabel,
              value:
                item?.fieldType === "text"
                  ? item.value
                  : item?.fieldType === "textArea"
                  ? item.value
                  : res?.data?.result?.data,
              key_type: item?.fieldType === "text" ? 1 : 2,
              order: i + 1,
              position: "top",
            })),
          };

          addCustomLesson(data);
        }
      })
      .catch((err) => {
        console.log(err, "err");
      });
  };

  const submitForm = async () => {
    if (imageAsFile?.imageAsFile) {
      console.log(imageAsFile.imageAsFile, "XXXXX");

      let formData = new FormData();
      formData.append("image_url", imageAsFile?.imageAsFile);

      uploadImage(formData);

      // await uploadAddLessonPlanImage(formData)
      //   .then(async (res) => {
      //     // setLessonPlanImg(res.data.result.data);
      //     setImageAsFile({});
      //     console.log(res, "res res");
      //     if (res?.data?.result?.data) {
      //       let data = {
      //         curriculum_id: location.state.curriculum_id,
      //         suboption_id: location.state.suboption_id,

      //         data: formFields.map((item, i) => ({
      //           key: item?.fieldLabel,
      //           value:
      //             item?.fieldType === "text"
      //               ? item.value
      //               : item?.fieldType === "textArea"
      //               ? item.value
      //               : item?.fieldType === "image"
      //               ? res?.data?.result?.data
      //               : "",
      //           key_type: item?.fieldType === "text" ? 1 : 2,
      //           order: i + 1,
      //           position: "top",
      //         })),
      //       };

      //       await addCustomLessonPlan(data)
      //         .then((res) => {
      //           showNotification();
      //         })
      //         .catch((err) => {
      //           console.log(err);
      //         });
      //     }
      //   })
      //   .catch((err) => {
      //     console.log(err, "err");
      //   });
    } else {
      let data = {
        curriculum_id: location.state.curriculum_id,
        suboption_id: location.state.suboption_id,

        data: formFields.map((item, i) => ({
          key: item?.fieldLabel,
          value:
            item?.fieldType === "text"
              ? item.value
              : item?.fieldType === "textArea"
              ? item.value
              : item.value,
          key_type: item?.fieldType === "text" ? 1 : 2,
          order: i + 1,
          position: "top",
        })),
      };

      addCustomLesson(data);
    }
  };

  const submitEditForm = async () => {
    let data = {
      id: lessonPlanData?.id,
      lesson_id: dynamicFormEditData?.id,
      lesson_data: editFormFields?.map((item, i) => ({
        key: item?.fieldLabel,
        value: item.value,
        // item?.fieldType === "text"
        //   ? item.value
        //   : item?.fieldType === "textArea"
        //   ? item.value
        //   : item.value,
        key_type: item?.fieldType === "text" ? 1 : 2,
        order: i + 1,
        position: "top",
      })),
    };

    await updateCustomLessonPlan(data)
      .then((res) => {
        if (res?.data?.message) {
          showNotification(res?.data?.message, "success");
          closeModal();
          getCustomLessons();
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const renderEditFormFields = (editFormFields) => {
    return editFormFields?.map((field, index) => (
      <div
        key={index}
        className={`item ${field === draggingItem ? "dragging" : ""}`}
        draggable="true"
        onDragStart={(e) => handleDragStart(e, field)}
        onDragEnd={handleDragEnd}
        onDragOver={handleDragOver}
        onDrop={(e) => handleDrop(e, field)}
      >
        <RenderFormField
          onEditField={onEditField}
          onDeleteField={onDeleteField}
          textField={textField}
          setTextField={setTextField}
          field={field}
          index={index}
          setImageAsFile={setImageAsFile}
          editorHtml={editorHtml}
          setEditorHtml={setEditorHtml}
          formFields={formFields}
          // setFormFields={setFormFields}
          fieldValue={field?.value}
          setEditFormFields={setEditFormFields}
          editFormFields={editFormFields}
        />
      </div>
    ));
  };

  const renderAddFormFields = () => {
    return formFields?.map((field, index) => (
      <div
        key={index}
        className={`item ${field === draggingItem ? "dragging" : ""}`}
        draggable="true"
        onDragStart={(e) => handleDragStart(e, field)}
        onDragEnd={handleDragEnd}
        onDragOver={handleDragOver}
        onDrop={(e) => handleDrop(e, field)}
      >
        <RenderFormField
          onEditField={onEditField}
          onDeleteField={onDeleteField}
          textField={textField}
          setTextField={setTextField}
          field={field}
          index={index}
          setImageAsFile={setImageAsFile}
          editorHtml={editorHtml}
          setEditorHtml={setEditorHtml}
          formFields={formFields}
          setFormFields={setFormFields}
          fieldValue={field?.value}
        />
      </div>
    ));
  };

  const renderSubmitFormButton = () => {
    if (formFields && formFields?.length > 0) {
      return (
        <Button
          className="btn-primary-blue"
          sx={{ mt: 2 }}
          onClick={submitForm}
        >
          Submit Form
        </Button>
      );
    }

    if (editFormFields && editFormFields?.length > 0) {
      return (
        <Button
          className="btn-primary-blue"
          sx={{ mt: 2 }}
          onClick={submitEditForm}
        >
          Submit Form
        </Button>
      );
    }

    return null;
  };

  const renderForms = (editFormFields) => {
    if (formFields?.length > 0) {
      return renderAddFormFields();
    }

    if (editFormFields?.length > 0) {
      return renderEditFormFields(editFormFields);
    }

    return null;
  };

  return (
    <div>
      <style>{css}</style>

      {!editFormFields?.length && (
        <Button
          className="btn-primary-blue"
          onClick={openAddFieldDialog}
          data-dismiss="modal"
        >
          {isEdit ? "Edit Item" : "Add New Item"}
        </Button>
      )}

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

      {renderForms(editFormFields)}

      {renderSubmitFormButton()}
    </div>
  );
};
export default memo(DynamicForm);
