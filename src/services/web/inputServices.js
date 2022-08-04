import { useField } from 'formik';
//Mayank React Developer

export const DatePicker = ({ label, ...props }) => {
  const [field, meta] = useField(props);
  return (
    <>
      {/* <label htmlFor={props.id || props.name}>{label}</label> */}
      <input className="date" {...field} {...props} />
      {meta.touched && meta.error ? (
        <div className="error" style={{color:"red"}}>{meta.error}</div>
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
          <div className="error" style={{color:"red"}}>{meta.error}</div>
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
          <div className="error" style={{color:"red"}}>{meta.error}</div>
        ) : null}
      </div>
    );
  };
  
  export const MySelect = ({ label, ...props }) => {
    const [field, meta] = useField(props);
    return (
      <div>
        <select {...field} {...props} />
        {meta.touched && meta.error ? (
          <div className="error" style={{color:"red"}}>{meta.error}</div>
        ) : null}
      </div>
    );
  };

  export const MyTextArea = ({label, ...props}) => {
    // useField() returns [formik.getFieldProps(), formik.getFieldMeta()]
    // which we can spread on <input> and alse replace ErrorMessage entirely.
    const [field, meta] = useField(props);
    return (
        <>
            <label htmlFor={props.id || props.name}>{label}</label>
            <textarea className="text-area" {...field} {...props} />
            {meta.touched && meta.error ? (
                <div className="error" style={{color:"red"}}>{meta.error}</div>
            ) : null}
        </>
    );
  };