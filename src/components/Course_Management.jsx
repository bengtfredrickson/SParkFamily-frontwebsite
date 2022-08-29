import React, { useEffect, useState } from "react";
import {
  add_course,
  delete_course,
  get_coach,
  get_course,
  update_course,
  upload_vedio,
} from "../services/web/webServices";
import Side_Navigation from "./Side_Navigation";
import { Store } from "react-notifications-component";
import { Button } from "react-bootstrap";
import { DataGrid } from "@mui/x-data-grid";
import { Modal } from "react-bootstrap";
import { useNavigate } from "react-router";
import Box from "@mui/material/Box";
import { Formik, Form, FieldArray, ErrorMessage } from "formik";
import * as Yup from "yup";
import { MyTextArea, MyTextInput } from "../services/web/inputServices";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import ChipInput from "material-ui-chip-input";
import { Loader } from '../components/Helper/Loader';
import Footer from './Footer';
const css = `
  .sidebar-menu li:nth-child(5) a {
      background:coral;
  }
  
  `;
export default function Course_Management() {
  const [getLoader, setLoader] = useState(true);
  const navigate = useNavigate();
  const [getCourse, setCourse] = useState([]);
  const [select, setSelection] = useState([]);
  const [getCourseDetail, setCourseDetail] = useState([]);
  const [getbutton, setbutton] = useState(false);
  let getImage;

  // let vedioUrl;
  // let videoThumbnail;
  const [getAllCoach, setAllCoach] = useState([]);
  const [getCoachId, setCoachId] = useState([]);
  // Modal Use State
  const [show, setShow] = useState(false);
  const [showEditDetail, setEditDetail] = useState(false);
  const [showAddCourse, setAddCourse] = useState(false);
  const [getCourseImage, setCourseImage] = useState({});
  const [getCourseVideo, setCourseVideo] = useState({});
  const [getCourseVideoThumbnail, setVideoThumbnail] = useState([]);
  const [getWhatYouWillLearn, setWhatYouWillLearn] = useState([]);
  const [getContent, setContent] = useState([]);
  const [open, setOpen] = React.useState();
  const [getOpenImage, setOpenImage] = React.useState();
  const [getVideo, setVideo] = useState([]);
  const [getImageUrl, setImageUrl] = useState('');
  const [getState, setState] = useState(true);
  const [getData, setData] = useState(false);
  // ==================>Ends

  let submitted = false;
  let validationWhatYouWillLearn = false;
  let courseImageValidation = false;
  // Course Detail Function starts
  const handleClose = () => {
    setShow(false);
  };
  const onDetail = (params) => {
    setShow(true);
    console.log("params===>", params.row);
    setCourseDetail(params.row);
  };

  // Course Edit Function Starts
  const handleClose1 = () => {
    setEditDetail(false);
  };
  const onEdit = (params) => {
    setEditDetail(true);
    console.log("Edit===>", params.row);
    setCourseDetail(params.row);
  };

  //  Add Function Modal Starts
  const handleClose2 = () => {
    setAddCourse(false);
  };
  const handleAddTask = () => {
    setAddCourse(true);
  };
  //   X===========================Ends of Modal Function==============================X
  //Handle Image
  const handleImage = (e) => {
    getImage = e.target.files[0]
    let formData = new FormData();
    if (getImage) {
      formData.append("course_images", getImage);
    }
    setState(false);
    setImageUrl(URL.createObjectURL(e.target.files[0]));
    setOpenImage(!getOpenImage);
    upload_vedio(formData)
      .then((res) => {
        setCourseImage(res.data.response[0].location);

        setData(true);
        setOpenImage(getOpenImage);
      })
      .catch((err) => {
        if (err) {
          console.log(err);
          setOpenImage(getOpenImage);
        }
      });
  };

  //   Video Url Function
  const handleVideoFaq = () => {
    let formData = new FormData();
    if (getCourseVideo && getCourseVideoThumbnail) {
      formData.append("video_url", getCourseVideo);
      formData.append("video_thumbnail", getCourseVideoThumbnail);
    }
    setOpen(!open);

    upload_vedio(formData)
      .then((res) => {
        console.log("Video Data Response=====>", res);

        let videoData = {
          video_url: res.data.response[0].location,
          video_name: res.data.response[0].originalname,
          video_thumbnail: res.data.response[1].location,
        };

        setVideo((getVideo) => [...getVideo, videoData]);
        // {getVideo.map(entry=>console.log(entry))}
        Store.addNotification({
          title: "Success",
          message: res?.data?.message,
          type: "success",
          insert: "top",
          container: "top-right",
          animationIn: ["animate__animated", "animate__fadeIn"],
          animationOut: ["animate__animated", "animate__fadeOut"],
          dismiss: {
            duration: 5000,
            onScreen: true,
          },
        });

        setOpen(open);
      })
      .catch((err) => {
        if (err) {
          console.log(err);
          setOpen(open);
        }
      });
  };

  // Ends

  const handleCoach = (e) => {
    console.log("hello===>", e.target.value);
    setCoachId(e.target.value);
  };

  // Delete Function
  // const onDelete = (params) => {
  //   console.log(params.row);
  //   if (window.confirm("are your sure?")) {
  //     delete_course(params.row._id)
  //       .then((res) => {
  //         Store.addNotification({
  //           title: "Success",
  //           message: res?.data?.message,
  //           type: "success",
  //           insert: "top",
  //           container: "top-right",
  //           animationIn: ["animate__animated", "animate__fadeIn"],
  //           animationOut: ["animate__animated", "animate__fadeOut"],
  //           dismiss: {
  //             duration: 5000,
  //             onScreen: true,
  //           },
  //         });

  //         get_course()
  //           .then((res) => {
  //             console.log("Res=====>", res.data.response);
  //             setCourse(
  //               res.data.response.map((el, index) => ({
  //                 ...el,
  //                 id: el._id,
  //                 i: index,
  //               }))
  //             );
  //           })
  //           .catch((err) => {
  //             console.log(err);
  //           });
  //       })
  //       .catch((err) => {
  //         console.log(err);
  //       });
  //   }
  // };

  // Ends

  const seeVideo = (params) => {
    console.log("data===>", params);
    navigate("/seevideo", { state: { video: params.row } });
  };
  useEffect(() => {
    get_course()
      .then((res) => {
        console.log("Res=====>", res.data.response);
        setCourse(
          res.data.response.map((el, index) => ({
            ...el,
            id: el._id,
            i: index,
          }))
        );
        setLoader(false);
      })
      .catch((err) => {
        if (err) {
          setLoader(false);
          console.log(err);
        }
      });

    get_coach()
      .then((res) => {
        console.log("getAllCoach===>", res.data.response);
        setAllCoach(res.data.response);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const columns = [
    {
      field: "sno",
      headerName: "S.NO.",
      filterable: false,
      width: 70,
      renderCell: (index) => `${index.row.i + 1}`,
    },
    {
      field: "course_title",
      headerName: "Course Title",
      width: 200,
      editable: true,
    },
    {
      field: "coach_email",
      headerName: "Coach Email",
      width: 200,
      editable: true,
      renderCell: (index) => `${index.row.coach.coach_email}`,
    },
    {
      field: "coach_name",
      headerName: "Coach Email",
      width: 200,
      editable: true,
      renderCell: (index) => `${index.row.coach.coach_name}`,
    },
    {
      field: "coach_image",
      headerName: "Coach Image",
      width: 200,
      editable: true,
      renderCell: (params) => {
        return (
          <>
            <div>
              {!params?.row?.coach?.coach_image ? (
                <img
                  className="circular_image"
                  style={{ width: "62px" }}
                  src="/images/profile.png"
                  alt="Not Found "
                />
              ) : (
                <img
                  className="circular_image"
                  style={{ width: "62px" }}
                  src={params?.row?.coach?.coach_image}
                  alt=""
                />
              )}
            </div>
          </>
        );
      },
    },
    {
      field: "$",
      headerName: "Vedio",
      width: 150,
      renderCell: (params) => {
        return (
          <>
            <Button
              style={{ backgroundColor: "blue" }}
              onClick={() => {
                seeVideo(params);
              }}
            >
              Click to View
            </Button>
          </>
        );
      },
    },
    {
      field: "course_Detail",
      headerName: "Course Detail",
      width: 200,
      renderCell: (params) => {
        return (
          <>
            <Button
              style={{ backgroundColor: "blue" }}
              onClick={() => onDetail(params)}
            >
              Click to View
            </Button>
          </>
        );
      },
    },
    {
      field: "$1",
      headerName: "Course Images",
      width: 120,
      renderCell: (params) => {
        return (
          <>
            <div>
              {params?.row?.course_images === " " ? (
                <img
                  className="circular_image"
                  style={{ width: "62px" }}
                  src="/images/profile.png"
                  alt="Not Found "
                />
              ) : (
                <img
                  className="circular_image"
                  style={{ width: "62px" }}
                  src={params?.row?.course_images}
                  alt=""
                />
              )}
            </div>
          </>
        );
      },
    },

    {
      field: "$&",
      headerName: "Action",
      width: 500,
      renderCell: (params) => {
        return (
          <>
            <button style={{ border: "none" }}>
              <i
                className="fas fa-edit"
                style={{ color: "blue" }}
                onClick={() => onEdit(params)}
              ></i>
            </button>

            {/* <button style={{ margin: "20px", border: "none" }}>
              <i
                className="fa fa-trash"
                aria-hidden="true"
                style={{ color: "red" }}
                onClick={() => onDelete(params)}
              ></i>
            </button> */}
          </>
        );
      },
    },
  ];
  return (
    <>
      <style>{css}</style>
      <Side_Navigation />

      <div className="main-content" style={{ marginBottom: "9px" }}>
        <section className="section">
          <div className="section-header">
            <h1>Course Management</h1>
            {/* <div className="section-header-breadcrumb">
                            <div className="breadcrumb-item active"><a href="#">Home</a></div>
                            <div className="breadcrumb-item"><a href="#">User Management</a></div>
                        </div> */}
          </div>
          <div className="section-body">
            <div className="row">
              <div className="col-12">
                <div className="card">
                  <div className="card-header d-Fle">
                    <h4>Data Table</h4>
                    <a style={{ cursor: "pointer" }} onClick={handleAddTask}>
                      Add Course
                    </a>
                  </div>
                  <div className="card-body">
                    <div className="table-responsive newPc">
                      {getLoader === true ? <Loader /> : <Box sx={{ height: 400, width: "100%" }}>
                        {getCourse.length > 0 && (
                          <>
                            <h2>{select.map((val) => val._id)}</h2>

                            <DataGrid
                              rows={getCourse}
                              columns={columns}
                              pageSize={5}
                              rowsPerPageOptions={[5]}
                              onSelectionChange={(newSelection) => {
                                setSelection(newSelection.rows);
                              }}
                            />
                          </>
                        )}
                      </Box>}

                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Model Starts */}
      <Modal show={show} onHide={handleClose} keyboard={false}>
        <Modal.Header>
          <Modal.Title>Show Detail</Modal.Title>
          <i
            className="fas fa-cut"
            style={{ cursor: "pointer" }}
            onClick={handleClose}
          ></i>
        </Modal.Header>
        <Modal.Body>
          <div className="row">
            <div className="col-md-4">
              <h5>Course Name:</h5>
              {getCourseDetail.course_title}
            </div>
            <div className="col-md-4 ">
              <h5>Course Description</h5>
              {getCourseDetail?.course_description}
            </div>
            <div className="col-md-4">
              <h5>Course Content</h5>
              {getCourseDetail.course_content?.length > 0
                ? getCourseDetail.course_content.map((item, index) => {
                  return (
                    <>
                      <div key={index}>{`${index + 1}.)    ${item}`} </div>
                    </>
                  );
                })
                : ""}
            </div>
            <div className="col-md-4 my-2">
              <h5>Offline Time Slot</h5>
              {getCourseDetail?.coach?.offline_time_slot?.length > 0
                ? getCourseDetail?.coach?.offline_time_slot.map((item, index) => {
                  return (
                    <>
                      <div key={index}>{`${index + 1}.)    ${item}`} </div>
                    </>
                  );
                })
                : ""}
            </div>
            <div className="col-md-4 my-2">
              <h5>online_time_slot</h5>
              {getCourseDetail.coach?.online_time_slot?.length > 0
                ? getCourseDetail.coach?.online_time_slot.map((item, index) => {
                  return (
                    <>
                      <div key={index}>{`${index + 1}.)    ${item}`} </div>
                    </>
                  );
                })
                : ""}
            </div>
            <div className="col-md-4 my-2">
              <h5>what_you_will_learn</h5>
              {getCourseDetail.what_you_will_learn?.length > 0
                ? getCourseDetail.what_you_will_learn.map((item, index) => {
                  return (
                    <>
                      <div key={index}>{`${index + 1}.)    ${item}`} </div>
                    </>
                  );
                })
                : ""}
            </div>
            <div className="col-md-4 my-2">
              <h5>Faq</h5>

              {getCourseDetail.faq?.length > 0
                ? getCourseDetail.faq.map((item, index) => {
                  return (
                    <>
                      <div key={index}>
                        <h6>{`${index + 1}.)${item.question}`}</h6>
                        <h7>{`==>${item.answer}`}</h7>
                      </div>
                    </>
                  );
                })
                : ""}
            </div>
            <div className="col-md-4 my-2">
              <h5>Level</h5>
              {getCourseDetail?.level}
            </div>
            <div className="col-md-4 my-2">
              <h5>Language</h5>
              {getCourseDetail?.language}
            </div>

            <div className="col-md-4 my-2">
              <h5>price</h5>
              {`${getCourseDetail?.currency_type} ${getCourseDetail?.price}`}
            </div>
            <div className="col-md-4 my-2">
              <h5>Enrolled Student</h5>
              {getCourseDetail?.enrolledStudent}
            </div>
            <div className="col-md-4 my-2">
              <h5>Duration</h5>
              {getCourseDetail?.duration}
            </div>
          </div>
        </Modal.Body>
      </Modal>
      {/* ends */}

      {/* Edit Model start */}

      <Modal show={showEditDetail} onHide={handleClose1} keyboard={false}>
        <Modal.Header>
          <Modal.Title>Edit</Modal.Title>
          <i
            class="fas fa-cut"
            style={{ cursor: "pointer" }}
            onClick={handleClose1}
          ></i>
        </Modal.Header>
        <Modal.Body>
          <Formik
            enableReinitialize={true}
            initialValues={{
              course_description: getCourseDetail.course_description,
              course_title: getCourseDetail.course_title,
              course_overview: getCourseDetail.course_overview,
              what_you_will_learn: "",
              course_content: "",
              price: getCourseDetail.price,
              currency_type: getCourseDetail.currency_type,
              faq: (getCourseDetail.faq || []).map((q) => ({
                question: q.question,
                answer: q.answer,
              })),
              course_images: getCourseDetail.course_images,
            }}
            validationSchema={Yup.object({
              course_title: Yup.string().required("Course Title is Required"),
              course_description: Yup.string().required(),
              course_overview: Yup.string().required(),
              price: Yup.number()
                .typeError("That doesn't look like a phone number")
                .positive("A phone number can't start with a minus")
                .integer("A phone number can't include a decimal point")
                .required("A phone number is required").required("Price is required"),
              currency_type: Yup.string().required("Currency is rquired"),

              faq: Yup.array().of(
                Yup.object().shape({
                  question: Yup.string().required("required!"),
                  answer: Yup.string().required("required!"),
                })
              ),
            })}

            onSubmit={(values) => {
              setbutton(true);
              if (getWhatYouWillLearn == '') {
                values.what_you_will_learn = getCourseDetail.what_you_will_learn.toString();
              }
              else {
                values.what_you_will_learn = getWhatYouWillLearn.toString();
              }


              if (getContent == '') {
                values.course_content = getCourseDetail.course_content.toString();
              }
              else {
                values.course_content = getContent.toString();
              }


              if (getData === true) {
                values.course_images = getCourseImage.toString();

              }


              update_course(values, getCourseDetail._id).then((res) => {

                setEditDetail(false);
                setbutton(false);
                get_course()
                  .then((res) => {
                    console.log("Res=====>", res.data.response);
                    setCourse(
                      res.data.response.map((el, index) => ({
                        ...el,
                        id: el._id,
                        i: index,
                      }))
                    );
                  })
                  .catch((err) => {
                    console.log(err);
                  });
              }).catch((err) => {
                if (err) {

                  Store.addNotification({
                    title: "Error!",
                    message: err?.response?.data?.message,
                    type: "danger",
                    insert: "top",
                    container: "top-right",
                    animationIn: ["animate__animated", "animate__fadeIn"],
                    animationOut: ["animate__animated", "animate__fadeOut"],
                    dismiss: {
                      duration: 5000,
                      onScreen: true,
                    },
                  });
                  setbutton(false);
                }
              })


            }}
            render={({ values }) => (
              <Form>
                <div className="modal-body">
                  <div className="row">
                    <div className="col-lg-4 col-md-12 col-sm-12">
                      <div className="form-group">
                        <label>Course Title</label>
                        <MyTextInput
                          type="text"
                          className="form-control"
                          name="course_title"
                        />
                      </div>
                    </div>
                    <div className="col-lg-8 col-md-12 col-sm-12">
                      <div className="form-group">
                        <label>Course Description</label>
                        <MyTextArea
                          type="textarea"
                          className="form-control"
                          name="course_description"
                        />
                      </div>
                    </div>
                    <div className="col-lg-4 col-md-12 col-sm-12">
                      <div className="form-group">
                        <label>Course Overview</label>
                        <MyTextArea
                          type="textarea"
                          className="form-control"
                          name="course_overview"
                        />
                      </div>
                    </div>
                    <div className="col-lg-12 col-md-12 col-sm-12">
                      <div className="form-group">
                        <label>What you will learn</label>
                        <ChipInput
                          name="what_you_will_learn"
                          onChange={(value) => setWhatYouWillLearn(value)}
                          defaultValue={getCourseDetail.what_you_will_learn}
                          fullWidth
                        />


                      </div>
                    </div>
                    <div className="col-lg-12 col-md-12 col-sm-12">
                      <div className="form-group">
                        <label>Course Content</label>
                        <ChipInput
                          name="course_content"
                          onChange={(value) => setContent(value)}
                          defaultValue={getCourseDetail.course_content}
                          fullWidth
                        />
                      </div>
                    </div>
                    <div className="col-lg-6 col-md-12 col-sm-12">
                      <div className="form-group">
                        <label>Course Price</label>
                        <MyTextInput
                          type="text"
                          className="form-control"
                          name="price"
                        />
                      </div>
                    </div>
                    <div className="col-lg-4 col-md-12 col-sm-12">
                      <div className="form-group">
                        <label>Course Image</label>
                        {getState ? <img src={getCourseDetail.course_images} className=" w-50 p-3"
                          style={{ marginLeft: "70px" }} alt="" /> : <img src={getImageUrl} className=" w-50 p-3"
                            style={{ marginLeft: "70px" }} alt="" />}
                        <input
                          type="file"
                          accept="image/*"
                          className="form-control"
                          name="course_images"
                          onChange={handleImage}
                        />
                      </div>
                    </div>

                    <div className="col-lg-4 col-md-12 col-sm-12">
                      <div className="form-group">
                        <label>Course Price</label>
                        <MyTextInput
                          type="text"
                          className="form-control"
                          name="price"
                        />
                      </div>
                    </div>
                    <div className="col-lg-4 col-md-12 col-sm-12">
                      <div className="form-group">
                        <label>Course Currency Type</label>
                        <MyTextInput
                          type="text"
                          className="form-control"
                          name="currency_type"
                        />
                      </div>
                    </div>

                    <FieldArray
                      name="faq"
                      render={(arrayHelpers) => (
                        <div className="col-lg-8 col-md-12 col-sm-12">
                          <div className="form-group">
                            <label>Faq</label>
                            {values.faq && values.faq.length > 0 ? (
                              values.faq.map((item, index) => (
                                <div key={index}>
                                  <label style={{ marginRight: "11px" }}>
                                    Question{" "}
                                  </label>
                                  <MyTextInput
                                    className="form-control"
                                    name={`faq.${index}.question`}
                                    type="text"
                                  />
                                  <label
                                    style={{
                                      marginRight: "11px",
                                      marginLeft: "3px",
                                    }}
                                  >
                                    Answer
                                  </label>
                                  <MyTextInput
                                    className="form-control"
                                    name={`faq.${index}.answer`}
                                    type="text"
                                  />

                                  <Button
                                    onClick={() => arrayHelpers.remove(index)}
                                    style={{ cursor: "pointer" }}
                                  >
                                    <i className="fas fa-trash-alt"></i>
                                  </Button>

                                  <Button
                                    stype="button"
                                    style={{ border: "none" }}
                                    onClick={() =>
                                      arrayHelpers.insert(index, "")
                                    }
                                  >
                                    <h6>+</h6>
                                  </Button>
                                </div>
                              ))
                            ) : (
                              <Button onClick={() => arrayHelpers.push("")}>
                                {/* show this when user has removed all faq from the list */}
                                Add Faq
                              </Button>
                            )}
                          </div>
                        </div>
                      )}
                    />

                    <div className="col-lg-12 col-md-12 col-sm-12">

                      {!getbutton ? <Button
                        type="submit"
                        style={{
                          background: "blue",
                          width: "96px",
                          height: "43px",
                        }}
                      >
                        Submit
                      </Button> : <Button

                        style={{
                          background: "blue",
                          width: "96px",
                          height: "43px",
                        }}
                        disabled
                      >
                        Wait please
                      </Button>}
                    </div>
                  </div>
                </div>
              </Form>
            )}
          />
        </Modal.Body>
      </Modal>
      {/* Ends */}

      {/* Add Course */}
      <Modal show={showAddCourse} onHide={handleClose2} animation={false}>
        <Modal.Header>
          <Modal.Title>Add Course</Modal.Title>
          <i
            class="fas fa-cut"
            style={{ cursor: "pointer" }}
            onClick={handleClose2}
          ></i>
        </Modal.Header>
        <Modal.Body>
          <Formik
            // enableReinitialize={true}
            initialValues={{
              course_title: "",
              course_description: "",
              course_overview: "",
              what_you_will_learn: [],
              course_content: [],
              price: "",
              currency_type: "",
              faq: [
                {
                  question: "",
                  answer: "",
                },
              ],
              course_images: "",

              videos: [
                {
                  video_url: "",
                  video_name: "",
                  video_thumbnail: "",
                },
              ],
              coach: "",
            }}
            validationSchema={Yup.object().shape({
              course_title: Yup.string().required("course title is required!"),
              course_description: Yup.string().required("course description is required!"),
              course_overview: Yup.string().required("course overview is required!"),
              price: Yup.number()
                .typeError("That doesn't look like a price")
                .positive("A price can't start with a minus")
                .required("A price is required"),
              currency_type: Yup.string().required("required!"),
              faq: Yup.array().of(
                Yup.object().shape({
                  question: Yup.string().required("required!"),
                  answer: Yup.string().required("required!"),
                })
              ),
              course_images:Yup.mixed().required("required!"),
            })}
            validate={(values) => {
              const errors = {};
              if (values.what_you_will_learn == '') {
                errors.what_you_will_learn = 'Required';
              }
              if (values.course_content == '') {
                errors.course_content = 'Required';
              }
             
              return errors;
            }}
            onSubmit={(values) => {
              setbutton(true);
              values.coach = getCoachId.toString();
              values.course_images = getCourseImage.toString();
              values.videos = (getVideo || []).map((q) => ({
                video_url: q.video_url,
                video_name: q.video_name,
                video_thumbnail: q.video_thumbnail,
              }));
              values.what_you_will_learn=values.what_you_will_learn.toString();
              values.course_content=values.course_content.toString();
    

                add_course(values)
                  .then((res) => {
                    // setButton(true);
                    console.log("Res=====>", res);
                    Store.addNotification({
                      title: "Success",
                      message: res?.data?.message,
                      type: "success",
                      insert: "top",
                      container: "top-right",
                      animationIn: ["animate__animated", "animate__fadeIn"],
                      animationOut: ["animate__animated", "animate__fadeOut"],
                      dismiss: {
                        duration: 5000,
                        onScreen: true,
                      },
                    });
                    setAddCourse(false);
                    setbutton(false);
                    get_course()
                      .then((res) => {
                        console.log("Res=====>", res.data.response);
                        setCourse(
                          res.data.response.map((el, index) => ({
                            ...el,
                            id: el._id,
                            i: index,
                          }))
                        );
                      })
                      .catch((err) => {
                        console.log(err);
                      });
                  })
                  .catch((err) => {
                    if (err) {
                      Store.addNotification({
                        title: "Error!",
                        message: err?.response?.data?.message,
                        type: "danger",
                        insert: "top",
                        container: "top-right",
                        animationIn: ["animate__animated", "animate__fadeIn"],
                        animationOut: ["animate__animated", "animate__fadeOut"],
                        dismiss: {
                          duration: 5000,
                          onScreen: true,
                        },
                      });
                      setbutton(false);
                    }
                  });
              
            }}
            >

           {props=>(
              <Form>
                <div className="modal-body">
                  <div className="row">
                    <div className="col-lg-4 col-md-12 col-sm-12">
                      <div className="form-group">
                        <label>Coach</label>
                        <select onClick={handleCoach} className="form-control">
                          <option>Select Coach</option>
                          {getAllCoach?.length > 0
                            ? getAllCoach.map((item, index) => {
                              return (
                                <>
                                  <option key={index} value={item._id}>
                                    {item?.coach_name}
                                  </option>
                                </>
                              );
                            })
                            : ""}
                        </select>
                      </div>
                    </div>

                    <div className="col-lg-4 col-md-12 col-sm-12">
                      <div className="form-group">
                        <label>Course Title</label>
                        <MyTextInput
                          type="text"
                          className="form-control"
                          name="course_title"
                        />
                      </div>
                    </div>

                    <div className="col-lg-4 col-md-12 col-sm-12">
                      <div className="form-group">
                        <label>Course Description</label>
                        <MyTextArea
                          type="textarea"
                          className="form-control"
                          name="course_description"
                        />
                      </div>
                    </div>

                    <div className="col-lg-4 col-md-12 col-sm-12">
                      <div className="form-group">
                        <label>Course Overview</label>
                        <MyTextArea
                          type="textarea"
                          className="form-control"
                          name="course_overview"
                        />
                      </div>
                    </div>
                    <div className="col-lg-4 col-md-12 col-sm-12">
                      <div className="form-group">
                        <label>Course Price</label>
                        <MyTextInput
                          type="text"
                          className="form-control"
                          name="price"
                        />
                      </div>
                    </div>
                    <div className="col-lg-4 col-md-12 col-sm-12">
                      <div className="form-group">
                        <label>Course Currency Type</label>
                        <MyTextInput
                          type="text"
                          className="form-control"
                          name="currency_type"
                        />
                      </div>
                    </div>
                    <div className="col-lg-12 col-md-12 col-sm-12">
                      <div className="form-group">
                        <label>What You will Learn</label>
                       
                        <ChipInput
                          name="what_you_will_learn"
                          onChange={(e) => {
                            const l = e.length;
                            const h = e[l - 1];
                            props.values.what_you_will_learn = [...props.values.what_you_will_learn, h]
                          }}

                          fullWidth
                          // value={props.values.value}
                        />
                        {props.errors.what_you_will_learn && props.touched.what_you_will_learn && <div style={{ color: "red" }}>{props.errors.what_you_will_learn}</div>}
                      </div>
                    </div>
                    <div className="col-lg-12 col-md-12 col-sm-12">
                      <div className="form-group">
                        <label>Course Content</label>
                       
                        <ChipInput
                          name="course_content"
                          onChange={(e) => {
                            const l = e.length;
                            const h = e[l - 1];
                            props.values.course_content = [...props.values.course_content, h]
                          }}

                          fullWidth
                          // value={props.values.value}
                        />
                        {props.errors.course_content && props.touched.course_content && <div style={{ color: "red" }}>{props.errors.course_content}</div>}
                      </div>
                    </div>
                    <div className="col-lg-4 col-md-12 col-sm-12">
                      <div className="form-group">
                        <label>Course Image</label>
                        <input type="file"
                          className="form-control"
                          accept="image/*"
                          name="course_images"
                          onChange={(e) => {
                            props.values.course_images = e.target.files[0]

                            handleImage(e)
                          }}
                          // value={props.values.value}
                        />
                        {props.errors.course_images && props.touched.course_images && <div style={{ color: "red" }}>{props.errors.course_images}</div>}
                       
                      </div>
                    </div>
                    <FieldArray
                      name="faq"
                      render={(arrayHelpers) => (
                        <div className="col-lg-12 col-md-12 col-sm-12">
                          <div className="form-group">
                            <label> Course Faq</label>
                            {props.values.faq && props.values.faq.length > 0 ? (
                              props.values.faq.map((item, index) => (
                                <div key={index}>
                                  <label style={{ marginRight: "11px" }}>
                                    Question{" "}
                                  </label>
                                  <MyTextInput
                                    className="form-control"
                                    name={`faq.${index}.question`}
                                    type="text"
                                  />

                                  <label
                                    style={{
                                      marginRight: "11px",
                                      marginLeft: "3px",
                                    }}
                                  >
                                    Answer
                                  </label>
                                  <MyTextInput
                                    className="form-control"
                                    name={`faq.${index}.answer`}
                                    type="text"
                                  />

                                  <Button
                                    onClick={() => arrayHelpers.remove(index)}
                                    style={{ cursor: "pointer" }}
                                  >
                                    <i className="fas fa-trash-alt"></i>
                                  </Button>

                                  <Button
                                    stype="button"
                                    style={{ border: "none" }}
                                    onClick={() =>
                                      arrayHelpers.insert(index, "")
                                    }
                                  >
                                    <h6>+</h6>
                                  </Button>
                                </div>
                              ))
                            ) : (
                              <Button onClick={() => arrayHelpers.push("")}>
                                Add Faq
                              </Button>
                            )}
                          </div>
                        </div>
                      )}
                    />

                    <FieldArray
                      name="videos"
                      render={(arrayHelpers) => (
                        <div className="col-lg-12 col-md-12 col-sm-12">
                          <div className="form-group">
                            <label> Course Video</label>
                            {props.values.videos && props.values.videos.length > 0 ? (
                              props.values.videos.map((item, index) => (
                                <div key={index}>
                                  <label style={{ marginRight: "11px" }}>
                                    Select Video
                                  </label>
                                  <input
                                    className="form-control"
                                    name={`videos.${index}.video_url`}
                                    type="file"
                                    accept="video/*"
                                    required
                                    onChange={(e) =>
                                      setCourseVideo(e.target.files[0])
                                    }

                                  />

                                  
                                  <label
                                    style={{
                                      marginRight: "11px",
                                      marginLeft: "3px",
                                    }}
                                  >
                                    Select Video Thumbnail
                                  </label>
                                  <input
                                    className="form-control"
                                    name={`videos.${index}.video_thumbnail`}
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) =>
                                      setVideoThumbnail(e.target.files[0])
                                    }
                                    required
                                  />

                                  <Button
                                    onClick={() => arrayHelpers.remove(index)}
                                    style={{ cursor: "pointer" }}
                                  >
                                    <i className="fas fa-trash-alt"></i>
                                  </Button>

                                  <Button
                                    stype="button"
                                    style={{ border: "none" }}
                                    onClick={() =>
                                      arrayHelpers.insert(index, "")
                                    }
                                  >
                                    <h6>+</h6>
                                  </Button>
                                  <Button style={{ backgroundColor: "blue" }} onClick={handleVideoFaq}>

                                    <i className="fa fa-upload" aria-hidden="true">Upload Data</i>
                                  </Button>
                                </div>
                              ))
                            ) : (
                              <Button onClick={() => arrayHelpers.push("")}>
                                {/* show this when user has removed all faq from the list */}
                                Add Video
                              </Button>
                            )}
                          </div>
                        </div>
                      )}
                    />

                    <div className="col-lg-12 col-md-12 col-sm-12">

                      {!getbutton ? <Button
                        type="submit"
                        style={{
                          background: "blue",
                          width: "96px",
                          height: "43px",
                        }}
                      >
                        Submit
                      </Button> : <Button

                        style={{
                          background: "blue",
                          width: "120px",
                          height: "43px",
                        }}
                        disabled
                      >
                        Wait Please !
                      </Button>}
                    </div>
                  </div>
                </div>
              </Form>
            )}
            </Formik>
        </Modal.Body>
      </Modal>
      {/* Add Ends */}
      {/*  Video Url BackDrop*/}
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={open}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      {/* Ends */}

      {/* Image */}
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={getOpenImage}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      {/* Ends */}
      <Footer />
    </>
  );
}
