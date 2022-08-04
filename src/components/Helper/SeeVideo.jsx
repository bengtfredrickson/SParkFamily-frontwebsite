import React, { useEffect, useState } from 'react'
import { Modal } from 'react-bootstrap';
import { Button } from 'react-bootstrap';
import { useLocation } from 'react-router-dom'
import '../Helper/seevideo.css'
import Side_Navigation from '../Side_Navigation';
import { Store } from 'react-notifications-component';
import { add_video, deleteVideo, get_course, upload_vedio } from '../../services/web/webServices';
import { Formik, Form, FieldArray } from 'formik';
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import ReactPlayer from 'react-player';
// import { MyTextInput } from '../../services/web/inputServices';
export default function SeeVedio() {
    const { state } = useLocation();
    const { video } = state;
    const [getVideoUrl, setVideoUrl] = useState([]);
    const [getData, setData] = useState([]);
    const [show, setShow] = useState(false);
    const [getRequestToShow, setRequestToShow] = useState(false);
    const [getCourseVideo, setCourseVideo] = useState([]);
    const [getCourseVideoThumbnail, setCourseVideoThumbnail] = useState([]);
    const [getVideo, setVideo] = useState([]);
    const [open, setOpen] = React.useState();
    // const []

    useEffect(() => {
        get_course().then((res) => {
            setData(res.data.response[video.i])
        }).catch((err) => {
            console.log(err);
        })
    }, [])
    const handleClose = () => {
        setShow(false);
    };
    const showVideo = (index) => {
        setVideoUrl(getData?.videos[index]?.video_url);
        setShow(true);
    }


    const handleClose1 = () => {
        setRequestToShow(false);
    }
    const addVideo = () => {
        setRequestToShow(true);
    }



    const uploadVideo = () => {
        let formData = new FormData();
        if (getCourseVideo && getCourseVideoThumbnail) {
            formData.append("video_url", getCourseVideo);
            formData.append("video_thumbnail", getCourseVideoThumbnail);
        }

        setOpen(!open);
        upload_vedio(formData)
            .then((res) => {
                console.log("Video Data Response=====>", res);

                let videoData = {
                    video_url: res.data.response[0].location,
                    video_name: res.data.response[0].originalname,
                    video_thumbnail: res.data.response[1].location,
                };

                setVideo((getVideo) => [...getVideo, videoData]);
                // {getVideo.map(entry=>console.log(entry))}
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
                setOpen(open);

                //   setOpen(open);
            })
            .catch((err) => {
                if (err) {
                    console.log(err);
                    setOpen(open);
                    // setOpen(open);
                }
            });

    }




    const delete_video = (index) => {
        console.log("data===>", video)

        deleteVideo(getData._id, getData?.videos[index]?._id).
            then((res) => {
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
                get_course().then((res) => {
                    setData(res.data.response[video.i])
                }).catch((err) => {
                    console.log(err);
                })
            }).catch((err) => {
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
            })
    }
    return (
        <>
            <Side_Navigation />

            <section className=" my_section" style={{ width: "84%", height: "87vh", marginLeft: '250px' }} >

                <div className="container-fluid pt-5">
                    <Button onClick={addVideo} style={{ marginTop: "30px", marginLeft: "1180px", backgroundColor: "blue" }}>Add More Video</Button>
                    <div className="row pt-5" >

                        {getData?.videos?.length > 0 ? getData?.videos?.map((item, index) => {
                            return (
                                <>

                                    <div className="col-md-3 " id='vedio_tumbnail' key={index}>

                                        <img src={item?.video_thumbnail} className="img-fluid images" />
                                        <h6 style={{ cursor: "pointer" }} onClick={() => showVideo(index)} >{item?.video_name} </h6>
                                        <i className="fa fa-play play_Button" onClick={() => showVideo(index)} ></i>
                                        <i className="fas fa-trash-alt cut-button" onClick={() => delete_video(index)}></i>
                                        {/* <i class="fas fa-trash-alt"></i> */}
                                    </div>
                                </>
                            )
                        }) : ""}
                    </div>
                </div>
            </section>

            {/* Model start */}


            <Modal show={show} onHide={handleClose} keyboard={false} >
                <Modal.Header >
                    <Modal.Title>Video</Modal.Title>
                    <i
                        className="fas fa-cut"
                        style={{ cursor: "pointer" }}
                        onClick={handleClose}
                    ></i>
                </Modal.Header>
                <Modal.Body >
                   
                    <ReactPlayer 
                         height={400}
                         width="700"
                         controls
                         config={{ file: { attributes: { controlsList: 'nodownload' } } }}
                         onContextMenu={e => e.preventDefault()}
                         className="react-player"
                         url={getVideoUrl}
                    />
                </Modal.Body>
                <Modal.Footer >
                    <Button style={{ backgroundColor: "blue" }} onClick={handleClose}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>



            {/* Model ends */}


            {/* Add Modal start */}
            <Modal show={getRequestToShow} onHide={handleClose1} keyboard={false} >
                <Modal.Header >
                    <Modal.Title>Add Video</Modal.Title>
                    <i
                        className="fas fa-cut"
                        style={{ cursor: "pointer" }}
                        onClick={handleClose1}
                    ></i>
                </Modal.Header>
                <Modal.Body >
                    <Formik
                        initialValues={{
                            videos: [
                                {
                                    video_url: "",
                                    video_name: "",
                                    video_thumbnail: "",
                                },
                            ],
                        }}

                        onSubmit={(values) => {
                            values.videos = (getVideo || []).map((q) => ({
                                video_url: q.video_url,
                                video_name: q.video_name,
                                video_thumbnail: q.video_thumbnail,
                            }))


                            add_video(values, getData._id)
                                .then((res) => {
                                    // setButton(true);
                                    console.log("Res=====>", res);
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
                                    setRequestToShow(false);
                                    setVideo((getVideo) => []);
                                    get_course().then((res) => {
                                        setData(res.data.response[video.i])
                                    }).catch((err) => {
                                        console.log(err);
                                    })

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
                                    }
                                    setRequestToShow(false);
                                });

                        }}
                    >



                        {({ values }) => (


                            <Form>
                                <div className="modal-body">
                                    <div className="row">
                                        <FieldArray
                                            name="videos"
                                            render={(arrayHelpers) => (
                                                <div className="col-lg-12 col-md-12 col-sm-12">
                                                    <div className="form-group">
                                                        <label> Course Video</label>
                                                        {values.videos && values.videos.length > 0 ? (
                                                            values.videos.map((item, index) => (
                                                                <div key={index}>
                                                                    <label style={{ marginRight: "11px" }}>
                                                                        Select Video
                                                                    </label>
                                                                    <input
                                                                        className="form-control"
                                                                        name={`videos.${index}.video_url`}
                                                                        type="file"
                                                                        accept="video/*"
                                                                        required
                                                                        onChange={(e) => setCourseVideo(e.target.files[0])}

                                                                    />
                                                                    <label
                                                                        style={{
                                                                            marginRight: "11px",
                                                                            marginLeft: "3px",
                                                                        }}
                                                                    >
                                                                        Select Video Thumbnail
                                                                    </label>
                                                                    <input
                                                                        className="form-control"
                                                                        name={`videos.${index}.video_thumbnail`}
                                                                        type="file"
                                                                        accept="image/*"
                                                                        required
                                                                        onChange={(e) => setCourseVideoThumbnail(e.target.files[0])}
                                                                    />

                                                                    <Button
                                                                        onClick={() => arrayHelpers.remove(index)}
                                                                        style={{ cursor: "pointer" }}
                                                                    >
                                                                        <i className="fas fa-trash-alt"></i>
                                                                    </Button>

                                                                    <Button
                                                                        stype="button"
                                                                        style={{ border: "none" }}
                                                                        onClick={() =>
                                                                            arrayHelpers.insert(index, "")
                                                                        }
                                                                    >
                                                                        <h6>+</h6>
                                                                    </Button>
                                                                    <Button style={{ backgroundColor: "blue" }} onClick={uploadVideo} >
                                                                        <i className="fa fa-upload" aria-hidden="true" >Upload Data </i>
                                                                    </Button>
                                                                </div>
                                                            ))
                                                        ) : (
                                                            <Button onClick={() => arrayHelpers.push("")}>
                                                                Add Video
                                                            </Button>
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                        />



                                        <div className="col-lg-12 col-md-12 col-sm-12">

                                            <Button type="submit" style={{
                                                background: "blue", width: "96px",
                                                height: "43px"
                                            }}  >
                                                Submit
                                            </Button>
                                        </div>

                                    </div>
                                </div>
                            </Form>
                        )}
                    </Formik>
                </Modal.Body>
            </Modal>


            <Backdrop
                sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={open}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
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
