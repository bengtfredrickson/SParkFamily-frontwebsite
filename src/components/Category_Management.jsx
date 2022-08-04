import Side_Navigation from './Side_Navigation';
import React, { useEffect, useState } from "react";
// import Side_Navigation from "./Side_Navigation";
import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";
import { add_category, delete_category, edit_category, get_category, get_course } from "../services/web/webServices";
import { Store } from "react-notifications-component";
import { MyTextInput } from "../services/web/inputServices";
import { Button } from "react-bootstrap";
import { Modal } from "react-bootstrap";
import { Formik, Form } from 'formik';
import * as Yup from 'yup';


export default function Category_Management() {
    const css = `
    .sidebar-menu li:nth-child(6) a {
        background:coral;
    }
    `

    const [getCategory, setCategory] = useState([]);
    const [select, setSelection] = useState([]);
    const [getDetail, setDetail] = useState([]);
    const [getbutton,setbutton]=useState(false);

    //   Function Starts

    const [showEditCategory, setShowEditCategory] = useState(false);
    const handleClose = () => {
        setShowEditCategory(false);
    };
    const handleShow = (e) => {
        setDetail(e.row)
        setShowEditCategory(true);
    };
    

    const [showAddCategory, setShowAddCategory] = useState(false);
    const handleClose1 = () => {
        setShowAddCategory(false);
    };
    const handleShow1 = () => {
        setShowAddCategory(true);
    };





    const columns = [
        {
            field: 'sno',
            headerName: 'S.NO.',
            filterable: false,
            width: 70,
            renderCell: (index) => `${(index.row.i) + 1}`
        },

        // { field: 'id', headerName: 'ID', width: 250 },

        {
            field: 'category',
            headerName: "Category",
            width: 200,
            editable: true,
        },
        {
            field: "action",
            headerName: "Action",
            width: 500,
            renderCell: (params) => {
                return (
                    <>

                        <button style={{border: "none" }}  onClick={() => handleShow(params)} ><i className="fas fa-edit" style={{color:"blue"}}></i></button>

                        <button style={{ margin: "20px" ,border:"none" }} onClick={() => onDelete(params)}><i className="fa fa-trash" aria-hidden="true" style={{color:"red"}}></i></button>

                       
                        {/* onClick={onDelete(params)} */}

                    </>
                );
            },
        }


    ];



    useEffect(() => {
        get_category()
            .then((res) => {
                console.log("example=====>", res.data.response);
                setCategory(
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

    const onDelete = (params) => {
        if (window.confirm("are your sure?")) {
            delete_category(params.row._id)
                .then((res) => {
                    // setButton(true);

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
                    get_category()
                        .then((res) => {
                            // console.log("Res=====>", res.data.response);
                            setCategory(
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
                    console.log(err);
                });
        }
    }


    return (
        <>
            <style>
                {css}
            </style>
            {/* <!-- Main Content --> */}
            <Side_Navigation />
            <div className="main-content">
                <section className="section">
                    <div className="section-header">
                        <h1>Category Management</h1>
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
                                        <a onClick={handleShow1}   style={{ cursor: "pointer" }}>Add Category</a>
                                    </div>
                                    <div className="card-body">
                                        <div className="table-responsive newPc">

                                            <Box sx={{ height: 400, width: '100%' }}>
                                                {getCategory.length > 0 && (
                                                    <>
                                                        <h2>{select.map((val) => val._id)}</h2>

                                                        <DataGrid

                                                            rows={getCategory}

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


            <Modal show={showEditCategory} onHide={handleClose} keyboard={false}>
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
                            category: getDetail.category,

                        }}

                        validationSchema={Yup.object({
                            category: Yup.string(),

                        })}
                        onSubmit={(values) => {
                            setbutton(true);
                            const id = getDetail._id
                            edit_category(id, values)

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
                                    setShowEditCategory(false);
                                    setbutton(false);
                                    get_category().
                                        then((res) => {
                                            console.log(res.data.response)

                                            setCategory(res.data.response.map((el, index) => ({ ...el, id: el._id, i: index })))


                                        }).catch((err) => {
                                            console.log(err);
                                        })


                                })
                                .catch((err) => {
                                    setbutton(false);
                                    console.log(err);
                                });
                        }}


                    >
                        <Form>
                            <div className="modal-body">
                                <div className="row">

                                    <div className="col-lg-4 col-md-12 col-sm-12">
                                        <div className="form-group">
                                            <label>Category</label>
                                            <MyTextInput type="text" className="form-control" name="category" />
                                        </div>


                                    </div>


                                    <div className="col-lg-12 col-md-12 col-sm-12">

                                   

                                        {!getbutton?  <Button type="submit" style={{
                                            background: "blue", width: "96px",
                                            height: "43px"
                                        }}  >
                                            Submit
                                        </Button>:<Button  style={{
                                            background: "blue", width: "130px",
                                            height: "43px"
                                        }}  >
                                            Wait Please !!
                                        </Button>}
                                    </div>

                                </div>
                            </div>
                        </Form>
                    </Formik>

                </Modal.Body>

            </Modal>

          {/* Add Model */}
          <Modal show={showAddCategory} onHide={handleClose1} keyboard={false}>
                <Modal.Header>
                    <Modal.Title>Add Category</Modal.Title>
                    <i
                        className="fas fa-cut"
                        style={{ cursor: "pointer" }}
                        onClick={handleClose1}
                    ></i>
                </Modal.Header>
                <Modal.Body>
                    <Formik
                        initialValues={{
                            category: "",

                        }}

                        validationSchema={Yup.object({
                            category: Yup.string().required(),

                        })}
                        onSubmit={(values) => {
                            setbutton(true);

                            
                            add_category(values)

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
                                       

                                    }
                                   
                                    );
                                    setbutton(false);
                                    get_category().
                                        then((res) => {
                                            console.log(res.data.response)

                                            setCategory(res.data.response.map((el, index) => ({ ...el, id: el._id, i: index })))


                                        }).catch((err) => {
                                            console.log(err);
                                        })

                                        setShowAddCategory(false)
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

                                    <div className="col-lg-4 col-md-12 col-sm-12">
                                        <div className="form-group">
                                            <label>Category</label>
                                            <MyTextInput type="text" className="form-control" name="category" />
                                        </div>


                                    </div>


                                    <div className="col-lg-12 col-md-12 col-sm-12">

                                        {!getbutton? <Button type="submit" style={{
                                            background: "blue", width: "96px",
                                            height: "43px"
                                        }}  >
                                            Submit
                                        </Button>:<Button  style={{
                                            background: "blue", width: "130px",
                                            height: "43px"
                                        }}  >
                                            Wait Please !!
                                        </Button>}
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
                    Copyright &copy; 2021 <div className="bullet"></div> Design By <a href="https://www.webmobril.com/">Webmobril</a>
                </div>
                <div className="footer-right">
                </div>
            </footer>


        </>

    )
}
