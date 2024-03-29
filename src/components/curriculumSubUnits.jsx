import React, { useEffect, useState } from 'react'
import Side_Navigation from './Side_Navigation'
import { DataGrid } from '@mui/x-data-grid';
import Box from '@mui/material/Box';
import { add_subunits, add_Subunits, delete_subunits, delete_Subunits, get_subunits, get_Subunits, update_subunits, update_Subunits } from '../services/web/webServices';
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
import { DropdownButton, Dropdown } from 'react-bootstrap';

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
    `
export default function CurriculumSubUnits() {
    const navigate = useNavigate();

    const [getLoader, setLoader] = useState(true);
    const location = useLocation();
    const [select, setSelection] = useState([]);
    const [Subunits, setSubunits] = useState([]);
    const [getImage, setImage] = useState({});
    const [getDetail, setDetail] = useState([]);
    const [getImageUrl, setImageUrl] = useState({});
    const [getState, setState] = useState(true);
    const [getbutton, setbutton] = useState(false);

    // Edit Subunits Model
    const [showEditSubunits, setShowEditSubunits] = useState(false);
    const [SubUnitCategory, setSubUnitCategory] = useState("")
    const handleClose = () => {
        if (window.confirm("Are you sure you want to leave the current page?\nChanges will not be saved until you submit the form!")) {

            setShowEditSubunits(false);
        }
    };
    const handleShow = (e) => {
        setDetail(e.row)
        setShowEditSubunits(true);
    };
    const onHandle = (e) => {
        setImage({
            pictureAsFile: e.target.files[0],
        });
        setState(false);
        setImageUrl(URL.createObjectURL(e.target.files[0]));
    };
    // ends


    // Add Subunits Model Function

    const [showAddSubunits, setShowAddSubunits] = useState(false);
    const handleClose1 = () => {
        if (window.confirm("Are you sure you want to leave the current page?\nChanges will not be saved until you submit the form!")) {

            setShowAddSubunits(false);
        }
    };
    const handleShow1 = (value) => {
        setSubUnitCategory(value)
        setShowAddSubunits(true);
    };

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
                subunit_id: params.row.subunit_id,
            }
            delete_subunits(data).then((res) => {

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
                get_subunits({ curriculum_id: location.state.curriculum_id, unit_id: location.state.unit_id }).
                    then((res) => {
                        console.log(res.data.result)

                        setSubunits(res.data.result.map((el, index) => ({ ...el, id: el.subunit_id, i: index })))


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
        if (Subunits.length === 0 || location?.state?.reloadSubunits) {
            get_subunits({ curriculum_id: location.state.curriculum_id, unit_id: location.state.unit_id }).
                then((res) => {
                    console.log("=======>", res.data.result)

                    setSubunits(res.data.result.map((el, index) => ({ ...el, id: el.subunit_id, i: index })))
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
            headerName: 'Category',
            width: 500,

        },
        {
            field: 'title',
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
                        <Button onClick={() => navigate('/curriculum_options', { state: { curriculum_id: location.state.curriculum_id, unit_id: location.state.unit_id, subunit_id: params.row.subunit_id, page_key: params.row.key } })}>Resources</Button>
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
                                <h1>Sub Sections</h1>
                            </div>

                            <div className="section-body">
                                <div className="row">
                                    <div className="col-12">
                                        <div className="card curriculum_format">
                                            <div className="card-header d-Fle">
                                                <h4></h4>
                                                <DropdownButton className="custom-btn"
                                                    title="Add Sub Section"
                                                    id="dropdown-basic-button"
                                                    onSelect={(selectedOption) => handleShow1(selectedOption)}
                                                >
                                                    <Dropdown.Item eventKey="Overview">Category: Overview</Dropdown.Item>
                                                    <Dropdown.Item eventKey="Lesson Plans">Category: Lesson Plans</Dropdown.Item>
                                                    <Dropdown.Item eventKey="Assessments">Category: Assessments</Dropdown.Item>
                                                </DropdownButton>
                                            </div>
                                            <div className="card-body">
                                                <div className="table-responsive newPc">


                                                    {getLoader === true ? <Loader /> : <Box sx={{ height: 650, width: '100%' }}>
                                                        {!Subunits.length ? <h3>No Data Found!</h3> : null}

                                                        {Subunits.length > 0 && (
                                                            <>
                                                                <h2>{select.map((val) => val._id)}</h2>

                                                                <DataGrid

                                                                    rows={Subunits}

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


            <Modal show={showEditSubunits} keyboard={false}>
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
                            title: getDetail.title,
                        }}

                        validationSchema={Yup.object({
                            subunit_name: Yup.string().required("Required"),
                            title: Yup.string().required("Required").matches(
                                /\S+/,
                                "Field must contain at least one non-space character"
                            )

                        })}
                        onSubmit={(values, { resetForm }) => {
                            setbutton(true);
                            console.log(values);

                            update_subunits(values)
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
                                    get_subunits({ curriculum_id: location.state.curriculum_id, unit_id: location.state.unit_id }).
                                        then((res) => {
                                            console.log(res.data.result)

                                            setSubunits(res.data.result.map((el, index) => ({ ...el, id: el.subunit_name, i: index })))


                                        }).catch((err) => {
                                            console.log(err);
                                        })
                                    setShowEditSubunits(false)
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
                                            <label>Category</label>
                                            <MyTextInput type="text" className="form-control" name="subunit_name" readOnly={true} />
                                        </div>


                                    </div>
                                    <div className="col-lg-12 col-md-12 col-sm-12">
                                        <div className="form-group">
                                            <label>Name</label>
                                            <MyTextInput type="text" className="form-control" name="title" />
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



            {/* Modal Add Subunits */}
            <Modal show={showAddSubunits} keyboard={false}>
                <Modal.Header>
                    <Modal.Title>Add Sub Section</Modal.Title>
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
                            subunit_name: SubUnitCategory,
                            title: "",
                        }}

                        validationSchema={Yup.object({
                            subunit_name: Yup.string().required("Required"),
                            title: Yup.string().required("Required").matches(
                                /\S+/,
                                "Field must contain at least one non-space character"
                              )
                        })}

                        onSubmit={(values, { resetForm }) => {

                            console.log(values);
                            setbutton(true);


                            add_subunits(values)
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

                                    get_subunits({ curriculum_id: location.state.curriculum_id, unit_id: location.state.unit_id }).
                                        then((res) => {
                                            console.log(res.data.result)

                                            setSubunits(res.data.result.map((el, index) => ({ ...el, id: el.subunit_id, i: index })))


                                        }).catch((err) => {
                                            console.log(err);
                                        })

                                    setShowAddSubunits(false);
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
                                                <label>Category</label>
                                                <MyTextInput type="text" className="form-control" name="subunit_name" readOnly={true} />
                                            </div>


                                        </div>
                                        <div className="col-lg-12 col-md-12 col-sm-12">
                                            <div className="form-group">
                                                <label>Name</label>
                                                <MyTextInput type="text" className="form-control" name="title" />
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
            {/* Ends Add Subunits */}


            <Footer />



        </>
    )
}
