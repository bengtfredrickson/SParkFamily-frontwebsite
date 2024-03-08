import React, { useEffect, useMemo, useState } from 'react'
import Side_Navigation from './Side_Navigation'
import { DataGrid } from '@mui/x-data-grid';
import Box from '@mui/material/Box';
import { add_module, delete_module, edit_module, get_module, reOrder } from '../services/web/webServices';
import { Store } from 'react-notifications-component';
import { useLocation, useNavigate } from "react-router-dom";
import { Form, Formik, Field } from 'formik';
import Modal from "react-bootstrap/Modal";
import { MyTextArea, MyTextInput } from '../services/web/inputServices';
import * as Yup from 'yup';
import { Loader } from './Helper/Loader';
import Footer from './Footer';
import moment from 'moment/moment';
import {
    MRT_TableContainer,
    useMaterialReactTable,
} from "material-react-table";
import { Button, TablePagination } from "@mui/material";


const css = `
    .sidebar-menu li:nth-child(3) a {
        background:coral;
    }
    `
export default function CurriculumModules() {
    const navigate = useNavigate();

    const [getLoader, setLoader] = useState(true);
    const location = useLocation();
    const [select, setSelection] = useState([]);
    const [Modules, setModules] = useState([]);
    const [getImage, setImage] = useState({});
    const [getDetail, setDetail] = useState([]);
    const [getImageUrl, setImageUrl] = useState({});
    const [getState, setState] = useState(true);
    const [getbutton, setbutton] = useState(false);

    // Edit Modules Model
    const [showEditModules, setShowEditModules] = useState(false);
    const handleClose = () => {
        if (window.confirm("Are you sure you want to leave the current page?\nChanges will not be saved until you submit the form!")) {

            setShowEditModules(false);
        }
    };
    const handleShow = (e) => {
        setDetail(e)
        setShowEditModules(true);
    };
    const onHandle = (e) => {
        setImage({
            pictureAsFile: e.target.files[0],
        });
        setState(false);
        setImageUrl(URL.createObjectURL(e.target.files[0]));
    };
    // ends


    // Add Modules Model Function

    const [showAddModules, setShowAddModules] = useState(false);
    const handleClose1 = () => {
        if (window.confirm("Are you sure you want to leave the current page?\nChanges will not be saved until you submit the form!")) {

            setShowAddModules(false);
        }
    };
    const handleShow1 = () => {
        setShowAddModules(true);
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
        if (window.confirm("Are your sure? You want to delete this unit?")) {
            let data = {
                module_id: params.module_id,
            }
            delete_module(data).then((res) => {

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
                get_module(location.state.id).
                    then((res) => {

                        setModules(res.data.result.map((el, index) => ({ ...el, id: el.module_id, i: index })))
                        setData(res.data.result.map((el, index) => ({ ...el, id: el.module_id, i: index })))



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
        if (Modules.length === 0 || location?.state?.reloadModules) {
            get_module(location.state.id).
                then((res) => {

                    setModules(res.data.result.map((el, index) => ({ ...el, id: el.module_id, i: index })))
                    setData(res.data.result.map((el, index) => ({ ...el, id: el.module_id, i: index })))
                    setLoader(false);

                }).catch((err) => {
                    setLoader(false);
                    console.log(err);
                })
        }
    }, []);
    const columns = useMemo(() => [
        {
            // accessorKey: 'order_id',
            header: 'S.NO.',
            filterable: false,
            size: 5, //increase the width of this column
            muiTableHeadCellProps: {
                align: "left",
            },
            muiTableBodyCellProps: {
                align: "left",
            },
            accessorFn: (index) => `${index.i + 1}`,

        },
        {
            accessorKey: 'module_name',
            header: 'Name',
            size: 20,
            muiTableHeadCellProps: {
                align: "left",
            },
            muiTableBodyCellProps: {
                align: "left",
            },

        },
        {
            header: "Action",
            width: 450,
            accessorFn: (params) => {
                return (
                    <>
                        <Button onClick={() => navigate('/curriculum_units', { state: { id: location.state.id, module_id: params.module_id } })}>Units</Button>
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
    ], []);
    const itemsPerPageOptions = [10, 25, 50, 100]; // Define your desired options

    const [data, setData] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(itemsPerPageOptions[0]);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const paginatedData = useMemo(() => {
        const startIndex = page * rowsPerPage;
        const endIndex = startIndex + rowsPerPage;
        return data.slice(startIndex, endIndex);
    }, [data, page, rowsPerPage]);

    const table = useMaterialReactTable({
        autoResetPageIndex: false,
        columns,
        data: paginatedData,
        enableRowOrdering: true,
        enableSorting: false,
        enablePagination: false, // Disable internal pagination, as we will use external TablePagination
        muiRowDragHandleProps: ({ table }) => ({
            onDragEnd: () => {
                const { draggingRow, hoveredRow } = table.getState();
                if (hoveredRow && draggingRow) {
                    let data = {
                        id1: draggingRow.original.order_id,
                        id2: hoveredRow.original.order_id,
                        tableName: "module",
                    };
                    console.log("🚀 ~ CurriculumModules ~ data:", data)
                    reOrder(data)
                        .then((res) => {
                            get_module(location.state.id).
                                then((res) => {

                                    setModules(res.data.result.map((el, index) => ({ ...el, id: el.module_id, i: index })))
                                    setData(res.data.result.map((el, index) => ({ ...el, id: el.module_id, i: index })))
                                    setLoader(false);

                                }).catch((err) => {
                                    setLoader(false);
                                    console.log(err);
                                })
                        })
                        .catch((err) => {
                            console.log(err);
                        });
                }
            },
        }),
    });






    return (
        <>
            <style>{css}</style>
            <Side_Navigation />

            <div className="app-container app-theme-white body-tabs-shadow fixed-sidebar fixed-header">

                <div className="app-main">

                    <div className="main-content" style={{ marginBottom: "9px" }}>
                        <section className="section">
                            <div className="section-header">
                                <h1>Sections</h1>
                            </div>

                            <div className="section-body">
                                <div className="row">
                                    <div className="col-12">
                                        <div className="card">
                                            <div className="card-header d-Fle">
                                                <h4></h4>
                                                <a onClick={handleShow1} style={{ cursor: "pointer" }}>Add Section</a>
                                            </div>
                                            <div className="card-body">
                                                <div className="table-responsive newPc">


                                                    {getLoader === true ? <Loader /> : <Box sx={{ height: 650, width: '100%' }}>
                                                        {!Modules.length ? <h3>No Data Found!</h3> : null}
                                                        {Modules.length > 0 && (
                                                            <>
                                                                {/* <h2>{select.map((val) => val._id)}</h2> */}

                                                                {/* <DataGrid

                                                                    rows={Modules}

                                                                    columns={columns}
                                                                    pageSize={10}
                                                                    rowsPerPageOptions={[10]}

                                                                    onSelectionChange={(newSelection) => {

                                                                        setSelection(newSelection.rows);
                                                                    }}
                                                                /> */}
                                                                <MRT_TableContainer table={table} />
                                                                <TablePagination
                                                                    rowsPerPageOptions={itemsPerPageOptions}
                                                                    component="div"
                                                                    count={data.length}
                                                                    rowsPerPage={rowsPerPage}
                                                                    page={page}
                                                                    onPageChange={handleChangePage}
                                                                    onRowsPerPageChange={handleChangeRowsPerPage}
                                                                    style={{ position: 'sticky', bottom: 0, backgroundColor: 'white', zIndex: 1 }}
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


            <Modal show={showEditModules} keyboard={false}>
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
                            curriculum_id: location.state.id,
                            module_name: getDetail.module_name,
                            module_id: getDetail.module_id
                        }}

                        validationSchema={Yup.object({
                            module_name: Yup.string().required("Required").matches(
                                /\S+/,
                                "Field must contain at least one non-space character"
                            )

                        })}
                        onSubmit={(values, { resetForm }) => {
                            setbutton(true);

                            edit_module(values)
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
                                    get_module(location.state.id).
                                        then((res) => {

                                            setModules(res.data.result.map((el, index) => ({ ...el, id: el.module_id, i: index })))
                                            setData(res.data.result.map((el, index) => ({ ...el, id: el.module_id, i: index })))


                                        }).catch((err) => {
                                            console.log(err);
                                        })
                                    setShowEditModules(false)
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
                                            <MyTextInput type="text" className="form-control" name="module_name" />
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



            {/* Modal Add Modules */}
            <Modal show={showAddModules} keyboard={false}>
                <Modal.Header>
                    <Modal.Title>Add Section</Modal.Title>
                    <i
                        className="fas fa-cut"
                        style={{ cursor: "pointer" }}
                        onClick={handleClose1}
                    ></i>
                </Modal.Header>
                <Modal.Body>
                    <Formik

                        initialValues={{
                            curriculum_id: location.state.id,
                            module_name: "",
                        }}

                        validationSchema={Yup.object({
                            module_name: Yup.string().required("Required").matches(
                                /\S+/,
                                "Field must contain at least one non-space character"
                            )
                        })}

                        onSubmit={(values, { resetForm }) => {

                            setbutton(true);


                            add_module(values)
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
                                    get_module(location.state.id).
                                        then((res) => {
                                            console.log("=====")
                                            setModules(res.data.result.map((el, index) => ({ ...el, id: el.module_id, i: index })))
                                            setData(res.data.result.map((el, index) => ({ ...el, id: el.module_id, i: index })))


                                        }).catch((err) => {
                                            console.log(err);
                                        })

                                    setShowAddModules(false);
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
                                                <MyTextInput type="text" className="form-control" name="module_name" />
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
            {/* Ends Add Modules */}


            <Footer />



        </>
    )
}
