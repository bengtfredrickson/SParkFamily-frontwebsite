import { Button, InputLabel, TextField } from "@mui/material";
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
import { useFormik } from "formik";
import * as Yup from "yup";

const css = `
   

    .btn-primary-blue{
      background-color:#1976d2 !important;
      color:#fff !important;
      text-transform: uppercase;
      font-size:14px;
      font-weight:500;
      padding:6px 12px;
      height:40px;
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
  const [editorHtml, setEditorHtml] = useState();
  const [fieldPosition, setFieldPosition] = useState("");
  const [isImageError, setIsImageError] = useState(false);
  const [imageErrorMsg, setImageErrorMsg] = useState("");
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [positionCounts, setPositionCounts] = useState({});

  const formik = useFormik({
    validateOnMount: true,
    initialValues: {
      lessonTitle: dynamicFormEditData?.title || "",
    },
    validationSchema: Yup.object({
      lessonTitle: Yup.string().required("Required"),
    }),

    enableReinitialize: true,
  });

  useEffect(() => {
    createEditFormData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (formFields?.length > 0) {
      const counts = getPositionCount(formFields);
      setPositionCounts(counts);
    }
  }, [formFields]);

  const openAddFieldDialog = () => {
    setOpenDialog(true);
    // window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const closeAddFieldDialog = () => {
    setOpenDialog(false);
    setIsEdit(false);
    setEditData({});
    setFieldPosition("");
    // setIsError(false);
    setEditKey();
  };

  const onEditField = (index) => {
    let data = [...formFields];
    data = data?.[index];

    setEditData(data);
    setEditKey(index);
    setIsEdit(true);
    openAddFieldDialog();
  };

  const onEditSave = (values) => {
    const { type, label, position } = values;

    let addData = [...formFields];

    addData[editKey] = {
      fieldType: type,
      fieldLabel: label,
      value: formFields?.[editKey]?.value,
      position: position,
      // position: formFields?.[editKey]?.position,
    };

    setFormFields([...addData]);
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
      const { type, label, position } = values;
      let data = formFields?.length > 0 ? [...formFields] : [];
      data.push({
        fieldType: type,
        fieldLabel: label,
        value: "",
        position,
      });

      setFormFields(data);
    } catch (error) {
      console.log(error);
    }
  };

  const createEditFormData = () => {
    let keyTypeArr = ["text", "image", "textArea"];
    const data =
      dynamicFormEditData &&
      dynamicFormEditData?.data?.length > 0 &&
      dynamicFormEditData?.data.map((item) => ({
        fieldType: keyTypeArr[item?.key_type - 1],
        fieldLabel: item?.key,
        value: item?.value,
        position: item?.position,
      }));

    setFormFields(data);
  };

  const handleDragOver = (e) => {
    e?.preventDefault();
  };

  const handleDragEnd = () => {
    setDraggingItem(null);
  };

  const handleDragStart = (e, item) => {
    setDraggingItem(item);
    e?.dataTransfer?.setData("text/html", "");
  };

  const handleDrop = (e, targetItem) => {
    e.preventDefault();
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

  const handleFileChange = (event) => {
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
    // setIsSuccess(true);
    setImageAsFile({ imageAsFile: selectedFile });
    // updateFormField(URL?.createObjectURL(event?.target?.files?.[0]));
  };

  const showNotification = (message, type, title) => {
    Store.addNotification({
      title: title,
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
      .then(async (res) => {
        await getCustomLessons();
        await closeModal();
        showNotification(res.data.message, "success", "success");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const uploadImage = async (formData, formType) => {
    if (isImageError) return;

    await uploadAddLessonPlanImage(formData)
      .then(async (res) => {
        if (res?.data?.message) {
          if (formType === "addForm") {
            if (dynamicFormEditData?.id) {
              let data = {
                id: lessonPlanData?.id,
                lesson_id: dynamicFormEditData?.id,
                title: formik?.values?.lessonTitle,

                lesson_data: formFields?.map((item, i) => ({
                  key: item?.fieldLabel,
                  value:
                    item?.fieldType === "text"
                      ? item.value
                      : item?.fieldType === "textArea"
                      ? item.value
                      : res?.data?.result?.data,
                  key_type:
                    item?.fieldType === "text"
                      ? 1
                      : item?.fieldType === "image"
                      ? 2
                      : 3,
                  order: i + 1,
                  position: item.position,
                })),
              };

              await updateCustomLessonPlan(data)
                .then(async (res) => {
                  await getCustomLessons();
                  showNotification(res?.data?.message, "success", "success");
                  await closeModal();
                })
                .catch((err) => {
                  console.log(err);
                });
            } else {
              let data = {
                curriculum_id: location.state.curriculum_id,
                suboption_id: location.state.suboption_id,
                title: formik?.values?.lessonTitle,

                data: formFields.map((item, i) => ({
                  key: item?.fieldLabel,
                  value:
                    item?.fieldType === "text"
                      ? item.value
                      : item?.fieldType === "textArea"
                      ? item.value
                      : res?.data?.result?.data,
                  key_type:
                    item?.fieldType === "text"
                      ? 1
                      : item?.fieldType === "image"
                      ? 2
                      : 3,
                  order: i + 1,
                  position: item.position,
                })),
              };

              await addCustomLesson(data);
            }
          }
        }
      })
      .catch((err) => {
        console.log(err, "err");
      });
  };

  // const submitForm = async () => {
  //   if (imageAsFile?.imageAsFile) {
  //     if (isImageError) return;

  //     let formData = new FormData();
  //     formData.append("image_url", imageAsFile?.imageAsFile);

  //     await uploadImage(formData, "addForm");
  //   } else {
  //     if (isImageError) return;

  //     let data = {
  //       curriculum_id: location.state.curriculum_id,
  //       suboption_id: location.state.suboption_id,
  //       title: formik?.values?.lessonTitle,

  //       data: formFields.map((item, i) => ({
  //         key: item?.fieldLabel,
  //         value:
  //           item?.fieldType === "text"
  //             ? item.value
  //             : item?.fieldType === "textArea"
  //             ? item.value
  //             : item.value,
  //         key_type:
  //           item?.fieldType === "text"
  //             ? 1
  //             : item?.fieldType === "image"
  //             ? 2
  //             : 3,
  //         order: i + 1,
  //         position: item.position,
  //       })),
  //     };

  //     let updateData = {
  //       id: lessonPlanData?.id,
  //       lesson_id: dynamicFormEditData?.id,
  //       title: formik?.values?.lessonTitle,

  //       lesson_data: formFields?.map((item, i) => ({
  //         key: item?.fieldLabel,
  //         value: item.value,
  //         key_type:
  //           item?.fieldType === "text"
  //             ? 1
  //             : item?.fieldType === "image"
  //             ? 2
  //             : 3,
  //         order: i + 1,
  //         position: item.position,
  //       })),
  //     };

  //     dynamicFormEditData?.id
  //       ? await updateCustomLessonPlan(updateData)
  //           .then(async (res) => {
  //             await getCustomLessons();
  //             showNotification(res?.data?.message, "success", "success");
  //             await closeModal();
  //           })
  //           .catch((err) => {
  //             console.log(err);
  //           })
  //       : await addCustomLesson(data);
  //   }
  // };

  const submitForm = async () => {
    // Disable the button to prevent multiple submissions
    setIsButtonDisabled(true);

    if (imageAsFile?.imageAsFile) {
      if (isImageError) {
        setIsButtonDisabled(false); // Enable the button
        return;
      }

      let formData = new FormData();
      formData.append("image_url", imageAsFile?.imageAsFile);

      await uploadImage(formData, "addForm");
    } else {
      if (isImageError) {
        setIsButtonDisabled(false); // Enable the button
        return;
      }

      let data = {
        curriculum_id: location.state.curriculum_id,
        suboption_id: location.state.suboption_id,
        title: formik?.values?.lessonTitle,

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
          position: item.position,
        })),
      };

      let updateData = {
        id: lessonPlanData?.id,
        lesson_id: dynamicFormEditData?.id,
        title: formik?.values?.lessonTitle,

        lesson_data: formFields?.map((item, i) => ({
          key: item?.fieldLabel,
          value: item.value,
          key_type:
            item?.fieldType === "text"
              ? 1
              : item?.fieldType === "image"
              ? 2
              : 3,
          order: i + 1,
          position: item.position,
        })),
      };

      try {
        if (dynamicFormEditData?.id) {
          const res = await updateCustomLessonPlan(updateData);
          await getCustomLessons();
          showNotification(res?.data?.message, "success", "success");
          await closeModal();
        } else {
          await addCustomLesson(data);
        }
      } catch (err) {
        console.log(err);
      }
    }

    // Enable the button after 3 seconds
    setTimeout(() => {
      setIsButtonDisabled(false);
    }, 3000);
  };

  const getPositionCount = (array) => {
    // Initialize an object to store counts for each position
    const positionCounts = {};

    // Loop through the array of objects
    array.forEach((item) => {
      // Extract the position value
      const position = item.position;

      // If the position is already in the counts object, increment its count
      if (positionCounts[position]) {
        positionCounts[position]++;
      } else {
        // Otherwise, initialize its count to 1
        positionCounts[position] = 1;
      }
    });

    return positionCounts;
  };

  const renderAddFormFields = () => {
    return formFields?.map((field, index) => {
      if (index === editKey) {
        return (
          <AddFieldPopper
            open={openDialog}
            onClose={closeAddFieldDialog}
            addNewField={addNewField}
            isEdit={isEdit}
            onEditSave={onEditSave}
            editData={editData}
            setFieldPosition={setFieldPosition}
            fieldPosition={fieldPosition}
            lessonTitle={formik?.values?.lessonTitle}
            positionCounts={positionCounts}
          />
        );
      } else {
        return (
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
              onEditField={() => onEditField(index)}
              onDeleteField={onDeleteField}
              field={field}
              index={index}
              setImageAsFile={setImageAsFile}
              editorHtml={editorHtml}
              setEditorHtml={setEditorHtml}
              formFields={formFields}
              setFormFields={setFormFields}
              fieldValue={field?.value}
              handleFileChange={handleFileChange}
              isImageError={isImageError}
              imageErrorMsg={imageErrorMsg}
            />
          </div>
        );
      }
    });
  };

  const renderSubmitFormButton = () => {
    if (formFields && formFields?.length > 0) {
      return (
        <Button
          className="btn-primary-blue"
          sx={{ mt: 2 }}
          onClick={submitForm}
          disabled={isButtonDisabled || isImageError}
        >
          {isButtonDisabled ? "Please Wait..." : "Submit Form"}
        </Button>
      );
    }

    return null;
  };

  const renderForms = (formFields) => {
    if (formFields?.length > 0) {
      return renderAddFormFields();
    }

    return null;
  };
  console.log(formFields, "formFields");
  return (
    <div>
      <style>{css}</style>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          marginBottom: "10px",
        }}
      >
        <>
          <InputLabel id="name">Add Title </InputLabel>
          <TextField
            sx={{ marginTop: 1, marginBottom: 1 }}
            fullWidth
            id="lessonTitle"
            name="lessonTitle"
            value={formik.values.lessonTitle}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={
              formik.touched.lessonTitle && Boolean(formik.errors.lessonTitle)
            }
            // helperText={formik.touched.lessonTitle && formik.errors.lessonTitle}
          />
        </>
        {formik.touched.lessonTitle && (
          <p style={{ color: "red" }}>{formik.errors.lessonTitle}</p>
        )}
      </div>

      <Button
        className="btn-primary-blue"
        onClick={openAddFieldDialog}
        data-dismiss="modal"
      >
        {isEdit ? "Edit Item" : "Add New Item"}
      </Button>

      {!isEdit && openDialog && (
        <AddFieldPopper
          open={openDialog}
          onClose={closeAddFieldDialog}
          addNewField={addNewField}
          isEdit={isEdit}
          onEditSave={onEditSave}
          editData={editData}
          setFieldPosition={setFieldPosition}
          fieldPosition={fieldPosition}
          lessonTitle={formik?.values?.lessonTitle}
          positionCounts={positionCounts}
        />
      )}

      {renderForms(formFields)}

      {renderSubmitFormButton()}
    </div>
  );
};
export default memo(DynamicForm);
