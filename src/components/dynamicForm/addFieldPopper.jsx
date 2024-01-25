import {
  Box,
  Button,
  TextField,
  MenuItem,
  InputLabel,
  Select,
  // Dialog,
} from "@mui/material";
import React from "react";
import { useFormik } from "formik";

const AddFieldDialog = ({
  // open,
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

  const formik = useFormik({
    initialValues: {
      name: editData?.fieldName,
      type: editData?.fieldType,
      label: editData?.fieldLabel,
    },
    onSubmit: (values) => {
      isEdit ? onEditSave(values) : addNewField(values);
      onClose();
    },
  });

  return (
    // <Dialog onClose={onClose} open={open}>
    <Box sx={{ border: 1, p: 1, bgcolor: "background.paper" }}>
      <div style={{ textAlign: "end" }}>
        <i
          className="fas fa-cut"
          style={{ cursor: "pointer" }}
          onClick={onClose}
        ></i>
      </div>
      <form onSubmit={formik.handleSubmit}>
        <InputLabel id="name">Add Name of the field</InputLabel>
        <TextField
          sx={{ marginTop: 1, marginBottom: 1 }}
          fullWidth
          id="name"
          name="name"
          // defaultValue={editData?.fieldName || ""}
          value={formik.values.name}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.name && Boolean(formik.errors.name)}
          helperText={formik.touched.name && formik.errors.name}
        />
        <InputLabel id="name">Add Label of the field</InputLabel>
        <TextField
          sx={{ marginTop: 1, marginBottom: 1 }}
          fullWidth
          id="label"
          name="label"
          // label="Add Label of the field"
          // label={`${editData?.fieldLabel || "Add Label of the field"} `}
          // defaultValue={editData?.fieldLabel}
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
          // defaultValue={editData?.fieldType}
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

        {/* <TextField
            sx={{ marginTop: 1, marginBottom: 1 }}
            fullWidth
            id="type"
            name="type"
            select
            label="Select"
            value={formik.values.type}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            defaultValue="text"
            helperText={formik.touched.type && formik.errors.type}
          >
            {fieldTypes.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField> */}

        {/* <TextField
            fullWidth
            id="password"
            name="password"
            label="Password"
            type="password"
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.password && Boolean(formik.errors.password)}
            helperText={formik.touched.password && formik.errors.password}
          /> */}
        <Button color="primary" variant="contained" fullWidth type="submit">
          Submit
        </Button>
      </form>
    </Box>
    // </Dialog>
  );
};

export default AddFieldDialog;
