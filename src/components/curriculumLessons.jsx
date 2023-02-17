import React, { useEffect, useState } from 'react'
import Side_Navigation from './Side_Navigation'
import { DataGrid } from '@mui/x-data-grid';
import Box from '@mui/material/Box';
import { get_lessons } from '../services/web/webServices';
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

const css = `
    .sidebar-menu li:nth-child(3) a {
        background:coral;
    }
    `
export default function CurriculumoLessonPlans() {
    const navigate = useNavigate();

    const [getLoader, setLoader] = useState(true);
    const location = useLocation();
    const [select, setSelection] = useState([]);
    const [LessonPlans, setLessonPlans] = useState([]);
    const [getImage, setImage] = useState({});
    const [getDetail, setDetail] = useState([]);
    const [getImageUrl, setImageUrl] = useState({});
    const [getState, setState] = useState(true);
    const [getbutton, setbutton] = useState(false);

    // Edit LessonPlans Model
    const [showEditLessonPlans, setShowEditLessonPlans] = useState(false);
    const handleClose = () => {
        setShowEditLessonPlans(false);
    };
    const handleShow = (e) => {
        setDetail(e.row)
        setShowEditLessonPlans(true);
    };
    const onHandle = (e) => {
        setImage({
            pictureAsFile: e.target.files[0],
        });
        setState(false);
        setImageUrl(URL.createObjectURL(e.target.files[0]));
    };
    // ends


    // Add LessonPlans Model Function

    const [showAddLessonPlans, setShowAddLessonPlans] = useState(false);
    const handleClose1 = () => {
        setShowAddLessonPlans(false);
    };
    const handleShow1 = () => {
        setShowAddLessonPlans(true);
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

    // const onDelete = (params) => () => {
    //     if (window.confirm("Are your sure? You want to delete this?")) {
    //         let data = {
    //             subunit_id: params.row.subunit_id,
    //         }
    //         delete_LessonPlans(data).then((res) => {

    //             Store.addNotification({
    //                 title: "Success",
    //                 message: "Record Deleted Successfully",
    //                 type: "success",
    //                 insert: "top",
    //                 container: "top-right",
    //                 className: "rnc__notification-container--top-right",
    //                 animationIn: ["animate__animated", "animate__fadeIn"],
    //                 animationOut: [
    //                     "animate__animated",
    //                     "animate__fadeOut",
    //                 ],
    //                 dismiss: {
    //                     duration: 5000,
    //                     onScreen: true,
    //                 },
    //             });
    //             get_LessonPlans({ curriculum_id: location.state.curriculum_id, unit_id: location.state.unit_id }).
    //             then((res) => {
    //                     console.log(res.data.result)

    //                     setLessonPlans(res.data.result.map((el, index) => ({ ...el, id: el.subunit_id, i: index })))


    //                 }).catch((err) => {
    //                     console.log(err);
    //                 })

    //         }).catch((err) => {
    //             console.log(err)
    //         })

    //     }


    // };
    // ends
    useEffect(() => {
        if (LessonPlans.length === 0 || location?.state?.reloadLessonPlans) {
            get_lessons({ curriculum_id: location.state.curriculum_id,suboption_id: location.state.suboption_id }).
                then((res) => {
                    console.log("=======>", res.data.result)
                   
                    setLessonPlans(res.data.result.map((el, index) => ({ ...el, id: el.lesson_id, i: index })))
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
            field: 'lesson_name',
            headerName: 'Name',
            width: 120,

        },
        {
            field: 'image_url',
            headerName: 'Image',
            width: 120,
            renderCell: (params) => {
                return (
                    <div>

                        {params?.row?.image_url == ' ' ? <img className="circular_image" style={{ width: "62px" }} src="images/splash.png" alt="Not Found " /> : <img className="circular_image" style={{ width: "62px" }} src={params?.row?.image_url} alt='' />}


                    </div>
                )
            }
        },
        {
            field: 'lesson_objective',
            headerName: 'Objective',
            width: 120,
        },
        {
            field: 'lesson_target',
            headerName: 'Target',
            width: 120,
        },
        {
            field: 'integration',
            headerName: 'Integrations',
            width: 120,
        },
        {
            field: 'prep',
            headerName: 'Prep',
            width: 120,
        },
        {
            field: 'reflection_question',
            headerName: 'Question',
            width: 120,
        },
        {
            field: 'sel_compentencies',
            headerName: 'Compentencies',
            width: 120,
        },
        {
            field: 'lesson_set',
            headerName: 'Lesson Set',
            width: 120,
        },
        {
            field: 'spark_it_up',
            headerName: 'Spark It Up',
            width: 120,
        },
        {
            field: 'standards_alignment',
            headerName: 'Alignment',
            width: 120,
        },
        {
            field: 'teach',
            headerName: 'Teach',
            width: 120,
        },
        {
            field: 'teaching_cues',
            headerName: 'Cues',
            width: 120,
        },
        {
            field: 'teaching_suggestions',
            headerName: 'Suggestions',
            width: 120,
        },
        {
            field: 'vocabulary',
            headerName: 'Vocabulary',
            width: 120,
        },
        
        // {
        //     field: 'action',
        //     headerName: "Action",
        //     width: 450,
        //     renderCell: (params) => {
        //         return (
        //             <>
        //                 {/* <Button onClick={() => navigate('/curriculum_LessonPlans', { state: { curriculum_id:location.state.curriculum_id, suboption_id: params.row.suboption_id } })}>Lesson Plans</Button> */}
        //                 {/* <Button onClick={() => handleShow(params)}><i className="fas fa-edit"></i></Button>
        //                 <Button color="error"
        //                     onClick={onDelete(params)}
        //                 >
        //                     <i className="fa fa-trash" aria-hidden="true"></i>
        //                 </Button> */}


        //             </>
        //         );
        //     },
        // }
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
                                <h1>LessonPlans</h1>
                            </div>

                            <div className="section-body">
                                <div className="row">
                                    <div className="col-12">
                                        <div className="card">
                                            <div className="card-header d-Fle">
                                                <h4></h4>
                                                <a onClick={handleShow1} style={{ cursor: "pointer" }}>Add LessonPlans</a>
                                            </div>
                                            <div className="card-body">
                                                <div className="table-responsive newPc">


                                                    {getLoader === true ? <Loader /> : <Box sx={{ height: 650, width: '100%' }}>
                                                        {!LessonPlans.length? <h3>No Data Found!</h3>: null}
                                                        {LessonPlans.length > 0 && (
                                                            <>
                                                                <h2>{select.map((val) => val._id)}</h2>

                                                                <DataGrid

                                                                    rows={LessonPlans}

                                                                    columns={columns}
                                                                    pageSize={10}
                                                                    rowsPerPageLessonPlans={[10]}

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


            {/* <Modal show={showEditLessonPlans} onHide={handleClose} keyboard={false}>
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
                            curriculum_id: location.state.curriculum_id,
                            unit_id: location.state.unit_id,
                            subunit_id: getDetail.subunit_id,
                            subunit_name: getDetail.subunit_name,
                        }}

                        validationSchema={Yup.object({
                            subunit_name: Yup.string().required("Required")

                        })}
                        onSubmit={(values, { resetForm }) => {
                            setbutton(true);
                            console.log(values);

                            update_LessonPlans(values)
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
                                    get_LessonPlans({ curriculum_id: location.state.curriculum_id, unit_id: location.state.unit_id }).
                                        then((res) => {
                                            console.log(res.data.result)

                                            setLessonPlans(res.data.result.map((el, index) => ({ ...el, id: el.subunit_name, i: index })))


                                        }).catch((err) => {
                                            console.log(err);
                                        })
                                    setShowEditLessonPlans(false)
                                    setbutton(false);

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

                                });
                        }}
                    >
                        <Form>
                            <div className="modal-body">
                                <div className="row">


                                    <div className="col-lg-12 col-md-12 col-sm-12">
                                        <div className="form-group">
                                            <label>Name</label>
                                            <MyTextInput type="text" className="form-control" name="subunit_name" />
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

            </Modal> */}
            {/* Ends */}



            {/* Modal Add LessonPlans */}
            {/* <Modal show={showAddLessonPlans} onHide={handleClose1} keyboard={false}>
                <Modal.Header>
                    <Modal.Title>Add LessonPlans</Modal.Title>
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
                            subunit_name: "",
                        }}

                        validationSchema={Yup.object({
                            subunit_name: Yup.string().required("Required")
                        })}

                        onSubmit={(values, { resetForm }) => {

                            console.log(values);
                            setbutton(true);


                            add_LessonPlans(values)
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

                                    get_LessonPlans({ curriculum_id: location.state.curriculum_id, unit_id: location.state.unit_id }).
                                        then((res) => {
                                            console.log(res.data.result)

                                            setLessonPlans(res.data.result.map((el, index) => ({ ...el, id: el.subunit_id, i: index })))


                                        }).catch((err) => {
                                            console.log(err);
                                        })

                                    setShowAddLessonPlans(false);
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

                                    }
                                });
                        }}


                    >
                        {props => (
                            <Form>
                                <div className="modal-body">
                                    <div className="row">

                                        <div className="col-lg-12 col-md-12 col-sm-12">
                                            <div className="form-group">
                                                <label>Name</label>
                                                <MyTextInput type="text" className="form-control" name="subunit_name" />
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

            </Modal> */}
            {/* Ends Add LessonPlans */}


            <Footer />



        </>
    )
}
