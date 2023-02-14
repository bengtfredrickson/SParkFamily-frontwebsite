import React, { useEffect, useState } from 'react'
import Side_Navigation from './Side_Navigation'
import { DataGrid } from '@mui/x-data-grid';
import Box from '@mui/material/Box';
import { add_curriculum, delete_curriculum, get_all_curriculums, update_curriculum } from '../services/web/webServices';
import { Store } from 'react-notifications-component';
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { Button } from '@mui/material';
import { Form, Formik, Field } from 'formik';
import Modal from "react-bootstrap/Modal";
import { MyTextArea, MyTextInput } from '../services/web/inputServices';
import * as Yup from 'yup';
import { Loader } from './Helper/Loader';
import Footer from './Footer';
import moment from 'moment/moment';

const css = `
    .sidebar-menu li:nth-child(3) a {
        background:coral;
    }
    `
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

    // Edit Curriculum Model
    const [showEditCurriculum, setShowEditCurriculum] = useState(false);
    const handleClose = () => {
        setShowEditCurriculum(false);
    };
    const handleShow = (e) => {
        setDetail(e.row)
        setShowEditCurriculum(true);
        setImageUrl(e.row.banner_link);
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
        setShowAddCurriculum(false);
        setImage({})
        setImageUrl({})
    };
    const handleShow1 = () => {
        setShowAddCurriculum(true);
    };
    // Ends
    // let index1=0;
    // const navigate = useNavigate();
    //   Function Hnadle

    function validate_pic(value) {
        let error;
        if (!value) {
            error = 'Required!';
            return error;
        }
    }

    const onDelete = (params) => () => {
        if (window.confirm("are your sure?")) {
            let data = {
                curriculum_id: params.row.curriculum_id,
                name: params.row.name
            }
            delete_curriculum(data).then((res) => {

                Store.addNotification({
                    title: "Success",
                    message: res?.data?.message,
                    type: "success",
                    insert: "top",
                    container: "top-right",
                    className: "rnc__notification-container--top-right",
                    animationIn: ["animate__animated", "animate__fadeIn"],
                    animationOut: [
                        "animate__animated",
                        "animate__fadeOut",
                    ],
                    dismiss: {
                        duration: 5000,
                        onScreen: true,
                    },
                });
                get_all_curriculums().
                    then((res) => {

                        setCurriculum(res.data.result.map((el, index) => ({ ...el, id: el.curriculum_id, i: index })))

                    }).catch((err) => {
                        console.log(err);
                    })

            }).catch((err) => {
                console.log(err)
            })

        }


    };
    // ends
    useEffect(() => {
        if (curriculum.length === 0 || location?.state?.reloadcurriculum) {
            get_all_curriculums().
                then((res) => {
                    console.log(res.data.result)

                    setCurriculum(res.data.result.map((el, index) => ({ ...el, id: el.curriculum_id, i: index })))
                    setLoader(false);

                }).catch((err) => {
                    setLoader(false);
                    console.log(err);
                })
        }
    }, []);
    const columns = [
        {
            field: 'sno',
            headerName: 'S.NO.',
            filterable: false,
            width: 70,
            renderCell: (index) => `${(index.row.i) + 1}`
        },
        {
            field: 'nav_text',
            headerName: 'Name',
            width: 200,

        },
        {
            field: 'body_text',
            headerName: 'Description',
            type: 'text',
            width: 700,
        },
        {
            field: 'banner_link',
            headerName: 'Banner',
            width: 120,
            renderCell: (params) => {
                return (
                    <div>

                        {params?.row?.banner_link == ' ' ? <img className="circular_image" style={{ width: "62px" }} src="images/splash.png" alt="Not Found " /> : <img className="circular_image" style={{ width: "62px" }} src={params?.row?.banner_link} alt='' />}


                    </div>
                )
            }
        },
        {
            field: 'primary_color',
            headerName: 'Primary Colour',
            type: 'text',
            width: 130,
        },
        {
            field: 'created_on',
            headerName: 'Published Date',
            type: 'text',
            width: 120,
            renderCell: (params) => {
                return (
                    <>
                        {moment(params.value).format("YYYY")}
                    </>
                );
            },
        },
        {
            field: 'action',
            headerName: "Action",
            width: 450,
            renderCell: (params) => {
                return (
                    <>

                        <Button onClick={() => navigate('/module', { state: { id: params.row.curriculum_id } })}>Modules</Button>
                        <Button onClick={() => handleShow(params)}><i className="fas fa-edit"></i></Button>
                        <Button color="error" onClick={onDelete(params)}>
                            <i className="fa fa-trash" aria-hidden="true"></i>
                        </Button>


                    </>
                );
            },
        }
    ];






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

                            <div className="section-body">
                                <div className="row">
                                    <div className="col-12">
                                        <div className="card">
                                            <div className="card-header d-Fle">
                                                <h4></h4>
                                                <a onClick={handleShow1} style={{ cursor: "pointer" }}>Add Curriculum</a>
                                            </div>
                                            <div className="card-body">
                                                <div className="table-responsive newPc">


                                                    {getLoader === true ? <Loader /> : <Box sx={{ height: 650, width: '100%' }}>
                                                        {curriculum.length > 0 && (
                                                            <>
                                                                <h2>{select.map((val) => val._id)}</h2>

                                                                <DataGrid

                                                                    rows={curriculum}

                                                                    columns={columns}
                                                                    pageSize={10}
                                                                    rowsPerPageOptions={[10]}

                                                                    onSelectionChange={(newSelection) => {

                                                                        setSelection(newSelection.rows);
                                                                    }}
                                                                />
                                                            </>
                                                        )

                                                        }

                                                    </Box>}

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


            <Modal show={showEditCurriculum} onHide={handleClose} keyboard={false}>
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
                            curriculum_id: Yup.number().required(),
                            name: Yup.string().required(),
                            nav_text: Yup.string().required(),
                            body_text: Yup.string().required(),
                            primary_color: Yup.string().required(),
                            secondary_color: Yup.string().required(),
                        })}
                        onSubmit={(values, { resetForm }) => {
                            setbutton(true);
                            console.log(values);
                            let formData = new FormData();
                            formData.append("curriculum_id", values.curriculum_id)
                            formData.append("name", values.name)
                            formData.append("nav_text", values.nav_text)
                            formData.append("body_text", values.body_text)
                            formData.append("primary_color", values.primary_color)
                            formData.append("secondary_color", values.secondary_color)

                            if (getImage.pictureAsFile) {
                                formData.append("banner_link", getImage.pictureAsFile)
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
                                    get_all_curriculums().
                                        then((res) => {
                                            console.log(res.data.result)

                                            setCurriculum(res.data.result.map((el, index) => ({ ...el, id: el.curriculum_id, i: index })))


                                        }).catch((err) => {
                                            console.log(err);
                                        })
                                    setShowEditCurriculum(false)
                                    setbutton(false);
                                    setImageUrl({})
                                    setImage({})

                                }

                                )
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
                                    setImageUrl({})
                                    setImage({})
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
                                            <MyTextInput type="text" className="form-control" name="name" />
                                        </div>
                                    </div>
                                    <div className="col-lg-4 col-md-12 col-sm-12">
                                        <div className="form-group spo">
                                            <label>Nav Text</label>
                                            <MyTextInput type="text" className="form-control" name="nav_text" />
                                        </div>
                                    </div>
                                    <div className="col-lg-4 col-md-12 col-sm-12">
                                        <div className="form-group">
                                            <label>Primary Colour</label>
                                            <MyTextInput type="text" className="form-control" name="primary_color" />
                                        </div>
                                    </div>
                                    <div className="col-lg-4 col-md-12 col-sm-12">
                                        <div className="form-group">
                                            <label>Secondary Colour</label>
                                            <MyTextInput type="text" className="form-control" name="secondary_color" />
                                        </div>
                                    </div>
                                    <div className="col-lg-12 col-md-12 col-sm-12">
                                        <div className="form-group">
                                            <label>Body Text</label>
                                            <MyTextArea type="text" className="form-control" name="body_text" />
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
                                            {getImageUrl ? <img src={getImageUrl} className=" w-30 p-3" alt="" /> : null}
                                        </div>
                                    </div>


                                    <div className="col-lg-12 col-md-12 col-sm-12">


                                        {!getbutton ? <Button type="submit" variant="contained"  >
                                            Submit
                                        </Button> : <Button variant="contained" style={{ backgroundColor: 'blue', color: "white" }} disabled>Wait Please!</Button>}
                                    </div>
                                </div>
                            </div>
                        </Form>
                    </Formik>

                </Modal.Body>

            </Modal>
            {/* Ends */}



            {/* Modal Add Curriculum */}
            <Modal show={showAddCurriculum} onHide={handleClose1} keyboard={false}>
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
                        }}

                        validationSchema={Yup.object({
                            name: Yup.string().required("Required"),
                            nav_text: Yup.string().required("Required"),
                            body_text: Yup.string().required("Required"),
                            primary_color: Yup.string().required("Required"),
                            secondary_color: Yup.string().required("Required"),
                        })}

                        onSubmit={(values, { resetForm }) => {
                            let formData = new FormData();
                            formData.append("name", values.name)
                            formData.append("nav_text", values.nav_text)
                            formData.append("body_text", values.body_text)
                            formData.append("primary_color", values.primary_color)
                            formData.append("secondary_color", values.secondary_color)

                            if (getImage.pictureAsFile) {
                                formData.append("banner_link", getImage.pictureAsFile)
                            }

                            console.log("=========>", getImage.pictureAsFile);
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
                                        animationOut: [
                                            "animate__animated",
                                            "animate__fadeOut",
                                        ],
                                        dismiss: {
                                            duration: 5000,
                                            onScreen: true,
                                        },
                                    });
                                    resetForm({ values: "" });

                                    get_all_curriculums().
                                        then((res) => {
                                            console.log(res.data.result)

                                            setCurriculum(res.data.result.map((el, index) => ({ ...el, id: el.curriculum_id, i: index })))


                                        }).catch((err) => {
                                            console.log(err);
                                        })
                                    setImageUrl({})
                                    setImage({})
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
                                        setImageUrl({})
                                        setImage({})
                                    }
                                });
                        }}


                    >
                        {props => (
                            <Form>
                                <div className="modal-body">
                                    <div className="row">

                                        <div className="col-lg-4 col-md-12 col-sm-12">
                                            <div className="form-group">
                                                <label>Name</label>
                                                <MyTextInput type="text" className="form-control" name="name" />
                                            </div>


                                        </div>
                                        <div className="col-lg-4 col-md-12 col-sm-12">
                                            <div className="form-group spo">
                                                <label>Nav Text</label>
                                                <MyTextInput type="text" className="form-control" name="nav_text" />
                                            </div>
                                        </div>
                                        <div className="col-lg-4 col-md-12 col-sm-12">
                                            <div className="form-group">
                                                <label>Primary Colour</label>
                                                <MyTextInput type="text" className="form-control" name="primary_color" />
                                            </div>
                                        </div>
                                        <div className="col-lg-4 col-md-12 col-sm-12">
                                            <div className="form-group">
                                                <label>Secondary Colour</label>
                                                <MyTextInput type="text" className="form-control" name="secondary_color" />
                                            </div>
                                        </div>


                                        <div className="col-lg-12 col-md-12 col-sm-12">
                                            <div className="form-group">
                                                <label>Body Text</label>
                                                <MyTextArea type="text" className="form-control" name="body_text" />
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
                                                {getImageUrl ? <img src={getImageUrl} className=" w-30 p-3" alt="" /> : null}
                                            </div>
                                        </div>

                                        <div className="col-lg-12 col-md-12 col-sm-12">
                                            {!getbutton ? <Button type="submit" variant="contained"  >
                                                Submit
                                            </Button> : <Button variant="contained" style={{ backgroundColor: 'blue', color: "white" }} disabled>Wait Please!</Button>}

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
    )
}
