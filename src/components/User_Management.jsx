import React, { useEffect, useState } from 'react'
import Side_Navigation from './Side_Navigation'
import { DataGrid } from '@mui/x-data-grid';
import Box from '@mui/material/Box';
import { add_user, delete_user, get_All_Users, update_user } from '../services/web/webServices';
import { Store } from 'react-notifications-component';
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from '@mui/material';
import { Form, Formik } from 'formik';
import Modal from "react-bootstrap/Modal";
import { MyTextInput } from '../services/web/inputServices';
import * as Yup from 'yup';



const css = `
    .sidebar-menu li:nth-child(3) a {
        background:coral;
    }
    `


export default function User_Management() {

    const location = useLocation();
    const [select, setSelection] = useState([]);
    const [users, setUsers] = useState([]);
    const [getImage, setImage] = useState({});
    const [getDetail, setDetail] = useState([]);
    const [getImageUrl, setImageUrl] = useState({});
    const [getState, setState] = useState(true);
    const [getbutton,setbutton]=useState(false);

    // Edit User Model
    const [showEditUser, setShowEditUser] = useState(false);
    const handleClose = () => {
        setShowEditUser(false);
    };
    const handleShow = (e) => {
        setDetail(e.row)
        setShowEditUser(true);
    };
    const onHandle = (e) => {
        setImage({
            pictureAsFile: e.target.files[0],
        });
        setState(false);
        setImageUrl(URL.createObjectURL(e.target.files[0]));
    };
    // ends


    // Add User Model Function

    const [showAddUser, setShowAddUser] = useState(false);
    const handleClose1 = () => {
        setShowAddUser(false);
    };
    const handleShow1 = () => {
        setShowAddUser(true);
    };
    // Ends
    // let index1=0;
    const navigate = useNavigate();
    //   Function Hnadle

    const selectPic = (e) => {
        setImage({
            pictureAsFile: e.target.files[0],

        });
    }

    const onDelete = (params) => () => {
        if (window.confirm("are your sure?")) {
            delete_user(params.row._id).then((res) => {

                Store.addNotification({
                    title: "Success",
                    message: res?.data?.message,
                    type: "success",
                    insert: "top",
                    container: "top-right",
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

            }).catch((err) => {
                console.log(err)
            })
            get_All_Users().
                then((res) => {
                    console.log(res.data.response)

                    setUsers(res.data.response.map((el, index) => ({ ...el, id: el._id, i: index })))


                }).catch((err) => {
                    console.log(err);
                })
        }


    };
    // ends
    useEffect(() => {
        if (users.length === 0 || location?.state?.reloadUsers) {
            get_All_Users().
                then((res) => {
                    console.log(res.data.response)

                    setUsers(res.data.response.map((el, index) => ({ ...el, id: el._id, i: index })))
                    // res.data.response.map((intem,index)=>{
                    //     console.log("index-====>",index)
                    //     setLength(index);
                    // })


                }).catch((err) => {
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
            field: 'name',
            headerName: 'Name',
            width: 200,
            editable: true,
        },
        {
            field: 'email',
            headerName: 'Email_Id',
            width: 200,
            editable: true,
        },
        {
            field: 'phone',
            headerName: 'Phone Number',
            type: 'text',
            width: 200,

            editable: true,
        },
        {
            field: 'profile_pic',
            headerName: 'Image',
            width: 100,
            renderCell: (params) => {
                return (
                    <div>

                        {params?.row?.profile_pic == ' ' ? <img className="circular_image" style={{ width: "62px" }} src="images/profile.png" alt="Not Found " /> : <img className="circular_image" style={{ width: "62px" }} src={params?.row?.profile_pic} alt='' />}


                    </div>
                )
            }
        },
        {
            field: "is_active",
            headerName: "Activity",

        },
        {
            field: 'action',
            headerName: "Action",
            width: 450,
            renderCell: (params) => {
                return (
                    <>

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
            <div className="main-content">
                <section className="section">
                    <div className="section-header">
                        <h1>User Management</h1>
                        {/* <div className="section-header-breadcrumb">
                            <div className="breadcrumb-item active"><Link to="/home">Home</Link></div>
                            <div className="breadcrumb-item"><Link to="/home">User Management</Link></div>
                        </div> */}
                    </div>
                    <div className="section-body">
                        <div className="row">
                            <div className="col-12">
                                <div className="card">
                                    <div className="card-header d-Fle">
                                        <h4>Data Table</h4>
                                        <a onClick={handleShow1} style={{ cursor: "pointer" }}>Add User</a>
                                    </div>
                                    <div className="card-body">
                                        <div className="table-responsive newPc">
                                            <Box sx={{ height: 400, width: '100%' }}>
                                                {users.length > 0 && (
                                                    <>
                                                        <h2>{select.map((val) => val._id)}</h2>

                                                        <DataGrid

                                                            rows={users}

                                                            columns={columns}
                                                            pageSize={5}
                                                            rowsPerPageOptions={[5]}

                                                            onSelectionChange={(newSelection) => {

                                                                setSelection(newSelection.rows);
                                                            }}
                                                        />
                                                    </>
                                                )

                                                }

                                            </Box>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>

            {/*  Modal Edit*/}


            <Modal show={showEditUser} onHide={handleClose} keyboard={false}>
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
                            name: getDetail.name,
                            phone: getDetail.phone,
                            email: getDetail.email,
                            profile_pic: "",
                        }}
                        validationSchema={Yup.object({
                            name: Yup.string(),
                            phone: Yup.number()
                                .typeError("That doesn't look like a phone number")
                                .positive("A phone number can't start with a minus")
                                .integer("A phone number can't include a decimal point")
                                .min(8)
                                .required('A phone number is required'),
                            profile_pic: Yup.mixed(),
                            email: Yup.string()
                                .email("Invalid email address"),
                        })}
                        onSubmit={(values, { resetForm }) => {
                            setbutton(true);
                            console.log(values);
                            let formData = new FormData();
                            if (getImage.pictureAsFile) {
                                formData.append("profile_pic", getImage.pictureAsFile);
                            }
                            formData.append("email", values.email.toLowerCase());
                            formData.append("name", values.name);
                            formData.append("phone", values.phone);

                            update_user(getDetail._id, formData)
                                .then((res) => {
                                    resetForm({ values: "" });
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
                                    get_All_Users().
                                        then((res) => {
                                            console.log(res.data.response)

                                            setUsers(res.data.response.map((el, index) => ({ ...el, id: el._id, i: index })))


                                        }).catch((err) => {
                                            console.log(err);
                                        })
                                    setShowEditUser(false)
                                    setbutton(false);

                                }

                                )
                                .catch((err) => {
                                    // setButton(true);
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

                                    }
                                });
                        }}
                    >
                        <Form>
                            <div className="modal-body">
                                <div className="row">
                                    <div className="col-lg-6 col-md-12 col-sm-12">
                                        <div className="form-group">
                                            <label>Name</label>
                                            <MyTextInput
                                                type="text"
                                                className="form-control"
                                                name="name"
                                            />
                                        </div>
                                    </div>
                                    <div className="col-lg-6 col-md-12 col-sm-12">
                                        <div className="form-group">
                                            <label>Email Id</label>
                                            <MyTextInput
                                                type="email"
                                                className="form-control"
                                                name="email"
                                            />
                                        </div>
                                    </div>

                                    <div className="col-lg-6 col-md-12 col-sm-12">
                                        <div className="form-group">
                                            <label>Phone Number</label>
                                            <MyTextInput

                                                type="text"
                                                className="form-control"
                                                name="phone"
                                            />
                                        </div>
                                    </div>

                                    <div className="col-lg-7 col-md-12 col-sm-12">
                                        <div className="form-group">
                                            <label>Image</label>
                                            {/* <img  className=" w-50 p-3" src={getDetail.coach_image}/> */}
                                            {getState ? (
                                                <img
                                                    src={getDetail.profile_pic}
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

                                   
                                    {!getbutton? <Button type="submit" variant="contained"  >
                                            Submit
                                        </Button>:<Button  variant="contained" style={{backgroundColor:'blue',color:"white"}}  disabled>Wait Please!</Button>}
                                    </div>
                                </div>
                            </div>
                        </Form>
                    </Formik>

                </Modal.Body>

            </Modal>
            {/* Ends */}



            {/* Modal Add User */}
            <Modal show={showAddUser} onHide={handleClose1} keyboard={false}>
                <Modal.Header>
                    <Modal.Title>AddUser</Modal.Title>
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
                            email: "",
                            profile_pic: "",
                            phone: "",
                        }}

                        validationSchema={Yup.object({
                            name: Yup.string().required(),
                            email: Yup.string().email().required(),
                            phone: Yup.string().required(),
                            profile_pic: Yup.mixed(),
                        })}

                        onSubmit={(values, { resetForm }) => {
                            setbutton(true);
                            // console.log(values)

                            let formData = new FormData();

                            if (getImage.pictureAsFile) {
                                formData.append("profile_pic", getImage.pictureAsFile);
                            }
                            formData.append("name", values.name);
                            formData.append('email', values.email);
                            formData.append("phone", values.phone);

                            add_user(formData)

                                .then((res) => {

                                    console.log("Res=====>", res);
                                    Store.addNotification({
                                        title: "Success",
                                        message: res?.data?.message,
                                        type: "success",
                                        insert: "top",
                                        container: "top-right",
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
                                    resetForm({ formData: "" });
                                   
                                    get_All_Users().
                                        then((res) => {
                                            console.log(res.data.response)

                                            setUsers(res.data.response.map((el, index) => ({ ...el, id: el._id, i: index })))


                                        }).catch((err) => {
                                            console.log(err);
                                        })

                                    setShowAddUser(false);
                                    setbutton(false);

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
                                            <label>Email Id</label>
                                            <MyTextInput type="text" className="form-control" name="email" />
                                        </div>



                                    </div><div className="col-lg-4 col-md-12 col-sm-12">
                                        <div className="form-group">
                                            <label>Phone Number</label>
                                            <MyTextInput type="text" className="form-control" name="phone" />
                                        </div>



                                    </div>
                                    <div className="col-lg-4 col-md-12 col-sm-12">
                                        <div className="form-group">
                                            <label>Profile Picture</label>
                                            <img src={getImageUrl} className=" w-50 p-3" style={{ marginLeft: "70px" }} alt="" />
                                            <input type="file" className="form-control" accept="image/*"
                                                name="profile_pic" onChange={selectPic} required />
                                        </div>



                                    </div>
                                   

                                    <div className="col-lg-12 col-md-12 col-sm-12">
                                       {!getbutton? <Button type="submit" variant="contained"  >
                                            Submit
                                        </Button>:<Button  variant="contained" style={{backgroundColor:'blue',color:"white"}}  disabled>Wait Please!</Button>}
                                       
                                    </div>

                                </div>
                            </div>
                        </Form>
                    </Formik>

                </Modal.Body>

            </Modal>
            {/* Ends Add User */}


            <footer className="main-footer">
                <div className="footer-left">
                    Copyright &copy; 2021 <div className="bullet"></div> Design By <a href="https://www.webmobril.com/">Webmobril</a>
                </div>
                <div className="footer-right">
                </div>
            </footer>



        </>
    )
}
