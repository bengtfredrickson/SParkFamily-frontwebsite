import { useField } from 'formik';
import { Editor } from 'react-draft-wysiwyg';
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { EditorState, convertToRaw } from 'draft-js'
import draftToHtml from 'draftjs-to-html'
import { useState } from 'react';

//Mayank React Developer

export const DatePicker = ({ label, ...props }) => {
  const [field, meta] = useField(props);
  return (
    <>
      {/* <label htmlFor={props.id || props.name}>{label}</label> */}
      <input className="date" {...field} {...props} />
      {meta.touched && meta.error ? (
        <div className="error" style={{ color: "red" }}>{meta.error}</div>
      ) : null}
    </>
  );
};


export const MyTextInput = ({ label, ...props }) => {
  const [field, meta] = useField(props);
  return (
    <>
      {/* <label htmlFor={props.id || props.name}>{label}</label> */}
      <input className="text-input" {...field} {...props} />
      {meta.touched && meta.error ? (
        <div className="error" style={{ color: "red" }}>{meta.error}</div>
      ) : null}
    </>
  );
};

export const MyCheckbox = ({ children, ...props }) => {
  const [field, meta] = useField({ ...props, type: 'checkbox' });
  return (
    <div>
      <label className="checkbox-input">
        <label classNameName="checktoggle">checkbox</label>
        {children}
      </label>
      {meta.touched && meta.error ? (
        <div className="error" style={{ color: "red" }}>{meta.error}</div>
      ) : null}
    </div>
  );
};


// MySelect component
export const MySelect = ({ label, ...props }) => {
  const [field, meta, helpers] = useField(props);

  return (
    <div>
      <select
        {...field}
        {...props}
        onChange={(e) => {
          helpers.setValue(e.target.value);
          if (props.onChange) {
            props.onChange(e);
          }
        }}
      >
        {props.children}
      </select>
      {meta.touched && meta.error ? (
        <div className="error" style={{ color: "red" }}>
          {meta.error}
        </div>
      ) : null}
    </div>
  );
};

export const MyTextArea = ({ label, ...props }) => {
  // useField() returns [formik.getFieldProps(), formik.getFieldMeta()]
  // which we can spread on <input> and alse replace ErrorMessage entirely.
  const [field, meta] = useField(props);
  return (
    <>
      <label htmlFor={props.id || props.name}>{label}</label>
      <textarea className="text-area" {...field} {...props} />
      {meta.touched && meta.error ? (
        <div className="error" style={{ color: "red" }}>{meta.error}</div>
      ) : null}
    </>
  );
};

export const MyTextEditor = ({ label, ...props }) => {
  const [field, meta, helpers] = useField(props);
  const [editorData, setEditorData] = useState()

  const handelChange = (value) => {
    setEditorData(value)
    console.log(draftToHtml(convertToRaw(value.getCurrentContent())))
  }

  return (
    <>

      <Editor
        toolbarClassName="toolbarClassName"
        wrapperClassName="wrapperClassName"
        editorClassName="editorClassName"
        wrapperStyle={{
          border: "1px solid #d6d6d6",
          padding: 10,
          borderRadius: 10
        }}
        toolbarStyle={{
          border: 0,
          borderBottom: "1px solid #d6d6d6"
        }}
        editorState={editorData}
        onEditorStateChange={(value) => handelChange(value)}
        onBlur={() => helpers.setTouched(true)}
      />
      {meta.touched && meta.error ? (
        <div className="error" style={{ color: "red" }}>{meta.error}</div>
      ) : null}
    </>
  )
};