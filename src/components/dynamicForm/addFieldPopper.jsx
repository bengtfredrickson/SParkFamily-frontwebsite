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
    },

    onSubmit: (values) => {
      isEdit ? onEditSave(values) : addNewField(values);
      onClose();
    },
    enableReinitialize: true,
  });

  return (
    <Box sx={{ border: 0, p: 1, bgcolor: "background.paper" }}>
      <div style={{ textAlign: "end" }}>
        <i
          className="fas fa-cut"
          style={{ cursor: "pointer" }}
          onClick={onClose}
        ></i>
      </div>
      <form onSubmit={formik.handleSubmit}>
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
    </Box>
  );
};

export default AddFieldDialog;
