import {
  Box,
  Button,
  TextField,
  MenuItem,
  InputLabel,
  Select,
} from "@mui/material";
import React from "react";
import { useFormik } from "formik";

const AddFieldDialog = ({
  addNewField,
  onClose,
  isEdit,
  onEditSave,
  editData,
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

  const names = [
    {
      value: "top",
      label: "top",
    },
    {
      value: "middle",
      label: "middle",
    },
    {
      value: "bottom",
      label: "bottom",
    },
  ];

  const formik = useFormik({
    initialValues: {
      type: editData?.fieldType || "",
      label: editData?.fieldLabel || "",
      position: editData?.position || "",
      title: "",
    },

    onSubmit: (values) => {
      isEdit ? onEditSave(values) : addNewField(values);
      onClose();
    },
    enableReinitialize: true,
  });

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
            <InputLabel id="name">Add Title of the field</InputLabel>
            <TextField
              sx={{ marginTop: 1, marginBottom: 1 }}
              fullWidth
              id="title"
              name="title"
              value={formik.values.title}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.title && Boolean(formik.errors.title)}
              helperText={formik.touched.title && formik.errors.title}
            />
          </div>
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
              helperText={formik.touched.label && formik.errors.label}
            />
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
              >
                {fieldTypes.map((option, index) => (
                  <MenuItem key={index} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
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
              >
                {names.map((option, index) => (
                  <MenuItem key={index} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </div>
          </div>

          <Button
            sx={{ mt: 2, p: 2 }}
            color="primary"
            variant="contained"
            fullWidth
            type="submit"
          >
            Submit
          </Button>
        </form>
      </div>
    </Box>
  );
};

export default AddFieldDialog;
