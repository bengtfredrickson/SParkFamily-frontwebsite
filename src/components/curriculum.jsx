import React, { useEffect, useState, useMemo } from "react";
import Side_Navigation from "./Side_Navigation";
import { DataGrid } from "@mui/x-data-grid";
import Box from "@mui/material/Box";
import {
  add_curriculum,
  delete_curriculum,
  get_all_curriculums,
  update_curriculum,
} from "../services/web/webServices";
import { Store } from "react-notifications-component";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
import { Form, Formik, Field, useFormik } from "formik";
import Modal from "react-bootstrap/Modal";
import { MyTextArea, MyTextInput } from "../services/web/inputServices";
import * as Yup from "yup";
import { Loader } from "./Helper/Loader";
import Footer from "./Footer";
import moment from "moment/moment";
import { DropdownButton, Dropdown } from "react-bootstrap";

import DataTable from "./DataTable";
import DynamicForm from "./dynamicForm/dynamicForm";

const css = `
    .sidebar-menu li:nth-child(3) a {
        background:coral;
    }

    .curriculum_format .dropdown-menu{
        position:absolute !important;
        right:0 !important;
        left:auto !important;
        width:auto;
        padding:0;
    }

    .custom-btn{
    background: #48aee114;
    padding: 2px 0px;
    display: block;
    color: #fff;
    border-radius: 5px;
    text-decoration: none;
    border: 1px solid #1846b9;
    }

    .curriculum_format .custom-btn .btn-primary{
        background-color:transparent !important;
        color:#34395e !important;
        text-transform: uppercase;
        font-size:14px;
        font-weight:500;
    }

    .curriculum_format .custom-btn .btn-primary:focus:active{
        background-color:transparent !important;
    }

    .curriculum_format .card-header.d-Fle a{
        background: transparent !important;
        padding: 10px 15px !important;
        display: block;
        color:#34395e !important;
        border-radius: 0 !important;
        text-decoration: none;
        border-top: 0 !important;
        border-left:0 !important;
        border-right:0 !important;
        border-bottom: solid 1px #ccc !important;
    }

    .curriculum_format .card-header.d-Fle a:last-child{
        border-bottom: 0 !important;
    }
    .curriculum_format .card-header.d-Fle a:hover {
        background: #eef4fc !important;
    }
    `;
export default function Curriculum() {
  const navigate = useNavigate();

  const [getLoader, setLoader] = useState(true);
  const location = useLocation();
  const [select, setSelection] = useState([]);
  const [curriculum, setCurriculum] = useState([]);
  const [getImage, setImage] = useState({});
  const [getDetail, setDetail] = useState([]);
  const [getImageUrl, setImageUrl] = useState({});
  const [getState, setState] = useState(true);
  const [getbutton, setbutton] = useState(false);

  const [Module, setModule] = useState(0);

  // Edit Curriculum Model
  const [showEditCurriculum, setShowEditCurriculum] = useState(false);
  const handleClose = () => {
    if (
      window.confirm(
        "Are you sure you want to leave the current page?\nChanges will not be saved until you submit the form!"
      )
    ) {
      setShowEditCurriculum(false);
      setImage({});
      setImageUrl({});
    }
  };
  const handleShow = (row) => {
    console.log(row);
    setDetail(row);
    setShowEditCurriculum(true);
    setImageUrl(row.banner_link);
  };
  const onHandle = (e) => {
    setImage({
      pictureAsFile: e.target.files[0],
    });
    setState(false);
    setImageUrl(URL.createObjectURL(e.target.files[0]));
  };
  // ends

  // Add Curriculum Model Function

  const [showAddCurriculum, setShowAddCurriculum] = useState(false);
  const handleClose1 = () => {
    if (
      window.confirm(
        "Are you sure you want to leave the current page?\nChanges will not be saved until you submit the form!"
      )
    ) {
      setShowAddCurriculum(false);
      setImage({});
      setImageUrl({});
    }
  };
  const handleShow1 = (selectedOption) => {
    console.log("=========>", selectedOption);
    setModule(selectedOption);
    setShowAddCurriculum(true);
  };

  function validate_pic(value) {
    let error;
    if (!value) {
      error = "Required!";
      return error;
    }
  }

  const onDelete = (params)  => {
    if (window.confirm("Are you sure you want to Delete this curriculum?")) {
      let data = {
        curriculum_id: params.curriculum_id,
        name: params.name,
      };
      console.log("111",data)
      delete_curriculum(data)
        .then((res) => {
          Store.addNotification({
            title: "Success",
            message: "Curriculum Deleted Successfully",
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
          get_all_curriculums()
            .then((res) => {
              setCurriculum(
                res.data.result.map((el, index) => ({
                  ...el,
                  id: el.curriculum_id,
                  column_name: el.name,
                  i: index,
                }))
              );
            })
            .catch((err) => {
              console.log(err);
            });
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };
  // ends
  useEffect(() => {
    if (curriculum?.length === 0 || location?.state?.reloadcurriculum) {
      get_all_curriculums()
        .then((res) => {
          setCurriculum(
            res.data.result.map((el, index) => ({
              ...el,
              id: el.curriculum_id,
              column_name: el.name,
              i: index,
            }))
          );
          setLoader(false);
        })
        .catch((err) => {
          setLoader(false);
          console.log(err);
        });
    }
  }, []);

  const columns = useMemo(
    () => [
      {
        field: "sno",
        headerName: "S.NO.",
        filterable: false,
        width: 70,
        renderCell: (index) => `${index.row.i + 1}`,
      },
      {
        field: "name",
        headerName: "Name",
        width: 200,
      },
      // {
      //     field: 'body_text',
      //     headerName: 'Description',
      //     type: 'text',
      //     width: 700,
      // },
      // {
      //     field: 'banner_link',
      //     headerName: 'Banner',
      //     width: 120,
      //     renderCell: (params) => {
      //         return (
      //             <div>

      //                 {params?.row?.banner_link == ' ' ? <img className="circular_image" style={{ width: "62px" }} src="images/splash.png" alt="Not Found " /> : <img className="circular_image" style={{ width: "62px" }} src={params?.row?.banner_link} alt='' />}

      //             </div>
      //         )
      //     }
      // },
      {
        field: "primary_color",
        headerName: "Primary Colour",
        type: "text",
        width: 130,
      },
      // {
      //     field: 'created_on',
      //     headerName: 'Published Date',
      //     type: 'text',
      //     width: 120,
      //     renderCell: (params) => {
      //         return (
      //             <>
      //                 {moment(params.value).format("YYYY")}
      //             </>
      //         );
      //     },
      // },
      {
        field: "action",
        headerName: "Action",
        width: 200,
        renderCell: (params) => {
          console.log(params, "params.row.curriculum_id");
          return (
            <>
              {params.row.module_id === 1 ? (
                <Button
                  style={{ width: "-webkit-fill-available" }}
                  onClick={() =>
                    navigate("/curriculum_module", {
                      state: { id: params.row.curriculum_id },
                    })
                  }
                >
                  Sections
                </Button>
              ) : (
                <Button
                  style={{ width: "-webkit-fill-available" }}
                  onClick={() =>
                    navigate("/curriculum_units", {
                      state: { id: params.row.curriculum_id, module_id: 0 },
                    })
                  }
                >
                  Units
                </Button>
              )}
              <Button onClick={() => handleShow(params)}>
                <i className="fas fa-edit"></i>
              </Button>
              <Button color="error" onClick={onDelete(params)}>
                <i className="fa fa-trash" aria-hidden="true"></i>
              </Button>
            </>
          );
        },
      },
    ],
    []
  );

  const formik = useFormik({
    initialValues: {
      name: "",
      type: "",
      label: "",
    },
    onSubmit: (values) => {},
  });
  return (
    <>
      <style>{css}</style>
      <Side_Navigation />

      <div className="app-container app-theme-white body-tabs-shadow fixed-sidebar fixed-header">
        <div className="app-main">
          <div className="main-content" style={{ marginBottom: "9px" }}>
            <section className="section">
              <div className="section-header">
                <h1>Curriculum</h1>
              </div>
              {/* <DynamicForm formik={formik} /> */}
              <div className="section-body">
                <div className="row">
                  <div className="col-12">
                    <div className="card curriculum_format">
                      <div className="card-header d-Fle">
                        <DropdownButton
                          style={{
                            marginRight:"0",
                            marginLeft:"auto",
                          }}
                          className="custom-btn"
                          title="Add Curriculum"
                          id="dropdown-basic-button"
                          onSelect={(selectedOption) =>
                            handleShow1(selectedOption)
                          }
                        >
                          <Dropdown.Item eventKey="0">
                            K-2 PE Format
                          </Dropdown.Item>
                          <Dropdown.Item eventKey="1">
                            3-6 PE Format (With Sections)
                          </Dropdown.Item>
                        </DropdownButton>
                      </div>
                      {/* <div className="card-header d-Fle">
                                                <h4></h4>
                                                <a onClick={handleShow1} style={{ cursor: "pointer" }}>Add Curriculum</a>
                                            </div> */}
                      <div className="card-body">
                        <div className="table-responsive newPc">
                          {getLoader === true ? (
                            <Loader />
                          ) : (
                            <Box sx={{ height: 650, width: "100%" }}>
                              {!curriculum.length ? (
                                <h3>No Data Found!</h3>
                              ) : null}

                              {curriculum?.length > 0 && (
                                <>
                                  <h2>{select.map((val) => val._id)}</h2>

                                  <DataTable
                                    tableData={curriculum}
                                    onDelete={onDelete}
                                    handleShow={handleShow}
                                  />
                                </>
                              )}
                            </Box>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>

      {/*  Modal Edit*/}

      <Modal show={showEditCurriculum} keyboard={false}>
        <Modal.Header>
          <Modal.Title>Edit</Modal.Title>
          <i
            className="fas fa-cut"
            style={{ cursor: "pointer" }}
            onClick={handleClose}
          ></i>
        </Modal.Header>
        <Modal.Body>
          <Formik
            enableReinitialize={true}
            initialValues={{
              curriculum_id: getDetail.curriculum_id,
              name: getDetail.name,
              nav_text: getDetail.nav_text,
              body_text: getDetail.body_text,
              primary_color: getDetail.primary_color,
              secondary_color: getDetail.secondary_color,
              banner_link: getDetail.banner_link,
            }}
            validationSchema={Yup.object({
              curriculum_id: Yup.number().required("Required"),
              name: Yup.string()
                .required("Required")
                .matches(
                  /\S+/,
                  "Name must contain at least one non-space character"
                ),
              nav_text: Yup.string().required("Required"),
              body_text: Yup.string().required("Required"),
              primary_color: Yup.string().required("Required"),
              secondary_color: Yup.string().required("Required"),
            })}
            onSubmit={(values, { resetForm }) => {
              setbutton(true);
              console.log(values);
              let formData = new FormData();
              formData.append("curriculum_id", values.curriculum_id);
              formData.append("name", values.name);
              formData.append("nav_text", values.nav_text);
              formData.append("body_text", values.body_text);
              formData.append("primary_color", values.primary_color);
              formData.append("secondary_color", values.secondary_color);

              if (getImage.pictureAsFile) {
                formData.append("banner_link", getImage.pictureAsFile);
              }

              update_curriculum(formData)
                .then((res) => {
                  resetForm({ values: "" });
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
                  get_all_curriculums()
                    .then((res) => {
                      console.log(res.data.result);

                      setCurriculum(
                        res.data.result.map((el, index) => ({
                          ...el,
                          id: el.curriculum_id,
                          i: index,
                        }))
                      );
                    })
                    .catch((err) => {
                      console.log(err);
                    });
                  setShowEditCurriculum(false);
                  setbutton(false);
                  setImageUrl({});
                  setImage({});
                })
                .catch((err) => {
                  // setButton(true);
                  if (err) {
                    Store.addNotification({
                      title: "Error!",
                      message: err?.result?.data?.message,
                      type: "danger",
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
                  }
                  setImageUrl({});
                  setImage({});
                  setbutton(false);
                });
            }}
          >
            <Form>
              <div className="modal-body">
                <div className="row">
                  <div className="col-lg-4 col-md-12 col-sm-12">
                    <div className="form-group">
                      <label>Name</label>
                      <MyTextInput
                        type="text"
                        className="form-control"
                        name="name"
                      />
                    </div>
                  </div>
                  <div className="col-lg-4 col-md-12 col-sm-12">
                    <div className="form-group spo">
                      <label>Nav Text</label>
                      <MyTextInput
                        type="text"
                        className="form-control"
                        name="nav_text"
                        readOnly={true}
                      />
                    </div>
                  </div>
                  <div className="col-lg-4 col-md-12 col-sm-12">
                    <div className="form-group">
                      <label>Primary Colour</label>
                      <MyTextInput
                        type="text"
                        className="form-control"
                        name="primary_color"
                      />
                    </div>
                  </div>
                  <div className="col-lg-4 col-md-12 col-sm-12">
                    <div className="form-group">
                      <label>Secondary Colour</label>
                      <MyTextInput
                        type="text"
                        className="form-control"
                        name="secondary_color"
                      />
                    </div>
                  </div>
                  <div className="col-lg-12 col-md-12 col-sm-12">
                    <div className="form-group">
                      <label>Body Text</label>
                      <MyTextArea
                        type="text"
                        className="form-control"
                        name="body_text"
                      />
                    </div>
                  </div>
                  <div className="col-lg-6 col-md-12 col-sm-12">
                    <div className="form-group">
                      <label>Banner</label>

                      <input
                        type="file"
                        accept="image/*"
                        className="form-control"
                        name="banner_link"
                        onChange={(e) => onHandle(e)}
                      />
                      {getImageUrl ? (
                        <img src={getImageUrl} className=" w-30 p-3" alt="" />
                      ) : null}
                    </div>
                  </div>

                  <div className="col-lg-12 col-md-12 col-sm-12">
                    {!getbutton ? (
                      <Button type="submit" variant="contained">
                        Submit
                      </Button>
                    ) : (
                      <Button
                        variant="contained"
                        style={{ backgroundColor: "blue", color: "white" }}
                        disabled
                      >
                        Wait Please!
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </Form>
          </Formik>
        </Modal.Body>
      </Modal>
      {/* Ends */}

      {/* Modal Add Curriculum */}
      <Modal show={showAddCurriculum} keyboard={false}>
        <Modal.Header>
          <Modal.Title>Add Curriculum</Modal.Title>
          <i
            className="fas fa-cut"
            style={{ cursor: "pointer" }}
            onClick={handleClose1}
          ></i>
        </Modal.Header>
        <Modal.Body>
          <Formik
            initialValues={{
              name: "",
              nav_text: "",
              body_text: "",
              primary_color: "",
              secondary_color: "",
              banner_link: "",
              module_id: "",
            }}
            validationSchema={Yup.object({
              name: Yup.string().required("Required"),
              body_text: Yup.string().required("Required"),
              primary_color: Yup.string().required("Required"),
              secondary_color: Yup.string().required("Required"),
            })}
            onSubmit={(values, { resetForm }) => {
              let formData = new FormData();
              formData.append("name", values.name);
              formData.append("nav_text", values.name);
              formData.append("body_text", values.body_text);
              formData.append("primary_color", values.primary_color);
              formData.append("secondary_color", values.secondary_color);
              formData.append("module_id", Module);

              if (getImage.pictureAsFile) {
                formData.append("banner_link", getImage.pictureAsFile);
              }

              setbutton(true);

              add_curriculum(formData)
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
                  resetForm({ values: "" });

                  get_all_curriculums()
                    .then((res) => {
                      console.log(res.data.result);

                      setCurriculum(
                        res.data.result.map((el, index) => ({
                          ...el,
                          id: el.curriculum_id,
                          i: index,
                        }))
                      );
                    })
                    .catch((err) => {
                      console.log(err);
                    });
                  setImageUrl({});
                  setImage({});
                  setShowAddCurriculum(false);
                  setbutton(false);
                })
                .catch((err) => {
                  if (err) {
                    Store.addNotification({
                      title: "Error!",
                      message: err?.result?.data?.message,
                      type: "danger",
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
                    setbutton(false);
                    setImageUrl({});
                    setImage({});
                  }
                });
            }}
          >
            {(props) => (
              <Form>
                <div className="modal-body">
                  <div className="row">
                    <div className="col-lg-4 col-md-12 col-sm-12">
                      <div className="form-group">
                        <label>Name</label>
                        <MyTextInput
                          type="text"
                          className="form-control"
                          name="name"
                        />
                      </div>
                    </div>
                    <div className="col-lg-4 col-md-12 col-sm-12">
                      <div className="form-group spo">
                        <label>Nav Text</label>
                        <MyTextInput
                          type="text"
                          className="form-control"
                          name="name"
                          readOnly={true}
                        />
                      </div>
                    </div>
                    <div className="col-lg-4 col-md-12 col-sm-12">
                      <div className="form-group">
                        <label>Primary Colour</label>
                        <MyTextInput
                          type="text"
                          className="form-control"
                          name="primary_color"
                        />
                      </div>
                    </div>
                    <div className="col-lg-4 col-md-12 col-sm-12">
                      <div className="form-group">
                        <label>Secondary Colour</label>
                        <MyTextInput
                          type="text"
                          className="form-control"
                          name="secondary_color"
                        />
                      </div>
                    </div>

                    <div className="col-lg-12 col-md-12 col-sm-12">
                      <div className="form-group">
                        <label>Body Text</label>
                        <MyTextArea
                          type="text"
                          className="form-control"
                          name="body_text"
                        />
                      </div>
                    </div>
                    <div className="col-lg-6 col-md-12 col-sm-12">
                      <div className="form-group">
                        <label>Banner</label>

                        <input
                          type="file"
                          accept="image/*"
                          className="form-control"
                          name="banner_link"
                          onChange={(e) => onHandle(e)}
                          required
                        />
                        {getImageUrl ? (
                          <img src={getImageUrl} className=" w-30 p-3" alt="" />
                        ) : null}
                      </div>
                    </div>

                    <div className="col-lg-12 col-md-12 col-sm-12">
                      {!getbutton ? (
                        <Button type="submit" variant="contained">
                          Submit
                        </Button>
                      ) : (
                        <Button
                          variant="contained"
                          style={{ backgroundColor: "blue", color: "white" }}
                          disabled
                        >
                          Wait Please!
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </Form>
            )}
          </Formik>
        </Modal.Body>
      </Modal>
      {/* Ends Add Curriculum */}

      <Footer />
    </>
  );
}
