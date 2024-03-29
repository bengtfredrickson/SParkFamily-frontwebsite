import React, { useEffect, useState } from 'react'
import Side_Navigation from './Side_Navigation'
import { DataGrid } from '@mui/x-data-grid';
import Box from '@mui/material/Box';
import { add_suboption, delete_suboption, edit_suboption, get_suboptions, get_SubOptions } from '../services/web/webServices';
import { Store } from 'react-notifications-component';
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from '@mui/material';
import { Form, Formik, Field } from 'formik';
import Modal from "react-bootstrap/Modal";
import { MyTextArea, MyTextInput, MySelect } from '../services/web/inputServices';
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
export default function CurriculumoSubOptions() {
    const navigate = useNavigate();

    const [getLoader, setLoader] = useState(true);
    const location = useLocation();
    const [select, setSelection] = useState([]);
    const [SubOptions, setSubOptions] = useState([]);
    const [getPdf, setPdf] = useState({});
    const [getDetail, setDetail] = useState([]);
    const [getPdfUrl, setPdfUrl] = useState("");
    const [getState, setState] = useState(false);
    const [getState1, setState1] = useState(false);
    const [getState2, setState2] = useState(false);
    const [getbutton, setbutton] = useState(false);
    const [Preview, setPreview] = useState("")
    const [getVideo, setVideo] = useState({});
    const [getAudio, setAudio] = useState({});
    const [getVideoUrl, setVideoUrl] = useState("");
    const [getAudioUrl, setAudioUrl] = useState("");
    const [PreviewFlag, setPreviewFlag] = useState(0);
    const [selectedOption, setSelectedOption] = useState('');



    // Edit SubOptions Model
    const [showEditSubOptions, setShowEditSubOptions] = useState(false);
    const handleClose = () => {
        if (window.confirm("Are you sure you want to leave the current page?\nChanges will not be saved until you submit the form!")) {

            setShowEditSubOptions(false);
            setPdfUrl("")
            setPdf({})
            setAudio({})
            setVideo({})
            setAudioUrl("")
            setVideoUrl("")
            setState(false)
        }

    };
    const handleDropdownChange = (event) => {
        console.log("=----=-=-=", event.target.value)

        setSelectedOption(event.target.value);
    };
    const handleShow = (e) => {
        setDetail(e.row)
        setShowEditSubOptions(true);
        setPdfUrl(e.row.pdf_url);
        setAudioUrl(e.row.audio_url);
        setVideoUrl(e.row.video_url)

    };
    const onHandle = (e, type) => {
        if (type === "p") {
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
        }
        else if (type === "a") {
            setAudio({
                pictureAsFile: e.target.files[0],
            });
            if (e.target.files[0].type.includes("audio")) {
                setState1(false);
            }
            else {
                setState1(true);

            }
            setAudioUrl(URL.createObjectURL(e.target.files[0]));

        }
        else if (type === "v") {
            setVideo({
                pictureAsFile: e.target.files[0],
            });
            if (e.target.files[0].type === "video/mp4") {
                setState2(false);
            }
            else {
                setState2(true);

            }
            setVideoUrl(URL.createObjectURL(e.target.files[0]));

        }
    };
    // ends


    // Add SubOptions Model Function

    const [showAddSubOptions, setShowAddSubOptions] = useState(false);
    const handleClose1 = () => {
        if (window.confirm("Are you sure you want to leave the current page?\nChanges will not be saved until you submit the form!")) {

            setShowAddSubOptions(false);
            setPdfUrl("")
            setPdf({})
            setAudio({})
            setVideo({})
            setAudioUrl("")
            setVideoUrl("")
            setState(false)
            setState1(false)
            setState2(false)
            setSelectedOption("")
        }
    };
    const handleShow1 = () => {
        setShowAddSubOptions(true);
    };
    const [showPreview, setshowPreview] = useState(false);
    const handleClose2 = () => {
        if (window.confirm("Are you sure you want to leave the current page?\nChanges will not be saved until you submit the form!")) {

            setshowPreview(false);
            setState(false)
            setState1(false)
            setState2(false)
        }
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
                suboption_id: params.row.suboption_id,
            }
            delete_suboption(data).then((res) => {

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
                get_suboptions({ curriculum_id: location.state.curriculum_id, unit_id: location.state.unit_id, subunit_id: location.state.subunit_id, option_id: location.state.option_id }).
                    then((res) => {
                        console.log("=======>", res.data.result)

                        setSubOptions(res.data.result.map((el, index) => ({ ...el, id: el.suboption_id, i: index })))
                        setLoader(false);
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
        if (SubOptions.length === 0 || location?.state?.reloadSubOptions) {
            get_suboptions({ curriculum_id: location.state.curriculum_id, unit_id: location.state.unit_id, subunit_id: location.state.subunit_id, option_id: location.state.option_id }).
                then((res) => {
                    console.log("=======>", res.data.result)

                    setSubOptions(res.data.result.map((el, index) => ({ ...el, id: el.suboption_id, i: index })))
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
            field: 'suboption_name',
            headerName: 'Category',
            width: 250,

        },
        {
            field: 'title',
            headerName: 'Name',
            width: 250,

        },
        {
            field: 'pdf_url',
            headerName: "Pdf",
            width: 200,
            renderCell: (params) => {
                return (
                    <>
                        {params.row.pdf_url === "" || params.row.pdf_url === null ? <Button><i className="fas fa-file-pdf" style={{ fontSize: '20px', color: "grey" }}></i></Button> : <Button onClick={() => handleShow2(params, { flag: 0 })}><i className="fas fa-file-pdf" style={{ fontSize: '20px' }}></i></Button>}
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
                        {params.row.video_url === "" || params.row.video_url === null ? <Button ><i className="fas fa-file-video" style={{ fontSize: '20px', color: "grey" }}></i></Button> : <Button onClick={() => handleShow2(params, { flag: 1 })}><i className="fas fa-file-video" style={{ fontSize: '20px' }}></i></Button>}
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
                        {params.row.audio_url === "" || params.row.audio_url === null ? <Button ><i className="fas fa-file-audio" style={{ fontSize: '20px', color: "grey" }}></i></Button> : <Button onClick={() => handleShow2(params, { flag: 2 })}><i className="fas fa-file-audio" style={{ fontSize: '20px' }}></i></Button>}
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
                        {params?.row?.suboption_name?.toLowerCase().includes("lesson") ? <Button onClick={() => navigate('/curriculum_lessons', { state: { curriculum_id: location.state.curriculum_id, suboption_id: params.row.suboption_id } })}>Lesson Plans</Button> : <Button style={{ "color": "grey" }}>Lesson Plans</Button>}
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
                                <h1>Lessons Materials</h1>
                            </div>

                            <div className="section-body">
                                <div className="row">
                                    <div className="col-12">
                                        <div className="card">
                                            <div className="card-header d-Fle">
                                                <h4></h4>
                                                <a onClick={handleShow1} style={{ cursor: "pointer" }}>Add Resources</a>
                                            </div>
                                            <div className="card-body">
                                                <div className="table-responsive newPc">


                                                    {getLoader === true ? <Loader /> : <Box sx={{ height: 650, width: '100%' }}>
                                                        {!SubOptions.length ? <h3>No Data Found!</h3> : null}
                                                        {SubOptions.length > 0 && (
                                                            <>
                                                                <h2>{select.map((val) => val._id)}</h2>

                                                                <DataGrid

                                                                    rows={SubOptions}

                                                                    columns={columns}
                                                                    pageSize={10}
                                                                    rowsPerPageSubOptions={[10]}

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


            <Modal show={showEditSubOptions} keyboard={false}>
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
                            pdf_title: getDetail.pdf_title,
                            audio_title: getDetail.audio_title,
                            video_title: getDetail.video_title,
                            suboption_name: getDetail.suboption_name,
                            option_id: getDetail.option_id,
                            suboption_id: getDetail.suboption_id,
                            title: getDetail.title,

                        }}

                        validationSchema={Yup.object({
                            title: Yup.string().required("Required").matches(
                                /\S+/,
                                "Field must contain at least one non-space character"
                            ),
                            audio_title: Yup.string(),
                            video_title: Yup.string(),
                            pdf_title: Yup.string()

                        })}

                        onSubmit={(values, { resetForm }) => {
                            let formData = new FormData();
                            formData.append("curriculum_id", values.curriculum_id)
                            formData.append("unit_id", values.unit_id)
                            formData.append("subunit_id", values.subunit_id)
                            formData.append("is_files", values.is_files)
                            formData.append("audio_title", values.audio_title)
                            formData.append("video_title", values.video_title)
                            formData.append("pdf_title", values.pdf_title)
                            formData.append("suboption_name", values.suboption_name)
                            formData.append("suboption_id", values.suboption_id)
                            formData.append("option_id", values.option_id)
                            formData.append("title", values.title)
                            if (getPdf.pictureAsFile) {
                                formData.append("pdf_url", getPdf.pictureAsFile)
                                formData.append("pdf_title", values.pdf_title)
                                formData.append("audio_title", "")
                                formData.append("video_title", "")
                                formData.append("audio_url", "")
                                formData.append("video_url", "")

                            }
                            if (getAudio.pictureAsFile) {
                                formData.append("audio_url", getAudio.pictureAsFile)
                                formData.append("pdf_url", "")
                                formData.append("video_url", "")
                                formData.append("pdf_title", "")
                                formData.append("audio_title", values.audio_title)
                                formData.append("video_title", "")
                            }
                            if (getVideo.pictureAsFile) {
                                formData.append("video_url", getVideo.pictureAsFile)
                                formData.append("pdf_url", "")
                                formData.append("audio_url", "")
                                formData.append("pdf_title", "")
                                formData.append("audio_title", "")
                                formData.append("video_title", values.video_title)
                            }
                            if (!getPdf.pictureAsFile && !getAudio.pictureAsFile && !getVideo.pictureAsFile) {
                                formData.append("pdf_title",  getDetail.pdf_title)
                                formData.append("audio_title", getDetail.audio_title)
                                formData.append("video_title", getDetail.video_title)
                                formData.append("pdf_url", getPdfUrl)
                                formData.append("audio_url", getAudioUrl)
                                formData.append("video_url", getVideoUrl)

                            }
                            setbutton(true);
                            const isFound = SubOptions.some(element => {
                                if (element.suboption_name.toLowerCase().includes("lesson") && element.subunit_id !== values.subunit_id) {
                                    return true;
                                }

                                return false;
                            });
                            if (isFound && values.suboption_name.toLowerCase().includes("lesson")) {
                                Store.addNotification({
                                    title: "Error!",
                                    message: "You cannot add more than 1 lesson plan",
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



                            } else {
                                edit_suboption(formData)
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
                                        get_suboptions({ curriculum_id: location.state.curriculum_id, unit_id: location.state.unit_id, subunit_id: location.state.subunit_id, option_id: location.state.option_id }).
                                            then((res) => {
                                                console.log("=======>", res.data.result)

                                                setSubOptions(res.data.result.map((el, index) => ({ ...el, id: el.suboption_id, i: index })))
                                                setLoader(false);


                                            }).catch((err) => {
                                                console.log(err);
                                            })
                                        setShowEditSubOptions(false)
                                        setbutton(false);
                                        setPdfUrl("")
                                        setPdf({})
                                        setAudio({})
                                        setVideo({})
                                        setAudioUrl("")
                                        setVideoUrl("")
                                        setState(false)
                                        setState1(false)
                                        setState2(false)
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
                                        setAudio({})
                                        setVideo({})
                                        setAudioUrl("")
                                        setVideoUrl("")
                                        setState(false)
                                        setState1(false)
                                        setState2(false)
                                    });
                            }


                        }}
                    >
                        <Form>
                            <div className="modal-body">
                                <div className="row">


                                    <div className="col-lg-12 col-md-12 col-sm-12">
                                        <div className="col-lg-4 col-md-12 col-sm-12">
                                            <div className="form-group">
                                                <label>Category</label>
                                                <MyTextInput type="text" className="form-control" name="suboption_name" readOnly={true} />
                                            </div>
                                        </div>
                                        <div className="col-lg-4 col-md-12 col-sm-12">
                                            <div className="form-group">
                                                <label>Title</label>
                                                <MyTextInput type="text" className="form-control" name="title" />
                                            </div>


                                        </div>
                                        <div className="col-lg-12 col-md-12 col-sm-12">
                                            <div className="form-group spo">
                                                <label>Audio Title</label>
                                                <MyTextInput type="text" className="form-control" name="audio_title" />
                                            </div>
                                        </div>
                                        <div className="col-lg-6 col-md-12 col-sm-12">
                                            <div className="form-group">
                                                <label>Audio File</label>

                                                <input
                                                    type="file"
                                                    accept="audio/*"
                                                    className="form-control"
                                                    name="banner_link"
                                                    onChange={(e) => onHandle(e, "a")}
                                                />
                                            </div>
                                            {getAudioUrl != "" ? <ReactAudioPlayer
                                                src={getAudioUrl}
                                                // autoPlay
                                                controls
                                            /> : null}
                                            {/* {getState ? <p style={{ color: "red" }}>Only PDF is allowed !</p> : null} */}
                                        </div>
                                        <div className="col-lg-12 col-md-12 col-sm-12">
                                            <div className="form-group">
                                                <label>Video Title</label>
                                                <MyTextInput type="text" className="form-control" name="video_title" />
                                            </div>
                                        </div>
                                        <div className="col-lg-6 col-md-12 col-sm-12">
                                            <div className="form-group">
                                                <label>Video File</label>

                                                <input
                                                    type="file"
                                                    accept="video/*"
                                                    className="form-control"
                                                    name="banner_link"
                                                    onChange={(e) => onHandle(e, "v")}
                                                />
                                            </div>
                                            {getVideoUrl != "" ? <ReactPlayer width="100%" height="100" url={getVideoUrl} controls={true} /> : null}
                                            {/* {getState ? <p style={{ color: "red" }}>Only PDF is allowed !</p> : null} */}
                                        </div>
                                        <div className="col-lg-12 col-md-12 col-sm-12">
                                            <div className="form-group">
                                                <label>Pdf Title</label>
                                                <MyTextInput type="text" className="form-control" name="pdf_title" />
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
                                                    onChange={(e) => onHandle(e, "p")}
                                                />
                                            </div>
                                            {getPdfUrl != "" ? <object width="100%" height="400" data={getPdfUrl} type="application/pdf" alt="" /> : null}


                                            {getState ? <p style={{ color: "red" }}>Only PDF is allowed !</p> : null}
                                            {getState1 ? <p style={{ color: "red" }}>Only Mp3 Audio is allowed !</p> : null}
                                            {getState2 ? <p style={{ color: "red" }}>Only Mp4 Video is allowed !</p> : null}                                        </div>



                                    </div>


                                    <div className="col-lg-12 col-md-12 col-sm-12">


                                        {!getbutton ? getState || getState1 || getState2 ? <Button disabled type="submit" variant="contained">Submit
                                        </Button> : <Button type="submit" variant="contained" >Submit
                                        </Button> : <Button variant="contained" style={{ backgroundColor: 'blue', color: "white" }} disabled>Wait Please!</Button>}
                                    </div>
                                </div>
                            </div>
                        </Form>
                    </Formik>

                </Modal.Body>

            </Modal >
            {/* Ends */}



            {/* Modal Add SubOptions */}
            <Modal show={showAddSubOptions} keyboard={false}>
                <Modal.Header>
                    <Modal.Title>Add Lesson Material</Modal.Title>
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
                            pdf_title: "",
                            audio_title: "",
                            video_title: "",
                            pdf_url: "",
                            suboption_name: "",
                            title: "",
                            option_id: location.state.option_id
                        }}

                        validationSchema={Yup.object({
                            suboption_name: Yup.string().required("Required").matches(
                                /\S+/,
                                "Field must contain at least one non-space character"
                            ),
                            title: Yup.string().required("Required").matches(
                                /\S+/,
                                "Field must contain at least one non-space character"
                            ),
                            audio_title: Yup.string(),
                            video_title: Yup.string(),
                            pdf_title: Yup.string()


                        })}

                        onSubmit={(values, { resetForm }) => {

                            let formData = new FormData();

                            formData.append("curriculum_id", values.curriculum_id)
                            formData.append("unit_id", values.unit_id)
                            formData.append("subunit_id", values.subunit_id)
                            formData.append("is_files", values.is_files)
                            formData.append("audio_title", values.audio_title)
                            formData.append("video_title", values.video_title)
                            formData.append("pdf_title", values.pdf_title)
                            formData.append("suboption_name", selectedOption)
                            formData.append("title", values.title)
                            formData.append("option_id", values.option_id)
                            if (getPdf.pictureAsFile) {
                                formData.append("pdf_url", getPdf.pictureAsFile)
                            }
                            if (getAudio.pictureAsFile) {
                                formData.append("audio_url", getAudio.pictureAsFile)
                            }
                            if (getVideo.pictureAsFile) {
                                formData.append("video_url", getVideo.pictureAsFile)
                            }
                            setbutton(true);
                            const isFound = SubOptions.some(element => {
                                if (element.suboption_name.toLowerCase().includes("lesson")) {
                                    return true;
                                }

                                return false;
                            });
                            if (isFound) {
                                if (values.suboption_name.toLowerCase().includes("lesson")) {
                                    Store.addNotification({
                                        title: "Error!",
                                        message: "You cannot add more than 1 lesson plan",
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

                                } else {
                                    add_suboption(formData)
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

                                            get_suboptions({ curriculum_id: location.state.curriculum_id, unit_id: location.state.unit_id, subunit_id: location.state.subunit_id, option_id: location.state.option_id }).
                                                then((res) => {
                                                    console.log("=======>", res.data.result)

                                                    setSubOptions(res.data.result.map((el, index) => ({ ...el, id: el.suboption_id, i: index })))
                                                    setLoader(false);

                                                }).catch((err) => {
                                                    console.log(err);
                                                })

                                            setShowAddSubOptions(false);
                                            setbutton(false);
                                            setPdfUrl("")
                                            setPdf({})
                                            setAudio({})
                                            setVideo({})
                                            setAudioUrl("")
                                            setVideoUrl("")
                                            setState(false)
                                            setState1(false)
                                            setState2(false)
                                            setSelectedOption("")
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
                                                setPdf({})
                                                setPdfUrl("")
                                                setAudio({})
                                                setVideo({})
                                                setAudioUrl("")
                                                setVideoUrl("")
                                                setState(false)
                                                setState1(false)
                                                setState2(false)
                                                setSelectedOption("")
                                            }
                                        });
                                }



                            } else {
                                add_suboption(formData)
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

                                        get_suboptions({ curriculum_id: location.state.curriculum_id, unit_id: location.state.unit_id, subunit_id: location.state.subunit_id, option_id: location.state.option_id }).
                                            then((res) => {
                                                console.log("=======>", res.data.result)

                                                setSubOptions(res.data.result.map((el, index) => ({ ...el, id: el.suboption_id, i: index })))
                                                setLoader(false);

                                            }).catch((err) => {
                                                console.log(err);
                                            })

                                        setShowAddSubOptions(false);
                                        setbutton(false);
                                        setPdfUrl("")
                                        setPdf({})
                                        setAudio({})
                                        setVideo({})
                                        setAudioUrl("")
                                        setVideoUrl("")
                                        setState(false)
                                        setState1(false)
                                        setState2(false)
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
                                            setPdf({})
                                            setPdfUrl("")
                                            setAudio({})
                                            setVideo({})
                                            setAudioUrl("")
                                            setVideoUrl("")
                                            setState(false)
                                            setState1(false)
                                            setState2(false)
                                        }
                                    });
                            }


                        }}


                    >
                        {props => (
                            <Form>
                                <div className="modal-body">
                                    <div className="row">

                                        <div className="col-lg-4 col-md-12 col-sm-12">
                                            <div className="form-group">
                                                <label>Category</label>
                                                <MySelect className="form-control"
                                                    name="suboption_name"
                                                    value={selectedOption}
                                                    onChange={handleDropdownChange}>
                                                    <option value="" disabled>Select a category</option>
                                                    <option value="Lesson Plan">Lesson Plan</option>
                                                    <option value="Audio">Audio</option>
                                                    <option value="Video">Video</option>
                                                    <option value="Pdf">Pdf</option>

                                                    {/* Add more options as needed */}
                                                </MySelect>
                                            </div>


                                        </div>
                                        <div className="col-lg-4 col-md-12 col-sm-12">
                                            <div className="form-group">
                                                <label>Name</label>
                                                <MyTextInput type="text" className="form-control" name="title" />
                                            </div>


                                        </div>
                                        {selectedOption == "Audio" ? <div className="col-lg-12 col-md-12 col-sm-12">
                                            <div className="form-group spo">
                                                <label>Audio Title</label>
                                                <MyTextInput type="text" className="form-control" name="audio_title" />
                                            </div>
                                        </div> : null}
                                        {selectedOption == "Audio" ? <div div className="col-lg-6 col-md-12 col-sm-12">
                                            <div className="form-group">
                                                <label>Audio File</label>

                                                <input
                                                    type="file"
                                                    accept="audio/*"
                                                    className="form-control"
                                                    name="banner_link"
                                                    onChange={(e) => onHandle(e, "a")}
                                                />
                                            </div>
                                            {getAudioUrl != "" ? <ReactAudioPlayer
                                                src={getAudioUrl}
                                                // autoPlay
                                                controls
                                            /> : null}
                                            {/* {getState ? <p style={{ color: "red" }}>Only PDF is allowed !</p> : null} */}
                                        </div> : null}
                                        {selectedOption == "Video" ? <div className="col-lg-12 col-md-12 col-sm-12">
                                            <div className="form-group">
                                                <label>Video Title</label>
                                                <MyTextInput type="text" className="form-control" name="video_title" />
                                            </div>
                                        </div> : null}
                                        {selectedOption == "Video" ? <div className="col-lg-6 col-md-12 col-sm-12">
                                            <div className="form-group">
                                                <label>Video File</label>

                                                <input
                                                    type="file"
                                                    accept="video/*"
                                                    className="form-control"
                                                    name="banner_link"
                                                    onChange={(e) => onHandle(e, "v")}
                                                />
                                            </div>
                                            {getVideoUrl != "" ? <ReactPlayer width="100%" height="100" url={getVideoUrl} controls={true} /> : null}
                                            {/* {getState ? <p style={{ color: "red" }}>Only PDF is allowed !</p> : null} */}
                                        </div> : null}
                                        {selectedOption == "Pdf" ? <div className="col-lg-12 col-md-12 col-sm-12">
                                            <div className="form-group">
                                                <label>Pdf Title</label>
                                                <MyTextInput type="text" className="form-control" name="pdf_title" />
                                            </div>
                                        </div> : null}
                                        {selectedOption == "Pdf" ? <div className="col-lg-6 col-md-12 col-sm-12">
                                            <div className="form-group">
                                                <label>PDF</label>

                                                <input
                                                    type="file"
                                                    accept="application/pdf"
                                                    className="form-control"
                                                    name="banner_link"
                                                    onChange={(e) => onHandle(e, "p")}
                                                />
                                            </div>
                                            {getPdfUrl != "" ? <object width="100%" height="400" data={getPdfUrl} type="application/pdf" alt="" /> : null}

                                        </div> : null}
                                        <div style={{ 'width': '100%' }}>
                                            {getState ? <p style={{ color: "red" }}>Only PDF is allowed !</p> : null}
                                            {getState1 ? <p style={{ color: "red" }}>Only Mp3 Audio is allowed !</p> : null}
                                            {getState2 ? <p style={{ color: "red" }}>Only Mp4 Video is allowed !</p> : null}
                                        </div>

                                        <div className="col-lg-12 col-md-12 col-sm-12">
                                            {!getbutton ? getState || getState1 || getState2 ? <Button disabled type="submit" variant="contained">Submit
                                            </Button> : <Button type="submit" variant="contained" >Submit
                                            </Button> : <Button variant="contained" style={{ backgroundColor: 'blue', color: "white" }} disabled>Wait Please!</Button>}

                                        </div>

                                    </div>
                                </div>
                            </Form>
                        )}
                    </Formik>

                </Modal.Body>

            </Modal>
            {/* Ends Add SubOptions */}
            {/* Modal Add Options */}
            <Modal show={showPreview} keyboard={false}>
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
                        PreviewFlag === 0 ? Preview === "" | Preview === null ? <p>No PDF Available</p> : <object width="100%" height="400" data={Preview} type="application/pdf" alt="" /> : PreviewFlag === 1 ? Preview === "" | Preview === null ? <p>No Video Available</p> : <ReactPlayer url={Preview} controls={true} />
                            : PreviewFlag === 2 ? Preview === "" | Preview === null ? <p>No Audio Available</p> : <ReactAudioPlayer
                                src={Preview}
                                autoPlay
                                controls
                            /> : null
                    }
                    { }

                </Modal.Body>

            </Modal>
            {/* Ends Add Options */}


            <Footer />



        </>
    )
}
