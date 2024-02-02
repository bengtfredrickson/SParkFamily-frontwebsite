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
import htmlToDraft from "html-to-draftjs";
import { ContentState, EditorState } from "draft-js";

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
  const [fieldPosition, setFieldPosition] = useState("");

  useEffect(() => {
    // setEditFormFields(dynamicFormEditData?.data);
    createEditFormData();
  }, []);

  const openAddFieldDialog = () => {
    setOpenDialog(true);
  };

  const closeAddFieldDialog = () => {
    setOpenDialog(false);
    setIsEdit(false);
  };

  const onEditField = (index) => {
    let data = formFields[index];
    // let editData = editFormFields[index];

    setEditData(data);
    setEditKey(index);
    setIsEdit(true);
    openAddFieldDialog();
  };

  const onEditSave = (value) => {
    const { type, label } = value;

    let addData = [...formFields];
    let editData = [...editFormFields];

    addData[editKey] = {
      fieldType: type,
      fieldLabel: label,
      value: formFields?.[editKey]?.value,
    };

    editData[editKey] = {
      fieldType: type,
      fieldLabel: label,
      value: editFormFields?.[editKey]?.value,
    };

    setFormFields([...addData]);
    setEditFormFields([...editData]);
    setEditData({});
    setEditKey();
    setIsEdit(false);
  };

  const onDeleteField = (index) => {
    let data = [...formFields];
    let editData = [...editFormFields];

    if (index > -1) {
      data.splice(index, 1); // 2nd parameter means remove one item only
      setFormFields([...data]);
      setEditFormFields([...editData]);
    }
  };

  const addNewField = (values) => {
    console.log(values, "values");
    try {
      const { type, label } = values;

      if (dynamicFormEditData?.id) {
        console.log(editFormFields, "editFormFields");

        setEditFormFields([
          ...editFormFields,
          { fieldType: type, fieldLabel: label, value: "" },
        ]);
      } else {
        setFormFields([
          ...formFields,
          { fieldType: type, fieldLabel: label, value: "" },
        ]);
      }
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
    console.log(e, "handleDragOver");
    e?.preventDefault();
  };

  const handleDragEnd = () => {
    console.log("handleDragEnd");
    setDraggingItem(null);
  };

  const handleDragStart = (e, item) => {
    console.log(e, item, "handleDragStart");

    setDraggingItem(item);
    e?.dataTransfer?.setData("text/html", "");
  };

  const handleDrop = (e, targetItem, isEditItem) => {
    if (!draggingItem) return;
    console.log(e, targetItem, "handleDrop");
    const currentIndex = formFields.indexOf(draggingItem);
    const targetIndex = formFields.indexOf(targetItem);

    if (currentIndex !== -1 && targetIndex !== -1) {
      const newItems = [...formFields];
      newItems.splice(currentIndex, 1);
      newItems.splice(targetIndex, 0, draggingItem);

      // if (isEditItem) {
      // setEditFormFields(newItems);
      // } else {
      setFormFields(newItems);
      // }
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
      .then(async () => {
        await getCustomLessons();
        await closeModal();
        showNotification();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const uploadImage = async (formData, formType) => {
    await uploadAddLessonPlanImage(formData)
      .then(async (res) => {
        if (res?.data?.message) {
          if (formType === "addForm") {
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
                position: fieldPosition,
              })),
            };

            await addCustomLesson(data);
          } else {
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
                key_type:
                  item?.fieldType === "text"
                    ? 1
                    : item?.fieldType === "image"
                    ? 2
                    : 3,
                order: i + 1,
                position: fieldPosition,
              })),
            };

            await updateCustomLessonPlan(data)
              .then(async (res) => {
                await getCustomLessons();
                showNotification(res?.data?.message, "success");
                await closeModal();
              })
              .catch((err) => {
                console.log(err);
              });
          }
        }
      })
      .catch((err) => {
        console.log(err, "err");
      });
  };

  const submitForm = async () => {
    if (imageAsFile?.imageAsFile) {
      let formData = new FormData();
      formData.append("image_url", imageAsFile?.imageAsFile);

      await uploadImage(formData, "addForm");
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
          key_type:
            item?.fieldType === "text"
              ? 1
              : item?.fieldType === "image"
              ? 2
              : 3,
          order: i + 1,
          position: "top",
        })),
      };

      await addCustomLesson(data);
    }
  };

  const submitEditForm = async () => {
    if (imageAsFile?.imageAsFile) {
      let formData = new FormData();
      formData.append("image_url", imageAsFile?.imageAsFile);

      await uploadImage(formData);
    } else {
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
          key_type:
            item?.fieldType === "text"
              ? 1
              : item?.fieldType === "image"
              ? 2
              : 3,
          order: i + 1,
          position: fieldPosition,
        })),
      };

      await updateCustomLessonPlan(data)
        .then(async (res) => {
          await getCustomLessons();
          showNotification(res?.data?.message, "success");
          await closeModal();
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

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

  const renderEditFormFields = (editFormFields) => {
    return editFormFields?.map((field, index) => (
      <div
        key={index}
        className={`item ${field === draggingItem ? "dragging" : ""}`}
        draggable="true"
        onDragStart={(e) => handleDragStart(e, field, "isEdit")}
        onDragEnd={() => handleDragEnd("isEdit")}
        onDragOver={handleDragOver}
        onDrop={(e) => handleDrop(e, field, "isEdit")}
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
          setFieldPosition={setFieldPosition}
          fieldPosition={fieldPosition}
          fieldValue={field?.value}
          fieldType={field?.fieldType}
          setEditFormFields={setEditFormFields}
          editFormFields={editFormFields}
          convertHtmlToDraft={convertHtmlToDraft}
        />
      </div>
    ));
  };

  const renderAddFormFields = () => {
    console.log(formFields, "formFields");
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
          setFieldPosition={setFieldPosition}
          fieldPosition={fieldPosition}
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

  const renderForms = (editFormFields, formFields) => {
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

      <Button
        className="btn-primary-blue"
        onClick={openAddFieldDialog}
        data-dismiss="modal"
      >
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

      {renderForms(editFormFields, formFields)}

      {renderSubmitFormButton()}
    </div>
  );
};
export default memo(DynamicForm);
