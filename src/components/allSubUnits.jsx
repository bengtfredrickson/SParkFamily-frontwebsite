import React, { useEffect, useState } from 'react'
import Side_Navigation from './Side_Navigation'
import { DataGrid } from '@mui/x-data-grid';
import Box from '@mui/material/Box';
import { get_all_subunits } from '../services/web/webServices';
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
export default function AllSubUnits() {
    const navigate = useNavigate();

    const [getLoader, setLoader] = useState(true);
    const location = useLocation();
    const [select, setSelection] = useState([]);
    const [SubUnits, setSubUnits] = useState([]);
    const [getImage, setImage] = useState({});
    const [getDetail, setDetail] = useState([]);
    const [getImageUrl, setImageUrl] = useState({});
    const [getState, setState] = useState(true);
    const [getbutton, setbutton] = useState(false);

    // Edit SubUnits Model
    const [showEditSubUnits, setShowEditSubUnits] = useState(false);
    const handleClose = () => {
        setShowEditSubUnits(false);
    };
    const handleShow = (e) => {
        setDetail(e.row)
        setShowEditSubUnits(true);
    };
    const onHandle = (e) => {
        setImage({
            pictureAsFile: e.target.files[0],
        });
        setState(false);
        setImageUrl(URL.createObjectURL(e.target.files[0]));
    };
    // ends


    // Add SubUnits Model Function

    const [showAddSubUnits, setShowAddSubUnits] = useState(false);
    const handleClose1 = () => {
        setShowAddSubUnits(false);
    };
    const handleShow1 = () => {
        setShowAddSubUnits(true);
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
    //     if (window.confirm("are your sure?")) {
    //         let data = {
    //             SubUnits_id: params.row.SubUnits_id,
    //             name: params.row.name
    //         }
    //         delete_SubUnits(data).then((res) => {

    //             Store.addNotification({
    //                 title: "Success",
    //                 message: res?.data?.message,
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
    //             get_all_SubUnits().
    //                 then((res) => {

    //                     setSubUnits(res.data.result.map((el, index) => ({ ...el, id: el.SubUnits_id, i: index })))

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
        if (SubUnits.length === 0 || location?.state?.reloadSubUnits) {
            get_all_subunits().
                then((res) => {
                    console.log("=======>",res.data.result)

                    setSubUnits(res.data.result.map((el, index) => ({ ...el, id: el.subunit_id, i: index })))
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
            field: 'subunit_name',
            headerName: 'Name',
            width: 500,

        },
        {
            field: 'action',
            headerName: "Action",
            width: 450,
            renderCell: (params) => {
                return (
                    <>
                        {/* <Button onClick={() => navigate('/SubUnits_files', { state: { id: params.row.SubUnits_ID } })}>Files</Button> */}
                        <Button onClick={() => handleShow(params)}><i className="fas fa-edit"></i></Button>
                        <Button color="error" 
                        // onClick={onDelete(params)}
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
                                <h1>SubUnits</h1>
                            </div>

                            <div className="section-body">
                                <div className="row">
                                    <div className="col-12">
                                        <div className="card">
                                            <div className="card-header d-Fle">
                                                <h4></h4>
                                                <a onClick={handleShow1} style={{ cursor: "pointer" }}>Add SubUnits</a>
                                            </div>
                                            <div className="card-body">
                                                <div className="table-responsive newPc">


                                                    {getLoader === true ? <Loader /> : <Box sx={{ height: 650, width: '100%' }}>
                                                        {SubUnits.length > 0 && (
                                                            <>
                                                                <h2>{select.map((val) => val._id)}</h2>

                                                                <DataGrid

                                                                    rows={SubUnits}

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


            {/* <Modal show={showEditSubUnits} onHide={handleClose} keyboard={false}>
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
                            SubUnits_id: getDetail.SubUnits_id,
                            nav_text: getDetail.nav_text,
                            body_text: getDetail.body_text,
                            primary_color: getDetail.primary_color,
                            secondary_color: getDetail.secondary_color,
                            banner_link: getDetail.banner_link,
                        }}

                        validationSchema={Yup.object({
                            SubUnits_id: Yup.number().required(),
                            nav_text: Yup.string().required(),
                            body_text: Yup.string().required(),
                            primary_color: Yup.string().required(),
                            secondary_color: Yup.string().required(),
                            banner_link: Yup.string().required(),
                        })}
                        onSubmit={(values, { resetForm }) => {
                            setbutton(true);
                            console.log(values);


                            update_SubUnits(values)
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
                                    get_all_SubUnits().
                                        then((res) => {
                                            console.log(res.data.result)

                                            setSubUnits(res.data.result.map((el, index) => ({ ...el, id: el.SubUnits_id, i: index })))


                                        }).catch((err) => {
                                            console.log(err);
                                        })
                                    setShowEditSubUnits(false)
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
                                });
                        }}
                    >
                        <Form>
                            <div className="modal-body">
                                <div className="row">

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
                                            <label>Banner Link</label>
                                            <MyTextInput type="text" className="form-control" name="banner_link" />
                                        </div>
                                    </div>
                                    <div className="col-lg-12 col-md-12 col-sm-12">
                                        <div className="form-group">
                                            <label>Body Text</label>
                                            <MyTextArea type="text" className="form-control" name="body_text" />
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



            {/* Modal Add SubUnits */}
            {/* <Modal show={showAddSubUnits} onHide={handleClose1} keyboard={false}>
                <Modal.Header>
                    <Modal.Title>Add SubUnits</Modal.Title>
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
                            name: Yup.string().required(),
                            nav_text: Yup.string().required(),
                            body_text: Yup.string().required(),
                            primary_color: Yup.string().required(),
                            secondary_color: Yup.string().required(),
                            banner_link: Yup.string().required(),
                        })}

                        onSubmit={(values, { resetForm }) => {

                            console.log(values);
                            setbutton(true);


                            add_SubUnits(values)
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

                                    get_all_SubUnits().
                                        then((res) => {
                                            console.log(res.data.result)

                                            setSubUnits(res.data.result.map((el, index) => ({ ...el, id: el.SubUnits_id, i: index })))


                                        }).catch((err) => {
                                            console.log(err);
                                        })

                                    setShowAddSubUnits(false);
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
                                                <label>Banner Link</label>
                                                <MyTextInput type="text" className="form-control" name="banner_link" />
                                            </div>
                                        </div>
                                        <div className="col-lg-12 col-md-12 col-sm-12">
                                            <div className="form-group">
                                                <label>Body Text</label>
                                                <MyTextArea type="text" className="form-control" name="body_text" />
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
            {/* Ends Add SubUnits */}


            <Footer />



        </>
    )
}
