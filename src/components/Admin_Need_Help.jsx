import Side_Navigation from './Side_Navigation';
import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";
import {  delete_admin__need_help, get_all_admin__need_help } from "../services/web/webServices";
import { Store } from "react-notifications-component";
import { Button } from "react-bootstrap";
import { Modal } from "react-bootstrap";


export default function Admin_Need_Help() {
  const css = `
  
  .sidebar-menu li:nth-child(9) a {
    background: none !important;
}
  .sidebar-menu li:nth-child(9) a {
      background: coral !important;
  }
    
    `

  const [getAdminNeedHelpData, setAdminNeedHelpData] = useState([]);
  const [getMessage, setMessage] = useState(false);
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
      headerName: "Phone",
      width: 120,
      editable: true,
    },
    {
      field: "#",
      headerName: "Check Detail",
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
    get_all_admin__need_help()
      .then((res) => {
        setAdminNeedHelpData(
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
      delete_admin__need_help(params.row._id)
        .then((res) => {
      
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
          get_all_admin__need_help()
            .then((res) => {
              setAdminNeedHelpData(
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
            <h1>Admin Need Help Management</h1>
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

                      <Box sx={{ height: 400, width: '100%' }}>
                        {getAdminNeedHelpData.length > 0 && (
                          <>
                            <DataGrid rows={getAdminNeedHelpData}
                              columns={columns}
                              pageSize={5}
                              rowsPerPageOptions={[5]}

                            />
                          </> ) }
                      </Box>
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
          <Modal.Title>Show Detail</Modal.Title>
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
