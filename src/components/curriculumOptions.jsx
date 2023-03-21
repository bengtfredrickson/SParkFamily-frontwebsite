import React, { useEffect, useState } from 'react'
import Side_Navigation from './Side_Navigation'
import { DataGrid } from '@mui/x-data-grid';
import Box from '@mui/material/Box';
import { add_option, delete_option, edit_option, get_options } from '../services/web/webServices';
import { Store } from 'react-notifications-component';
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from '@mui/material';
import { Form, Formik, Field } from 'formik';
import Modal from "react-bootstrap/Modal";
import { MyTextArea, MyTextInput } from '../services/web/inputServices';
import * as Yup from 'yup';
import { Loader } from './Helper/Loader';
import Footer from './Footer';
import moment from 'moment/moment';
import ReactPlayer from 'react-player/lazy'
import ReactAudioPlayer from 'react-audio-player';



const css = `
    .sidebar-menu li:nth-child(3) a {
        background:coral;
    }
    `
export default function CurriculumoOptions() {
    const navigate = useNavigate();

    const [getLoader, setLoader] = useState(true);
    const location = useLocation();
    const [select, setSelection] = useState([]);
    const [Options, setOptions] = useState([]);
    const [getPdf, setPdf] = useState({});
    const [getDetail, setDetail] = useState([]);
    const [getPdfUrl, setPdfUrl] = useState("");
    const [Preview, setPreview] = useState("")
    const [PreviewFlag, setPreviewFlag] = useState(0)
    const [getState, setState] = useState(false);
    const [getbutton, setbutton] = useState(false);

    // Edit Options Model
    const [showEditOptions, setShowEditOptions] = useState(false);
    const handleClose = () => {
        setShowEditOptions(false);
        setPdf({})
        setPdfUrl("")
        setState(false)
    };
    const handleShow = (e) => {
        setDetail(e.row)
        setShowEditOptions(true);
        setPdfUrl(e.row.pdf_url);

    };
    const onHandle = (e) => {
        console.log("=====1101010101010101>", e.target.files[0])
        setPdf({
            pictureAsFile: e.target.files[0],
        });
        if (e.target.files[0].type === "application/pdf") {
            setState(false);
        }
        else {
            setState(true);

        }
        setPdfUrl(URL.createObjectURL(e.target.files[0]));
    };
    // ends


    // Add Options Model Function

    const [showAddOptions, setShowAddOptions] = useState(false);
    const [showPreview, setshowPreview] = useState(false);
    const handleClose2 = () => {
        setshowPreview(false);
        setState(false)
    };
    const handleShow2 = (e, flag) => {
        setshowPreview(true);
        setPreviewFlag(flag.flag)
        if (flag.flag === 0) {
            setPreview(e.row.pdf_url)
        }
        else if (flag.flag === 1) {
            setPreview(e.row.video_url)
        } else {
            setPreview(e.row.audio_url)
        }


    };
    const handleClose1 = () => {
        setShowAddOptions(false);
        setPdf({})
        setPdfUrl("")
        setState(false)
    };
    const handleShow1 = () => {
        setShowAddOptions(true);
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
        if (window.confirm("Are your sure? You want to delete this?")) {
            let data = {
                option_id: params.row.option_id,
            }
            delete_option(data).then((res) => {

                Store.addNotification({
                    title: "Success",
                    message: "Record Deleted Successfully",
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
                get_options({ curriculum_id: location.state.curriculum_id, unit_id: location.state.unit_id, subunit_id: location.state.subunit_id }).
                    then((res) => {
                        console.log(res.data.result)

                        setOptions(res.data.result.map((el, index) => ({ ...el, id: el.option_id, i: index })))


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
        if (Options.length === 0 || location?.state?.reloadOptions) {
            get_options({ curriculum_id: location.state.curriculum_id, unit_id: location.state.unit_id, subunit_id: location.state.subunit_id }).
                then((res) => {
                    console.log("=======>", res.data.result)

                    setOptions(res.data.result.map((el, index) => ({ ...el, id: el.option_id, i: index })))
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
            field: 'option_name',
            headerName: 'Name',
            width: 500,

        },
        {
            field: 'pdf_url',
            headerName: "Pdf",
            width: 200,
            renderCell: (params) => {
                return (
                    <>
                        <Button onClick={() => handleShow2(params, { flag: 0 })}><i className="fas fa-file-pdf" style={{ fontSize: '20px' }}></i></Button>
                    </>
                );
            },
        },
        {
            field: 'video_url',
            headerName: "Video",
            width: 200,
            renderCell: (params) => {
                return (
                    <>
                        <Button onClick={() => handleShow2(params, { flag: 1 })}><i className="fas fa-file-video" style={{ fontSize: '20px' }}></i></Button>
                    </>
                );
            },
        },
        {
            field: 'audio_url',
            headerName: "Audio",
            width: 200,
            renderCell: (params) => {
                return (
                    <>
                        <Button onClick={() => handleShow2(params, { flag: 2 })}><i className="fas fa-file-audio" style={{ fontSize: '20px' }}></i></Button>
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
                        <Button onClick={() => navigate('/curriculum_suboptions', { state: { curriculum_id: location.state.curriculum_id, unit_id: location.state.unit_id, subunit_id: location.state.subunit_id, option_id: params.row.option_id } })}>Resources</Button>
                        <Button onClick={() => handleShow(params)}><i className="fas fa-edit"></i></Button>
                        <Button color="error"
                            onClick={onDelete(params)}
                        >
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
                                <h1>Options</h1>
                            </div>

                            <div className="section-body">
                                <div className="row">
                                    <div className="col-12">
                                        <div className="card">
                                            <div className="card-header d-Fle">
                                                <h4></h4>
                                                <a onClick={handleShow1} style={{ cursor: "pointer" }}>Add Options</a>
                                            </div>
                                            <div className="card-body">
                                                <div className="table-responsive newPc">


                                                    {getLoader === true ? <Loader /> : <Box sx={{ height: 650, width: '100%' }}>
                                                        {!Options.length ? <h3>No Data Found!</h3> : null}
                                                        {Options.length > 0 && (
                                                            <>
                                                                <h2>{select.map((val) => val._id)}</h2>

                                                                <DataGrid

                                                                    rows={Options}

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


            <Modal show={showEditOptions} onHide={handleClose} keyboard={false}>
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
                            unit_id: getDetail.unit_id,
                            subunit_id: getDetail.subunit_id,
                            is_files: getDetail.is_files,
                            audio_url: getDetail.audio_url,
                            video_url: getDetail.video_url,
                            option_name: getDetail.option_name,
                            option_id: getDetail.option_id
                        }}

                        validationSchema={Yup.object({
                            option_name: Yup.string().required("Required"),
                            audio_url: Yup.string().matches(
                                /((https?):\/\/)?(www.)?[a-z0-9]+(\.[a-z]{2,}){1,3}(#?\/?[a-zA-Z0-9#]+)*\/?(\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)?$/,
                                'Enter correct url!'
                            ),
                            video_url: Yup.string().matches(
                                /((https?):\/\/)?(www.)?[a-z0-9]+(\.[a-z]{2,}){1,3}(#?\/?[a-zA-Z0-9#]+)*\/?(\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)?$/,
                                'Enter correct url!'
                            )
                        })}

                        onSubmit={(values, { resetForm }) => {
                            let formData = new FormData();
                            formData.append("curriculum_id", values.curriculum_id)
                            formData.append("unit_id", values.unit_id)
                            formData.append("subunit_id", values.subunit_id)
                            formData.append("is_files", values.is_files)
                            formData.append("audio_url", values.audio_url)
                            formData.append("video_url", values.video_url)
                            formData.append("option_name", values.option_name)
                            formData.append("option_id", values.option_id)
                            if (getPdf.pictureAsFile) {
                                formData.append("pdf_url", getPdf.pictureAsFile)
                            }
                            // else {
                            //     formData.append("pdf_url", null)

                            // }
                            setbutton(true);

                            edit_option(formData)
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
                                    get_options({ curriculum_id: location.state.curriculum_id, unit_id: location.state.unit_id, subunit_id: location.state.subunit_id }).
                                        then((res) => {
                                            console.log(res.data.result)

                                            setOptions(res.data.result.map((el, index) => ({ ...el, id: el.option_id, i: index })))


                                        }).catch((err) => {
                                            console.log(err);
                                        })
                                    setShowEditOptions(false)
                                    setbutton(false);
                                    setPdfUrl("")
                                    setPdf({})
                                    setState(false)


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
                                    setbutton(false);
                                    setPdfUrl("")
                                    setPdf({})
                                    setState(false)

                                });
                        }}
                    >
                        <Form>
                            <div className="modal-body">
                                <div className="row">


                                    <div className="col-lg-12 col-md-12 col-sm-12">
                                        <div className="col-lg-4 col-md-12 col-sm-12">
                                            <div className="form-group">
                                                <label>Name</label>
                                                <MyTextInput type="text" className="form-control" name="option_name" />
                                            </div>


                                        </div>
                                        <div className="col-lg-12 col-md-12 col-sm-12">
                                            <div className="form-group spo">
                                                <label>Audio link</label>
                                                <MyTextInput type="text" className="form-control" name="audio_url" />
                                            </div>
                                        </div>
                                        <div className="col-lg-12 col-md-12 col-sm-12">
                                            <div className="form-group">
                                                <label>Video Link</label>
                                                <MyTextInput type="text" className="form-control" name="video_url" />
                                            </div>
                                        </div>
                                        <div className="col-lg-6 col-md-12 col-sm-12">
                                            <div className="form-group">
                                                <label>PDF</label>

                                                <input
                                                    type="file"
                                                    accept="application/pdf"
                                                    className="form-control"
                                                    name="banner_link"
                                                    onChange={(e) => onHandle(e)}
                                                />
                                            </div>
                                            {getPdfUrl != "" ? <object width="100%" height="400" data={getPdfUrl} type="application/pdf" alt="" /> : null}


                                        </div>
                                        {getState ? <p style={{ color: "red" }}>Only PDF is allowed !</p> : null}



                                    </div>


                                    <div className="col-lg-12 col-md-12 col-sm-12">


                                        {!getbutton ? getState ? <Button disabled type="submit" variant="contained">Submit
                                        </Button> : <Button type="submit" variant="contained" >Submit
                                        </Button> : <Button variant="contained" style={{ backgroundColor: 'blue', color: "white" }} disabled>Wait Please!</Button>}
                                    </div>
                                </div>
                            </div>
                        </Form>
                    </Formik>

                </Modal.Body>

            </Modal>
            {/* Ends */}



            {/* Modal Add Options */}
            <Modal show={showAddOptions} onHide={handleClose1} keyboard={false}>
                <Modal.Header>
                    <Modal.Title>Add Options</Modal.Title>
                    <i
                        className="fas fa-cut"
                        style={{ cursor: "pointer" }}
                        onClick={handleClose1}
                    ></i>
                </Modal.Header>
                <Modal.Body>
                    <Formik

                        initialValues={{
                            curriculum_id: location.state.curriculum_id,
                            unit_id: location.state.unit_id,
                            subunit_id: location.state.subunit_id,
                            is_files: 1,
                            audio_url: "",
                            video_url: "",
                            option_name: ""
                        }}

                        validationSchema={Yup.object({
                            option_name: Yup.string().required("Required"),
                            audio_url: Yup.string().matches(
                                /((https?):\/\/)?(www.)?[a-z0-9]+(\.[a-z]{2,}){1,3}(#?\/?[a-zA-Z0-9#]+)*\/?(\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)?$/,
                                'Enter correct url!'
                            ),
                            video_url: Yup.string().matches(
                                /((https?):\/\/)?(www.)?[a-z0-9]+(\.[a-z]{2,}){1,3}(#?\/?[a-zA-Z0-9#]+)*\/?(\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)?$/,
                                'Enter correct url!'
                            )
                        })}

                        onSubmit={(values, { resetForm }) => {
                            let formData = new FormData();
                            formData.append("curriculum_id", values.curriculum_id)
                            formData.append("unit_id", values.unit_id)
                            formData.append("subunit_id", values.subunit_id)
                            formData.append("is_files", values.is_files)
                            formData.append("audio_url", values.audio_url)
                            formData.append("video_url", values.video_url)
                            formData.append("option_name", values.option_name)
                            if (getPdf.pictureAsFile) {
                                formData.append("pdf_url", getPdf.pictureAsFile)
                            }
                            setbutton(true);


                            add_option(formData)
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

                                    get_options({ curriculum_id: location.state.curriculum_id, unit_id: location.state.unit_id, subunit_id: location.state.subunit_id }).
                                        then((res) => {
                                            console.log(res.data.result)

                                            setOptions(res.data.result.map((el, index) => ({ ...el, id: el.option_id, i: index })))


                                        }).catch((err) => {
                                            console.log(err);
                                        })

                                    setShowAddOptions(false);
                                    setbutton(false);
                                    setPdfUrl("")
                                    setPdf({})
                                    setState(false)


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
                                        setPdfUrl("")
                                        setPdf({})
                                        setState(false)

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
                                                <MyTextInput type="text" className="form-control" name="option_name" />
                                            </div>


                                        </div>
                                        <div className="col-lg-12 col-md-12 col-sm-12">
                                            <div className="form-group spo">
                                                <label>Audio link</label>
                                                <MyTextInput type="text" className="form-control" name="audio_url" />
                                            </div>
                                        </div>
                                        <div className="col-lg-12 col-md-12 col-sm-12">
                                            <div className="form-group">
                                                <label>Video Link</label>
                                                <MyTextInput type="text" className="form-control" name="video_url" />
                                            </div>
                                        </div>
                                        <div className="col-lg-6 col-md-12 col-sm-12">
                                            <div className="form-group">
                                                <label>PDF</label>

                                                <input
                                                    type="file"
                                                    accept="application/pdf"
                                                    className="form-control"
                                                    name="banner_link"
                                                    onChange={(e) => onHandle(e)}
                                                />
                                            </div>
                                            {getPdfUrl != "" ? <object width="100%" height="400" data={getPdfUrl} type="application/pdf" alt="" /> : null}
                                            {getState ? <p style={{ color: "red" }}>Only PDF is allowed !</p> : null}
                                        </div>

                                        <div className="col-lg-12 col-md-12 col-sm-12">
                                            {!getbutton ? getState ? <Button disabled type="submit" variant="contained">Submit
                                            </Button> : <Button type="submit" variant="contained" >Submit
                                            </Button>
                                                : <Button variant="contained" style={{ backgroundColor: 'blue', color: "white" }} disabled>Wait Please!</Button>}

                                        </div>

                                    </div>
                                </div>
                            </Form>
                        )}
                    </Formik>

                </Modal.Body>

            </Modal>
            {/* Ends Add Options */}

            <Modal show={showPreview} onHide={handleClose2} keyboard={false}>
                <Modal.Header>
                    <i
                        className="fas fa-cut"
                        style={{ cursor: "pointer" }}
                        onClick={handleClose2}
                    ></i>
                </Modal.Header>
                <Modal.Body>
                    {console.log("===============>", Preview, PreviewFlag)
                    }                    {
                        PreviewFlag === 0 ? Preview === "" | Preview === null ? <p>No PDF Available</p> : <object width="100%" height="400" data={Preview} type="application/pdf" alt="" /> : PreviewFlag === 1 ? Preview === "" | Preview === null ? <p>No Video Available</p> : <ReactPlayer url={Preview} />
                            : PreviewFlag === 2 ? Preview === "" | Preview === null ? <p>No Audio Available</p> : <ReactAudioPlayer
                                src={Preview}
                                autoPlay
                                controls
                            /> : null
                    }
                    { }

                </Modal.Body>

            </Modal>


            <Footer />



        </>
    )
}
