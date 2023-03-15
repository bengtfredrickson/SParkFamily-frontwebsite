import React, { useEffect, useState } from 'react'
import Side_Navigation from './Side_Navigation'
import { DataGrid } from '@mui/x-data-grid';
import Box from '@mui/material/Box';
import { add_lesson, delete_lesson, edit_lesson, get_lessons } from '../services/web/webServices';
import { Store } from 'react-notifications-component';
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from '@mui/material';
import { Form, Formik, Field } from 'formik';
import Modal from "react-bootstrap/Modal";
import { MyTextArea, MyTextEditor, MyTextInput } from '../services/web/inputServices';
import * as Yup from 'yup';
import { Loader } from './Helper/Loader';
import Footer from './Footer';
import moment from 'moment/moment';
import { ContentState, convertFromHTML, convertToRaw, EditorState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import draftToHtml from 'draftjs-to-html'
import htmlToDraft from 'html-to-draftjs'

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
    const [getImageUrl, setImageUrl] = useState("");
    const [getState, setState] = useState(true);
    const [getbutton, setbutton] = useState(false);

    // Edit LessonPlans Model
    const [showEditLessonPlans, setShowEditLessonPlans] = useState(false);
    const handleClose = () => {
        setShowEditLessonPlans(false);
        setImage({})
        setImageUrl("")
        setEditorData1("")
        setIntegration("")
        setEditorData2("")
        setObjective("")
        setEditorData3("")
        setTarget("")
        setEditorData4("")
        setPrep("")
        setEditorData5("")
        setQuestions("")
        setEditorData6("")
        setCompetencies("")
        setEditorData7("")
        setSet("")
        setEditorData8("")
        setSparkItUp("")
        setEditorData9("")
        setAlignment("")
        setEditorData10("")
        setTeach("")
        setEditorData11("")
        setCues("")
        setEditorData12("")
        setSuggestion("")
        setEditorData13("")
        setVocabulary("")
    };
    const handleShow = (e) => {
        setDetail(e.row)
        setShowEditLessonPlans(true);
        setImageUrl(e.row.image_url);
        setEditorData1(EditorState.createWithContent(
            ContentState.createFromBlockArray(convertFromHTML(e.row.integration))
        ))
        setIntegration(e.row.integration)
        setEditorData2(EditorState.createWithContent(
            ContentState.createFromBlockArray(convertFromHTML(e.row.lesson_objective))
        ))
        setObjective(e.row.lesson_objective)
        setEditorData3(EditorState.createWithContent(
            ContentState.createFromBlockArray(convertFromHTML(e.row.lesson_target))
        ))
        setTarget(e.row.lesson_target)
        setEditorData4(EditorState.createWithContent(
            ContentState.createFromBlockArray(convertFromHTML(e.row.prep))
        ))
        setPrep(e.row.prep)
        setEditorData5(EditorState.createWithContent(
            ContentState.createFromBlockArray(convertFromHTML(e.row.reflection_question))
        ))
        setQuestions(e.row.reflection_question)
        setEditorData6(EditorState.createWithContent(
            ContentState.createFromBlockArray(convertFromHTML(e.row.sel_compentencies))
        ))
        setCompetencies(e.row.sel_compentencies)
        setEditorData7(EditorState.createWithContent(
            ContentState.createFromBlockArray(convertFromHTML(e.row.lesson_set))
        ))
        setSet(e.row.lesson_set)
        setEditorData8(EditorState.createWithContent(
            ContentState.createFromBlockArray(convertFromHTML(e.row.spark_it_up))
        ))
        setSparkItUp(e.row.spark_it_up)
        setEditorData9(EditorState.createWithContent(
            ContentState.createFromBlockArray(convertFromHTML(e.row.standards_alignment))
        ))
        setAlignment(e.row.standards_alignment)
        setEditorData10(EditorState.createWithContent(
            ContentState.createFromBlockArray(convertFromHTML(e.row.teach))
        ))
        setTeach(e.row.teach)
        setEditorData11(EditorState.createWithContent(
            ContentState.createFromBlockArray(convertFromHTML(e.row.teaching_cues))
        ))
        setCues(e.row.teaching_cues)
        setEditorData12(EditorState.createWithContent(
            ContentState.createFromBlockArray(convertFromHTML(e.row.teaching_suggestions))
        ))
        setSuggestion(e.row.teaching_suggestions)
        setEditorData13(EditorState.createWithContent(
            ContentState.createFromBlockArray(convertFromHTML(e.row.vocabulary))
        ))
        setVocabulary(e.row.vocabulary)
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
        setImage({})
        setImageUrl("")
        setEditorData1("")
        setIntegration("")
        setEditorData2("")
        setObjective("")
        setEditorData3("")
        setTarget("")
        setEditorData4("")
        setPrep("")
        setEditorData5("")
        setQuestions("")
        setEditorData6("")
        setCompetencies("")
        setEditorData7("")
        setSet("")
        setEditorData8("")
        setSparkItUp("")
        setEditorData9("")
        setAlignment("")
        setEditorData10("")
        setTeach("")
        setEditorData11("")
        setCues("")
        setEditorData12("")
        setSuggestion("")
        setEditorData13("")
        setVocabulary("")

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

    const onDelete = (params) => () => {
        if (window.confirm("Are your sure? You want to delete this?")) {
            let data = {
                lesson_id: params.row.lesson_id,
            }
            delete_lesson(data).then((res) => {

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
                get_lessons({ curriculum_id: location.state.curriculum_id, suboption_id: location.state.suboption_id }).
                    then((res) => {
                        console.log("=======>", res.data.result)

                        setLessonPlans(res.data.result.map((el, index) => ({ ...el, id: el.lesson_id, i: index })))
                        setLoader(false);

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
        if (LessonPlans.length === 0 || location?.state?.reloadLessonPlans) {
            get_lessons({ curriculum_id: location.state.curriculum_id, suboption_id: location.state.suboption_id }).
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
        // {
        //     field: 'lesson_objective',
        //     headerName: 'Objective',
        //     width: 120,
        // },
        // {
        //     field: 'lesson_target',
        //     headerName: 'Target',
        //     width: 120,
        // },
        // {
        //     field: 'integration',
        //     headerName: 'Integrations',
        //     width: 120,
        // },
        // {
        //     field: 'prep',
        //     headerName: 'Prep',
        //     width: 120,
        // },
        // {
        //     field: 'reflection_question',
        //     headerName: 'Question',
        //     width: 120,
        // },
        // {
        //     field: 'sel_compentencies',
        //     headerName: 'Compentencies',
        //     width: 120,
        // },
        // {
        //     field: 'lesson_set',
        //     headerName: 'Lesson Set',
        //     width: 120,
        // },
        // {
        //     field: 'spark_it_up',
        //     headerName: 'Spark It Up',
        //     width: 120,
        // },
        // {
        //     field: 'standards_alignment',
        //     headerName: 'Alignment',
        //     width: 120,
        // },
        // {
        //     field: 'teach',
        //     headerName: 'Teach',
        //     width: 120,
        // },
        // {
        //     field: 'teaching_cues',
        //     headerName: 'Cues',
        //     width: 120,
        // },
        // {
        //     field: 'teaching_suggestions',
        //     headerName: 'Suggestions',
        //     width: 120,
        // },
        // {
        //     field: 'vocabulary',
        //     headerName: 'Vocabulary',
        //     width: 120,
        // },

        {
            field: 'action',
            headerName: "Action",
            width: 450,
            renderCell: (params) => {
                return (
                    <>
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




    const [editorData1, setEditorData1] = useState('')
    const [editorData2, setEditorData2] = useState('')
    const [editorData3, setEditorData3] = useState('')
    const [editorData4, setEditorData4] = useState('')
    const [editorData5, setEditorData5] = useState('')
    const [editorData6, setEditorData6] = useState('')
    const [editorData7, setEditorData7] = useState('')
    const [editorData8, setEditorData8] = useState('')
    const [editorData9, setEditorData9] = useState('')
    const [editorData10, setEditorData10] = useState('')
    const [editorData11, setEditorData11] = useState('')
    const [editorData12, setEditorData12] = useState('')
    const [editorData13, setEditorData13] = useState('')

    const [Integration, setIntegration] = useState('')
    const [Objective, setObjective] = useState('')
    const [Target, setTarget] = useState('')
    const [Prep, setPrep] = useState('')
    const [Questions, setQuestions] = useState('')
    const [Competencies, setCompetencies] = useState('')
    const [Set, setSet] = useState('')
    const [SparkItUp, setSparkItUp] = useState('')
    const [Alignment, setAlignment] = useState('')
    const [Teach, setTeach] = useState('')
    const [Cues, setCues] = useState('')
    const [Suggestion, setSuggestion] = useState('')
    const [Vocabulary, setVocabulary] = useState('')
    const handelChange = (value, e) => {
        let data1 = draftToHtml(convertToRaw(value.getCurrentContent()))
        if (e === 1) {
            setEditorData1(value)
            setIntegration(data1)
        }
        else if (e === 2) {
            setEditorData2(value)
            setObjective(data1)
        }
        else if (e === 3) {
            setEditorData3(value)
            setTarget(data1)
        }
        else if (e === 4) {
            setEditorData4(value)
            setPrep(data1)
        }
        else if (e === 5) {
            setEditorData5(value)
            setQuestions(data1)
        }
        else if (e === 6) {
            setEditorData6(value)
            setCompetencies(data1)
        }
        else if (e === 7) {
            setEditorData7(value)
            setSet(data1)
        }
        else if (e === 8) {
            setEditorData8(value)
            setSparkItUp(data1)
        }
        else if (e === 9) {
            setEditorData9(value)
            setAlignment(data1)
        }
        else if (e === 10) {
            setEditorData10(value)
            setTeach(data1)
        }
        else if (e === 11) {
            setEditorData11(value)
            setCues(data1)
        }
        else if (e === 12) {
            setEditorData12(value)
            setSuggestion(data1)
        }
        else if (e === 13) {
            setEditorData13(value)
            setVocabulary(data1)
        }

    }

    return (
        <>
            <style>{css}</style>
            <Side_Navigation />

            <div className="app-container app-theme-white body-tabs-shadow fixed-sidebar fixed-header">

                <div className="app-main">

                    <div className="main-content" style={{ marginBottom: "9px" }}>
                        <section className="section">
                            <div className="section-header">
                                <h1>Lesson</h1>
                            </div>

                            <div className="section-body">
                                <div className="row">
                                    <div className="col-12">
                                        <div className="card">
                                            <div className="card-header d-Fle">
                                                <h4></h4>
                                                <a onClick={handleShow1} style={{ cursor: "pointer" }}>Add Lesson</a>
                                            </div>
                                            <div className="card-body">
                                                <div className="table-responsive newPc">


                                                    {getLoader === true ? <Loader /> : <Box sx={{ height: 650, width: '100%' }}>
                                                        {!LessonPlans.length ? <h3>No Data Found!</h3> : null}
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


            <Modal show={showEditLessonPlans} onHide={handleClose} keyboard={false}>
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
                            suboption_id: location.state.suboption_id,
                            lesson_id: getDetail.id,
                            lesson_name: getDetail.lesson_name,
                            integration: getDetail.integration,
                            lesson_objective: getDetail.lesson_objective,
                            lesson_target: getDetail.lesson_target,
                            prep: getDetail.prep,
                            reflection_question: getDetail.reflection_question,
                            sel_compentencies: getDetail.sel_compentencies,
                            lesson_set: getDetail.lesson_set,
                            spark_it_up: getDetail.spark_it_up,
                            standards_alignment: getDetail.standards_alignment,
                            teach: getDetail.teach,
                            teaching_cues: getDetail.teaching_cues,
                            teaching_suggestions: getDetail.teaching_suggestions,
                            vocabulary: getDetail.vocabulary,
                        }}

                        validationSchema={Yup.object({
                            lesson_name: Yup.string().required("Required"),
                            // integration: Yup.string().required("Required"),
                            // lesson_objective: Yup.string().required("Required"),
                            // lesson_target: Yup.string().required("Required"),
                            // prep: Yup.string().required("Required"),
                            // reflection_question: Yup.string().required("Required"),
                            // sel_compentencies: Yup.string().required("Required"),
                            // lesson_set: Yup.string().required("Required"),
                            // spark_it_up: Yup.string().required("Required"),
                            // standards_alignment: Yup.string().required("Required"),
                            // teach: Yup.string().required("Required"),
                            // teaching_cues: Yup.string().required("Required"),
                            // teaching_suggestions: Yup.string().required("Required"),
                            // vocabulary: Yup.string().required("Required"),
                        })}
                        onSubmit={(values, { resetForm }) => {
                            let formData = new FormData();

                            formData.append("curriculum_id", values.curriculum_id)
                            formData.append("suboption_id", values.suboption_id)
                            formData.append("lesson_id", values.lesson_id)
                            formData.append("lesson_name", values.lesson_name)
                            formData.append("integration", Integration)
                            formData.append("lesson_objective", Objective)
                            formData.append("lesson_target", Target)
                            formData.append("prep", Prep)
                            formData.append("reflection_question", Questions)
                            formData.append("sel_compentencies", Competencies)
                            formData.append("lesson_set", Set)
                            formData.append("spark_it_up", SparkItUp)
                            formData.append("standards_alignment", Alignment)
                            formData.append("teach", Teach)
                            formData.append("teaching_cues", Cues)
                            formData.append("teaching_suggestions", Suggestion)
                            formData.append("vocabulary", Vocabulary)
                            if (getImage.pictureAsFile) {
                                formData.append("image_url", getImage.pictureAsFile)
                            }
                            setbutton(true);
                            console.log(values);

                            edit_lesson(formData)
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
                                    get_lessons({ curriculum_id: location.state.curriculum_id, suboption_id: location.state.suboption_id }).
                                        then((res) => {
                                            console.log("=======>", res.data.result)

                                            setLessonPlans(res.data.result.map((el, index) => ({ ...el, id: el.lesson_id, i: index })))
                                            setLoader(false);

                                        }).catch((err) => {
                                            console.log(err);
                                        })
                                    setImage({})
                                    setImageUrl("")
                                    setShowEditLessonPlans(false)
                                    setbutton(false);
                                    setEditorData1("")
                                    setIntegration("")
                                    setEditorData2("")
                                    setObjective("")
                                    setEditorData3("")
                                    setTarget("")
                                    setEditorData4("")
                                    setPrep("")
                                    setEditorData5("")
                                    setQuestions("")
                                    setEditorData6("")
                                    setCompetencies("")
                                    setEditorData7("")
                                    setSet("")
                                    setEditorData8("")
                                    setSparkItUp("")
                                    setEditorData9("")
                                    setAlignment("")
                                    setEditorData10("")
                                    setTeach("")
                                    setEditorData11("")
                                    setCues("")
                                    setEditorData12("")
                                    setSuggestion("")
                                    setEditorData13("")
                                    setVocabulary("")

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
                                    setImage({})
                                    setImageUrl("")
                                    setbutton(false);
                                    setEditorData1("")
                                    setIntegration("")
                                    setEditorData2("")
                                    setObjective("")
                                    setEditorData3("")
                                    setTarget("")
                                    setEditorData4("")
                                    setPrep("")
                                    setEditorData5("")
                                    setQuestions("")
                                    setEditorData6("")
                                    setCompetencies("")
                                    setEditorData7("")
                                    setSet("")
                                    setEditorData8("")
                                    setSparkItUp("")
                                    setEditorData9("")
                                    setAlignment("")
                                    setEditorData10("")
                                    setTeach("")
                                    setEditorData11("")
                                    setCues("")
                                    setEditorData12("")
                                    setSuggestion("")
                                    setEditorData13("")
                                    setVocabulary("")

                                });
                        }}
                    >
                        <Form>
                            <div className="modal-body">
                                <div className="row">

                                    <div className="col-lg-4 col-md-12 col-sm-12">
                                        <div className="form-group">
                                            <label>Name</label>
                                            <MyTextInput type="text" className="form-control" name="lesson_name" />
                                        </div>
                                    </div>
                                    <div className="col-lg-12 col-md-12 col-sm-12">
                                        <div className="form-group spo">
                                            <label>Integration</label>
                                            {console.log("===========aaaaa====>", editorData1)}
                                            <Editor
                                                toolbarClassName="toolbarClassName"
                                                wrapperClassName="wrapperClassName"
                                                editorClassName="editorClassName"
                                                wrapperStyle={{
                                                    border: "1px solid #d6d6d6",
                                                    padding: 10,
                                                    borderRadius: 10
                                                }}
                                                toolbarStyle={{
                                                    border: 0,
                                                    borderBottom: "1px solid #d6d6d6"
                                                }}
                                                editorState={editorData1}
                                                onEditorStateChange={(value) => handelChange(value, 1)}
                                            // onBlur={() => helpers.setTouched(true)}
                                            />
                                            {/* <MyTextEditor type="text" className="form-control" name="integration" />                                                 */}
                                        </div>
                                    </div>
                                    <div className="col-lg-12 col-md-12 col-sm-12">
                                        <div className="form-group">
                                            <label>Lesson Objective</label>
                                            <Editor
                                                toolbarClassName="toolbarClassName"
                                                wrapperClassName="wrapperClassName"
                                                editorClassName="editorClassName"
                                                wrapperStyle={{
                                                    border: "1px solid #d6d6d6",
                                                    padding: 10,
                                                    borderRadius: 10
                                                }}
                                                toolbarStyle={{
                                                    border: 0,
                                                    borderBottom: "1px solid #d6d6d6"
                                                }}
                                                editorState={editorData2}
                                                onEditorStateChange={(value) => handelChange(value, 2)}
                                            // onBlur={() => helpers.setTouched(true)}
                                            />
                                            {/* <MyTextArea type="text" className="form-control" name="lesson_objective" /> */}
                                        </div>
                                    </div>
                                    <div className="col-lg-12 col-md-12 col-sm-12">
                                        <div className="form-group">
                                            <label>Lesson Target</label>
                                            <Editor
                                                toolbarClassName="toolbarClassName"
                                                wrapperClassName="wrapperClassName"
                                                editorClassName="editorClassName"
                                                wrapperStyle={{
                                                    border: "1px solid #d6d6d6",
                                                    padding: 10,
                                                    borderRadius: 10
                                                }}
                                                toolbarStyle={{
                                                    border: 0,
                                                    borderBottom: "1px solid #d6d6d6"
                                                }}
                                                editorState={editorData3}
                                                onEditorStateChange={(value) => handelChange(value, 3)}
                                            // onBlur={() => helpers.setTouched(true)}
                                            />
                                            {/* <MyTextArea type="text" className="form-control" name="lesson_target" /> */}
                                        </div>
                                    </div>
                                    <div className="col-lg-12 col-md-12 col-sm-12">
                                        <div className="form-group">
                                            <label>Prep</label>
                                            <Editor
                                                toolbarClassName="toolbarClassName"
                                                wrapperClassName="wrapperClassName"
                                                editorClassName="editorClassName"
                                                wrapperStyle={{
                                                    border: "1px solid #d6d6d6",
                                                    padding: 10,
                                                    borderRadius: 10
                                                }}
                                                toolbarStyle={{
                                                    border: 0,
                                                    borderBottom: "1px solid #d6d6d6"
                                                }}
                                                editorState={editorData4}
                                                onEditorStateChange={(value) => handelChange(value, 4)}
                                            // onBlur={() => helpers.setTouched(true)}
                                            />
                                            {/* <MyTextArea type="text" className="form-control" name="prep" /> */}
                                        </div>
                                    </div>
                                    <div className="col-lg-12 col-md-12 col-sm-12">
                                        <div className="form-group">
                                            <label>Reflection Question</label>
                                            <Editor
                                                toolbarClassName="toolbarClassName"
                                                wrapperClassName="wrapperClassName"
                                                editorClassName="editorClassName"
                                                wrapperStyle={{
                                                    border: "1px solid #d6d6d6",
                                                    padding: 10,
                                                    borderRadius: 10
                                                }}
                                                toolbarStyle={{
                                                    border: 0,
                                                    borderBottom: "1px solid #d6d6d6"
                                                }}
                                                editorState={editorData5}
                                                onEditorStateChange={(value) => handelChange(value, 5)}
                                            // onBlur={() => helpers.setTouched(true)}
                                            />
                                            {/* <MyTextArea type="text" className="form-control" name="reflection_question" /> */}
                                        </div>
                                    </div>
                                    <div className="col-lg-12 col-md-12 col-sm-12">
                                        <div className="form-group">
                                            <label>Competencies</label>
                                            <Editor
                                                toolbarClassName="toolbarClassName"
                                                wrapperClassName="wrapperClassName"
                                                editorClassName="editorClassName"
                                                wrapperStyle={{
                                                    border: "1px solid #d6d6d6",
                                                    padding: 10,
                                                    borderRadius: 10
                                                }}
                                                toolbarStyle={{
                                                    border: 0,
                                                    borderBottom: "1px solid #d6d6d6"
                                                }}
                                                editorState={editorData6}
                                                onEditorStateChange={(value) => handelChange(value, 6)}
                                            // onBlur={() => helpers.setTouched(true)}
                                            />
                                            {/* <MyTextArea type="text" className="form-control" name="sel_compentencies" /> */}
                                        </div>
                                    </div>
                                    <div className="col-lg-12 col-md-12 col-sm-12">
                                        <div className="form-group">
                                            <label>Lesson Set</label>
                                            <Editor
                                                toolbarClassName="toolbarClassName"
                                                wrapperClassName="wrapperClassName"
                                                editorClassName="editorClassName"
                                                wrapperStyle={{
                                                    border: "1px solid #d6d6d6",
                                                    padding: 10,
                                                    borderRadius: 10
                                                }}
                                                toolbarStyle={{
                                                    border: 0,
                                                    borderBottom: "1px solid #d6d6d6"
                                                }}
                                                editorState={editorData7}
                                                onEditorStateChange={(value) => handelChange(value, 7)}
                                            // onBlur={() => helpers.setTouched(true)}
                                            />
                                            {/* <MyTextArea type="text" className="form-control" name="lesson_set" /> */}
                                        </div>
                                    </div>
                                    <div className="col-lg-12 col-md-12 col-sm-12">
                                        <div className="form-group">
                                            <label>Spark It Up</label>
                                            <Editor
                                                toolbarClassName="toolbarClassName"
                                                wrapperClassName="wrapperClassName"
                                                editorClassName="editorClassName"
                                                wrapperStyle={{
                                                    border: "1px solid #d6d6d6",
                                                    padding: 10,
                                                    borderRadius: 10
                                                }}
                                                toolbarStyle={{
                                                    border: 0,
                                                    borderBottom: "1px solid #d6d6d6"
                                                }}
                                                editorState={editorData8}
                                                onEditorStateChange={(value) => handelChange(value, 8)}
                                            // onBlur={() => helpers.setTouched(true)}
                                            />
                                            {/* <MyTextArea type="text" className="form-control" name="spark_it_up" /> */}
                                        </div>
                                    </div>
                                    <div className="col-lg-12 col-md-12 col-sm-12">
                                        <div className="form-group">
                                            <label>Standard Alignment</label>
                                            <Editor
                                                toolbarClassName="toolbarClassName"
                                                wrapperClassName="wrapperClassName"
                                                editorClassName="editorClassName"
                                                wrapperStyle={{
                                                    border: "1px solid #d6d6d6",
                                                    padding: 10,
                                                    borderRadius: 10
                                                }}
                                                toolbarStyle={{
                                                    border: 0,
                                                    borderBottom: "1px solid #d6d6d6"
                                                }}
                                                editorState={editorData9}
                                                onEditorStateChange={(value) => handelChange(value, 9)}
                                            // onBlur={() => helpers.setTouched(true)}
                                            />
                                            {/* <MyTextArea type="text" className="form-control" name="standards_alignment" /> */}
                                        </div>
                                    </div>
                                    <div className="col-lg-12 col-md-12 col-sm-12">
                                        <div className="form-group">
                                            <label>Teach</label>
                                            <Editor
                                                toolbarClassName="toolbarClassName"
                                                wrapperClassName="wrapperClassName"
                                                editorClassName="editorClassName"
                                                wrapperStyle={{
                                                    border: "1px solid #d6d6d6",
                                                    padding: 10,
                                                    borderRadius: 10
                                                }}
                                                toolbarStyle={{
                                                    border: 0,
                                                    borderBottom: "1px solid #d6d6d6"
                                                }}
                                                editorState={editorData10}
                                                onEditorStateChange={(value) => handelChange(value, 10)}
                                            // onBlur={() => helpers.setTouched(true)}
                                            />
                                            {/* <MyTextArea type="text" className="form-control" name="teach" /> */}
                                        </div>
                                    </div>
                                    <div className="col-lg-12 col-md-12 col-sm-12">
                                        <div className="form-group">
                                            <label>Teaching Cues</label>
                                            <Editor
                                                toolbarClassName="toolbarClassName"
                                                wrapperClassName="wrapperClassName"
                                                editorClassName="editorClassName"
                                                wrapperStyle={{
                                                    border: "1px solid #d6d6d6",
                                                    padding: 10,
                                                    borderRadius: 10
                                                }}
                                                toolbarStyle={{
                                                    border: 0,
                                                    borderBottom: "1px solid #d6d6d6"
                                                }}
                                                editorState={editorData11}
                                                onEditorStateChange={(value) => handelChange(value, 11)}
                                            // onBlur={() => helpers.setTouched(true)}
                                            />
                                            {/* <MyTextArea type="text" className="form-control" name="teaching_cues" /> */}
                                        </div>
                                    </div>
                                    <div className="col-lg-12 col-md-12 col-sm-12">
                                        <div className="form-group">
                                            <label>Teaching Suggestions</label>
                                            <Editor
                                                toolbarClassName="toolbarClassName"
                                                wrapperClassName="wrapperClassName"
                                                editorClassName="editorClassName"
                                                wrapperStyle={{
                                                    border: "1px solid #d6d6d6",
                                                    padding: 10,
                                                    borderRadius: 10
                                                }}
                                                toolbarStyle={{
                                                    border: 0,
                                                    borderBottom: "1px solid #d6d6d6"
                                                }}
                                                editorState={editorData12}
                                                onEditorStateChange={(value) => handelChange(value, 12)}
                                            // onBlur={() => helpers.setTouched(true)}
                                            />
                                            {/* <MyTextArea type="text" className="form-control" name="teaching_suggestions" /> */}
                                        </div>
                                    </div>
                                    <div className="col-lg-12 col-md-12 col-sm-12">
                                        <div className="form-group">
                                            <label>Vocabulary</label>
                                            <Editor
                                                toolbarClassName="toolbarClassName"
                                                wrapperClassName="wrapperClassName"
                                                editorClassName="editorClassName"
                                                wrapperStyle={{
                                                    border: "1px solid #d6d6d6",
                                                    padding: 10,
                                                    borderRadius: 10
                                                }}
                                                toolbarStyle={{
                                                    border: 0,
                                                    borderBottom: "1px solid #d6d6d6"
                                                }}
                                                editorState={editorData13}
                                                onEditorStateChange={(value) => handelChange(value, 13)}
                                            // onBlur={() => helpers.setTouched(true)}
                                            />
                                            {/* <MyTextArea type="text" className="form-control" name="vocabulary" /> */}
                                        </div>
                                    </div>
                                    <div className="col-lg-6 col-md-12 col-sm-12">
                                        <div className="form-group">
                                            <label>Image</label>

                                            <input
                                                type="file"
                                                accept="image/*"
                                                className="form-control"
                                                name="image_url"
                                                onChange={(e) => onHandle(e)}
                                            />
                                            {getImageUrl != "" ? <img src={getImageUrl} className=" w-30 p-3" alt="" /> : null}
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



            {/* Modal Add LessonPlans */}
            <Modal show={showAddLessonPlans} onHide={handleClose1} keyboard={false}>
                <Modal.Header>
                    <Modal.Title>Add Lesson</Modal.Title>
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
                            suboption_id: location.state.suboption_id,
                            lesson_name: "",
                            integration: '',
                            lesson_objective: "",
                            lesson_target: "",
                            prep: "",
                            reflection_question: "",
                            sel_compentencies: "",
                            lesson_set: "",
                            spark_it_up: "",
                            standards_alignment: "",
                            teach: "",
                            teaching_cues: "",
                            teaching_suggestions: "",
                            vocabulary: "",
                        }}

                        validationSchema={Yup.object({
                            lesson_name: Yup.string().required("Required"),
                            // integration: Yup.string().required("Required"),
                            // lesson_objective: Yup.string().required("Required"),
                            // lesson_target: Yup.string().required("Required"),
                            // prep: Yup.string().required("Required"),
                            // reflection_question: Yup.string().required("Required"),
                            // sel_compentencies: Yup.string().required("Required"),
                            // lesson_set: Yup.string().required("Required"),
                            // spark_it_up: Yup.string().required("Required"),
                            // standards_alignment: Yup.string().required("Required"),
                            // teach: Yup.string().required("Required"),
                            // teaching_cues: Yup.string().required("Required"),
                            // teaching_suggestions: Yup.string().required("Required"),
                            // vocabulary: Yup.string().required("Required"),
                        })}

                        onSubmit={(values, { resetForm }) => {
                            console.log("=========>", values);

                            let formData = new FormData();

                            formData.append("curriculum_id", values.curriculum_id)
                            formData.append("suboption_id", values.suboption_id)
                            formData.append("lesson_name", values.lesson_name)
                            formData.append("integration", Integration)
                            formData.append("lesson_objective", Objective)
                            formData.append("lesson_target", Target)
                            formData.append("prep", Prep)
                            formData.append("reflection_question", Questions)
                            formData.append("sel_compentencies", Competencies)
                            formData.append("lesson_set", Set)
                            formData.append("spark_it_up", SparkItUp)
                            formData.append("standards_alignment", Alignment)
                            formData.append("teach", Teach)
                            formData.append("teaching_cues", Cues)
                            formData.append("teaching_suggestions", Suggestion)
                            formData.append("vocabulary", Vocabulary)
                            if (getImage.pictureAsFile) {
                                formData.append("image_url", getImage.pictureAsFile)
                            }
                            setbutton(true);

                            console.log('formData = ', formData)
                            add_lesson(formData)
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

                                    get_lessons({ curriculum_id: location.state.curriculum_id, suboption_id: location.state.suboption_id }).
                                        then((res) => {
                                            console.log("=======>", res.data.result)

                                            setLessonPlans(res.data.result.map((el, index) => ({ ...el, id: el.lesson_id, i: index })))
                                            setLoader(false);

                                        }).catch((err) => {
                                            console.log(err);
                                        })
                                    setImage({})
                                    setImageUrl("")
                                    setShowAddLessonPlans(false);
                                    setbutton(false);
                                    setEditorData1("")
                                    setIntegration("")
                                    setEditorData2("")
                                    setObjective("")
                                    setEditorData3("")
                                    setTarget("")
                                    setEditorData4("")
                                    setPrep("")
                                    setEditorData5("")
                                    setQuestions("")
                                    setEditorData6("")
                                    setCompetencies("")
                                    setEditorData7("")
                                    setSet("")
                                    setEditorData8("")
                                    setSparkItUp("")
                                    setEditorData9("")
                                    setAlignment("")
                                    setEditorData10("")
                                    setTeach("")
                                    setEditorData11("")
                                    setCues("")
                                    setEditorData12("")
                                    setSuggestion("")
                                    setEditorData13("")
                                    setVocabulary("")

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

                                    }
                                    setbutton(false);
                                    setImage({})
                                    setImageUrl("")
                                    setEditorData1("")
                                    setIntegration("")
                                    setEditorData2("")
                                    setObjective("")
                                    setEditorData3("")
                                    setTarget("")
                                    setEditorData4("")
                                    setPrep("")
                                    setEditorData5("")
                                    setQuestions("")
                                    setEditorData6("")
                                    setCompetencies("")
                                    setEditorData7("")
                                    setSet("")
                                    setEditorData8("")
                                    setSparkItUp("")
                                    setEditorData9("")
                                    setAlignment("")
                                    setEditorData10("")
                                    setTeach("")
                                    setEditorData11("")
                                    setCues("")
                                    setEditorData12("")
                                    setSuggestion("")
                                    setEditorData13("")
                                    setVocabulary("")
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
                                                <MyTextInput type="text" className="form-control" name="lesson_name" />
                                            </div>
                                        </div>
                                        <div className="col-lg-12 col-md-12 col-sm-12">
                                            <div className="form-group spo">
                                                <label>Integration</label>
                                                <Editor
                                                    toolbarClassName="toolbarClassName"
                                                    wrapperClassName="wrapperClassName"
                                                    editorClassName="editorClassName"
                                                    wrapperStyle={{
                                                        border: "1px solid #d6d6d6",
                                                        padding: 10,
                                                        borderRadius: 10
                                                    }}
                                                    toolbarStyle={{
                                                        border: 0,
                                                        borderBottom: "1px solid #d6d6d6"
                                                    }}
                                                    editorState={editorData1}
                                                    onEditorStateChange={(value) => handelChange(value, 1)}
                                                // onBlur={() => helpers.setTouched(true)}
                                                />
                                                {/* <MyTextEditor type="text" className="form-control" name="integration" />                                                 */}
                                            </div>
                                        </div>
                                        <div className="col-lg-12 col-md-12 col-sm-12">
                                            <div className="form-group">
                                                <label>Lesson Objective</label>
                                                <Editor
                                                    toolbarClassName="toolbarClassName"
                                                    wrapperClassName="wrapperClassName"
                                                    editorClassName="editorClassName"
                                                    wrapperStyle={{
                                                        border: "1px solid #d6d6d6",
                                                        padding: 10,
                                                        borderRadius: 10
                                                    }}
                                                    toolbarStyle={{
                                                        border: 0,
                                                        borderBottom: "1px solid #d6d6d6"
                                                    }}
                                                    editorState={editorData2}
                                                    onEditorStateChange={(value) => handelChange(value, 2)}
                                                // onBlur={() => helpers.setTouched(true)}
                                                />
                                                {/* <MyTextArea type="text" className="form-control" name="lesson_objective" /> */}
                                            </div>
                                        </div>
                                        <div className="col-lg-12 col-md-12 col-sm-12">
                                            <div className="form-group">
                                                <label>Lesson Target</label>
                                                <Editor
                                                    toolbarClassName="toolbarClassName"
                                                    wrapperClassName="wrapperClassName"
                                                    editorClassName="editorClassName"
                                                    wrapperStyle={{
                                                        border: "1px solid #d6d6d6",
                                                        padding: 10,
                                                        borderRadius: 10
                                                    }}
                                                    toolbarStyle={{
                                                        border: 0,
                                                        borderBottom: "1px solid #d6d6d6"
                                                    }}
                                                    editorState={editorData3}
                                                    onEditorStateChange={(value) => handelChange(value, 3)}
                                                // onBlur={() => helpers.setTouched(true)}
                                                />
                                                {/* <MyTextArea type="text" className="form-control" name="lesson_target" /> */}
                                            </div>
                                        </div>
                                        <div className="col-lg-12 col-md-12 col-sm-12">
                                            <div className="form-group">
                                                <label>Prep</label>
                                                <Editor
                                                    toolbarClassName="toolbarClassName"
                                                    wrapperClassName="wrapperClassName"
                                                    editorClassName="editorClassName"
                                                    wrapperStyle={{
                                                        border: "1px solid #d6d6d6",
                                                        padding: 10,
                                                        borderRadius: 10
                                                    }}
                                                    toolbarStyle={{
                                                        border: 0,
                                                        borderBottom: "1px solid #d6d6d6"
                                                    }}
                                                    editorState={editorData4}
                                                    onEditorStateChange={(value) => handelChange(value, 4)}
                                                // onBlur={() => helpers.setTouched(true)}
                                                />
                                                {/* <MyTextArea type="text" className="form-control" name="prep" /> */}
                                            </div>
                                        </div>
                                        <div className="col-lg-12 col-md-12 col-sm-12">
                                            <div className="form-group">
                                                <label>Reflection Question</label>
                                                <Editor
                                                    toolbarClassName="toolbarClassName"
                                                    wrapperClassName="wrapperClassName"
                                                    editorClassName="editorClassName"
                                                    wrapperStyle={{
                                                        border: "1px solid #d6d6d6",
                                                        padding: 10,
                                                        borderRadius: 10
                                                    }}
                                                    toolbarStyle={{
                                                        border: 0,
                                                        borderBottom: "1px solid #d6d6d6"
                                                    }}
                                                    editorState={editorData5}
                                                    onEditorStateChange={(value) => handelChange(value, 5)}
                                                // onBlur={() => helpers.setTouched(true)}
                                                />
                                                {/* <MyTextArea type="text" className="form-control" name="reflection_question" /> */}
                                            </div>
                                        </div>
                                        <div className="col-lg-12 col-md-12 col-sm-12">
                                            <div className="form-group">
                                                <label>Competencies</label>
                                                <Editor
                                                    toolbarClassName="toolbarClassName"
                                                    wrapperClassName="wrapperClassName"
                                                    editorClassName="editorClassName"
                                                    wrapperStyle={{
                                                        border: "1px solid #d6d6d6",
                                                        padding: 10,
                                                        borderRadius: 10
                                                    }}
                                                    toolbarStyle={{
                                                        border: 0,
                                                        borderBottom: "1px solid #d6d6d6"
                                                    }}
                                                    editorState={editorData6}
                                                    onEditorStateChange={(value) => handelChange(value, 6)}
                                                // onBlur={() => helpers.setTouched(true)}
                                                />
                                                {/* <MyTextArea type="text" className="form-control" name="sel_compentencies" /> */}
                                            </div>
                                        </div>
                                        <div className="col-lg-12 col-md-12 col-sm-12">
                                            <div className="form-group">
                                                <label>Lesson Set</label>
                                                <Editor
                                                    toolbarClassName="toolbarClassName"
                                                    wrapperClassName="wrapperClassName"
                                                    editorClassName="editorClassName"
                                                    wrapperStyle={{
                                                        border: "1px solid #d6d6d6",
                                                        padding: 10,
                                                        borderRadius: 10
                                                    }}
                                                    toolbarStyle={{
                                                        border: 0,
                                                        borderBottom: "1px solid #d6d6d6"
                                                    }}
                                                    editorState={editorData7}
                                                    onEditorStateChange={(value) => handelChange(value, 7)}
                                                // onBlur={() => helpers.setTouched(true)}
                                                />
                                                {/* <MyTextArea type="text" className="form-control" name="lesson_set" /> */}
                                            </div>
                                        </div>
                                        <div className="col-lg-12 col-md-12 col-sm-12">
                                            <div className="form-group">
                                                <label>Spark It Up</label>
                                                <Editor
                                                    toolbarClassName="toolbarClassName"
                                                    wrapperClassName="wrapperClassName"
                                                    editorClassName="editorClassName"
                                                    wrapperStyle={{
                                                        border: "1px solid #d6d6d6",
                                                        padding: 10,
                                                        borderRadius: 10
                                                    }}
                                                    toolbarStyle={{
                                                        border: 0,
                                                        borderBottom: "1px solid #d6d6d6"
                                                    }}
                                                    editorState={editorData8}
                                                    onEditorStateChange={(value) => handelChange(value, 8)}
                                                // onBlur={() => helpers.setTouched(true)}
                                                />
                                                {/* <MyTextArea type="text" className="form-control" name="spark_it_up" /> */}
                                            </div>
                                        </div>
                                        <div className="col-lg-12 col-md-12 col-sm-12">
                                            <div className="form-group">
                                                <label>Standard Alignment</label>
                                                <Editor
                                                    toolbarClassName="toolbarClassName"
                                                    wrapperClassName="wrapperClassName"
                                                    editorClassName="editorClassName"
                                                    wrapperStyle={{
                                                        border: "1px solid #d6d6d6",
                                                        padding: 10,
                                                        borderRadius: 10
                                                    }}
                                                    toolbarStyle={{
                                                        border: 0,
                                                        borderBottom: "1px solid #d6d6d6"
                                                    }}
                                                    editorState={editorData9}
                                                    onEditorStateChange={(value) => handelChange(value, 9)}
                                                // onBlur={() => helpers.setTouched(true)}
                                                />
                                                {/* <MyTextArea type="text" className="form-control" name="standards_alignment" /> */}
                                            </div>
                                        </div>
                                        <div className="col-lg-12 col-md-12 col-sm-12">
                                            <div className="form-group">
                                                <label>Teach</label>
                                                <Editor
                                                    toolbarClassName="toolbarClassName"
                                                    wrapperClassName="wrapperClassName"
                                                    editorClassName="editorClassName"
                                                    wrapperStyle={{
                                                        border: "1px solid #d6d6d6",
                                                        padding: 10,
                                                        borderRadius: 10
                                                    }}
                                                    toolbarStyle={{
                                                        border: 0,
                                                        borderBottom: "1px solid #d6d6d6"
                                                    }}
                                                    editorState={editorData10}
                                                    onEditorStateChange={(value) => handelChange(value, 10)}
                                                // onBlur={() => helpers.setTouched(true)}
                                                />
                                                {/* <MyTextArea type="text" className="form-control" name="teach" /> */}
                                            </div>
                                        </div>
                                        <div className="col-lg-12 col-md-12 col-sm-12">
                                            <div className="form-group">
                                                <label>Teaching Cues</label>
                                                <Editor
                                                    toolbarClassName="toolbarClassName"
                                                    wrapperClassName="wrapperClassName"
                                                    editorClassName="editorClassName"
                                                    wrapperStyle={{
                                                        border: "1px solid #d6d6d6",
                                                        padding: 10,
                                                        borderRadius: 10
                                                    }}
                                                    toolbarStyle={{
                                                        border: 0,
                                                        borderBottom: "1px solid #d6d6d6"
                                                    }}
                                                    editorState={editorData11}
                                                    onEditorStateChange={(value) => handelChange(value, 11)}
                                                // onBlur={() => helpers.setTouched(true)}
                                                />
                                                {/* <MyTextArea type="text" className="form-control" name="teaching_cues" /> */}
                                            </div>
                                        </div>
                                        <div className="col-lg-12 col-md-12 col-sm-12">
                                            <div className="form-group">
                                                <label>Teaching Suggestions</label>
                                                <Editor
                                                    toolbarClassName="toolbarClassName"
                                                    wrapperClassName="wrapperClassName"
                                                    editorClassName="editorClassName"
                                                    wrapperStyle={{
                                                        border: "1px solid #d6d6d6",
                                                        padding: 10,
                                                        borderRadius: 10
                                                    }}
                                                    toolbarStyle={{
                                                        border: 0,
                                                        borderBottom: "1px solid #d6d6d6"
                                                    }}
                                                    editorState={editorData12}
                                                    onEditorStateChange={(value) => handelChange(value, 12)}
                                                // onBlur={() => helpers.setTouched(true)}
                                                />
                                                {/* <MyTextArea type="text" className="form-control" name="teaching_suggestions" /> */}
                                            </div>
                                        </div>
                                        <div className="col-lg-12 col-md-12 col-sm-12">
                                            <div className="form-group">
                                                <label>Vocabulary</label>
                                                <Editor
                                                    toolbarClassName="toolbarClassName"
                                                    wrapperClassName="wrapperClassName"
                                                    editorClassName="editorClassName"
                                                    wrapperStyle={{
                                                        border: "1px solid #d6d6d6",
                                                        padding: 10,
                                                        borderRadius: 10
                                                    }}
                                                    toolbarStyle={{
                                                        border: 0,
                                                        borderBottom: "1px solid #d6d6d6"
                                                    }}
                                                    editorState={editorData13}
                                                    onEditorStateChange={(value) => handelChange(value, 13)}
                                                // onBlur={() => helpers.setTouched(true)}
                                                />
                                                {/* <MyTextArea type="text" className="form-control" name="vocabulary" /> */}
                                            </div>
                                        </div>
                                        <div className="col-lg-6 col-md-12 col-sm-12">
                                            <div className="form-group">
                                                <label>Image</label>

                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    className="form-control"
                                                    name="image_url"
                                                    onChange={(e) => onHandle(e)}
                                                    required
                                                />
                                                {getImageUrl != "" ? <img src={getImageUrl} className=" w-30 p-3" alt="" /> : null}
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
            {/* Ends Add LessonPlans */}


            <Footer />



        </>
    )
}
