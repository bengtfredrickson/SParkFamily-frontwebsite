import React, { useEffect, useState } from "react";
import Side_Navigation from "./Side_Navigation";
import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";
import Modal from "react-bootstrap/Modal";
import {
  add_coach,
  // delete_coach,
  get_coach,
  update_coach,
} from "../services/web/webServices";
import { Store } from "react-notifications-component";
import { Button } from "@mui/material";
import { Formik, Form } from "formik";
import { MyTextInput, MyTextArea } from "../services/web/inputServices";
import * as Yup from "yup";
import ChipInput from 'material-ui-chip-input'
//   css
const css = `
    .sidebar-menu li:nth-child(4) a {
        background:coral;
    }
    
    `
// Ends
export default function Coach_Management() {
  const [getCoach, setCoach] = useState([]);
  const [getImageUrl, setImageUrl] = useState({});
  const [select, setSelection] = useState([]);
  const [getDetail, setDetail] = useState([]);

  const [getImage, setImage] = useState([]);
  const [getState, setState] = useState(true);
  const [getGrade, setGarde] = useState([]);
  const [getSubject, setSubject] = useState([]);
  const [getOffered, setOffered] = useState([]);
  const [getOnlineTimeSlot, setOnlineTimeSlot] = useState([]);
  const [getOfflineTimeSlot, setOfflineTimeSlot] = useState([]);
  const [getbutton, setbutton] = useState(false);
  // Short Bio Modal
  const [show, setShow] = useState(false);
  const handleClose = () => {
    setShow(false);
  };
  const handleShow = (e) => {
    setDetail(e.row);
    setShow(true);
  };
  // Ends

  // Social Profile Model

  const [showSocialProfile, setShowSocialProfile] = useState(false);
  const handleClose1 = () => {
    setShowSocialProfile(false);
  };
  const handleShow1 = (e) => {
    setDetail(e.row);
    setShowSocialProfile(true);
  };

  // coach Detail
  const [showCoachDetail, setCoachDetail] = useState(false);
  const handleClose2 = () => {
    setCoachDetail(false);
  };
  const handleShow2 = (e) => {
    setDetail(e.row);
    setCoachDetail(true);
  };

  // Edit Coach
  const [showEditCoach, setEditDetail] = useState(false);
  const handleClose3 = () => {
    setEditDetail(false);
  };
  const handleShow3 = (e) => {
    setDetail(e.row);
    setEditDetail(true);
  };

  // Ends

  // Add Coach
  const [showAddCoach, setAddCoach] = useState(false);
  const handleClose4 = () => {
    setAddCoach(false);
  };
  const handleShow4 = () => {
    setAddCoach(true);
  };

  //   Fnction Starts
  const onHandle = (e) => {
    setImage({
      pictureAsFile: e.target.files[0],
    });
    setState(false);
    setImageUrl(URL.createObjectURL(e.target.files[0]));
  };



  // Grade onChange

  //Subject OnChange






  // const onDelete = (params) => {
  //   console.log(params.row);
  //   if (window.confirm("are your sure?")) {
  //     delete_coach(params.row._id)
  //       .then((res) => {
  //         // setButton(true);

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
  //         get_coach()
  //           .then((res) => {
  //             // console.log("Res=====>", res.data.response);
  //             setCoach(
  //               res.data.response.map((el, index) => ({
  //                 ...el,
  //                 id: el._id,
  //                 i: index,
  //               }))
  //             );
  //           })
  //           .catch((err) => {
  //             if (err) {
  //               Store.addNotification({
  //                 title: "Error!",
  //                 message: err?.response?.data?.message,
  //                 type: "danger",
  //                 insert: "top",
  //                 container: "top-right",
  //                 animationIn: ["animate__animated", "animate__fadeIn"],
  //                 animationOut: ["animate__animated", "animate__fadeOut"],
  //                 dismiss: {
  //                   duration: 5000,
  //                   onScreen: true,
  //                 },
  //               });
  //             }
  //           });
  //       })
  //       .catch((err) => {
  //         if (err) {
  //           Store.addNotification({
  //             title: "Error!",
  //             message: err?.response?.data?.message,
  //             type: "danger",
  //             insert: "top",
  //             container: "top-right",
  //             animationIn: ["animate__animated", "animate__fadeIn"],
  //             animationOut: ["animate__animated", "animate__fadeOut"],
  //             dismiss: {
  //               duration: 5000,
  //               onScreen: true,
  //             },
  //           });
  //         }
  //       });
  //   }
  // };
  // Ends

  useEffect(() => {
    get_coach()
      .then((res) => {
        console.log("example=====>", res.data.response);
        setCoach(
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
  }, []);

  // Coloumns
  const columns = [
    {
      field: "sno",
      headerName: "S.NO.",
      width: 90,
      renderCell: (index) => `${index.row.i + 1}`,
    },
    { field: "coach_name", headerName: "Coach Name", width: 100 },
    {
      field: "coach_email",
      headerName: "Email Id",
      width: 150,
      editable: true,
    },
    {
      field: "#",
      headerName: "Short Bio",
      width: 200,
      renderCell: (params) => {
        return (
          <>
            <Button variant="contained" onClick={() => handleShow(params)}>
              Click to View
            </Button>
          </>
        );
      },
    },
    {
      field: "#1",
      headerName: "Social Profile",
      width: 200,
      renderCell: (params) => {
        return (
          <>
            <Button variant="contained" onClick={() => handleShow1(params)}>
              Click to View
            </Button>
          </>
        );
      },
    },
    {
      field: "$",
      headerName: "Coach Detail",
      width: 200,
      renderCell: (params) => {
        return (
          <>
            <Button variant="contained" onClick={() => handleShow2(params)}>
              Click to View
            </Button>
          </>
        );
      },
    },
    {
      field: "coach_image",
      headerName: "Image",
      width: 110,
      renderCell: (params) => {
        return (
          <div>
            {params?.row?.coach_image == " " ? (
              <img
                className="circular_image"
                style={{ width: "62px" }}
                src="images/profile.png"
                alt="Not Found "
              />
            ) : (
              <img
                className="circular_image"
                style={{ width: "62px" }}
                src={params?.row?.coach_image}
                alt=""
              />
            )}
          </div>
        );
      },
    },
    {
      field: "action",
      headerName: "Action",
      width: 450,
      renderCell: (params) => {
        return (
          <>
            <Button onClick={() => handleShow3(params)}>
              <i className="fas fa-edit"></i>
            </Button>
            {/* <Button

              color="error"
              onClick={() => onDelete(params)}
            ><i className="fa fa-trash" aria-hidden="true"></i>

            </Button> */}
          </>
        );
      },
    },
  ];

  //   Ends

  return (
    <>
      <style>{css}</style>
      <Side_Navigation />
      <div className="main-content">
        <section className="section">
          <div className="section-header">
            <h1>Coach Management</h1>
            {/* <div className="section-header-breadcrumb">
              <div className="breadcrumb-item active">
                <Link to="/home">Home</Link>
              </div>
              <div className="breadcrumb-item">
                <Link to="/user_management">User Management</Link>
              </div>
            </div> */}
          </div>
          <div className="section-body">
            <div className="row">
              <div className="col-12">
                <div className="card">
                  <div className="card-header d-Fle">
                    <h4>Data Table</h4>
                    <a onClick={handleShow4} style={{ cursor: "pointer" }}>Add Coach</a>
                  </div>
                  <div className="card-body">
                    <div className="table-responsive newPc">
                      <Box sx={{ height: 400, width: "100%" }}>
                        {getCoach.length > 0 && (
                          <>
                            <h2>{select.map((val) => val._id)}</h2>

                            <DataGrid
                              rows={getCoach}
                              columns={columns}
                              pageSize={5}
                              rowsPerPageOptions={[5]}
                              onSelectionChange={(newSelection) => {
                                setSelection(newSelection.rows);
                              }}
                            />
                          </>
                        )}
                      </Box>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>





      {/* Modal Short Bio */}
      <Modal show={show} onHide={handleClose} keyboard={false}>
        <Modal.Header>
          <Modal.Title>Short Bio</Modal.Title>
          <i
            className="fas fa-cut"
            style={{ cursor: "pointer" }}
            onClick={handleClose}
          ></i>
        </Modal.Header>
        <Modal.Body>{getDetail.short_bio}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
      {/* Short Bio */}

      {/* Social Profile */}
      <Modal show={showSocialProfile} onHide={handleClose1} keyboard={false}>
        <Modal.Header>
          <Modal.Title>Social Profile</Modal.Title>
          <i
            className="fas fa-cut"
            style={{ cursor: "pointer" }}
            onClick={handleClose1}
          ></i>
        </Modal.Header>
        <Modal.Body>
          {`Facebook:  ${getDetail?.facebook_profile_url}`}
          <br />
          <br />
          {`Twitter :  ${getDetail?.twitter_profile_url}`}
          <br />
          <br />
          {`Linkedin:  ${getDetail?.linkedin_profile_url}`}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose1}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
      {/* ends */}

      {/* Coach Detail */}
      <Modal
        show={showCoachDetail}
        onHide={handleClose2}
        dialogClassName="modal-90w"
        aria-labelledby="example-custom-modal-styling-title"
      >
        <Modal.Header>
          <Modal.Title>Coach Detail</Modal.Title>
          <i
            className="fas fa-cut"
            style={{ cursor: "pointer" }}
            onClick={handleClose2}
          ></i>
        </Modal.Header>
        <Modal.Body>
          <h6>Subjects:</h6>
          {getDetail?.subject_of_teacher?.length > 0
            ? getDetail?.subject_of_teacher.map((item, index) => {
              return <div key={index}>{item}</div>;
            })
            : "Not Found"}
          <br />
          <h6>Grade:</h6>
          {getDetail?.grade?.length > 0
            ? getDetail?.grade.map((item, index) => {
              return <div key={index}>{item}</div>;
            })
            : "Not Found"}
          <br />
          <h6>Service Offered:</h6>
          {getDetail?.service_offered?.length > 0
            ? getDetail?.service_offered.map((item, index) => {
              return <div key={index}>{item}</div>;
            })
            : "Not Found"}
          <br />
          <h6>Online Time Slot:</h6>
          {getDetail?.online_time_slot?.length > 0
            ? getDetail?.online_time_slot.map((item, index) => {
              return <div key={index}>{item}</div>;
            })
            : "Not Found"}
          <br />
          <h6>Offline Time Slot:</h6>
          {getDetail?.offline_time_slot?.length > 0
            ? getDetail?.offline_time_slot.map((item, index) => {
              return <div key={index}>{item}</div>;
            })
            : "Not Found"}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose2}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
      {/* Ends */}

      {/* Edit Coach Modal */}
      <Modal show={showEditCoach} onHide={handleClose3} keyboard={false}>
        <Modal.Header>
          <Modal.Title>Edit Coach</Modal.Title>
          <i
            className="fas fa-cut"
            style={{ cursor: "pointer" }}
            onClick={handleClose3}
          ></i>
        </Modal.Header>
        <Modal.Body>
          <Formik
            enableReinitialize={true}
            initialValues={{
              coach_name: getDetail.coach_name,
              coach_email: getDetail.coach_email,
              grade: "",
              subject_of_teacher: "",
              service_offered: "",
              offline_time_slot: "",
              online_time_slot: "",
              facebook_profile_url: getDetail.facebook_profile_url,
              twitter_profile_url: getDetail.twitter_profile_url,
              linkedin_profile_url: getDetail.linkedin_profile_url,
              short_bio: getDetail.short_bio,
              coach_image: "",
            }}
            validationSchema={Yup.object({
              coach_email: Yup.string().email("Invalid email address"),
              coach_name: Yup.string(),
              facebook_profile_url: Yup.string(),
              twitter_profile_url: Yup.string(),
              linkedin_profile_url: Yup.string(),
              short_bio: Yup.string(),
              coach_image: Yup.mixed(),
            })}
            onSubmit={(values) => {
              setbutton(true);
              let formData = new FormData();
              if (getImage.pictureAsFile) {
                formData.append("coach_image", getImage.pictureAsFile);
              }
              formData.append("coach_name", values.coach_name);
              formData.append("coach_email", values.coach_email);

              if (getGrade == "") {
                formData.append('grade', getDetail.grade.toString())
              }
              else {

                formData.append("grade", getGrade.toString());
              }
              if (getSubject == "") {

                formData.append("subject_of_teacher", getDetail.subject_of_teacher.toString());
              } else {

                formData.append("subject_of_teacher", getSubject.toString());
              }
              if (getOffered == "") {

                formData.append("service_offered", getDetail.service_offered.toString());
              }
              else {
                formData.append("service_offered", getOffered.toString());

              }
              if (getOfflineTimeSlot == "") {
                formData.append("offline_time_slot", getDetail.offline_time_slot.toString());

              } else {
                formData.append("offline_time_slot", getOfflineTimeSlot.toString());

              }
              if (getOnlineTimeSlot == "") {

                formData.append("online_time_slot", getDetail.online_time_slot.toString());
              } else {
                formData.append("online_time_slot", getOnlineTimeSlot.toString());

              }
              formData.append(
                "facebook_profile_url",
                values.facebook_profile_url
              );
              formData.append(
                "twitter_profile_url",
                values.twitter_profile_url
              );
              formData.append(
                "linkedin_profile_url",
                values.linkedin_profile_url
              );
              formData.append("short_bio", values.short_bio);
              const id = getDetail._id;

              update_coach(id, formData)
                .then((res) => {
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
                  setbutton(false);
                  get_coach()
                    .then((res) => {
                      // console.log("Res=====>", res.data.response);
                      setCoach(
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
                  setbutton(false);
                });

            }}
          >

            <Form>
              <div className="modal-body">
                <div className="row">
                  <div className="col-lg-6 col-md-12 col-sm-12">
                    <div className="form-group">
                      <label>Coach Name</label>
                      <MyTextInput
                        type="text"
                        className="form-control"
                        name="coach_name"
                      />
                    </div>
                  </div>
                  <div className="col-lg-6 col-md-12 col-sm-12">
                    <div className="form-group">
                      <label>Email</label>
                      <MyTextInput
                        type="text"
                        className="form-control"
                        name="coach_email"
                      />
                    </div>
                  </div>

                  <div className="col-lg-6 col-md-12 col-sm-12">
                    <div className="form-group">
                      <label>Grade</label>
                      <ChipInput style={{ marginLeft: "20px" }} name="grade" onChange={(value) => setGarde(value)} defaultValue={getDetail.grade} />
                    </div>
                  </div>
                  <div className="col-lg-6 col-md-12 col-sm-12">
                    <div className="form-group">
                      <label>Subject</label>
                      <ChipInput style={{ marginLeft: "20px" }} name="subject_of_teacher" onChange={(value) => setSubject(value)} defaultValue={getDetail.service_offered} />
                    </div>
                  </div>
                  <div className="col-lg-6 col-md-12 col-sm-12">
                    <div className="form-group">
                      <label>Service Offered</label>
                      <ChipInput style={{ marginLeft: "20px" }} name="service_offered" onChange={(value) => setOffered(value)} defaultValue={getDetail.service_offered} />
                    </div>
                  </div>
                  <div className="col-lg-6 col-md-12 col-sm-12">
                    <div className="form-group">
                      <label>Offline Time Slot</label>
                      <ChipInput style={{ marginLeft: "20px" }} name="offline_time_slot" onChange={(value) => setOfflineTimeSlot(value)} defaultValue={getDetail.offline_time_slot} />
                    </div>
                  </div>
                  <div className="col-lg-6 col-md-12 col-sm-12">
                    <div className="form-group">
                      <label>Online Time Slot</label>
                      <ChipInput style={{ marginLeft: "20px" }} name="online_time_slot" onChange={(value) => setOnlineTimeSlot(value)} defaultValue={getDetail.online_time_slot} />
                    </div>
                  </div>
                  <div className="col-lg-6 col-md-12 col-sm-12">
                    <div className="form-group">
                      <label>Facebook Profile</label>
                      <MyTextInput
                        type="text"
                        className="form-control"
                        name="facebook_profile_url"
                      />
                    </div>
                  </div>
                  <div className="col-lg-6 col-md-12 col-sm-12">
                    <div className="form-group">
                      <label>Twitter Profile</label>
                      <MyTextInput
                        type="text"
                        className="form-control"
                        name="twitter_profile_url"
                      />
                    </div>
                  </div>
                  <div className="col-lg-6 col-md-12 col-sm-12">
                    <div className="form-group">
                      <label>LinkedIn Profile</label>
                      <MyTextInput
                        type="text"
                        className="form-control"
                        name="linkedin_profile_url"
                      />
                    </div>
                  </div>

                  <div className="col-lg-7 col-md-12 col-sm-12">
                    <div className="form-group">
                      <label>Image</label>
                      {/* <img  className=" w-50 p-3" src={getDetail.coach_image}/> */}
                      {getState ? (
                        <img
                          src={getDetail.coach_image}
                          className=" w-50 p-3"
                          alt=""
                        />
                      ) : (
                        <img
                          src={getImageUrl}
                          className=" w-50 p-3"

                          alt=""
                        />
                      )}
                      <input
                        type="file"
                        className="form-control"
                        accept="image/*"
                        name="coach_image"
                        onChange={onHandle}
                      />
                    </div>
                  </div>
                  <div className="col-lg-12 col-md-12 col-sm-12">
                    <div className="form-group">
                      <label>Short Bio</label>

                      <MyTextArea
                        type="textarea"
                        className="form-control"
                        name="short_bio"
                      />
                    </div>
                  </div>

                  <div className="col-lg-12 col-md-12 col-sm-12">

                    {!getbutton ? <input
                      type="submit"
                      className="modal-btn"
                      onClick={handleClose3}
                    /> : <Button

                      style={{
                        backgroundColor: "blue",
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
          </Formik>
        </Modal.Body>
      </Modal>
      {/* Edit coach ends */}




      {/* Add Coach */}

      <Modal show={showAddCoach} onHide={handleClose4}>
        <Modal.Header>
          <Modal.Title>Add Coach</Modal.Title>
          <i
            className="fas fa-cut"
            style={{ cursor: "pointer" }}
            onClick={handleClose4}
          ></i>
        </Modal.Header>
        <Modal.Body>

          <Formik
            // enableReinitialize={true}
            initialValues={{
              coach_name: "",
              coach_email: "",
              grade: "",
              subject_of_teacher: "",
              service_offered: "",
              offline_time_slot: "",
              online_time_slot: "",
              facebook_profile_url: "",
              twitter_profile_url: "",
              linkedin_profile_url: "",
              short_bio: "",
              coach_image: "",
            }}
            validationSchema={Yup.object({
              coach_email: Yup.string().email("Invalid email address").required(),
              coach_name: Yup.string().required("Invalid Name"),
              facebook_profile_url: Yup.string().required("Invalid Facebook Id"),
              twitter_profile_url: Yup.string().required("Invalid Twitter Id"),
              linkedin_profile_url: Yup.string().required("Invalid Linkedin Id"),
              short_bio: Yup.string().required("Invalid Short Bio"),
              coach_image: Yup.mixed(),
            })}


            onSubmit={(values, { resetForm }) => {
              setbutton(true);
              let formData = new FormData();
              if (getImage.pictureAsFile) {
                formData.append("coach_image", getImage.pictureAsFile);
              }
              formData.append("coach_name", values.coach_name);
              formData.append("coach_email", values.coach_email);
              formData.append("grade", getGrade);
              formData.append("subject_of_teacher", getSubject);
              formData.append("service_offered", getOffered);
              formData.append("offline_time_slot", getOfflineTimeSlot);
              formData.append("online_time_slot", getOnlineTimeSlot);
              formData.append(
                "facebook_profile_url",
                values.facebook_profile_url
              );
              formData.append(
                "twitter_profile_url",
                values.twitter_profile_url
              );
              formData.append(
                "linkedin_profile_url",
                values.linkedin_profile_url
              );
              formData.append("short_bio", values.short_bio);
              add_coach(formData)
                .then((res) => {
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
                  setImageUrl({})
                  resetForm({ values: "" });

                  get_coach()
                    .then((res) => {
                      // console.log("Res=====>", res.data.response);
                      setCoach(
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

                  setAddCoach(false);
                  setbutton(false);
                })
                .catch((err) => {
                  console.log(err);
                  setbutton(false);

                });

            }}
          >
            <Form>
              <div className="modal-body">
                <div className="row">
                  <div className="col-lg-6 col-md-12 col-sm-12">
                    <div className="form-group">
                      <label>Coach Name</label>
                      <MyTextInput
                        type="text"
                        className="form-control"
                        name="coach_name"
                        placeholder="Name"
                      />
                    </div>
                  </div>
                  <div className="col-lg-6 col-md-12 col-sm-12">
                    <div className="form-group">
                      <label>Coach Email</label>
                      <MyTextInput
                        type="email"
                        className="form-control"
                        name="coach_email"
                        placeholder="email@gmail.com"
                      />
                    </div>
                  </div>

                  <div className="col-lg-6 col-md-12 col-sm-12">
                    <div className="form-group">
                      <label>Facebook</label>
                      <MyTextInput
                        type="text"
                        className="form-control"
                        name="facebook_profile_url"
                        placeholder="Facebook"
                      />
                    </div>
                  </div>
                  <div className="col-lg-6 col-md-12 col-sm-12">
                    <div className="form-group">
                      <label>Linkedin</label>
                      <MyTextInput
                        type="text"
                        className="form-control"
                        name="twitter_profile_url"
                        placeholder="Linkedin"
                      />
                    </div>
                  </div>
                  <div className="col-lg-6 col-md-12 col-sm-12">
                    <div className="form-group">
                      <label>twitter</label>
                      <MyTextInput
                        type="text"
                        className="form-control"
                        name="linkedin_profile_url"
                        placeholder="Twitter"
                      />
                    </div>
                  </div>

                  <div className="col-lg-7 col-md-12 col-sm-12">
                    <div className="form-group">
                      <label>Coach Image</label>
                      <img
                        src={getImageUrl}
                        className=" w-50 p-3"

                        alt=""
                      />
                      <input
                        type="file"
                        accept="image/*"
                        className="form-control"
                        name="coach_image"
                        onChange={onHandle}
                        required
                      />
                    </div>
                  </div>
                  <div className="col-lg-6  col-md-12 col-sm-12">
                    <div className="form-group">
                      <label>Select Grade</label>

                      <ChipInput name="grade" onChange={(value) => setGarde(value)} style={{ marginLeft: "20px" }} />

                    </div>
                  </div>
                  <div className="col-lg-6 col-md-12 col-sm-12">
                    <div className="form-group">
                      <label>Subject</label>
                      <ChipInput style={{ marginLeft: "20px" }} name="subject_of_teacher" onChange={(value) => setSubject(value)} />
                    </div>
                  </div>

                  <div className="col-lg-6 col-md-12 col-sm-12">
                    <div className="form-group">
                      <label>Service Offered</label>
                      <ChipInput style={{ marginLeft: "20px" }} name="service_offered" onChange={(value) => setOffered(value)} />
                    </div>
                  </div>
                  <div className="col-lg-6 col-md-12 col-sm-12">
                    <div className="form-group">
                      <label>Offline Time Slot</label>
                      <ChipInput style={{ marginLeft: "20px" }} name="offline_time_slot" onChange={(value) => setOfflineTimeSlot(value)} />
                    </div>
                  </div>
                  <div className="col-lg-6 col-md-12 col-sm-12">
                    <div className="form-group">
                      <label>Online Time Slot</label>
                      <ChipInput style={{ marginLeft: "20px" }} name="online_time_slot" onChange={(value) => setOnlineTimeSlot(value)} />
                    </div>
                  </div>
                  <div className="col-lg-12 col-md-12 col-sm-12">
                    <div className="form-group">
                      <label>Short Bio</label>

                      <MyTextArea
                        type="textarea"
                        className="form-control"
                        name="short_bio"
                        placeholder="Summary"
                      />
                    </div>
                  </div>

                  <div className="col-lg-12 col-md-12 col-sm-12">

                    {!getbutton ? <button type="submit" style={{ backgroundColor: "blue", color: "white", border: "none", height: "40px", width: "80px" }}  >Submit</button> : 
                    <button  style={{ backgroundColor: "blue", color: "white", border: "none", height: "40px", width: "120px" }}  >Wait Please!!</button> }
                  </div>
                </div>
              </div>
            </Form>
          </Formik>
        </Modal.Body>

      </Modal>

      {/* ends */}
      <footer className="main-footer">
        <div className="footer-left">
          Copyright &copy; 2021 <div className="bullet"></div> Design By
          <a href="https://www.webmobril.com/">Webmobril</a>
        </div>
        <div className="footer-right"></div>
      </footer>
    </>
  );
}
