import Side_Navigation from './Side_Navigation';
import React, { useEffect, useState } from "react";
// import Side_Navigation from "./Side_Navigation";
import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";
import { add_category, deleteNeedHelp, delete_category, delete_contact_us, edit_category, getNeedHelp, get_all_contact_us, get_category, get_course } from "../services/web/webServices";
import { Store } from "react-notifications-component";
import { MyTextInput } from "../services/web/inputServices";
import { Button } from "react-bootstrap";
import { Modal } from "react-bootstrap";
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { Loader } from '../components/Helper/Loader';
import Footer from './Footer';


export default function Contact_Us() {
  const css = `
  
  .sidebar-menu li:nth-child(7) a {
    background: none !important;
}
  .sidebar-menu li:nth-child(7) a {
      background: coral !important;
  }
    
    `

  const [getContactUs, setContactUs] = useState([]);
  const [getMessage, setMessage] = useState(false);
  const [getLoader, setLoader] = useState(true);
  const [getDetail,setDetail]=useState([]);
  const handleClose = () => {
    setMessage(false);
  };
  const handleShow = (e) => {
      setDetail(e.row)
      setMessage(true);
  };

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
      headerName: "Name",
      width: 170,
      editable: true,
    },
    {
      field: 'email',
      headerName: "Email Id",
      width: 240,
      editable: true,
    },
    {
      field: 'phone',
      headerName: "Phone No.",
      width: 120,
      editable: true,
    },
    {
      field: "#",
      headerName: "Show Detail",
      width:135,
      filterable: false,
      renderCell: (params) => {
        return (
          <>
            <Button variant="contained" style={{color:"white",backgroundColor:"blue"}} onClick={() => handleShow(params)}>
              Click to View
            </Button>
          </>
        );
      },
    },
   
    {
      field: "action",
      headerName: "Action",
      width: 500,
      filterable: false,
      renderCell: (params) => {
        return (
          <>

           

            <button style={{ margin: "20px", border: "none" }} onClick={()=>onDelete(params)} ><i className="fa fa-trash" aria-hidden="true" style={{ color: "red" }}></i></button>


            

          </>
        );
      },
    }


  ];



  useEffect(() => {
    get_all_contact_us()
      .then((res) => {
        setContactUs(
          res.data.response.map((el, index) => ({
            ...el,
            id: el._id,
            i: index,
          }))
        );
        setLoader(false);
      })
      .catch((err) => {
        setLoader(false);
        console.log(err);
      });
  }, []);



  const onDelete = (params) => {
    if (window.confirm("are your sure?")) {
      delete_contact_us(params.row._id)
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
          get_all_contact_us()
            .then((res) => {
              console.log("Res=====>", res.data.response);
              setContactUs(
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
      <div className="main-content" style={{marginBottom:"25px"}}>
        <section className="section">
          <div className="section-header">
            <h1>Contact Us Management</h1>
          </div>
          <div className="section-body">
            <div className="row">
              <div className="col-12">
                <div className="card">
                  <div className="card-header d-Fle">
                    <h4>Data Table</h4>
                    {/* <a style={{ cursor: "pointer" }}>Add Need Help</a> */}
                  </div>
                  <div className="card-body">
                    <div className="table-responsive newPc">
                    {getLoader === true ? <Loader /> : <Box sx={{ height: 400, width: '100%' }}>
                        {getContactUs.length > 0 && (
                          <>
                            <DataGrid rows={getContactUs}
                              columns={columns}
                              pageSize={5}
                              rowsPerPageOptions={[5]}

                            />
                          </> ) }
                      </Box>}
                   
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>


      {/* Show Message */}
      <Modal show={getMessage} onHide={handleClose} keyboard={false}>
        <Modal.Header>
          <Modal.Title>Message</Modal.Title>
          <i
            className="fas fa-cut"
            style={{ cursor: "pointer" }}
            onClick={handleClose}
          ></i>
        </Modal.Header>
        <Modal.Body>
        <h5>Message</h5>
        {getDetail.message}
        <h5>Subject</h5>
        {getDetail.subject}
        </Modal.Body>
       
      </Modal>
      {/* Close Message */}
     <Footer/>


    </>

  )
}
