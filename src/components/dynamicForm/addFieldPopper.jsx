import {
  Box,
  Button,
  TextField,
  MenuItem,
  InputLabel,
  Select,
} from "@mui/material";
import * as Yup from "yup";
import React, { useMemo } from "react";
import { useFormik } from "formik";

const AddFieldDialog = ({
  addNewField,
  onClose,
  isEdit,
  onEditSave,
  editData,
  lessonTitle,
  positionCounts,
}) => {
  const fieldTypes = [
    {
      value: "text",
      label: "text",
    },
    {
      value: "image",
      label: "image",
    },
    {
      value: "textArea",
      label: "textArea",
    },
  ];

  const initialValue = useMemo(() => {
    return {
      type: editData?.fieldType || "",
      label: editData?.fieldLabel || "",
      position:
        (editData?.fieldType === "image" ? "middle" : editData?.position) || "",
    };
  }, [editData]);

  console.log(editData, "editData");

  console.log(initialValue, "initialValue");
  const formik = useFormik({
    validateOnMount: true,
    initialValues: { ...initialValue },
    validationSchema: Yup.object({
      type: Yup.string().required("Required"),
      label: Yup.string().required("Required"),
      position: Yup.string().required("Required"),
    }),

    onSubmit: (values) => {
      isEdit ? onEditSave(values) : addNewField(values);
      onClose();
    },
    enableReinitialize: true,
  });

  const positionNames = useMemo(() => {
    let data = [
      {
        value: "top",
        label: "top",
        disabled: positionCounts?.top === 3,
      },
      {
        value: "middle",
        label: "middle",
        disabled: false,
      },
      {
        value: "bottom",
        label: "bottom",
        disabled: positionCounts?.bottom === 3,
      },
    ];

    return data;
  }, [positionCounts]);

  // console.log(positionNames, "positionNames");

  return (
    <Box
      sx={{
        border: 0,
        borderBottom: "solid 1px #ccc",
        p: "0px 0px 15px 0",
        m: "2",
        bgcolor: "background.paper",
      }}
    >
      <div style={{ textAlign: "end" }}>
        <i
          className="fas fa-cut"
          style={{ cursor: "pointer" }}
          onClick={onClose}
        ></i>
      </div>
      <div
        style={{
          textAlign: "start",

          width: "100%",
        }}
      >
        <form onSubmit={formik.handleSubmit}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              width: "100%",
            }}
          >
            <InputLabel id="name">Add Label of the field</InputLabel>
            <TextField
              sx={{ marginTop: 1, marginBottom: 1 }}
              fullWidth
              id="label"
              name="label"
              value={formik.values.label}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.label && Boolean(formik.errors.label)}
            />
            {formik.touched.label && (
              <p style={{ color: "red" }}>{formik.errors.label}</p>
            )}
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
            }}
          >
            <div
              style={{
                width: "49%",
              }}
            >
              <InputLabel id="type">Add Type of the field</InputLabel>
              <Select
                fullWidth
                labelId="type"
                id="type"
                name="type"
                value={formik.values.type}
                label="Type"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.type && Boolean(formik.errors.type)}
              >
                {fieldTypes.map((option, index) => (
                  <MenuItem key={index} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
              {formik.touched.type && (
                <p style={{ color: "red" }}>{formik.errors.type}</p>
              )}
            </div>
            <div
              style={{
                width: "49%",
                marginRight: "0",
                marginLeft: "auto",
              }}
            >
              <InputLabel id="position">Add Position of the field</InputLabel>
              <Select
                fullWidth
                labelId="position"
                id="position"
                name="position"
                value={formik.values.position}
                label="Position"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.position && Boolean(formik.errors.position)
                }
              >
                {formik.values.type == "image" ? (
                  <MenuItem value={"middle"}>{"middle"}</MenuItem>
                ) : (
                  positionNames.map((option, index) => (
                    <MenuItem
                      key={index}
                      value={option.value}
                      disabled={option?.disabled}
                    >
                      {option.label}
                    </MenuItem>
                  ))
                )}
              </Select>
              {formik.touched.position && (
                <p style={{ color: "red" }}>{formik.errors.position}</p>
              )}
            </div>
          </div>

          <Button
            sx={{ mt: 2, p: 2 }}
            color="primary"
            variant="contained"
            fullWidth
            type="submit"
            disabled={formik.isValid === false || !lessonTitle}
          >
            Submit
          </Button>
        </form>
      </div>
    </Box>
  );
};

export default React.memo(AddFieldDialog);
