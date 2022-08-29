import Side_Navigation from './Side_Navigation';
import React, { useEffect, useState } from "react";
// import Side_Navigation from "./Side_Navigation";
import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";
import {deleteNeedHelp, getNeedHelp} from "../services/web/webServices";
import { Store } from "react-notifications-component";
import { Button } from "react-bootstrap";
import { Modal } from "react-bootstrap";
import { Loader } from '../components/Helper/Loader';
import Footer from './Footer';
export default function Need_Help() {
  const css = `
  
  .sidebar-menu li:nth-child(8) a {
    background: none !important;
}
  .sidebar-menu li:nth-child(8) a {
      background: coral !important;
  }
    
    `
    const [getLoader, setLoader] = useState(true);
  const [getNeedHelpData, setNeedHelpData] = useState([]);
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
      field: 'select_grade',
      headerName: "Select Grade",
      width: 120,
      editable: true,
    },
    {
      field: 'select_subject',
      headerName: "Select Subject",
      width: 120,
      editable: true,
    },
    {
      field: "#",
      headerName: "Message",
      width:135,
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
    getNeedHelp()
      .then((res) => {
        setNeedHelpData(
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
      deleteNeedHelp(params.row._id)
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
          getNeedHelp()
            .then((res) => {
              setNeedHelpData(
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
            <h1>Need Help Management</h1>
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
                    {getLoader === true ? <Loader /> :
                      <Box sx={{ height: 400, width: '100%' }}>
                        {getNeedHelpData.length > 0 && (
                          <>
                            <DataGrid rows={getNeedHelpData}
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
        <Modal.Body>{getDetail.message}</Modal.Body>
       
      </Modal>
      {/* Close Message */}
      <Footer/>
    </>

  )
}
