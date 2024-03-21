import React, { useEffect, useMemo, useState } from "react";
import Side_Navigation from "./Side_Navigation";
import { DataGrid } from "@mui/x-data-grid";
import Box from "@mui/material/Box";
import {
  add_afterLesson,
  add_earlyChild,
  add_HighLesson,
  add_lesson,
  delete_lesson,
  deleteCustomLessonPlan,
  edit_afterLesson,
  edit_earlyChild,
  edit_HighLesson,
  edit_lesson,
  get_lessons,
  getCustomLessonPlan,
  LessonReOrder,
  reOrder
} from "../services/web/webServices";
import { Store } from "react-notifications-component";
import { useLocation, useNavigate } from "react-router-dom";
import { Button, InputLabel, Select, TextField } from "@mui/material";
import { Form, Formik, useFormik } from "formik";
import Modal from "react-bootstrap/Modal";
import {
  MyTextArea,
  MyTextEditor,
  MyTextInput,
} from "../services/web/inputServices";
import * as Yup from "yup";
import { Loader } from "./Helper/Loader";
import Footer from "./Footer";
import moment from "moment/moment";
import {
  ContentState,
  convertFromHTML,
  convertToRaw,
  EditorState,
} from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import draftToHtml from "draftjs-to-html";
import htmlToDraft from "html-to-draftjs";
import { DropdownButton, Dropdown } from "react-bootstrap";
import DynamicForm from "./dynamicForm/dynamicForm";
import { isImage } from "../utils/checkImage";
import {
  MRT_TableContainer,
  useMaterialReactTable,
} from "material-react-table";
import { TablePagination } from "@mui/material";

const css = `
    .sidebar-menu li:nth-child(3) a {
        background:coral;
    }
    .curriculum_format .dropdown-menu{
        position:absolute !important;
        right:0 !important;
        left:auto !important;
        width:auto;
        max-width:500px;
        min-width:500px;
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

    .curriculum_format .card-header.d-Fle a .dropdown-info{
        white-space: normal !important;
    }

    .curriculum_format .card-header.d-Fle a:last-child{
        border-bottom: 0 !important;
    }
    .curriculum_format .card-header.d-Fle a:hover {
        background: #eef4fc !important;
    }

    .curriculum_format .dropdown-menu a.dropdown-item{
        display:flex !important;
        flex-direction:column !important;
        flex-wrap:wrap !important;

    }

    .btn-primary-blue{
        background-color:#1976d2 !important;
        color:#fff !important;
        text-transform: uppercase;
        font-size:14px;
        font-weight:500;
        padding:6px 12px;
        height:40px;
    }

     
  
  .btn-primary-blue:focus:active,.btn-primary-blue:hover{
        background-color:#0d60b2 !important;
    }

    button.custom_hyperlink{
      background-color:none !important;
     }

     button.custom_hyperlink:hover{
      text-decoration:underline !important;
      background-color:none !important;
     }


    .border-btn {
      background: #48aee114;
      padding: 4.5px 12px;
      display: block;
      color: #58555E;
      border-radius: 5px;
      text-decoration: none;
      border: 1px solid #1846b9;
  }
  
  .border-btn:hover {
      background: none;
      border: 1px solid #1846b9;
      color: #58555E;
  }
    `;
export default function CurriculumoLessonPlans() {
  const navigate = useNavigate();

  const [getLoader, setLoader] = useState(true);
  const location = useLocation();
  const [select, setSelection] = useState([]);
  const [LessonPlans, setLessonPlans] = useState([]);
  const [getImage, setImage] = useState({});
  const [getDetail, setDetail] = useState([]);
  const [getImageUrl, setImageUrl] = useState("");
  const [getState, setState] = useState(false);
  const [getbutton, setbutton] = useState(false);
  const [openFormModal, setOpenFormModal] = useState();
  const [openEditFormModal, setOpenEditFormModal] = useState();

  const [ViewModel, setViewModel] = useState(false);
  const [ViewData, setViewData] = useState({});
  const [dynamicFormEditData, setDynamicFormEditData] = useState({});
  const [lessonPlanData, setLessonPlanData] = useState({});
  const [deleteLessonId, setDeleteLessonId] = useState();

  // const formik = useFormik({
  //   initialValues: {
  //     name: "",
  //     type: "",
  //     label: "",
  //   },
  //   onSubmit: (values) => {},
  // });

  const convertHtmlToDraft = (data) => {
    if (data) {
      const blocksFromHTML = htmlToDraft(data);
      const contentState = ContentState.createFromBlockArray(
        blocksFromHTML.contentBlocks,
        blocksFromHTML.entityMap
      );
      return EditorState.createWithContent(contentState);
    }
  };

  // Edit LessonPlans Model
  const [showEditLessonPlans, setShowEditLessonPlans] = useState(false);
  const handleClose = () => {
    if (
      window.confirm(
        "Are you sure you want to leave the current page?\nChanges will not be saved until you submit the form!"
      )
    ) {
      setShowEditLessonPlans(false);
      setImage({});
      setImageUrl("");
      setEditorData1("");
      setIntegration("");
      setEditorData2("");
      setObjective("");
      setEditorData3("");
      setTarget("");
      setEditorData4("");
      setPrep("");
      setEditorData5("");
      setQuestions("");
      setEditorData6("");
      setCompetencies("");
      setEditorData7("");
      setSet("");
      setEditorData8("");
      setSparkItUp("");
      setEditorData9("");
      setAlignment("");
      setEditorData10("");
      setTeach("");
      setEditorData11("");
      setCues("");
      setEditorData12("");
      setSuggestion("");
      setEditorData13("");
      setVocabulary("");
      setReady("");
      setGo("");
      setAdaptation("");
      setAcademics("");
      setTeacherTips("");
      setFamilyFun("");
      setLyrics("");
      setMusicCredits("");
      setSafetyFirst("");
      setGameReset("");
      setHomePlay("");
      setTheRightFit("");
      setGuideline("");
      setIntegrationIcon("");
      setKeyWords("");
      setLessonFormat("");
    }
  };
console.log("deleteLessonId",deleteLessonId)
  const handleShow = (e, t) => {
    if (t === 1) {
      setDetail(e);
      setShowEditLessonPlans(true);
      setImageUrl(e.image_url);
      setLessonFormat(e.format);
      setEditorData1(convertHtmlToDraft(e.integration));
      setIntegration(e.integration);
      setEditorData2(convertHtmlToDraft(e.lesson_objective));
      setObjective(e.lesson_objective);
      setEditorData3(convertHtmlToDraft(e.lesson_target));
      setTarget(e.lesson_target);
      setEditorData4(convertHtmlToDraft(e.prep));
      setPrep(e.prep);
      setEditorData5(convertHtmlToDraft(e.reflection_question));
      setQuestions(e.reflection_question);
      setEditorData6(convertHtmlToDraft(e.sel_compentencies));
      setCompetencies(e.sel_compentencies);
      setEditorData7(convertHtmlToDraft(e.lesson_set));
      setSet(e.lesson_set);
      setEditorData8(convertHtmlToDraft(e.spark_it_up));
      setSparkItUp(e.spark_it_up);
      setEditorData9(convertHtmlToDraft(e.standards_alignment));
      setAlignment(e.standards_alignment);
      setEditorData10(convertHtmlToDraft(e.teach));
      setTeach(e.teach);
      setEditorData11(convertHtmlToDraft(e.teaching_cues));
      setCues(e.teaching_cues);
      setEditorData12(convertHtmlToDraft(e.teaching_suggestions));
      setSuggestion(e.teaching_suggestions);
      setEditorData13(
        convertHtmlToDraft(e.vocabulary ? e.vocabulary : "")
      );
      setVocabulary(e.vocabulary ? e.vocabulary : "");
    } else if (t === 2) {
      setDetail(e);
      setShowEditLessonPlans(true);
      setImageUrl(e.image_url);
      setLessonFormat(e.format);
      setEditorData1(convertHtmlToDraft(e.ready));
      setReady(e.ready);
      setEditorData2(convertHtmlToDraft(e.lesson_set));
      setSet(e.lesson_set);
      setEditorData3(convertHtmlToDraft(e.go));
      setGo(e.go);
      setEditorData4(convertHtmlToDraft(e.adaptations));
      setAdaptation(e.adaptations);
      setEditorData5(convertHtmlToDraft(e.objectives));
      setObjective(e.objectives);
      setEditorData6(convertHtmlToDraft(e.academics));
      setAcademics(e.academics);
      setEditorData7(convertHtmlToDraft(e.teacher_tips));
      setTeacherTips(e.teacher_tips);
      setEditorData8(convertHtmlToDraft(e.family_fun));
      setFamilyFun(e.family_fun);
      setEditorData9(convertHtmlToDraft(e.lyrics));
      setLyrics(e.lyrics);
      setEditorData10(convertHtmlToDraft(e.music_credits));
      setMusicCredits(e.music_credits);
    } else if (t === 3) {
      setDetail(e);
      setShowEditLessonPlans(true);
      setImageUrl(e.image_url);
      setLessonFormat(e.format);
      setEditorData1(convertHtmlToDraft(e.ready));
      setReady(e.ready);
      setEditorData2(convertHtmlToDraft(e.lesson_set));
      setSet(e.lesson_set);
      setEditorData3(convertHtmlToDraft(e.go));
      setGo(e.go);
      setEditorData4(convertHtmlToDraft(e.safety_first));
      setSafetyFirst(e.safety_first);
      setEditorData5(convertHtmlToDraft(e.game_reset));
      setGameReset(e.game_reset);
      setEditorData6(convertHtmlToDraft(e.home_play));
      setHomePlay(e.home_play);
      setEditorData7(convertHtmlToDraft(e.the_right_fit));
      setTheRightFit(e.the_right_fit);
      setEditorData8(convertHtmlToDraft(e.guideline_addressed));
      setGuideline(e.guideline_addressed);
    }

    if (t === 4) {
      setDetail(e);
      setShowEditLessonPlans(true);
      setImageUrl(e.image_url);
      setLessonFormat(e.format);
      setEditorData1(convertHtmlToDraft(e.integration));
      setIntegration(e.integration);
      setEditorData2(convertHtmlToDraft(e.lesson_objective));
      setObjective(e.lesson_objective);
      setEditorData3(convertHtmlToDraft(e.lesson_target));
      setTarget(e.lesson_target);
      setEditorData4(convertHtmlToDraft(e.prep));
      setPrep(e.prep);
      setEditorData5(convertHtmlToDraft(e.reflection_question));
      setQuestions(e.reflection_question);
      setEditorData6(convertHtmlToDraft(e.sel_compentencies));
      setCompetencies(e.sel_compentencies);
      setEditorData7(convertHtmlToDraft(e.lesson_set));
      setSet(e.lesson_set);
      setEditorData8(convertHtmlToDraft(e.spark_it_up));
      setSparkItUp(e.spark_it_up);
      setEditorData9(convertHtmlToDraft(e.standards_alignment));
      setAlignment(e.standards_alignment);
      setEditorData10(convertHtmlToDraft(e.teach));
      setTeach(e.teach);
      setEditorData11(convertHtmlToDraft(e.teaching_cues));
      setCues(e.teaching_cues);
      setEditorData12(convertHtmlToDraft(e.teaching_suggestions));
      setSuggestion(e.teaching_suggestions);
      setEditorData13(convertHtmlToDraft(e.integration_icon));
      setIntegrationIcon(e.integration_icon);
      setEditorData13(convertHtmlToDraft(e.key_words));
      setKeyWords(e.key_words);
    }

    if (t === 5) {
      setDynamicFormEditData(e);
      setOpenEditFormModal(true);
    }
  };

  const onHandle = (e) => {
    setImage({
      pictureAsFile: e.target.files[0],
    });
    if (e.target.files[0].type.includes("image")) {
      setState(false);
    } else {
      setState(true);
    }
    setImageUrl(URL.createObjectURL(e.target.files[0]));
  };
  // ends

  // Add LessonPlans Model Function

  const [showAddLessonPlans, setShowAddLessonPlans] = useState(false);
  const handleClose1 = () => {
    if (
      window.confirm(
        "Are you sure you want to leave the current page?\nChanges will not be saved until you submit the form!"
      )
    ) {
      setShowAddLessonPlans(false);
      setImage({});
      setImageUrl("");
      setEditorData1("");
      setIntegration("");
      setEditorData2("");
      setObjective("");
      setEditorData3("");
      setTarget("");
      setEditorData4("");
      setPrep("");
      setEditorData5("");
      setQuestions("");
      setEditorData6("");
      setCompetencies("");
      setEditorData7("");
      setSet("");
      setEditorData8("");
      setSparkItUp("");
      setEditorData9("");
      setAlignment("");
      setEditorData10("");
      setTeach("");
      setEditorData11("");
      setCues("");
      setEditorData12("");
      setSuggestion("");
      setEditorData13("");
      setVocabulary("");
      setReady("");
      setGo("");
      setAdaptation("");
      setAcademics("");
      setTeacherTips("");
      setFamilyFun("");
      setLyrics("");
      setMusicCredits("");
      setSafetyFirst("");
      setGameReset("");
      setHomePlay("");
      setTheRightFit("");
      setGuideline("");
      setIntegrationIcon("");
      setKeyWords("");
      setLessonFormat("");
    }
  };
  // const handleShow1 = (format) => {
  //   console.log(format, "format");
  //   setFormat(format);
  //   setShowAddLessonPlans(true);
  // };
  // Ends
  // let index1=0;
  // const navigate = useNavigate();
  //   Function Hnadle

  // function validate_pic(value) {
  //   let error;
  //   if (!value) {
  //     error = "Required!";
  //     return error;
  //   }
  // }

  
  const getCustomLessons = async () => {
    await getCustomLessonPlan({
      curriculum_id: location.state.curriculum_id,
      suboption_id: location.state.suboption_id,
    })
      .then((res) => {

        setDeleteLessonId(res?.data?.result?.[0]?.id);

        let data = JSON.parse(res?.data?.result?.[0]?.lesson_data);
        let resData = {
          ...res?.data?.result?.[0],
          lesson_data: data,
        };

        setLessonPlanData(resData);

        const re = data.map((el, index) => ({
          ...el,
          id: el.id,
          i: index,
        }));
        console.log(re, "====> re getCustomLessons");
        setLessonPlans(re);
        setData(re)
        setLoader(false);
      })
      .catch((err) => {
        setLoader(false);
        console.log("custom lesson err", err);
      });
  };
  const onDelete = (params) => {
    console.log(params, "onDelete params",deleteLessonId );
    if (window.confirm("Are your sure? You want to delete this?")) {
      let data = {
        id: deleteLessonId,
        lesson_id: params?.id,
      };
      deleteCustomLessonPlan(data)
        .then((res) => {
          getCustomLessons();

          Store.addNotification({
            title: "success",
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
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };
  // ends
  useEffect(() => {
    if (LessonPlans?.length === 0 || location?.state?.reloadLessonPlans) {
      getCustomLessons();

     
    }
  }, []);

  

  const handleView = (data) => {
    setViewData(data);
    setViewModel(true);
  };

  const columns =  [
    {
      header: "S.NO.",
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
      accessorKey: "title",
      header: "Name",
      size: 15,
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
            <Button onClick={() => handleView(params)}>
              <i className="fas fa-eye"></i>
            </Button>
            {console.log("====format")}
            <Button
              onClick={() =>
                handleShow(
                  params,
                  params?.format === "A"
                    ? 1
                    : params?.format === "B"
                      ? 2
                      : params?.format === "C"
                        ? 3
                        : params?.format === "D"
                          ? 4
                          : lessonPlanData?.format === "E"
                            ? 5
                            : null
                )
              }
            >
              <i className="fas fa-edit"></i>
            </Button>
            <Button color="error" onClick={()=>onDelete(params)}>
              <i className="fa fa-trash" aria-hidden="true"></i>
            </Button>
          </>
        );
      },
    },
  ];
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
            curriculum_id: location.state.curriculum_id,
            suboption_id: location.state.suboption_id,          
          };
          console.log("🚀 ~ CurriculumModules ~ data:", data)
          LessonReOrder(data)
            .then((res) => {
              getCustomLessonPlan({
                curriculum_id: location.state.curriculum_id,
                suboption_id: location.state.suboption_id,
              })
                .then((res) => {
                  setDeleteLessonId(res?.data?.result?.[0]?.id);

                  let data = JSON.parse(res?.data?.result?.[0]?.lesson_data);
                  let resData = {
                    ...res?.data?.result?.[0],
                    lesson_data: data,
                  };

                  setLessonPlanData(resData);

                  const re = data.map((el, index) => ({
                    ...el,
                    id: el.id,
                    i: index,
                  }));
                  setLessonPlans(re);
                  setData(re)
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

  const [editorData1, setEditorData1] = useState("");
  const [editorData2, setEditorData2] = useState("");
  const [editorData3, setEditorData3] = useState("");
  const [editorData4, setEditorData4] = useState("");
  const [editorData5, setEditorData5] = useState("");
  const [editorData6, setEditorData6] = useState("");
  const [editorData7, setEditorData7] = useState("");
  const [editorData8, setEditorData8] = useState("");
  const [editorData9, setEditorData9] = useState("");
  const [editorData10, setEditorData10] = useState("");
  const [editorData11, setEditorData11] = useState("");
  const [editorData12, setEditorData12] = useState("");
  const [editorData13, setEditorData13] = useState("");
  const [editorData14, setEditorData14] = useState("");
  const [editorData15, setEditorData15] = useState("");

  const [Format, setFormat] = useState(0);

  const [Integration, setIntegration] = useState("");
  const [Objective, setObjective] = useState("");
  const [Target, setTarget] = useState("");
  const [Prep, setPrep] = useState("");
  const [Questions, setQuestions] = useState("");
  const [Competencies, setCompetencies] = useState("");
  const [Set, setSet] = useState("");
  const [SparkItUp, setSparkItUp] = useState("");
  const [Alignment, setAlignment] = useState("");
  const [Teach, setTeach] = useState("");
  const [Cues, setCues] = useState("");
  const [Suggestion, setSuggestion] = useState("");
  const [Vocabulary, setVocabulary] = useState("");
  const [Ready, setReady] = useState("");
  const [Go, setGo] = useState("");
  const [Adaptation, setAdaptation] = useState("");
  const [Academics, setAcademics] = useState("");
  const [TeacherTips, setTeacherTips] = useState("");
  const [FamilyFun, setFamilyFun] = useState("");
  const [Lyrics, setLyrics] = useState("");
  const [MusicCredits, setMusicCredits] = useState("");
  const [SafetyFirst, setSafetyFirst] = useState("");
  const [GameReset, setGameReset] = useState("");
  const [HomePlay, setHomePlay] = useState("");
  const [TheRightFit, setTheRightFit] = useState("");
  const [Guideline, setGuideline] = useState("");
  const [IntegrationIcon, setIntegrationIcon] = useState("");
  const [KeyWords, setKeyWords] = useState("");
  const [LessonFormat, setLessonFormat] = useState("");

  const handelChange = (value, e, t) => {
    console.log(value, "value");
    let data1 = draftToHtml(convertToRaw(value.getCurrentContent()));
    console.log(data1, "data1");
    if (e === 1) {
      if (t === 1) {
        setIntegration(data1);
      } else if (t === 2) {
        setReady(data1);
      } else if (t === 3) {
        setReady(data1);
      } else if (t === 4) {
        setIntegration(data1);
      }
      setEditorData1(value);
    } else if (e === 2) {
      if (t === 1) {
        setObjective(data1);
      } else if (t === 2) {
        setSet(data1);
      } else if (t === 3) {
        setSet(data1);
      } else if (t === 4) {
        setObjective(data1);
      }
      setEditorData2(value);
    } else if (e === 3) {
      if (t === 1) {
        setTarget(data1);
      } else if (t === 2) {
        setGo(data1);
      } else if (t === 3) {
        setGo(data1);
      } else if (t === 4) {
        setTarget(data1);
      }
      setEditorData3(value);
    } else if (e === 4) {
      if (t === 1) {
        setPrep(data1);
      } else if (t === 2) {
        setAdaptation(data1);
      } else if (t === 3) {
        setSafetyFirst(data1);
      } else if (t === 4) {
        setPrep(data1);
      }
      setEditorData4(value);
    } else if (e === 5) {
      if (t === 1) {
        setQuestions(data1);
      } else if (t === 2) {
        setObjective(data1);
      } else if (t === 3) {
        setGameReset(data1);
      } else if (t === 4) {
        setQuestions(data1);
      }
      setEditorData5(value);
    } else if (e === 6) {
      if (t === 1) {
        setCompetencies(data1);
      } else if (t === 2) {
        setAcademics(data1);
      } else if (t === 3) {
        setHomePlay(data1);
      } else if (t === 4) {
        setCompetencies(data1);
      }
      setEditorData6(value);
    } else if (e === 7) {
      if (t === 1) {
        setSet(data1);
      } else if (t === 2) {
        setTeacherTips(data1);
      } else if (t === 3) {
        setTheRightFit(data1);
      } else if (t === 4) {
        setSet(data1);
      }
      setEditorData7(value);
    } else if (e === 8) {
      if (t === 1) {
        setSparkItUp(data1);
      } else if (t === 2) {
        setFamilyFun(data1);
      } else if (t === 3) {
        setGuideline(data1);
      } else if (t === 4) {
        setSparkItUp(data1);
      }
      setEditorData8(value);
    } else if (e === 9) {
      if (t === 1) {
        setAlignment(data1);
      } else if (t === 2) {
        setLyrics(data1);
      } else if (t === 4) {
        setAlignment(data1);
      }
      setEditorData9(value);
    } else if (e === 10) {
      if (t === 1) {
        setTeach(data1);
      } else if (t === 2) {
        setMusicCredits(data1);
      } else if (t === 4) {
        setTeach(data1);
      }
      setEditorData10(value);
    } else if (e === 11) {
      if (t === 1) {
        setCues(data1);
      } else if (t === 4) {
        setCues(data1);
      }
      setEditorData11(value);
    } else if (e === 12) {
      if (t === 1) {
        setSuggestion(data1);
      } else if (t === 4) {
        setSuggestion(data1);
      }
      setEditorData12(value);
    } else if (e === 13) {
      if (t === 1) {
        setVocabulary(data1);
      } else if (t === 4) {
        setIntegrationIcon(data1);
      }
      setEditorData13(value);
    } else if (e === 14) {
      if (t === 4) {
        setKeyWords(data1);
      }
      setEditorData14(value);
    }
  };

  const onOpenCustomForm = () => {
    setOpenFormModal(true);
  };

  const renderViewData = (item, index) => {
    if (item.key_type === 1) {
      return (
        <tr key={index}>
          <td
            style={{
              border: "2px solid #dddddd",
              textAlign: "left",
              padding: "8px",
            }}
          >
            <span style={{ fontWeight: "500" }}>{item.key}:</span>
          </td>
          <td
            style={{
              border: "2px solid #dddddd",
              textAlign: "left",
              padding: "8px",
            }}
          >
            {item.value}
          </td>
        </tr>
      );
    }
    if (item.key_type === 2) {
      return (
        <tr key={index}>
          <td
            style={{
              border: "2px solid #dddddd",
              textAlign: "left",
              padding: "8px",
            }}
          >
            <span style={{ fontWeight: "500" }}>{item.key}:</span>
          </td>
          <td
            style={{
              border: "2px solid #dddddd",
              textAlign: "left",
              padding: "8px",
            }}
          >
            <img
              src={item.value}
              alt=""
              style={{ height: "50px", width: "50px" }}
            />
          </td>
        </tr>
      );
    }
    if (item.key_type === 3) {
      return (
        <tr key={index}>
          <td
            style={{
              border: "2px solid #dddddd",
              textAlign: "left",
              padding: "8px",
            }}
          >
            <span style={{ fontWeight: "500" }}>{item.key}:</span>
          </td>
          <td
            style={{
              border: "2px solid #dddddd",
              textAlign: "left",
              padding: "8px",
            }}
            dangerouslySetInnerHTML={{ __html: item.value }}
          ></td>
        </tr>
      );
    }
  };

  const TableView = ({ data }) => {
    return (
      <table>
        <thead>
          <tr>
            <th>Key</th>
            <th>Value</th>
            <th>Type</th>
          </tr>
        </thead>
        <tbody>{data.map((item, index) => renderViewData(item, index))}</tbody>
      </table>
    );
  };

  return (
    <>
      <style>{css}</style>
      <Side_Navigation />

      <div className="app-container app-theme-white body-tabs-shadow fixed-sidebar fixed-header">
        <div className="app-main">
          <div className="main-content" style={{ marginBottom: "9px" }}>
            <section className="section">
              <div className="section-header">
                <h1>Lesson Plan</h1>
              </div>

              <div className="section-body">
                <div className="row">
                  <div className="col-12">
                    <div className="card curriculum_format">
                      <div className="card-header d-Fle">
                        <h4></h4>
                        <Button
                          className="border-btn"
                          onClick={onOpenCustomForm}
                        >
                          ADD LESSON PLAN{" "}
                        </Button>
                        {/* <DropdownButton
                          className="custom-btn"
                          title="Add Lesson Plan"
                          id="dropdown-basic-button"
                          onSelect={(selectedOption) =>
                            handleShow1(selectedOption)
                          }
                        >
                          <Dropdown.Item
                            eventKey="1"
                            className="word-wrap d-flex flex-column word-wrap align-items-start"
                          >
                            <b>FORMAT A- </b> <br />{" "}
                            <p className="dropdown-info text-break word-wrap overflow-wrap mb-0 text-break">
                              <i>
                                (Name, Integration, Learning Objective, Learning
                                Target, Prep, Reflection questions, SEL, Set,
                                Spark It Up, Standards, Teach, Teaching cues,
                                Teaching suggestions, Vocabulary, Diagram)
                              </i>
                            </p>{" "}
                          </Dropdown.Item>
                          <Dropdown.Item
                            eventKey="2"
                            className="word-wrap d-flex flex-column word-wrap align-items-start"
                          >
                            <b>FORMAT B- </b>
                            <br />{" "}
                            <p className="dropdown-info text-break word-wrap overflow-wrap mb-0">
                              <i>
                                (Name, Ready, Set, Go, Adaptations, Objectives,
                                Academics, Teaching Tips, Family Fun, Lyrics,
                                Music Credits, Image)
                              </i>
                            </p>
                          </Dropdown.Item>
                          <Dropdown.Item
                            eventKey="3"
                            className="word-wrap d-flex flex-column word-wrap align-items-start"
                          >
                            <b>FORMAT C- </b>
                            <br />{" "}
                            <p className="dropdown-info text-break word-wrap overflow-wrap mb-0">
                              <i>
                                (Name, Ready, Set, Go, Safety First, Game Reset,
                                Home Play, The Right Fit, Guideline Addressed,
                                Image)
                              </i>{" "}
                            </p>{" "}
                          </Dropdown.Item>
                          <Dropdown.Item
                            eventKey="4"
                            className="word-wrap d-flex flex-column word-wrap align-items-start"
                          >
                            <b>FORMAT D- </b> <br />{" "}
                            <p className="dropdown-info text-break word-wrap overflow-wrap mb-0">
                              <i>
                                (Name, Integration, Lesson Objective, Lesson
                                Target, Prep, Reflection Question, Competencies,
                                Lesson Set, Spark It Up, Standard Alignment,
                                Teach, Teaching Cues, Teaching Suggestions,
                                Integration Icons, Key Words, Image
                              </i>
                            </p>
                          </Dropdown.Item>
                          <Dropdown.Item
                            eventKey="5"
                            className="word-wrap d-flex flex-column word-wrap align-items-start"
                          >
                            <Button onClick={onOpenCustomForm}>
                              Create Custom Form{" "}
                            </Button>
                          </Dropdown.Item>
                        </DropdownButton> */}
                      </div>
                      <div className="card-body">
                        <div className="table-responsive newPc">
                          {getLoader === true ? (
                            <Loader />
                          ) : (
                            <Box sx={{ height: 650, width: "100%" }}>
                              {!LessonPlans.length ? (
                                <h3>No Data Found!</h3>
                              ) : null}
                              {LessonPlans.length > 0 && (
                                <>
                                  <h2>{select.map((val) => val._id)}</h2>
{                                  console.log("======data>", data)
}                                  <MRT_TableContainer table={table} />
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
                              )}
                            </Box>
                          )}
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

      <Modal show={showEditLessonPlans} keyboard={false}>
        <Modal.Header>
          <Modal.Title>Edit</Modal.Title>
          <i
            className="fas fa-cut"
            style={{ cursor: "pointer" }}
            onClick={handleClose}
          ></i>
        </Modal.Header>
        <Modal.Body>
          {getDetail.format === "A" ? (
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
                format: getDetail.format,
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

                formData.append("curriculum_id", values.curriculum_id);
                formData.append("suboption_id", values.suboption_id);
                formData.append("lesson_id", values.lesson_id);
                formData.append("lesson_name", values.lesson_name);
                formData.append("integration", Integration);
                formData.append("lesson_objective", Objective);
                formData.append("lesson_target", Target);
                formData.append("prep", Prep);
                formData.append("reflection_question", Questions);
                formData.append("sel_compentencies", Competencies);
                formData.append("lesson_set", Set);
                formData.append("spark_it_up", SparkItUp);
                formData.append("standards_alignment", Alignment);
                formData.append("teach", Teach);
                formData.append("teaching_cues", Cues);
                formData.append("teaching_suggestions", Suggestion);
                formData.append("vocabulary", Vocabulary);
                formData.append("format", LessonFormat);
                if (getImage.pictureAsFile) {
                  formData.append("image_url", getImage.pictureAsFile);
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
                    get_lessons({
                      curriculum_id: location.state.curriculum_id,
                      suboption_id: location.state.suboption_id,
                    })
                      .then((res) => {
                        // console.log("=======>", res.data.result);

                        // setLessonPlans(
                        //   res.data.result.map((el, index) => ({
                        //     ...el,
                        //     id: el.lesson_id,
                        //     i: index,
                        //   }))
                        // );
                        const re = res.data.result.map((el, index) => ({
                          ...el,
                          id: el.id,
                          i: index,
                        }));
                        setLessonPlans(re);
                        setData(re)
                        setLoader(false);
                      })
                      .catch((err) => {
                        console.log(err);
                      });
                    setImage({});
                    setImageUrl("");
                    setShowEditLessonPlans(false);
                    setbutton(false);

                    setEditorData1("");
                    setIntegration("");
                    setEditorData2("");
                    setObjective("");
                    setEditorData3("");
                    setTarget("");
                    setEditorData4("");
                    setPrep("");
                    setEditorData5("");
                    setQuestions("");
                    setEditorData6("");
                    setCompetencies("");
                    setEditorData7("");
                    setSet("");
                    setEditorData8("");
                    setSparkItUp("");
                    setEditorData9("");
                    setAlignment("");
                    setEditorData10("");
                    setTeach("");
                    setEditorData11("");
                    setCues("");
                    setEditorData12("");
                    setSuggestion("");
                    setEditorData13("");
                    setVocabulary("");
                    setReady("");
                    setGo("");
                    setAdaptation("");
                    setAcademics("");
                    setTeacherTips("");
                    setFamilyFun("");
                    setLyrics("");
                    setMusicCredits("");
                    setSafetyFirst("");
                    setGameReset("");
                    setHomePlay("");
                    setTheRightFit("");
                    setGuideline("");
                    setIntegrationIcon("");
                    setKeyWords("");
                    setState(false);
                    setLessonFormat();
                  })
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
                    setImage({});
                    setImageUrl("");
                    setbutton(false);
                    setShowEditLessonPlans(false);
                    setEditorData1("");
                    setIntegration("");
                    setEditorData2("");
                    setObjective("");
                    setEditorData3("");
                    setTarget("");
                    setEditorData4("");
                    setPrep("");
                    setEditorData5("");
                    setQuestions("");
                    setEditorData6("");
                    setCompetencies("");
                    setEditorData7("");
                    setSet("");
                    setEditorData8("");
                    setSparkItUp("");
                    setEditorData9("");
                    setAlignment("");
                    setEditorData10("");
                    setTeach("");
                    setEditorData11("");
                    setCues("");
                    setEditorData12("");
                    setSuggestion("");
                    setEditorData13("");
                    setVocabulary("");
                    setReady("");
                    setGo("");
                    setAdaptation("");
                    setAcademics("");
                    setTeacherTips("");
                    setFamilyFun("");
                    setLyrics("");
                    setMusicCredits("");
                    setSafetyFirst("");
                    setGameReset("");
                    setHomePlay("");
                    setTheRightFit("");
                    setGuideline("");
                    setIntegrationIcon("");
                    setKeyWords("");
                    setLessonFormat("");
                    setState(false);
                  });
              }}
            >
              <Form>
                <div className="modal-body">
                  <h3 className="format-heading">FORMAT A</h3>

                  <div className="row">
                    <div className="col-lg-4 col-md-12 col-sm-12">
                      <div className="form-group">
                        <label>Name</label>
                        <MyTextInput
                          type="text"
                          className="form-control"
                          name="lesson_name"
                        />
                      </div>
                    </div>
                    <div className="col-lg-12 col-md-12 col-sm-12">
                      <div className="form-group spo">
                        <label>Integration</label>
                        <Editor
                          toolbar={{
                            options: [
                              "inline",
                              "blockType",
                              "fontSize",
                              "fontFamily",
                              "list",
                              "textAlign",
                              "colorPicker",
                              "link",
                              "embedded" /*, 'emoji'*/,
                              "image",
                              "remove",
                              "history",
                            ],
                          }}
                          handlePastedText={() => false}
                          toolbarClassName="toolbarClassName"
                          wrapperClassName="wrapperClassName"
                          editorClassName="editorClassName"
                          wrapperStyle={{
                            border: "1px solid #d6d6d6",
                            padding: 10,
                            borderRadius: 10,
                          }}
                          toolbarStyle={{
                            border: 0,
                            borderBottom: "1px solid #d6d6d6",
                          }}
                          editorState={editorData1}
                          onEditorStateChange={(value) =>
                            handelChange(value, 1, 1)
                          }
                        // onBlur={() => helpers.setTouched(true)}
                        />
                        {/* <MyTextEditor type="text" className="form-control" name="integration" />                                                 */}
                      </div>
                    </div>
                    <div className="col-lg-12 col-md-12 col-sm-12">
                      <div className="form-group">
                        <label>Learning Objective</label>
                        <Editor
                          toolbar={{
                            options: [
                              "inline",
                              "blockType",
                              "fontSize",
                              "fontFamily",
                              "list",
                              "textAlign",
                              "colorPicker",
                              "link",
                              "embedded" /*, 'emoji'*/,
                              "image",
                              "remove",
                              "history",
                            ],
                          }}
                          handlePastedText={() => false}
                          toolbarClassName="toolbarClassName"
                          wrapperClassName="wrapperClassName"
                          editorClassName="editorClassName"
                          wrapperStyle={{
                            border: "1px solid #d6d6d6",
                            padding: 10,
                            borderRadius: 10,
                          }}
                          toolbarStyle={{
                            border: 0,
                            borderBottom: "1px solid #d6d6d6",
                          }}
                          editorState={editorData2}
                          onEditorStateChange={(value) =>
                            handelChange(value, 2, 1)
                          }
                        // onBlur={() => helpers.setTouched(true)}
                        />
                        {/* <MyTextArea type="text" className="form-control" name="lesson_objective" /> */}
                      </div>
                    </div>
                    <div className="col-lg-12 col-md-12 col-sm-12">
                      <div className="form-group">
                        <label>Learning Target</label>
                        <Editor
                          toolbar={{
                            options: [
                              "inline",
                              "blockType",
                              "fontSize",
                              "fontFamily",
                              "list",
                              "textAlign",
                              "colorPicker",
                              "link",
                              "embedded" /*, 'emoji'*/,
                              "image",
                              "remove",
                              "history",
                            ],
                          }}
                          handlePastedText={() => false}
                          toolbarClassName="toolbarClassName"
                          wrapperClassName="wrapperClassName"
                          editorClassName="editorClassName"
                          wrapperStyle={{
                            border: "1px solid #d6d6d6",
                            padding: 10,
                            borderRadius: 10,
                          }}
                          toolbarStyle={{
                            border: 0,
                            borderBottom: "1px solid #d6d6d6",
                          }}
                          editorState={editorData3}
                          onEditorStateChange={(value) =>
                            handelChange(value, 3, 1)
                          }
                        // onBlur={() => helpers.setTouched(true)}
                        />
                        {/* <MyTextArea type="text" className="form-control" name="lesson_target" /> */}
                      </div>
                    </div>
                    <div className="col-lg-12 col-md-12 col-sm-12">
                      <div className="form-group">
                        <label>Prep</label>
                        <Editor
                          toolbar={{
                            options: [
                              "inline",
                              "blockType",
                              "fontSize",
                              "fontFamily",
                              "list",
                              "textAlign",
                              "colorPicker",
                              "link",
                              "embedded" /*, 'emoji'*/,
                              "image",
                              "remove",
                              "history",
                            ],
                          }}
                          handlePastedText={() => false}
                          toolbarClassName="toolbarClassName"
                          wrapperClassName="wrapperClassName"
                          editorClassName="editorClassName"
                          wrapperStyle={{
                            border: "1px solid #d6d6d6",
                            padding: 10,
                            borderRadius: 10,
                          }}
                          toolbarStyle={{
                            border: 0,
                            borderBottom: "1px solid #d6d6d6",
                          }}
                          editorState={editorData4}
                          onEditorStateChange={(value) =>
                            handelChange(value, 4, 1)
                          }
                        // onBlur={() => helpers.setTouched(true)}
                        />
                        {/* <MyTextArea type="text" className="form-control" name="prep" /> */}
                      </div>
                    </div>
                    <div className="col-lg-12 col-md-12 col-sm-12">
                      <div className="form-group">
                        <label>Reflection Question</label>
                        <Editor
                          toolbar={{
                            options: [
                              "inline",
                              "blockType",
                              "fontSize",
                              "fontFamily",
                              "list",
                              "textAlign",
                              "colorPicker",
                              "link",
                              "embedded" /*, 'emoji'*/,
                              "image",
                              "remove",
                              "history",
                            ],
                          }}
                          handlePastedText={() => false}
                          toolbarClassName="toolbarClassName"
                          wrapperClassName="wrapperClassName"
                          editorClassName="editorClassName"
                          wrapperStyle={{
                            border: "1px solid #d6d6d6",
                            padding: 10,
                            borderRadius: 10,
                          }}
                          toolbarStyle={{
                            border: 0,
                            borderBottom: "1px solid #d6d6d6",
                          }}
                          editorState={editorData5}
                          onEditorStateChange={(value) =>
                            handelChange(value, 5, 1)
                          }
                        // onBlur={() => helpers.setTouched(true)}
                        />
                        {/* <MyTextArea type="text" className="form-control" name="reflection_question" /> */}
                      </div>
                    </div>
                    <div className="col-lg-12 col-md-12 col-sm-12">
                      <div className="form-group">
                        <label>SEL</label>
                        <Editor
                          toolbar={{
                            options: [
                              "inline",
                              "blockType",
                              "fontSize",
                              "fontFamily",
                              "list",
                              "textAlign",
                              "colorPicker",
                              "link",
                              "embedded" /*, 'emoji'*/,
                              "image",
                              "remove",
                              "history",
                            ],
                          }}
                          handlePastedText={() => false}
                          toolbarClassName="toolbarClassName"
                          wrapperClassName="wrapperClassName"
                          editorClassName="editorClassName"
                          wrapperStyle={{
                            border: "1px solid #d6d6d6",
                            padding: 10,
                            borderRadius: 10,
                          }}
                          toolbarStyle={{
                            border: 0,
                            borderBottom: "1px solid #d6d6d6",
                          }}
                          editorState={editorData6}
                          onEditorStateChange={(value) =>
                            handelChange(value, 6, 1)
                          }
                        // onBlur={() => helpers.setTouched(true)}
                        />
                        {/* <MyTextArea type="text" className="form-control" name="sel_compentencies" /> */}
                      </div>
                    </div>
                    <div className="col-lg-12 col-md-12 col-sm-12">
                      <div className="form-group">
                        <label>Set</label>
                        <Editor
                          toolbar={{
                            options: [
                              "inline",
                              "blockType",
                              "fontSize",
                              "fontFamily",
                              "list",
                              "textAlign",
                              "colorPicker",
                              "link",
                              "embedded" /*, 'emoji'*/,
                              "image",
                              "remove",
                              "history",
                            ],
                          }}
                          handlePastedText={() => false}
                          toolbarClassName="toolbarClassName"
                          wrapperClassName="wrapperClassName"
                          editorClassName="editorClassName"
                          wrapperStyle={{
                            border: "1px solid #d6d6d6",
                            padding: 10,
                            borderRadius: 10,
                          }}
                          toolbarStyle={{
                            border: 0,
                            borderBottom: "1px solid #d6d6d6",
                          }}
                          editorState={editorData7}
                          onEditorStateChange={(value) =>
                            handelChange(value, 7, 1)
                          }
                        // onBlur={() => helpers.setTouched(true)}
                        />
                        {/* <MyTextArea type="text" className="form-control" name="lesson_set" /> */}
                      </div>
                    </div>
                    <div className="col-lg-12 col-md-12 col-sm-12">
                      <div className="form-group">
                        <label>Spark It Up</label>
                        <Editor
                          toolbar={{
                            options: [
                              "inline",
                              "blockType",
                              "fontSize",
                              "fontFamily",
                              "list",
                              "textAlign",
                              "colorPicker",
                              "link",
                              "embedded" /*, 'emoji'*/,
                              "image",
                              "remove",
                              "history",
                            ],
                          }}
                          handlePastedText={() => false}
                          toolbarClassName="toolbarClassName"
                          wrapperClassName="wrapperClassName"
                          editorClassName="editorClassName"
                          wrapperStyle={{
                            border: "1px solid #d6d6d6",
                            padding: 10,
                            borderRadius: 10,
                          }}
                          toolbarStyle={{
                            border: 0,
                            borderBottom: "1px solid #d6d6d6",
                          }}
                          editorState={editorData8}
                          onEditorStateChange={(value) =>
                            handelChange(value, 8, 1)
                          }
                        // onBlur={() => helpers.setTouched(true)}
                        />
                        {/* <MyTextArea type="text" className="form-control" name="spark_it_up" /> */}
                      </div>
                    </div>
                    <div className="col-lg-12 col-md-12 col-sm-12">
                      <div className="form-group">
                        <label>Standard Alignment</label>
                        <Editor
                          toolbar={{
                            options: [
                              "inline",
                              "blockType",
                              "fontSize",
                              "fontFamily",
                              "list",
                              "textAlign",
                              "colorPicker",
                              "link",
                              "embedded" /*, 'emoji'*/,
                              "image",
                              "remove",
                              "history",
                            ],
                          }}
                          handlePastedText={() => false}
                          toolbarClassName="toolbarClassName"
                          wrapperClassName="wrapperClassName"
                          editorClassName="editorClassName"
                          wrapperStyle={{
                            border: "1px solid #d6d6d6",
                            padding: 10,
                            borderRadius: 10,
                          }}
                          toolbarStyle={{
                            border: 0,
                            borderBottom: "1px solid #d6d6d6",
                          }}
                          editorState={editorData9}
                          onEditorStateChange={(value) =>
                            handelChange(value, 9, 1)
                          }
                        // onBlur={() => helpers.setTouched(true)}
                        />
                        {/* <MyTextArea type="text" className="form-control" name="standards_alignment" /> */}
                      </div>
                    </div>
                    <div className="col-lg-12 col-md-12 col-sm-12">
                      <div className="form-group">
                        <label>Teach</label>
                        <Editor
                          toolbar={{
                            options: [
                              "inline",
                              "blockType",
                              "fontSize",
                              "fontFamily",
                              "list",
                              "textAlign",
                              "colorPicker",
                              "link",
                              "embedded" /*, 'emoji'*/,
                              "image",
                              "remove",
                              "history",
                            ],
                          }}
                          handlePastedText={() => false}
                          toolbarClassName="toolbarClassName"
                          wrapperClassName="wrapperClassName"
                          editorClassName="editorClassName"
                          wrapperStyle={{
                            border: "1px solid #d6d6d6",
                            padding: 10,
                            borderRadius: 10,
                          }}
                          toolbarStyle={{
                            border: 0,
                            borderBottom: "1px solid #d6d6d6",
                          }}
                          editorState={editorData10}
                          onEditorStateChange={(value) =>
                            handelChange(value, 10, 1)
                          }
                        // onBlur={() => helpers.setTouched(true)}
                        />
                        {/* <MyTextArea type="text" className="form-control" name="teach" /> */}
                      </div>
                    </div>
                    <div className="col-lg-12 col-md-12 col-sm-12">
                      <div className="form-group">
                        <label>Teaching Cues</label>
                        <Editor
                          toolbar={{
                            options: [
                              "inline",
                              "blockType",
                              "fontSize",
                              "fontFamily",
                              "list",
                              "textAlign",
                              "colorPicker",
                              "link",
                              "embedded" /*, 'emoji'*/,
                              "image",
                              "remove",
                              "history",
                            ],
                          }}
                          handlePastedText={() => false}
                          toolbarClassName="toolbarClassName"
                          wrapperClassName="wrapperClassName"
                          editorClassName="editorClassName"
                          wrapperStyle={{
                            border: "1px solid #d6d6d6",
                            padding: 10,
                            borderRadius: 10,
                          }}
                          toolbarStyle={{
                            border: 0,
                            borderBottom: "1px solid #d6d6d6",
                          }}
                          editorState={editorData11}
                          onEditorStateChange={(value) =>
                            handelChange(value, 11, 1)
                          }
                        // onBlur={() => helpers.setTouched(true)}
                        />
                        {/* <MyTextArea type="text" className="form-control" name="teaching_cues" /> */}
                      </div>
                    </div>
                    <div className="col-lg-12 col-md-12 col-sm-12">
                      <div className="form-group">
                        <label>Teaching Suggestions</label>
                        <Editor
                          toolbar={{
                            options: [
                              "inline",
                              "blockType",
                              "fontSize",
                              "fontFamily",
                              "list",
                              "textAlign",
                              "colorPicker",
                              "link",
                              "embedded" /*, 'emoji'*/,
                              "image",
                              "remove",
                              "history",
                            ],
                          }}
                          handlePastedText={() => false}
                          toolbarClassName="toolbarClassName"
                          wrapperClassName="wrapperClassName"
                          editorClassName="editorClassName"
                          wrapperStyle={{
                            border: "1px solid #d6d6d6",
                            padding: 10,
                            borderRadius: 10,
                          }}
                          toolbarStyle={{
                            border: 0,
                            borderBottom: "1px solid #d6d6d6",
                          }}
                          editorState={editorData12}
                          onEditorStateChange={(value) =>
                            handelChange(value, 12, 1)
                          }
                        // onBlur={() => helpers.setTouched(true)}
                        />
                        {/* <MyTextArea type="text" className="form-control" name="teaching_suggestions" /> */}
                      </div>
                    </div>
                    <div className="col-lg-12 col-md-12 col-sm-12">
                      <div className="form-group">
                        <label>Vocabulary</label>
                        <Editor
                          toolbar={{
                            options: [
                              "inline",
                              "blockType",
                              "fontSize",
                              "fontFamily",
                              "list",
                              "textAlign",
                              "colorPicker",
                              "link",
                              "embedded" /*, 'emoji'*/,
                              "image",
                              "remove",
                              "history",
                            ],
                          }}
                          handlePastedText={() => false}
                          toolbarClassName="toolbarClassName"
                          wrapperClassName="wrapperClassName"
                          editorClassName="editorClassName"
                          wrapperStyle={{
                            border: "1px solid #d6d6d6",
                            padding: 10,
                            borderRadius: 10,
                          }}
                          toolbarStyle={{
                            border: 0,
                            borderBottom: "1px solid #d6d6d6",
                          }}
                          editorState={editorData13}
                          onEditorStateChange={(value) =>
                            handelChange(value, 13, 1)
                          }
                        // onBlur={() => helpers.setTouched(true)}
                        />
                        {/* <MyTextArea type="text" className="form-control" name="vocabulary" /> */}
                      </div>
                    </div>
                    <div className="col-lg-6 col-md-12 col-sm-12">
                      <div className="form-group">
                        <label>Diagram</label>

                        <input
                          type="file"
                          accept="image/*"
                          className="form-control"
                          name="image_url"
                          onChange={(e) => onHandle(e)}
                        />
                        {getImageUrl !== "" ? (
                          <img src={getImageUrl} className=" w-30 p-3" alt="" />
                        ) : null}
                        {getState ? (
                          <p style={{ color: "red" }}>
                            Only Image is allowed !
                          </p>
                        ) : null}
                      </div>
                    </div>
                    <div className="col-lg-12 col-md-12 col-sm-12">
                      {!getbutton ? (
                        getState ? (
                          <Button disabled type="submit" variant="contained">
                            Submit
                          </Button>
                        ) : (
                          <Button type="submit" variant="contained">
                            Submit
                          </Button>
                        )
                      ) : (
                        <Button
                          variant="contained"
                          style={{ backgroundColor: "blue", color: "white" }}
                          disabled
                        >
                          Wait Please!
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </Form>
            </Formik>
          ) : getDetail.format === "B" ? (
            <Formik
              enableReinitialize={true}
              initialValues={{
                curriculum_id: location.state.curriculum_id,
                suboption_id: location.state.suboption_id,
                lesson_id: getDetail.id,
                title: getDetail.title,
                ready: getDetail.ready,
                lesson_set: getDetail.lesson_set,
                go: getDetail.go,
                adaptations: getDetail.adaptations,
                objectives: getDetail.objectives,
                academics: getDetail.academics,
                teacher_tips: getDetail.teacher_tips,
                family_fun: getDetail.family_fun,
                lyrics: getDetail.lyrics,
                music_credits: getDetail.music_credits,
                format: getDetail.format,
              }}
              validationSchema={Yup.object({
                title: Yup.string().required("Required"),
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

                formData.append("curriculum_id", values.curriculum_id);
                formData.append("suboption_id", values.suboption_id);
                formData.append("lesson_id", values.lesson_id);
                formData.append("title", values.title);
                formData.append("ready", Ready);
                formData.append("lesson_set", Set);
                formData.append("go", Go);
                formData.append("adaptations", Adaptation);
                formData.append("objectives", Objective);
                formData.append("academics", Academics);
                formData.append("teacher_tips", TeacherTips);
                formData.append("family_fun", FamilyFun);
                formData.append("lyrics", Lyrics);
                formData.append("music_credits", MusicCredits);
                formData.append("format", LessonFormat);
                if (getImage.pictureAsFile) {
                  formData.append("filename", getImage.pictureAsFile);
                }
                setbutton(true);
                console.log(values);

                edit_earlyChild(formData)
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
                    get_lessons({
                      curriculum_id: location.state.curriculum_id,
                      suboption_id: location.state.suboption_id,
                    })
                      .then((res) => {
                        console.log("=======>", res.data.result);

                        setLessonPlans(
                          res.data.result.map((el, index) => ({
                            ...el,
                            id: el.lesson_id,
                            i: index,
                          }))
                        );
                        setLoader(false);
                      })
                      .catch((err) => {
                        console.log(err);
                      });
                    setImage({});
                    setImageUrl("");
                    setShowEditLessonPlans(false);
                    setbutton(false);

                    setEditorData1("");
                    setIntegration("");
                    setEditorData2("");
                    setObjective("");
                    setEditorData3("");
                    setTarget("");
                    setEditorData4("");
                    setPrep("");
                    setEditorData5("");
                    setQuestions("");
                    setEditorData6("");
                    setCompetencies("");
                    setEditorData7("");
                    setSet("");
                    setEditorData8("");
                    setSparkItUp("");
                    setEditorData9("");
                    setAlignment("");
                    setEditorData10("");
                    setTeach("");
                    setEditorData11("");
                    setCues("");
                    setEditorData12("");
                    setSuggestion("");
                    setEditorData13("");
                    setVocabulary("");
                    setReady("");
                    setGo("");
                    setAdaptation("");
                    setAcademics("");
                    setTeacherTips("");
                    setFamilyFun("");
                    setLyrics("");
                    setMusicCredits("");
                    setSafetyFirst("");
                    setGameReset("");
                    setHomePlay("");
                    setTheRightFit("");
                    setGuideline("");
                    setIntegrationIcon("");
                    setKeyWords("");
                    setLessonFormat("");
                    setState(false);
                  })
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
                    setImage({});
                    setImageUrl("");
                    setbutton(false);
                    setShowEditLessonPlans(false);
                    setEditorData1("");
                    setIntegration("");
                    setEditorData2("");
                    setObjective("");
                    setEditorData3("");
                    setTarget("");
                    setEditorData4("");
                    setPrep("");
                    setEditorData5("");
                    setQuestions("");
                    setEditorData6("");
                    setCompetencies("");
                    setEditorData7("");
                    setSet("");
                    setEditorData8("");
                    setSparkItUp("");
                    setEditorData9("");
                    setAlignment("");
                    setEditorData10("");
                    setTeach("");
                    setEditorData11("");
                    setCues("");
                    setEditorData12("");
                    setSuggestion("");
                    setEditorData13("");
                    setVocabulary("");
                    setReady("");
                    setGo("");
                    setAdaptation("");
                    setAcademics("");
                    setTeacherTips("");
                    setFamilyFun("");
                    setLyrics("");
                    setMusicCredits("");
                    setSafetyFirst("");
                    setGameReset("");
                    setHomePlay("");
                    setTheRightFit("");
                    setGuideline("");
                    setIntegrationIcon("");
                    setKeyWords("");
                    setLessonFormat("");
                    setState(false);
                  });
              }}
            >
              <Form>
                <div className="modal-body">
                  <h3 className="format-heading">FORMAT B</h3>

                  <div className="row">
                    <div className="col-lg-4 col-md-12 col-sm-12">
                      <div className="form-group">
                        <label>Name</label>
                        <MyTextInput
                          type="text"
                          className="form-control"
                          name="title"
                        />
                      </div>
                    </div>
                    <div className="col-lg-12 col-md-12 col-sm-12">
                      <div className="form-group spo">
                        <label>Ready</label>
                        <Editor
                          toolbar={{
                            options: [
                              "inline",
                              "blockType",
                              "fontSize",
                              "fontFamily",
                              "list",
                              "textAlign",
                              "colorPicker",
                              "link",
                              "embedded" /*, 'emoji'*/,
                              "image",
                              "remove",
                              "history",
                            ],
                          }}
                          handlePastedText={() => false}
                          toolbarClassName="toolbarClassName"
                          wrapperClassName="wrapperClassName"
                          editorClassName="editorClassName"
                          wrapperStyle={{
                            border: "1px solid #d6d6d6",
                            padding: 10,
                            borderRadius: 10,
                          }}
                          toolbarStyle={{
                            border: 0,
                            borderBottom: "1px solid #d6d6d6",
                          }}
                          editorState={editorData1}
                          onEditorStateChange={(value) =>
                            handelChange(value, 1, 2)
                          }
                        // onBlur={() => helpers.setTouched(true)}
                        />
                        {/* <MyTextEditor type="text" className="form-control" name="integration" />                                                 */}
                      </div>
                    </div>
                    <div className="col-lg-12 col-md-12 col-sm-12">
                      <div className="form-group">
                        <label>Set</label>
                        <Editor
                          toolbar={{
                            options: [
                              "inline",
                              "blockType",
                              "fontSize",
                              "fontFamily",
                              "list",
                              "textAlign",
                              "colorPicker",
                              "link",
                              "embedded" /*, 'emoji'*/,
                              "image",
                              "remove",
                              "history",
                            ],
                          }}
                          handlePastedText={() => false}
                          toolbarClassName="toolbarClassName"
                          wrapperClassName="wrapperClassName"
                          editorClassName="editorClassName"
                          wrapperStyle={{
                            border: "1px solid #d6d6d6",
                            padding: 10,
                            borderRadius: 10,
                          }}
                          toolbarStyle={{
                            border: 0,
                            borderBottom: "1px solid #d6d6d6",
                          }}
                          editorState={editorData2}
                          onEditorStateChange={(value) =>
                            handelChange(value, 2, 2)
                          }
                        // onBlur={() => helpers.setTouched(true)}
                        />
                        {/* <MyTextArea type="text" className="form-control" name="lesson_objective" /> */}
                      </div>
                    </div>
                    <div className="col-lg-12 col-md-12 col-sm-12">
                      <div className="form-group">
                        <label>Go</label>
                        <Editor
                          toolbar={{
                            options: [
                              "inline",
                              "blockType",
                              "fontSize",
                              "fontFamily",
                              "list",
                              "textAlign",
                              "colorPicker",
                              "link",
                              "embedded" /*, 'emoji'*/,
                              "image",
                              "remove",
                              "history",
                            ],
                          }}
                          handlePastedText={() => false}
                          toolbarClassName="toolbarClassName"
                          wrapperClassName="wrapperClassName"
                          editorClassName="editorClassName"
                          wrapperStyle={{
                            border: "1px solid #d6d6d6",
                            padding: 10,
                            borderRadius: 10,
                          }}
                          toolbarStyle={{
                            border: 0,
                            borderBottom: "1px solid #d6d6d6",
                          }}
                          editorState={editorData3}
                          onEditorStateChange={(value) =>
                            handelChange(value, 3, 2)
                          }
                        // onBlur={() => helpers.setTouched(true)}
                        />
                        {/* <MyTextArea type="text" className="form-control" name="lesson_target" /> */}
                      </div>
                    </div>
                    <div className="col-lg-12 col-md-12 col-sm-12">
                      <div className="form-group">
                        <label>Adaptations</label>
                        <Editor
                          toolbar={{
                            options: [
                              "inline",
                              "blockType",
                              "fontSize",
                              "fontFamily",
                              "list",
                              "textAlign",
                              "colorPicker",
                              "link",
                              "embedded" /*, 'emoji'*/,
                              "image",
                              "remove",
                              "history",
                            ],
                          }}
                          handlePastedText={() => false}
                          toolbarClassName="toolbarClassName"
                          wrapperClassName="wrapperClassName"
                          editorClassName="editorClassName"
                          wrapperStyle={{
                            border: "1px solid #d6d6d6",
                            padding: 10,
                            borderRadius: 10,
                          }}
                          toolbarStyle={{
                            border: 0,
                            borderBottom: "1px solid #d6d6d6",
                          }}
                          editorState={editorData4}
                          onEditorStateChange={(value) =>
                            handelChange(value, 4, 2)
                          }
                        // onBlur={() => helpers.setTouched(true)}
                        />
                        {/* <MyTextArea type="text" className="form-control" name="prep" /> */}
                      </div>
                    </div>
                    <div className="col-lg-12 col-md-12 col-sm-12">
                      <div className="form-group">
                        <label>Objectives</label>
                        <Editor
                          toolbar={{
                            options: [
                              "inline",
                              "blockType",
                              "fontSize",
                              "fontFamily",
                              "list",
                              "textAlign",
                              "colorPicker",
                              "link",
                              "embedded" /*, 'emoji'*/,
                              "image",
                              "remove",
                              "history",
                            ],
                          }}
                          handlePastedText={() => false}
                          toolbarClassName="toolbarClassName"
                          wrapperClassName="wrapperClassName"
                          editorClassName="editorClassName"
                          wrapperStyle={{
                            border: "1px solid #d6d6d6",
                            padding: 10,
                            borderRadius: 10,
                          }}
                          toolbarStyle={{
                            border: 0,
                            borderBottom: "1px solid #d6d6d6",
                          }}
                          editorState={editorData5}
                          onEditorStateChange={(value) =>
                            handelChange(value, 5, 2)
                          }
                        // onBlur={() => helpers.setTouched(true)}
                        />
                        {/* <MyTextArea type="text" className="form-control" name="reflection_question" /> */}
                      </div>
                    </div>
                    <div className="col-lg-12 col-md-12 col-sm-12">
                      <div className="form-group">
                        <label>Academics</label>
                        <Editor
                          toolbar={{
                            options: [
                              "inline",
                              "blockType",
                              "fontSize",
                              "fontFamily",
                              "list",
                              "textAlign",
                              "colorPicker",
                              "link",
                              "embedded" /*, 'emoji'*/,
                              "image",
                              "remove",
                              "history",
                            ],
                          }}
                          handlePastedText={() => false}
                          toolbarClassName="toolbarClassName"
                          wrapperClassName="wrapperClassName"
                          editorClassName="editorClassName"
                          wrapperStyle={{
                            border: "1px solid #d6d6d6",
                            padding: 10,
                            borderRadius: 10,
                          }}
                          toolbarStyle={{
                            border: 0,
                            borderBottom: "1px solid #d6d6d6",
                          }}
                          editorState={editorData6}
                          onEditorStateChange={(value) =>
                            handelChange(value, 6, 2)
                          }
                        // onBlur={() => helpers.setTouched(true)}
                        />
                        {/* <MyTextArea type="text" className="form-control" name="sel_compentencies" /> */}
                      </div>
                    </div>
                    <div className="col-lg-12 col-md-12 col-sm-12">
                      <div className="form-group">
                        <label>Teaching Tips</label>
                        <Editor
                          toolbar={{
                            options: [
                              "inline",
                              "blockType",
                              "fontSize",
                              "fontFamily",
                              "list",
                              "textAlign",
                              "colorPicker",
                              "link",
                              "embedded" /*, 'emoji'*/,
                              "image",
                              "remove",
                              "history",
                            ],
                          }}
                          handlePastedText={() => false}
                          toolbarClassName="toolbarClassName"
                          wrapperClassName="wrapperClassName"
                          editorClassName="editorClassName"
                          wrapperStyle={{
                            border: "1px solid #d6d6d6",
                            padding: 10,
                            borderRadius: 10,
                          }}
                          toolbarStyle={{
                            border: 0,
                            borderBottom: "1px solid #d6d6d6",
                          }}
                          editorState={editorData7}
                          onEditorStateChange={(value) =>
                            handelChange(value, 7, 2)
                          }
                        // onBlur={() => helpers.setTouched(true)}
                        />
                        {/* <MyTextArea type="text" className="form-control" name="lesson_set" /> */}
                      </div>
                    </div>
                    <div className="col-lg-12 col-md-12 col-sm-12">
                      <div className="form-group">
                        <label>Family Fun</label>
                        <Editor
                          toolbar={{
                            options: [
                              "inline",
                              "blockType",
                              "fontSize",
                              "fontFamily",
                              "list",
                              "textAlign",
                              "colorPicker",
                              "link",
                              "embedded" /*, 'emoji'*/,
                              "image",
                              "remove",
                              "history",
                            ],
                          }}
                          handlePastedText={() => false}
                          toolbarClassName="toolbarClassName"
                          wrapperClassName="wrapperClassName"
                          editorClassName="editorClassName"
                          wrapperStyle={{
                            border: "1px solid #d6d6d6",
                            padding: 10,
                            borderRadius: 10,
                          }}
                          toolbarStyle={{
                            border: 0,
                            borderBottom: "1px solid #d6d6d6",
                          }}
                          editorState={editorData8}
                          onEditorStateChange={(value) =>
                            handelChange(value, 8, 2)
                          }
                        // onBlur={() => helpers.setTouched(true)}
                        />
                        {/* <MyTextArea type="text" className="form-control" name="spark_it_up" /> */}
                      </div>
                    </div>
                    <div className="col-lg-12 col-md-12 col-sm-12">
                      <div className="form-group">
                        <label>Lyrics</label>
                        <Editor
                          toolbar={{
                            options: [
                              "inline",
                              "blockType",
                              "fontSize",
                              "fontFamily",
                              "list",
                              "textAlign",
                              "colorPicker",
                              "link",
                              "embedded" /*, 'emoji'*/,
                              "image",
                              "remove",
                              "history",
                            ],
                          }}
                          handlePastedText={() => false}
                          toolbarClassName="toolbarClassName"
                          wrapperClassName="wrapperClassName"
                          editorClassName="editorClassName"
                          wrapperStyle={{
                            border: "1px solid #d6d6d6",
                            padding: 10,
                            borderRadius: 10,
                          }}
                          toolbarStyle={{
                            border: 0,
                            borderBottom: "1px solid #d6d6d6",
                          }}
                          editorState={editorData9}
                          onEditorStateChange={(value) =>
                            handelChange(value, 9, 2)
                          }
                        // onBlur={() => helpers.setTouched(true)}
                        />
                        {/* <MyTextArea type="text" className="form-control" name="standards_alignment" /> */}
                      </div>
                    </div>
                    <div className="col-lg-12 col-md-12 col-sm-12">
                      <div className="form-group">
                        <label>Music Credits</label>
                        <Editor
                          toolbar={{
                            options: [
                              "inline",
                              "blockType",
                              "fontSize",
                              "fontFamily",
                              "list",
                              "textAlign",
                              "colorPicker",
                              "link",
                              "embedded" /*, 'emoji'*/,
                              "image",
                              "remove",
                              "history",
                            ],
                          }}
                          handlePastedText={() => false}
                          toolbarClassName="toolbarClassName"
                          wrapperClassName="wrapperClassName"
                          editorClassName="editorClassName"
                          wrapperStyle={{
                            border: "1px solid #d6d6d6",
                            padding: 10,
                            borderRadius: 10,
                          }}
                          toolbarStyle={{
                            border: 0,
                            borderBottom: "1px solid #d6d6d6",
                          }}
                          editorState={editorData10}
                          onEditorStateChange={(value) =>
                            handelChange(value, 10, 2)
                          }
                        // onBlur={() => helpers.setTouched(true)}
                        />
                        {/* <MyTextArea type="text" className="form-control" name="teach" /> */}
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
                        {getImageUrl != "" ? (
                          <img src={getImageUrl} className=" w-30 p-3" alt="" />
                        ) : null}
                        {getState ? (
                          <p style={{ color: "red" }}>
                            Only Image is allowed !
                          </p>
                        ) : null}
                      </div>
                    </div>
                    <div className="col-lg-12 col-md-12 col-sm-12">
                      {!getbutton ? (
                        getState ? (
                          <Button disabled type="submit" variant="contained">
                            Submit
                          </Button>
                        ) : (
                          <Button type="submit" variant="contained">
                            Submit
                          </Button>
                        )
                      ) : (
                        <Button
                          variant="contained"
                          style={{ backgroundColor: "blue", color: "white" }}
                          disabled
                        >
                          Wait Please!
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </Form>
            </Formik>
          ) : getDetail.format === "C" ? (
            <Formik
              enableReinitialize={true}
              initialValues={{
                curriculum_id: location.state.curriculum_id,
                suboption_id: location.state.suboption_id,
                lesson_id: getDetail.id,
                title: getDetail.title,
                ready: getDetail.ready,
                lesson_set: getDetail.lesson_set,
                go: getDetail.go,
                safety_first: getDetail.safety_first,
                game_reset: getDetail.game_reset,
                home_play: getDetail.home_play,
                the_right_fit: getDetail.the_right_fit,
                guideline_addressed: getDetail.guideline_addressed,
                format: getDetail.format,
              }}
              validationSchema={Yup.object({
                title: Yup.string().required("Required"),
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

                formData.append("curriculum_id", values.curriculum_id);
                formData.append("suboption_id", values.suboption_id);
                formData.append("lesson_id", values.lesson_id);
                formData.append("title", values.title);
                formData.append("ready", Ready);
                formData.append("lesson_set", Set);
                formData.append("go", Go);
                formData.append("safety_first", SafetyFirst);
                formData.append("game_reset", GameReset);
                formData.append("home_play", HomePlay);
                formData.append("the_right_fit", TheRightFit);
                formData.append("guideline_addressed", Guideline);
                formData.append("format", LessonFormat);
                if (getImage.pictureAsFile) {
                  formData.append("image_url", getImage.pictureAsFile);
                }
                setbutton(true);
                console.log(values);

                edit_afterLesson(formData)
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
                    get_lessons({
                      curriculum_id: location.state.curriculum_id,
                      suboption_id: location.state.suboption_id,
                    })
                      .then((res) => {
                        console.log("=======>", res.data.result);

                        setLessonPlans(
                          res.data.result.map((el, index) => ({
                            ...el,
                            id: el.lesson_id,
                            i: index,
                          }))
                        );
                        setLoader(false);
                      })
                      .catch((err) => {
                        console.log(err);
                      });
                    setImage({});
                    setImageUrl("");
                    setShowEditLessonPlans(false);
                    setbutton(false);
                    setEditorData1("");
                    setIntegration("");
                    setEditorData2("");
                    setObjective("");
                    setEditorData3("");
                    setTarget("");
                    setEditorData4("");
                    setPrep("");
                    setEditorData5("");
                    setQuestions("");
                    setEditorData6("");
                    setCompetencies("");
                    setEditorData7("");
                    setSet("");
                    setEditorData8("");
                    setSparkItUp("");
                    setEditorData9("");
                    setAlignment("");
                    setEditorData10("");
                    setTeach("");
                    setEditorData11("");
                    setCues("");
                    setEditorData12("");
                    setSuggestion("");
                    setEditorData13("");
                    setVocabulary("");
                    setReady("");
                    setGo("");
                    setAdaptation("");
                    setAcademics("");
                    setTeacherTips("");
                    setFamilyFun("");
                    setLyrics("");
                    setMusicCredits("");
                    setSafetyFirst("");
                    setGameReset("");
                    setHomePlay("");
                    setTheRightFit("");
                    setGuideline("");
                    setIntegrationIcon("");
                    setKeyWords("");
                    setLessonFormat("");
                    setState(false);
                  })
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
                    setImage({});
                    setImageUrl("");
                    setbutton(false);
                    setEditorData1("");
                    setIntegration("");
                    setEditorData2("");
                    setObjective("");
                    setEditorData3("");
                    setTarget("");
                    setEditorData4("");
                    setPrep("");
                    setEditorData5("");
                    setQuestions("");
                    setEditorData6("");
                    setCompetencies("");
                    setEditorData7("");
                    setSet("");
                    setEditorData8("");
                    setSparkItUp("");
                    setEditorData9("");
                    setAlignment("");
                    setEditorData10("");
                    setTeach("");
                    setEditorData11("");
                    setCues("");
                    setEditorData12("");
                    setSuggestion("");
                    setEditorData13("");
                    setVocabulary("");
                    setReady("");
                    setGo("");
                    setAdaptation("");
                    setAcademics("");
                    setTeacherTips("");
                    setFamilyFun("");
                    setLyrics("");
                    setMusicCredits("");
                    setSafetyFirst("");
                    setGameReset("");
                    setHomePlay("");
                    setTheRightFit("");
                    setGuideline("");
                    setIntegrationIcon("");
                    setKeyWords("");
                    setShowEditLessonPlans(false);
                    setLessonFormat("");
                    setState(false);
                  });
              }}
            >
              <Form>
                <div className="modal-body">
                  <h3 className="format-heading">FORMAT C</h3>

                  <div className="row">
                    <div className="col-lg-4 col-md-12 col-sm-12">
                      <div className="form-group">
                        <label>Name</label>
                        <MyTextInput
                          type="text"
                          className="form-control"
                          name="title"
                        />
                      </div>
                    </div>
                    <div className="col-lg-12 col-md-12 col-sm-12">
                      <div className="form-group spo">
                        <label>Ready</label>
                        <Editor
                          toolbar={{
                            options: [
                              "inline",
                              "blockType",
                              "fontSize",
                              "fontFamily",
                              "list",
                              "textAlign",
                              "colorPicker",
                              "link",
                              "embedded" /*, 'emoji'*/,
                              "image",
                              "remove",
                              "history",
                            ],
                          }}
                          handlePastedText={() => false}
                          toolbarClassName="toolbarClassName"
                          wrapperClassName="wrapperClassName"
                          editorClassName="editorClassName"
                          wrapperStyle={{
                            border: "1px solid #d6d6d6",
                            padding: 10,
                            borderRadius: 10,
                          }}
                          toolbarStyle={{
                            border: 0,
                            borderBottom: "1px solid #d6d6d6",
                          }}
                          editorState={editorData1}
                          onEditorStateChange={(value) =>
                            handelChange(value, 1, 3)
                          }
                        // onBlur={() => helpers.setTouched(true)}
                        />
                        {/* <MyTextEditor type="text" className="form-control" name="integration" />                                                 */}
                      </div>
                    </div>
                    <div className="col-lg-12 col-md-12 col-sm-12">
                      <div className="form-group">
                        <label>Set</label>
                        <Editor
                          toolbar={{
                            options: [
                              "inline",
                              "blockType",
                              "fontSize",
                              "fontFamily",
                              "list",
                              "textAlign",
                              "colorPicker",
                              "link",
                              "embedded" /*, 'emoji'*/,
                              "image",
                              "remove",
                              "history",
                            ],
                          }}
                          handlePastedText={() => false}
                          toolbarClassName="toolbarClassName"
                          wrapperClassName="wrapperClassName"
                          editorClassName="editorClassName"
                          wrapperStyle={{
                            border: "1px solid #d6d6d6",
                            padding: 10,
                            borderRadius: 10,
                          }}
                          toolbarStyle={{
                            border: 0,
                            borderBottom: "1px solid #d6d6d6",
                          }}
                          editorState={editorData2}
                          onEditorStateChange={(value) =>
                            handelChange(value, 2, 3)
                          }
                        // onBlur={() => helpers.setTouched(true)}
                        />
                        {/* <MyTextArea type="text" className="form-control" name="lesson_objective" /> */}
                      </div>
                    </div>
                    <div className="col-lg-12 col-md-12 col-sm-12">
                      <div className="form-group">
                        <label>Go</label>
                        <Editor
                          toolbar={{
                            options: [
                              "inline",
                              "blockType",
                              "fontSize",
                              "fontFamily",
                              "list",
                              "textAlign",
                              "colorPicker",
                              "link",
                              "embedded" /*, 'emoji'*/,
                              "image",
                              "remove",
                              "history",
                            ],
                          }}
                          handlePastedText={() => false}
                          toolbarClassName="toolbarClassName"
                          wrapperClassName="wrapperClassName"
                          editorClassName="editorClassName"
                          wrapperStyle={{
                            border: "1px solid #d6d6d6",
                            padding: 10,
                            borderRadius: 10,
                          }}
                          toolbarStyle={{
                            border: 0,
                            borderBottom: "1px solid #d6d6d6",
                          }}
                          editorState={editorData3}
                          onEditorStateChange={(value) =>
                            handelChange(value, 3, 3)
                          }
                        // onBlur={() => helpers.setTouched(true)}
                        />
                        {/* <MyTextArea type="text" className="form-control" name="lesson_target" /> */}
                      </div>
                    </div>
                    <div className="col-lg-12 col-md-12 col-sm-12">
                      <div className="form-group">
                        <label>Safety First</label>
                        <Editor
                          toolbar={{
                            options: [
                              "inline",
                              "blockType",
                              "fontSize",
                              "fontFamily",
                              "list",
                              "textAlign",
                              "colorPicker",
                              "link",
                              "embedded" /*, 'emoji'*/,
                              "image",
                              "remove",
                              "history",
                            ],
                          }}
                          handlePastedText={() => false}
                          toolbarClassName="toolbarClassName"
                          wrapperClassName="wrapperClassName"
                          editorClassName="editorClassName"
                          wrapperStyle={{
                            border: "1px solid #d6d6d6",
                            padding: 10,
                            borderRadius: 10,
                          }}
                          toolbarStyle={{
                            border: 0,
                            borderBottom: "1px solid #d6d6d6",
                          }}
                          editorState={editorData4}
                          onEditorStateChange={(value) =>
                            handelChange(value, 4, 3)
                          }
                        // onBlur={() => helpers.setTouched(true)}
                        />
                        {/* <MyTextArea type="text" className="form-control" name="prep" /> */}
                      </div>
                    </div>
                    <div className="col-lg-12 col-md-12 col-sm-12">
                      <div className="form-group">
                        <label>Game Reset</label>
                        <Editor
                          toolbar={{
                            options: [
                              "inline",
                              "blockType",
                              "fontSize",
                              "fontFamily",
                              "list",
                              "textAlign",
                              "colorPicker",
                              "link",
                              "embedded" /*, 'emoji'*/,
                              "image",
                              "remove",
                              "history",
                            ],
                          }}
                          handlePastedText={() => false}
                          toolbarClassName="toolbarClassName"
                          wrapperClassName="wrapperClassName"
                          editorClassName="editorClassName"
                          wrapperStyle={{
                            border: "1px solid #d6d6d6",
                            padding: 10,
                            borderRadius: 10,
                          }}
                          toolbarStyle={{
                            border: 0,
                            borderBottom: "1px solid #d6d6d6",
                          }}
                          editorState={editorData5}
                          onEditorStateChange={(value) =>
                            handelChange(value, 5, 3)
                          }
                        // onBlur={() => helpers.setTouched(true)}
                        />
                        {/* <MyTextArea type="text" className="form-control" name="reflection_question" /> */}
                      </div>
                    </div>
                    <div className="col-lg-12 col-md-12 col-sm-12">
                      <div className="form-group">
                        <label>Home Play</label>
                        <Editor
                          toolbar={{
                            options: [
                              "inline",
                              "blockType",
                              "fontSize",
                              "fontFamily",
                              "list",
                              "textAlign",
                              "colorPicker",
                              "link",
                              "embedded" /*, 'emoji'*/,
                              "image",
                              "remove",
                              "history",
                            ],
                          }}
                          handlePastedText={() => false}
                          toolbarClassName="toolbarClassName"
                          wrapperClassName="wrapperClassName"
                          editorClassName="editorClassName"
                          wrapperStyle={{
                            border: "1px solid #d6d6d6",
                            padding: 10,
                            borderRadius: 10,
                          }}
                          toolbarStyle={{
                            border: 0,
                            borderBottom: "1px solid #d6d6d6",
                          }}
                          editorState={editorData6}
                          onEditorStateChange={(value) =>
                            handelChange(value, 6, 3)
                          }
                        // onBlur={() => helpers.setTouched(true)}
                        />
                        {/* <MyTextArea type="text" className="form-control" name="sel_compentencies" /> */}
                      </div>
                    </div>
                    <div className="col-lg-12 col-md-12 col-sm-12">
                      <div className="form-group">
                        <label>The Right Fit</label>
                        <Editor
                          toolbar={{
                            options: [
                              "inline",
                              "blockType",
                              "fontSize",
                              "fontFamily",
                              "list",
                              "textAlign",
                              "colorPicker",
                              "link",
                              "embedded" /*, 'emoji'*/,
                              "image",
                              "remove",
                              "history",
                            ],
                          }}
                          handlePastedText={() => false}
                          toolbarClassName="toolbarClassName"
                          wrapperClassName="wrapperClassName"
                          editorClassName="editorClassName"
                          wrapperStyle={{
                            border: "1px solid #d6d6d6",
                            padding: 10,
                            borderRadius: 10,
                          }}
                          toolbarStyle={{
                            border: 0,
                            borderBottom: "1px solid #d6d6d6",
                          }}
                          editorState={editorData7}
                          onEditorStateChange={(value) =>
                            handelChange(value, 7, 3)
                          }
                        // onBlur={() => helpers.setTouched(true)}
                        />
                        {/* <MyTextArea type="text" className="form-control" name="lesson_set" /> */}
                      </div>
                    </div>
                    <div className="col-lg-12 col-md-12 col-sm-12">
                      <div className="form-group">
                        <label>Guideline Addressed</label>
                        <Editor
                          toolbar={{
                            options: [
                              "inline",
                              "blockType",
                              "fontSize",
                              "fontFamily",
                              "list",
                              "textAlign",
                              "colorPicker",
                              "link",
                              "embedded" /*, 'emoji'*/,
                              "image",
                              "remove",
                              "history",
                            ],
                          }}
                          handlePastedText={() => false}
                          toolbarClassName="toolbarClassName"
                          wrapperClassName="wrapperClassName"
                          editorClassName="editorClassName"
                          wrapperStyle={{
                            border: "1px solid #d6d6d6",
                            padding: 10,
                            borderRadius: 10,
                          }}
                          toolbarStyle={{
                            border: 0,
                            borderBottom: "1px solid #d6d6d6",
                          }}
                          editorState={editorData8}
                          onEditorStateChange={(value) =>
                            handelChange(value, 8, 3)
                          }
                        // onBlur={() => helpers.setTouched(true)}
                        />
                        {/* <MyTextArea type="text" className="form-control" name="spark_it_up" /> */}
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
                        {getImageUrl != "" ? (
                          <img src={getImageUrl} className=" w-30 p-3" alt="" />
                        ) : null}
                        {getState ? (
                          <p style={{ color: "red" }}>
                            Only Image is allowed !
                          </p>
                        ) : null}
                      </div>
                    </div>
                    <div className="col-lg-12 col-md-12 col-sm-12">
                      {!getbutton ? (
                        getState ? (
                          <Button disabled type="submit" variant="contained">
                            Submit
                          </Button>
                        ) : (
                          <Button type="submit" variant="contained">
                            Submit
                          </Button>
                        )
                      ) : (
                        <Button
                          variant="contained"
                          style={{ backgroundColor: "blue", color: "white" }}
                          disabled
                        >
                          Wait Please!
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </Form>
            </Formik>
          ) : getDetail.format === "D" ? (
            <Formik
              enableReinitialize={true}
              initialValues={{
                curriculum_id: location.state.curriculum_id,
                suboption_id: location.state.suboption_id,
                lesson_id: getDetail.id,
                title: getDetail.title,
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
                integration_icon: getDetail.integration_icon,
                key_words: getDetail.key_words,
                format: getDetail.format,
              }}
              validationSchema={Yup.object({
                title: Yup.string().required("Required"),
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

                formData.append("curriculum_id", values.curriculum_id);
                formData.append("suboption_id", values.suboption_id);
                formData.append("lesson_id", values.lesson_id);
                formData.append("title", values.title);
                formData.append("integration", Integration);
                formData.append("lesson_objective", Objective);
                formData.append("lesson_target", Target);
                formData.append("prep", Prep);
                formData.append("reflection_question", Questions);
                formData.append("sel_compentencies", Competencies);
                formData.append("lesson_set", Set);
                formData.append("spark_it_up", SparkItUp);
                formData.append("standards_alignment", Alignment);
                formData.append("teach", Teach);
                formData.append("teaching_cues", Cues);
                formData.append("teaching_suggestions", Suggestion);
                formData.append("integration_icon", IntegrationIcon);
                formData.append("key_words", KeyWords);
                formData.append("format", LessonFormat);

                if (getImage.pictureAsFile) {
                  formData.append("image_url", getImage.pictureAsFile);
                }
                setbutton(true);
                console.log(values);

                edit_HighLesson(formData)
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
                    get_lessons({
                      curriculum_id: location.state.curriculum_id,
                      suboption_id: location.state.suboption_id,
                    })
                      .then((res) => {
                        console.log("=======>", res.data.result);

                        setLessonPlans(
                          res.data.result.map((el, index) => ({
                            ...el,
                            id: el.lesson_id,
                            i: index,
                          }))
                        );
                        setLoader(false);
                      })
                      .catch((err) => {
                        console.log(err);
                      });
                    setImage({});
                    setImageUrl("");
                    setShowEditLessonPlans(false);
                    setbutton(false);
                    setEditorData1("");
                    setIntegration("");
                    setEditorData2("");
                    setObjective("");
                    setEditorData3("");
                    setTarget("");
                    setEditorData4("");
                    setPrep("");
                    setEditorData5("");
                    setQuestions("");
                    setEditorData6("");
                    setCompetencies("");
                    setEditorData7("");
                    setSet("");
                    setEditorData8("");
                    setSparkItUp("");
                    setEditorData9("");
                    setAlignment("");
                    setEditorData10("");
                    setTeach("");
                    setEditorData11("");
                    setCues("");
                    setEditorData12("");
                    setSuggestion("");
                    setEditorData13("");
                    setVocabulary("");
                    setReady("");
                    setGo("");
                    setAdaptation("");
                    setAcademics("");
                    setTeacherTips("");
                    setFamilyFun("");
                    setLyrics("");
                    setMusicCredits("");
                    setSafetyFirst("");
                    setGameReset("");
                    setHomePlay("");
                    setTheRightFit("");
                    setGuideline("");
                    setIntegrationIcon("");
                    setKeyWords("");
                    setState(false);
                    setLessonFormat("");
                  })
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
                    setImage({});
                    setImageUrl("");
                    setbutton(false);
                    setShowEditLessonPlans(false);
                    setEditorData1("");
                    setIntegration("");
                    setEditorData2("");
                    setObjective("");
                    setEditorData3("");
                    setTarget("");
                    setEditorData4("");
                    setPrep("");
                    setEditorData5("");
                    setQuestions("");
                    setEditorData6("");
                    setCompetencies("");
                    setEditorData7("");
                    setSet("");
                    setEditorData8("");
                    setSparkItUp("");
                    setEditorData9("");
                    setAlignment("");
                    setEditorData10("");
                    setTeach("");
                    setEditorData11("");
                    setCues("");
                    setEditorData12("");
                    setSuggestion("");
                    setEditorData13("");
                    setVocabulary("");
                    setReady("");
                    setGo("");
                    setAdaptation("");
                    setAcademics("");
                    setTeacherTips("");
                    setFamilyFun("");
                    setLyrics("");
                    setMusicCredits("");
                    setSafetyFirst("");
                    setGameReset("");
                    setHomePlay("");
                    setTheRightFit("");
                    setGuideline("");
                    setIntegrationIcon("");
                    setKeyWords("");
                    setState(false);
                    setLessonFormat("");
                  });
              }}
            >
              <Form>
                <div className="modal-body">
                  <h3 className="format-heading">FORMAT D</h3>

                  <div className="row">
                    <div className="col-lg-4 col-md-12 col-sm-12">
                      <div className="form-group">
                        <label>Name</label>
                        <MyTextInput
                          type="text"
                          className="form-control"
                          name="title"
                        />
                      </div>
                    </div>
                    <div className="col-lg-12 col-md-12 col-sm-12">
                      <div className="form-group spo">
                        <label>Integration</label>
                        {console.log("===========aaaaa====>", editorData1)}
                        <Editor
                          toolbar={{
                            options: [
                              "inline",
                              "blockType",
                              "fontSize",
                              "fontFamily",
                              "list",
                              "textAlign",
                              "colorPicker",
                              "link",
                              "embedded" /*, 'emoji'*/,
                              "image",
                              "remove",
                              "history",
                            ],
                          }}
                          handlePastedText={() => false}
                          toolbarClassName="toolbarClassName"
                          wrapperClassName="wrapperClassName"
                          editorClassName="editorClassName"
                          wrapperStyle={{
                            border: "1px solid #d6d6d6",
                            padding: 10,
                            borderRadius: 10,
                          }}
                          toolbarStyle={{
                            border: 0,
                            borderBottom: "1px solid #d6d6d6",
                          }}
                          editorState={editorData1}
                          onEditorStateChange={(value) =>
                            handelChange(value, 1, 4)
                          }
                        // onBlur={() => helpers.setTouched(true)}
                        />
                        {/* <MyTextEditor type="text" className="form-control" name="integration" />                                                 */}
                      </div>
                    </div>
                    <div className="col-lg-12 col-md-12 col-sm-12">
                      <div className="form-group">
                        <label>Lesson Objective</label>
                        <Editor
                          toolbar={{
                            options: [
                              "inline",
                              "blockType",
                              "fontSize",
                              "fontFamily",
                              "list",
                              "textAlign",
                              "colorPicker",
                              "link",
                              "embedded" /*, 'emoji'*/,
                              "image",
                              "remove",
                              "history",
                            ],
                          }}
                          handlePastedText={() => false}
                          toolbarClassName="toolbarClassName"
                          wrapperClassName="wrapperClassName"
                          editorClassName="editorClassName"
                          wrapperStyle={{
                            border: "1px solid #d6d6d6",
                            padding: 10,
                            borderRadius: 10,
                          }}
                          toolbarStyle={{
                            border: 0,
                            borderBottom: "1px solid #d6d6d6",
                          }}
                          editorState={editorData2}
                          onEditorStateChange={(value) =>
                            handelChange(value, 2, 4)
                          }
                        // onBlur={() => helpers.setTouched(true)}
                        />
                        {/* <MyTextArea type="text" className="form-control" name="lesson_objective" /> */}
                      </div>
                    </div>
                    <div className="col-lg-12 col-md-12 col-sm-12">
                      <div className="form-group">
                        <label>Lesson Target</label>
                        <Editor
                          toolbar={{
                            options: [
                              "inline",
                              "blockType",
                              "fontSize",
                              "fontFamily",
                              "list",
                              "textAlign",
                              "colorPicker",
                              "link",
                              "embedded" /*, 'emoji'*/,
                              "image",
                              "remove",
                              "history",
                            ],
                          }}
                          handlePastedText={() => false}
                          toolbarClassName="toolbarClassName"
                          wrapperClassName="wrapperClassName"
                          editorClassName="editorClassName"
                          wrapperStyle={{
                            border: "1px solid #d6d6d6",
                            padding: 10,
                            borderRadius: 10,
                          }}
                          toolbarStyle={{
                            border: 0,
                            borderBottom: "1px solid #d6d6d6",
                          }}
                          editorState={editorData3}
                          onEditorStateChange={(value) =>
                            handelChange(value, 3, 4)
                          }
                        // onBlur={() => helpers.setTouched(true)}
                        />
                        {/* <MyTextArea type="text" className="form-control" name="lesson_target" /> */}
                      </div>
                    </div>
                    <div className="col-lg-12 col-md-12 col-sm-12">
                      <div className="form-group">
                        <label>Prep</label>
                        <Editor
                          toolbar={{
                            options: [
                              "inline",
                              "blockType",
                              "fontSize",
                              "fontFamily",
                              "list",
                              "textAlign",
                              "colorPicker",
                              "link",
                              "embedded" /*, 'emoji'*/,
                              "image",
                              "remove",
                              "history",
                            ],
                          }}
                          handlePastedText={() => false}
                          toolbarClassName="toolbarClassName"
                          wrapperClassName="wrapperClassName"
                          editorClassName="editorClassName"
                          wrapperStyle={{
                            border: "1px solid #d6d6d6",
                            padding: 10,
                            borderRadius: 10,
                          }}
                          toolbarStyle={{
                            border: 0,
                            borderBottom: "1px solid #d6d6d6",
                          }}
                          editorState={editorData4}
                          onEditorStateChange={(value) =>
                            handelChange(value, 4, 4)
                          }
                        // onBlur={() => helpers.setTouched(true)}
                        />
                        {/* <MyTextArea type="text" className="form-control" name="prep" /> */}
                      </div>
                    </div>
                    <div className="col-lg-12 col-md-12 col-sm-12">
                      <div className="form-group">
                        <label>Reflection Question</label>
                        <Editor
                          toolbar={{
                            options: [
                              "inline",
                              "blockType",
                              "fontSize",
                              "fontFamily",
                              "list",
                              "textAlign",
                              "colorPicker",
                              "link",
                              "embedded" /*, 'emoji'*/,
                              "image",
                              "remove",
                              "history",
                            ],
                          }}
                          handlePastedText={() => false}
                          toolbarClassName="toolbarClassName"
                          wrapperClassName="wrapperClassName"
                          editorClassName="editorClassName"
                          wrapperStyle={{
                            border: "1px solid #d6d6d6",
                            padding: 10,
                            borderRadius: 10,
                          }}
                          toolbarStyle={{
                            border: 0,
                            borderBottom: "1px solid #d6d6d6",
                          }}
                          editorState={editorData5}
                          onEditorStateChange={(value) =>
                            handelChange(value, 5, 4)
                          }
                        // onBlur={() => helpers.setTouched(true)}
                        />
                        {/* <MyTextArea type="text" className="form-control" name="reflection_question" /> */}
                      </div>
                    </div>
                    <div className="col-lg-12 col-md-12 col-sm-12">
                      <div className="form-group">
                        <label>Competencies</label>
                        <Editor
                          toolbar={{
                            options: [
                              "inline",
                              "blockType",
                              "fontSize",
                              "fontFamily",
                              "list",
                              "textAlign",
                              "colorPicker",
                              "link",
                              "embedded" /*, 'emoji'*/,
                              "image",
                              "remove",
                              "history",
                            ],
                          }}
                          handlePastedText={() => false}
                          toolbarClassName="toolbarClassName"
                          wrapperClassName="wrapperClassName"
                          editorClassName="editorClassName"
                          wrapperStyle={{
                            border: "1px solid #d6d6d6",
                            padding: 10,
                            borderRadius: 10,
                          }}
                          toolbarStyle={{
                            border: 0,
                            borderBottom: "1px solid #d6d6d6",
                          }}
                          editorState={editorData6}
                          onEditorStateChange={(value) =>
                            handelChange(value, 6, 4)
                          }
                        // onBlur={() => helpers.setTouched(true)}
                        />
                        {/* <MyTextArea type="text" className="form-control" name="sel_compentencies" /> */}
                      </div>
                    </div>
                    <div className="col-lg-12 col-md-12 col-sm-12">
                      <div className="form-group">
                        <label>Lesson Set</label>
                        <Editor
                          toolbar={{
                            options: [
                              "inline",
                              "blockType",
                              "fontSize",
                              "fontFamily",
                              "list",
                              "textAlign",
                              "colorPicker",
                              "link",
                              "embedded" /*, 'emoji'*/,
                              "image",
                              "remove",
                              "history",
                            ],
                          }}
                          handlePastedText={() => false}
                          toolbarClassName="toolbarClassName"
                          wrapperClassName="wrapperClassName"
                          editorClassName="editorClassName"
                          wrapperStyle={{
                            border: "1px solid #d6d6d6",
                            padding: 10,
                            borderRadius: 10,
                          }}
                          toolbarStyle={{
                            border: 0,
                            borderBottom: "1px solid #d6d6d6",
                          }}
                          editorState={editorData7}
                          onEditorStateChange={(value) =>
                            handelChange(value, 7, 4)
                          }
                        // onBlur={() => helpers.setTouched(true)}
                        />
                        {/* <MyTextArea type="text" className="form-control" name="lesson_set" /> */}
                      </div>
                    </div>
                    <div className="col-lg-12 col-md-12 col-sm-12">
                      <div className="form-group">
                        <label>Spark It Up</label>
                        <Editor
                          toolbar={{
                            options: [
                              "inline",
                              "blockType",
                              "fontSize",
                              "fontFamily",
                              "list",
                              "textAlign",
                              "colorPicker",
                              "link",
                              "embedded" /*, 'emoji'*/,
                              "image",
                              "remove",
                              "history",
                            ],
                          }}
                          handlePastedText={() => false}
                          toolbarClassName="toolbarClassName"
                          wrapperClassName="wrapperClassName"
                          editorClassName="editorClassName"
                          wrapperStyle={{
                            border: "1px solid #d6d6d6",
                            padding: 10,
                            borderRadius: 10,
                          }}
                          toolbarStyle={{
                            border: 0,
                            borderBottom: "1px solid #d6d6d6",
                          }}
                          editorState={editorData8}
                          onEditorStateChange={(value) =>
                            handelChange(value, 8, 4)
                          }
                        // onBlur={() => helpers.setTouched(true)}
                        />
                        {/* <MyTextArea type="text" className="form-control" name="spark_it_up" /> */}
                      </div>
                    </div>
                    <div className="col-lg-12 col-md-12 col-sm-12">
                      <div className="form-group">
                        <label>Standard Alignment</label>
                        <Editor
                          toolbar={{
                            options: [
                              "inline",
                              "blockType",
                              "fontSize",
                              "fontFamily",
                              "list",
                              "textAlign",
                              "colorPicker",
                              "link",
                              "embedded" /*, 'emoji'*/,
                              "image",
                              "remove",
                              "history",
                            ],
                          }}
                          handlePastedText={() => false}
                          toolbarClassName="toolbarClassName"
                          wrapperClassName="wrapperClassName"
                          editorClassName="editorClassName"
                          wrapperStyle={{
                            border: "1px solid #d6d6d6",
                            padding: 10,
                            borderRadius: 10,
                          }}
                          toolbarStyle={{
                            border: 0,
                            borderBottom: "1px solid #d6d6d6",
                          }}
                          editorState={editorData9}
                          onEditorStateChange={(value) =>
                            handelChange(value, 9, 4)
                          }
                        // onBlur={() => helpers.setTouched(true)}
                        />
                        {/* <MyTextArea type="text" className="form-control" name="standards_alignment" /> */}
                      </div>
                    </div>
                    <div className="col-lg-12 col-md-12 col-sm-12">
                      <div className="form-group">
                        <label>Teach</label>
                        <Editor
                          toolbar={{
                            options: [
                              "inline",
                              "blockType",
                              "fontSize",
                              "fontFamily",
                              "list",
                              "textAlign",
                              "colorPicker",
                              "link",
                              "embedded" /*, 'emoji'*/,
                              "image",
                              "remove",
                              "history",
                            ],
                          }}
                          handlePastedText={() => false}
                          toolbarClassName="toolbarClassName"
                          wrapperClassName="wrapperClassName"
                          editorClassName="editorClassName"
                          wrapperStyle={{
                            border: "1px solid #d6d6d6",
                            padding: 10,
                            borderRadius: 10,
                          }}
                          toolbarStyle={{
                            border: 0,
                            borderBottom: "1px solid #d6d6d6",
                          }}
                          editorState={editorData10}
                          onEditorStateChange={(value) =>
                            handelChange(value, 10, 4)
                          }
                        // onBlur={() => helpers.setTouched(true)}
                        />
                        {/* <MyTextArea type="text" className="form-control" name="teach" /> */}
                      </div>
                    </div>
                    <div className="col-lg-12 col-md-12 col-sm-12">
                      <div className="form-group">
                        <label>Teaching Cues</label>
                        <Editor
                          toolbar={{
                            options: [
                              "inline",
                              "blockType",
                              "fontSize",
                              "fontFamily",
                              "list",
                              "textAlign",
                              "colorPicker",
                              "link",
                              "embedded" /*, 'emoji'*/,
                              "image",
                              "remove",
                              "history",
                            ],
                          }}
                          handlePastedText={() => false}
                          toolbarClassName="toolbarClassName"
                          wrapperClassName="wrapperClassName"
                          editorClassName="editorClassName"
                          wrapperStyle={{
                            border: "1px solid #d6d6d6",
                            padding: 10,
                            borderRadius: 10,
                          }}
                          toolbarStyle={{
                            border: 0,
                            borderBottom: "1px solid #d6d6d6",
                          }}
                          editorState={editorData11}
                          onEditorStateChange={(value) =>
                            handelChange(value, 11, 4)
                          }
                        // onBlur={() => helpers.setTouched(true)}
                        />
                        {/* <MyTextArea type="text" className="form-control" name="teaching_cues" /> */}
                      </div>
                    </div>
                    <div className="col-lg-12 col-md-12 col-sm-12">
                      <div className="form-group">
                        <label>Teaching Suggestions</label>
                        <Editor
                          toolbar={{
                            options: [
                              "inline",
                              "blockType",
                              "fontSize",
                              "fontFamily",
                              "list",
                              "textAlign",
                              "colorPicker",
                              "link",
                              "embedded" /*, 'emoji'*/,
                              "image",
                              "remove",
                              "history",
                            ],
                          }}
                          handlePastedText={() => false}
                          toolbarClassName="toolbarClassName"
                          wrapperClassName="wrapperClassName"
                          editorClassName="editorClassName"
                          wrapperStyle={{
                            border: "1px solid #d6d6d6",
                            padding: 10,
                            borderRadius: 10,
                          }}
                          toolbarStyle={{
                            border: 0,
                            borderBottom: "1px solid #d6d6d6",
                          }}
                          editorState={editorData12}
                          onEditorStateChange={(value) =>
                            handelChange(value, 12, 4)
                          }
                        // onBlur={() => helpers.setTouched(true)}
                        />
                        {/* <MyTextArea type="text" className="form-control" name="teaching_suggestions" /> */}
                      </div>
                    </div>
                    <div className="col-lg-12 col-md-12 col-sm-12">
                      <div className="form-group">
                        <label>Integration Icons</label>
                        <Editor
                          toolbar={{
                            options: [
                              "inline",
                              "blockType",
                              "fontSize",
                              "fontFamily",
                              "list",
                              "textAlign",
                              "colorPicker",
                              "link",
                              "embedded" /*, 'emoji'*/,
                              "image",
                              "remove",
                              "history",
                            ],
                          }}
                          handlePastedText={() => false}
                          toolbarClassName="toolbarClassName"
                          wrapperClassName="wrapperClassName"
                          editorClassName="editorClassName"
                          wrapperStyle={{
                            border: "1px solid #d6d6d6",
                            padding: 10,
                            borderRadius: 10,
                          }}
                          toolbarStyle={{
                            border: 0,
                            borderBottom: "1px solid #d6d6d6",
                          }}
                          editorState={editorData13}
                          onEditorStateChange={(value) =>
                            handelChange(value, 13, 4)
                          }
                        // onBlur={() => helpers.setTouched(true)}
                        />
                        {/* <MyTextArea type="text" className="form-control" name="vocabulary" /> */}
                      </div>
                    </div>
                    <div className="col-lg-12 col-md-12 col-sm-12">
                      <div className="form-group">
                        <label>Key Words</label>
                        <Editor
                          toolbar={{
                            options: [
                              "inline",
                              "blockType",
                              "fontSize",
                              "fontFamily",
                              "list",
                              "textAlign",
                              "colorPicker",
                              "link",
                              "embedded" /*, 'emoji'*/,
                              "image",
                              "remove",
                              "history",
                            ],
                          }}
                          handlePastedText={() => false}
                          toolbarClassName="toolbarClassName"
                          wrapperClassName="wrapperClassName"
                          editorClassName="editorClassName"
                          wrapperStyle={{
                            border: "1px solid #d6d6d6",
                            padding: 10,
                            borderRadius: 10,
                          }}
                          toolbarStyle={{
                            border: 0,
                            borderBottom: "1px solid #d6d6d6",
                          }}
                          editorState={editorData14}
                          onEditorStateChange={(value) =>
                            handelChange(value, 14, 4)
                          }
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
                        {getImageUrl != "" ? (
                          <img src={getImageUrl} className=" w-30 p-3" alt="" />
                        ) : null}
                        {getState ? (
                          <p style={{ color: "red" }}>
                            Only Image is allowed !
                          </p>
                        ) : null}
                      </div>
                    </div>
                    <div className="col-lg-12 col-md-12 col-sm-12">
                      {!getbutton ? (
                        getState ? (
                          <Button disabled type="submit" variant="contained">
                            Submit
                          </Button>
                        ) : (
                          <Button type="submit" variant="contained">
                            Submit
                          </Button>
                        )
                      ) : (
                        <Button
                          variant="contained"
                          style={{ backgroundColor: "blue", color: "white" }}
                          disabled
                        >
                          Wait Please!
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </Form>
            </Formik>
          ) : null}
        </Modal.Body>
      </Modal>
      {/* Ends */}

      {/* Modal Add LessonPlans */}
      <Modal show={showAddLessonPlans} keyboard={false}>
        <Modal.Header>
          <Modal.Title>Add Lesson Plan</Modal.Title>
          <i
            className="fas fa-cut"
            style={{ cursor: "pointer" }}
            onClick={handleClose1}
          ></i>
        </Modal.Header>
        <Modal.Body>
          {Format === "1" ? (
            <Formik
              enableReinitialize={true}
              initialValues={{
                curriculum_id: location.state.curriculum_id,
                suboption_id: location.state.suboption_id,
                lesson_name: "",
                integration: "",
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
                let formData = new FormData();

                formData.append("curriculum_id", values.curriculum_id);
                formData.append("suboption_id", values.suboption_id);
                formData.append("lesson_id", values.lesson_id);
                formData.append("lesson_name", values.lesson_name);
                formData.append("integration", Integration);
                formData.append("lesson_objective", Objective);
                formData.append("lesson_target", Target);
                formData.append("prep", Prep);
                formData.append("reflection_question", Questions);
                formData.append("sel_compentencies", Competencies);
                formData.append("lesson_set", Set);
                formData.append("spark_it_up", SparkItUp);
                formData.append("standards_alignment", Alignment);
                formData.append("teach", Teach);
                formData.append("teaching_cues", Cues);
                formData.append("teaching_suggestions", Suggestion);
                formData.append("vocabulary", Vocabulary);
                if (getImage.pictureAsFile) {
                  formData.append("image_url", getImage.pictureAsFile);
                }
                setbutton(true);
                console.log(values);

                add_lesson(formData)
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
                    get_lessons({
                      curriculum_id: location.state.curriculum_id,
                      suboption_id: location.state.suboption_id,
                    })
                      .then((res) => {
                        console.log("=======>", res.data.result);

                        setLessonPlans(
                          res.data.result.map((el, index) => ({
                            ...el,
                            id: el.lesson_id,
                            i: index,
                          }))
                        );
                        setLoader(false);
                      })
                      .catch((err) => {
                        console.log(err);
                      });
                    setImage({});
                    setImageUrl("");
                    setShowAddLessonPlans(false);
                    setbutton(false);

                    setEditorData1("");
                    setIntegration("");
                    setEditorData2("");
                    setObjective("");
                    setEditorData3("");
                    setTarget("");
                    setEditorData4("");
                    setPrep("");
                    setEditorData5("");
                    setQuestions("");
                    setEditorData6("");
                    setCompetencies("");
                    setEditorData7("");
                    setSet("");
                    setEditorData8("");
                    setSparkItUp("");
                    setEditorData9("");
                    setAlignment("");
                    setEditorData10("");
                    setTeach("");
                    setEditorData11("");
                    setCues("");
                    setEditorData12("");
                    setSuggestion("");
                    setEditorData13("");
                    setVocabulary("");
                    setReady("");
                    setGo("");
                    setAdaptation("");
                    setAcademics("");
                    setTeacherTips("");
                    setFamilyFun("");
                    setLyrics("");
                    setMusicCredits("");
                    setSafetyFirst("");
                    setGameReset("");
                    setHomePlay("");
                    setTheRightFit("");
                    setGuideline("");
                    setIntegrationIcon("");
                    setKeyWords("");
                    setState(false);
                  })
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
                    setImage({});
                    setImageUrl("");
                    setbutton(false);
                    setShowAddLessonPlans(false);
                    setEditorData1("");
                    setIntegration("");
                    setEditorData2("");
                    setObjective("");
                    setEditorData3("");
                    setTarget("");
                    setEditorData4("");
                    setPrep("");
                    setEditorData5("");
                    setQuestions("");
                    setEditorData6("");
                    setCompetencies("");
                    setEditorData7("");
                    setSet("");
                    setEditorData8("");
                    setSparkItUp("");
                    setEditorData9("");
                    setAlignment("");
                    setEditorData10("");
                    setTeach("");
                    setEditorData11("");
                    setCues("");
                    setEditorData12("");
                    setSuggestion("");
                    setEditorData13("");
                    setVocabulary("");
                    setReady("");
                    setGo("");
                    setAdaptation("");
                    setAcademics("");
                    setTeacherTips("");
                    setFamilyFun("");
                    setLyrics("");
                    setMusicCredits("");
                    setSafetyFirst("");
                    setGameReset("");
                    setHomePlay("");
                    setTheRightFit("");
                    setGuideline("");
                    setIntegrationIcon("");
                    setKeyWords("");
                    setState(false);
                  });
              }}
            >
              <Form>
                <div className="modal-body">
                  <h3 className="format-heading">FORMAT A</h3>
                  <div className="row">
                    <div className="col-lg-4 col-md-12 col-sm-12">
                      <div className="form-group">
                        <label>Name</label>
                        <MyTextInput
                          type="text"
                          className="form-control"
                          name="lesson_name"
                        />
                      </div>
                    </div>
                    <div className="col-lg-12 col-md-12 col-sm-12">
                      <div className="form-group spo">
                        <label>Integration</label>
                        <Editor
                          toolbar={{
                            options: [
                              "inline",
                              "blockType",
                              "fontSize",
                              "fontFamily",
                              "list",
                              "textAlign",
                              "colorPicker",
                              "link",
                              "embedded" /*, 'emoji'*/,
                              "image",
                              "remove",
                              "history",
                            ],
                          }}
                          handlePastedText={() => false}
                          toolbarClassName="toolbarClassName"
                          wrapperClassName="wrapperClassName"
                          editorClassName="editorClassName"
                          wrapperStyle={{
                            border: "1px solid #d6d6d6",
                            padding: 10,
                            borderRadius: 10,
                          }}
                          toolbarStyle={{
                            border: 0,
                            borderBottom: "1px solid #d6d6d6",
                          }}
                          editorState={editorData1}
                          onEditorStateChange={(value) =>
                            handelChange(value, 1, 1)
                          }
                        // onBlur={() => helpers.setTouched(true)}
                        />
                        {/* <MyTextEditor type="text" className="form-control" name="integration" />                                                 */}
                      </div>
                    </div>
                    <div className="col-lg-12 col-md-12 col-sm-12">
                      <div className="form-group">
                        <label>Learning Objective</label>
                        <Editor
                          toolbar={{
                            options: [
                              "inline",
                              "blockType",
                              "fontSize",
                              "fontFamily",
                              "list",
                              "textAlign",
                              "colorPicker",
                              "link",
                              "embedded" /*, 'emoji'*/,
                              "image",
                              "remove",
                              "history",
                            ],
                          }}
                          handlePastedText={() => false}
                          toolbarClassName="toolbarClassName"
                          wrapperClassName="wrapperClassName"
                          editorClassName="editorClassName"
                          wrapperStyle={{
                            border: "1px solid #d6d6d6",
                            padding: 10,
                            borderRadius: 10,
                          }}
                          toolbarStyle={{
                            border: 0,
                            borderBottom: "1px solid #d6d6d6",
                          }}
                          editorState={editorData2}
                          onEditorStateChange={(value) =>
                            handelChange(value, 2, 1)
                          }
                        // onBlur={() => helpers.setTouched(true)}
                        />
                        {/* <MyTextArea type="text" className="form-control" name="lesson_objective" /> */}
                      </div>
                    </div>
                    <div className="col-lg-12 col-md-12 col-sm-12">
                      <div className="form-group">
                        <label>Learning Target</label>
                        <Editor
                          toolbar={{
                            options: [
                              "inline",
                              "blockType",
                              "fontSize",
                              "fontFamily",
                              "list",
                              "textAlign",
                              "colorPicker",
                              "link",
                              "embedded" /*, 'emoji'*/,
                              "image",
                              "remove",
                              "history",
                            ],
                          }}
                          handlePastedText={() => false}
                          toolbarClassName="toolbarClassName"
                          wrapperClassName="wrapperClassName"
                          editorClassName="editorClassName"
                          wrapperStyle={{
                            border: "1px solid #d6d6d6",
                            padding: 10,
                            borderRadius: 10,
                          }}
                          toolbarStyle={{
                            border: 0,
                            borderBottom: "1px solid #d6d6d6",
                          }}
                          editorState={editorData3}
                          onEditorStateChange={(value) =>
                            handelChange(value, 3, 1)
                          }
                        // onBlur={() => helpers.setTouched(true)}
                        />
                        {/* <MyTextArea type="text" className="form-control" name="lesson_target" /> */}
                      </div>
                    </div>
                    <div className="col-lg-12 col-md-12 col-sm-12">
                      <div className="form-group">
                        <label>Prep</label>
                        <Editor
                          toolbar={{
                            options: [
                              "inline",
                              "blockType",
                              "fontSize",
                              "fontFamily",
                              "list",
                              "textAlign",
                              "colorPicker",
                              "link",
                              "embedded" /*, 'emoji'*/,
                              "image",
                              "remove",
                              "history",
                            ],
                          }}
                          handlePastedText={() => false}
                          toolbarClassName="toolbarClassName"
                          wrapperClassName="wrapperClassName"
                          editorClassName="editorClassName"
                          wrapperStyle={{
                            border: "1px solid #d6d6d6",
                            padding: 10,
                            borderRadius: 10,
                          }}
                          toolbarStyle={{
                            border: 0,
                            borderBottom: "1px solid #d6d6d6",
                          }}
                          editorState={editorData4}
                          onEditorStateChange={(value) =>
                            handelChange(value, 4, 1)
                          }
                        // onBlur={() => helpers.setTouched(true)}
                        />
                        {/* <MyTextArea type="text" className="form-control" name="prep" /> */}
                      </div>
                    </div>
                    <div className="col-lg-12 col-md-12 col-sm-12">
                      <div className="form-group">
                        <label>Reflection Question</label>
                        <Editor
                          toolbar={{
                            options: [
                              "inline",
                              "blockType",
                              "fontSize",
                              "fontFamily",
                              "list",
                              "textAlign",
                              "colorPicker",
                              "link",
                              "embedded" /*, 'emoji'*/,
                              "image",
                              "remove",
                              "history",
                            ],
                          }}
                          handlePastedText={() => false}
                          toolbarClassName="toolbarClassName"
                          wrapperClassName="wrapperClassName"
                          editorClassName="editorClassName"
                          wrapperStyle={{
                            border: "1px solid #d6d6d6",
                            padding: 10,
                            borderRadius: 10,
                          }}
                          toolbarStyle={{
                            border: 0,
                            borderBottom: "1px solid #d6d6d6",
                          }}
                          editorState={editorData5}
                          onEditorStateChange={(value) =>
                            handelChange(value, 5, 1)
                          }
                        // onBlur={() => helpers.setTouched(true)}
                        />
                        {/* <MyTextArea type="text" className="form-control" name="reflection_question" /> */}
                      </div>
                    </div>
                    <div className="col-lg-12 col-md-12 col-sm-12">
                      <div className="form-group">
                        <label>SEL</label>
                        <Editor
                          toolbar={{
                            options: [
                              "inline",
                              "blockType",
                              "fontSize",
                              "fontFamily",
                              "list",
                              "textAlign",
                              "colorPicker",
                              "link",
                              "embedded" /*, 'emoji'*/,
                              "image",
                              "remove",
                              "history",
                            ],
                          }}
                          handlePastedText={() => false}
                          toolbarClassName="toolbarClassName"
                          wrapperClassName="wrapperClassName"
                          editorClassName="editorClassName"
                          wrapperStyle={{
                            border: "1px solid #d6d6d6",
                            padding: 10,
                            borderRadius: 10,
                          }}
                          toolbarStyle={{
                            border: 0,
                            borderBottom: "1px solid #d6d6d6",
                          }}
                          editorState={editorData6}
                          onEditorStateChange={(value) =>
                            handelChange(value, 6, 1)
                          }
                        // onBlur={() => helpers.setTouched(true)}
                        />
                        {/* <MyTextArea type="text" className="form-control" name="sel_compentencies" /> */}
                      </div>
                    </div>
                    <div className="col-lg-12 col-md-12 col-sm-12">
                      <div className="form-group">
                        <label>Set</label>
                        <Editor
                          toolbar={{
                            options: [
                              "inline",
                              "blockType",
                              "fontSize",
                              "fontFamily",
                              "list",
                              "textAlign",
                              "colorPicker",
                              "link",
                              "embedded" /*, 'emoji'*/,
                              "image",
                              "remove",
                              "history",
                            ],
                          }}
                          handlePastedText={() => false}
                          toolbarClassName="toolbarClassName"
                          wrapperClassName="wrapperClassName"
                          editorClassName="editorClassName"
                          wrapperStyle={{
                            border: "1px solid #d6d6d6",
                            padding: 10,
                            borderRadius: 10,
                          }}
                          toolbarStyle={{
                            border: 0,
                            borderBottom: "1px solid #d6d6d6",
                          }}
                          editorState={editorData7}
                          onEditorStateChange={(value) =>
                            handelChange(value, 7, 1)
                          }
                        // onBlur={() => helpers.setTouched(true)}
                        />
                        {/* <MyTextArea type="text" className="form-control" name="lesson_set" /> */}
                      </div>
                    </div>
                    <div className="col-lg-12 col-md-12 col-sm-12">
                      <div className="form-group">
                        <label>Spark It Up</label>
                        <Editor
                          toolbar={{
                            options: [
                              "inline",
                              "blockType",
                              "fontSize",
                              "fontFamily",
                              "list",
                              "textAlign",
                              "colorPicker",
                              "link",
                              "embedded" /*, 'emoji'*/,
                              "image",
                              "remove",
                              "history",
                            ],
                          }}
                          handlePastedText={() => false}
                          toolbarClassName="toolbarClassName"
                          wrapperClassName="wrapperClassName"
                          editorClassName="editorClassName"
                          wrapperStyle={{
                            border: "1px solid #d6d6d6",
                            padding: 10,
                            borderRadius: 10,
                          }}
                          toolbarStyle={{
                            border: 0,
                            borderBottom: "1px solid #d6d6d6",
                          }}
                          editorState={editorData8}
                          onEditorStateChange={(value) =>
                            handelChange(value, 8, 1)
                          }
                        // onBlur={() => helpers.setTouched(true)}
                        />
                        {/* <MyTextArea type="text" className="form-control" name="spark_it_up" /> */}
                      </div>
                    </div>
                    <div className="col-lg-12 col-md-12 col-sm-12">
                      <div className="form-group">
                        <label>Standards</label>
                        <Editor
                          toolbar={{
                            options: [
                              "inline",
                              "blockType",
                              "fontSize",
                              "fontFamily",
                              "list",
                              "textAlign",
                              "colorPicker",
                              "link",
                              "embedded" /*, 'emoji'*/,
                              "image",
                              "remove",
                              "history",
                            ],
                          }}
                          handlePastedText={() => false}
                          toolbarClassName="toolbarClassName"
                          wrapperClassName="wrapperClassName"
                          editorClassName="editorClassName"
                          wrapperStyle={{
                            border: "1px solid #d6d6d6",
                            padding: 10,
                            borderRadius: 10,
                          }}
                          toolbarStyle={{
                            border: 0,
                            borderBottom: "1px solid #d6d6d6",
                          }}
                          editorState={editorData9}
                          onEditorStateChange={(value) =>
                            handelChange(value, 9, 1)
                          }
                        // onBlur={() => helpers.setTouched(true)}
                        />
                        {/* <MyTextArea type="text" className="form-control" name="standards_alignment" /> */}
                      </div>
                    </div>
                    <div className="col-lg-12 col-md-12 col-sm-12">
                      <div className="form-group">
                        <label>Teach</label>
                        <Editor
                          toolbar={{
                            options: [
                              "inline",
                              "blockType",
                              "fontSize",
                              "fontFamily",
                              "list",
                              "textAlign",
                              "colorPicker",
                              "link",
                              "embedded" /*, 'emoji'*/,
                              "image",
                              "remove",
                              "history",
                            ],
                          }}
                          handlePastedText={() => false}
                          toolbarClassName="toolbarClassName"
                          wrapperClassName="wrapperClassName"
                          editorClassName="editorClassName"
                          wrapperStyle={{
                            border: "1px solid #d6d6d6",
                            padding: 10,
                            borderRadius: 10,
                          }}
                          toolbarStyle={{
                            border: 0,
                            borderBottom: "1px solid #d6d6d6",
                          }}
                          editorState={editorData10}
                          onEditorStateChange={(value) =>
                            handelChange(value, 10, 1)
                          }
                        // onBlur={() => helpers.setTouched(true)}
                        />
                        {/* <MyTextArea type="text" className="form-control" name="teach" /> */}
                      </div>
                    </div>
                    <div className="col-lg-12 col-md-12 col-sm-12">
                      <div className="form-group">
                        <label>Teaching Cues</label>
                        <Editor
                          toolbar={{
                            options: [
                              "inline",
                              "blockType",
                              "fontSize",
                              "fontFamily",
                              "list",
                              "textAlign",
                              "colorPicker",
                              "link",
                              "embedded" /*, 'emoji'*/,
                              "image",
                              "remove",
                              "history",
                            ],
                          }}
                          handlePastedText={() => false}
                          toolbarClassName="toolbarClassName"
                          wrapperClassName="wrapperClassName"
                          editorClassName="editorClassName"
                          wrapperStyle={{
                            border: "1px solid #d6d6d6",
                            padding: 10,
                            borderRadius: 10,
                          }}
                          toolbarStyle={{
                            border: 0,
                            borderBottom: "1px solid #d6d6d6",
                          }}
                          editorState={editorData11}
                          onEditorStateChange={(value) =>
                            handelChange(value, 11, 1)
                          }
                        // onBlur={() => helpers.setTouched(true)}
                        />
                        {/* <MyTextArea type="text" className="form-control" name="teaching_cues" /> */}
                      </div>
                    </div>
                    <div className="col-lg-12 col-md-12 col-sm-12">
                      <div className="form-group">
                        <label>Teaching Suggestions</label>
                        <Editor
                          toolbar={{
                            options: [
                              "inline",
                              "blockType",
                              "fontSize",
                              "fontFamily",
                              "list",
                              "textAlign",
                              "colorPicker",
                              "link",
                              "embedded" /*, 'emoji'*/,
                              "image",
                              "remove",
                              "history",
                            ],
                          }}
                          handlePastedText={() => false}
                          toolbarClassName="toolbarClassName"
                          wrapperClassName="wrapperClassName"
                          editorClassName="editorClassName"
                          wrapperStyle={{
                            border: "1px solid #d6d6d6",
                            padding: 10,
                            borderRadius: 10,
                          }}
                          toolbarStyle={{
                            border: 0,
                            borderBottom: "1px solid #d6d6d6",
                          }}
                          editorState={editorData12}
                          onEditorStateChange={(value) =>
                            handelChange(value, 12, 1)
                          }
                        // onBlur={() => helpers.setTouched(true)}
                        />
                        {/* <MyTextArea type="text" className="form-control" name="teaching_suggestions" /> */}
                      </div>
                    </div>
                    <div className="col-lg-12 col-md-12 col-sm-12">
                      <div className="form-group">
                        <label>Vocabulary</label>
                        <Editor
                          toolbar={{
                            options: [
                              "inline",
                              "blockType",
                              "fontSize",
                              "fontFamily",
                              "list",
                              "textAlign",
                              "colorPicker",
                              "link",
                              "embedded" /*, 'emoji'*/,
                              "image",
                              "remove",
                              "history",
                            ],
                          }}
                          handlePastedText={() => false}
                          toolbarClassName="toolbarClassName"
                          wrapperClassName="wrapperClassName"
                          editorClassName="editorClassName"
                          wrapperStyle={{
                            border: "1px solid #d6d6d6",
                            padding: 10,
                            borderRadius: 10,
                          }}
                          toolbarStyle={{
                            border: 0,
                            borderBottom: "1px solid #d6d6d6",
                          }}
                          editorState={editorData13}
                          onEditorStateChange={(value) =>
                            handelChange(value, 13, 1)
                          }
                        // onBlur={() => helpers.setTouched(true)}
                        />
                        {/* <MyTextArea type="text" className="form-control" name="vocabulary" /> */}
                      </div>
                    </div>
                    <div className="col-lg-6 col-md-12 col-sm-12">
                      <div className="form-group">
                        <label>Diagram</label>

                        <input
                          type="file"
                          accept="image/*"
                          className="form-control"
                          name="image_url"
                          onChange={(e) => onHandle(e)}
                          required
                        />
                        {getImageUrl !== "" ? (
                          <img src={getImageUrl} className=" w-30 p-3" alt="" />
                        ) : null}
                        {getState ? (
                          <p style={{ color: "red" }}>
                            Only Image is allowed !
                          </p>
                        ) : null}
                      </div>
                    </div>
                    <div className="col-lg-12 col-md-12 col-sm-12">
                      {!getbutton ? (
                        getState ? (
                          <Button disabled type="submit" variant="contained">
                            Submit
                          </Button>
                        ) : (
                          <Button type="submit" variant="contained">
                            Submit
                          </Button>
                        )
                      ) : (
                        <Button
                          variant="contained"
                          style={{ backgroundColor: "blue", color: "white" }}
                          disabled
                        >
                          Wait Please!
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </Form>
            </Formik>
          ) : Format === "2" ? (
            <Formik
              enableReinitialize={true}
              initialValues={{
                curriculum_id: location.state.curriculum_id,
                suboption_id: location.state.suboption_id,
                title: "",
                ready: "",
                lesson_set: "",
                go: "",
                adaptations: "",
                objectives: "",
                academics: "",
                teacher_tips: "",
                family_fun: "",
                lyrics: "",
                music_credits: "",
              }}
              validationSchema={Yup.object({
                title: Yup.string().required("Required"),
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

                formData.append("curriculum_id", values.curriculum_id);
                formData.append("suboption_id", values.suboption_id);
                formData.append("lesson_id", values.lesson_id);
                formData.append("title", values.title);
                formData.append("ready", Ready);
                formData.append("lesson_set", Set);
                formData.append("go", Go);
                formData.append("adaptations", Adaptation);
                formData.append("objectives", Objective);
                formData.append("academics", Academics);
                formData.append("teacher_tips", TeacherTips);
                formData.append("family_fun", FamilyFun);
                formData.append("lyrics", Lyrics);
                formData.append("music_credits", MusicCredits);
                if (getImage.pictureAsFile) {
                  formData.append("filename", getImage.pictureAsFile);
                }
                setbutton(true);
                console.log(values);

                add_earlyChild(formData)
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
                    get_lessons({
                      curriculum_id: location.state.curriculum_id,
                      suboption_id: location.state.suboption_id,
                    })
                      .then((res) => {
                        console.log("=======>", res.data.result);

                        setLessonPlans(
                          res.data.result.map((el, index) => ({
                            ...el,
                            id: el.lesson_id,
                            i: index,
                          }))
                        );
                        setLoader(false);
                      })
                      .catch((err) => {
                        console.log(err);
                      });
                    setImage({});
                    setImageUrl("");
                    setShowAddLessonPlans(false);
                    setbutton(false);

                    setEditorData1("");
                    setIntegration("");
                    setEditorData2("");
                    setObjective("");
                    setEditorData3("");
                    setTarget("");
                    setEditorData4("");
                    setPrep("");
                    setEditorData5("");
                    setQuestions("");
                    setEditorData6("");
                    setCompetencies("");
                    setEditorData7("");
                    setSet("");
                    setEditorData8("");
                    setSparkItUp("");
                    setEditorData9("");
                    setAlignment("");
                    setEditorData10("");
                    setTeach("");
                    setEditorData11("");
                    setCues("");
                    setEditorData12("");
                    setSuggestion("");
                    setEditorData13("");
                    setVocabulary("");
                    setReady("");
                    setGo("");
                    setAdaptation("");
                    setAcademics("");
                    setTeacherTips("");
                    setFamilyFun("");
                    setLyrics("");
                    setMusicCredits("");
                    setSafetyFirst("");
                    setGameReset("");
                    setHomePlay("");
                    setTheRightFit("");
                    setGuideline("");
                    setIntegrationIcon("");
                    setKeyWords("");
                    setState(false);
                  })
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
                    setImage({});
                    setImageUrl("");
                    setbutton(false);
                    setShowAddLessonPlans(false);

                    setEditorData1("");
                    setIntegration("");
                    setEditorData2("");
                    setObjective("");
                    setEditorData3("");
                    setTarget("");
                    setEditorData4("");
                    setPrep("");
                    setEditorData5("");
                    setQuestions("");
                    setEditorData6("");
                    setCompetencies("");
                    setEditorData7("");
                    setSet("");
                    setEditorData8("");
                    setSparkItUp("");
                    setEditorData9("");
                    setAlignment("");
                    setEditorData10("");
                    setTeach("");
                    setEditorData11("");
                    setCues("");
                    setEditorData12("");
                    setSuggestion("");
                    setEditorData13("");
                    setVocabulary("");
                    setReady("");
                    setGo("");
                    setAdaptation("");
                    setAcademics("");
                    setTeacherTips("");
                    setFamilyFun("");
                    setLyrics("");
                    setMusicCredits("");
                    setSafetyFirst("");
                    setGameReset("");
                    setHomePlay("");
                    setTheRightFit("");
                    setGuideline("");
                    setIntegrationIcon("");
                    setKeyWords("");
                    setState(false);
                  });
              }}
            >
              <Form>
                <div className="modal-body">
                  <h3 className="format-heading">FORMAT B</h3>

                  <div className="row">
                    <div className="col-lg-4 col-md-12 col-sm-12">
                      <div className="form-group">
                        <label>Name</label>
                        <MyTextInput
                          type="text"
                          className="form-control"
                          name="title"
                        />
                      </div>
                    </div>
                    <div className="col-lg-12 col-md-12 col-sm-12">
                      <div className="form-group spo">
                        <label>Ready</label>
                        <Editor
                          toolbar={{
                            options: [
                              "inline",
                              "blockType",
                              "fontSize",
                              "fontFamily",
                              "list",
                              "textAlign",
                              "colorPicker",
                              "link",
                              "embedded" /*, 'emoji'*/,
                              "image",
                              "remove",
                              "history",
                            ],
                          }}
                          handlePastedText={() => false}
                          toolbarClassName="toolbarClassName"
                          wrapperClassName="wrapperClassName"
                          editorClassName="editorClassName"
                          wrapperStyle={{
                            border: "1px solid #d6d6d6",
                            padding: 10,
                            borderRadius: 10,
                          }}
                          toolbarStyle={{
                            border: 0,
                            borderBottom: "1px solid #d6d6d6",
                          }}
                          editorState={editorData1}
                          onEditorStateChange={(value) =>
                            handelChange(value, 1, 2)
                          }
                        // onBlur={() => helpers.setTouched(true)}
                        />
                        {/* <MyTextEditor type="text" className="form-control" name="integration" />                                                 */}
                      </div>
                    </div>
                    <div className="col-lg-12 col-md-12 col-sm-12">
                      <div className="form-group">
                        <label>Set</label>
                        <Editor
                          toolbar={{
                            options: [
                              "inline",
                              "blockType",
                              "fontSize",
                              "fontFamily",
                              "list",
                              "textAlign",
                              "colorPicker",
                              "link",
                              "embedded" /*, 'emoji'*/,
                              "image",
                              "remove",
                              "history",
                            ],
                          }}
                          handlePastedText={() => false}
                          toolbarClassName="toolbarClassName"
                          wrapperClassName="wrapperClassName"
                          editorClassName="editorClassName"
                          wrapperStyle={{
                            border: "1px solid #d6d6d6",
                            padding: 10,
                            borderRadius: 10,
                          }}
                          toolbarStyle={{
                            border: 0,
                            borderBottom: "1px solid #d6d6d6",
                          }}
                          editorState={editorData2}
                          onEditorStateChange={(value) =>
                            handelChange(value, 2, 2)
                          }
                        // onBlur={() => helpers.setTouched(true)}
                        />
                        {/* <MyTextArea type="text" className="form-control" name="lesson_objective" /> */}
                      </div>
                    </div>
                    <div className="col-lg-12 col-md-12 col-sm-12">
                      <div className="form-group">
                        <label>Go</label>
                        <Editor
                          toolbar={{
                            options: [
                              "inline",
                              "blockType",
                              "fontSize",
                              "fontFamily",
                              "list",
                              "textAlign",
                              "colorPicker",
                              "link",
                              "embedded" /*, 'emoji'*/,
                              "image",
                              "remove",
                              "history",
                            ],
                          }}
                          handlePastedText={() => false}
                          toolbarClassName="toolbarClassName"
                          wrapperClassName="wrapperClassName"
                          editorClassName="editorClassName"
                          wrapperStyle={{
                            border: "1px solid #d6d6d6",
                            padding: 10,
                            borderRadius: 10,
                          }}
                          toolbarStyle={{
                            border: 0,
                            borderBottom: "1px solid #d6d6d6",
                          }}
                          editorState={editorData3}
                          onEditorStateChange={(value) =>
                            handelChange(value, 3, 2)
                          }
                        // onBlur={() => helpers.setTouched(true)}
                        />
                        {/* <MyTextArea type="text" className="form-control" name="lesson_target" /> */}
                      </div>
                    </div>
                    <div className="col-lg-12 col-md-12 col-sm-12">
                      <div className="form-group">
                        <label>Adaptations</label>
                        <Editor
                          toolbar={{
                            options: [
                              "inline",
                              "blockType",
                              "fontSize",
                              "fontFamily",
                              "list",
                              "textAlign",
                              "colorPicker",
                              "link",
                              "embedded" /*, 'emoji'*/,
                              "image",
                              "remove",
                              "history",
                            ],
                          }}
                          handlePastedText={() => false}
                          toolbarClassName="toolbarClassName"
                          wrapperClassName="wrapperClassName"
                          editorClassName="editorClassName"
                          wrapperStyle={{
                            border: "1px solid #d6d6d6",
                            padding: 10,
                            borderRadius: 10,
                          }}
                          toolbarStyle={{
                            border: 0,
                            borderBottom: "1px solid #d6d6d6",
                          }}
                          editorState={editorData4}
                          onEditorStateChange={(value) =>
                            handelChange(value, 4, 2)
                          }
                        // onBlur={() => helpers.setTouched(true)}
                        />
                        {/* <MyTextArea type="text" className="form-control" name="prep" /> */}
                      </div>
                    </div>
                    <div className="col-lg-12 col-md-12 col-sm-12">
                      <div className="form-group">
                        <label>Objectives</label>
                        <Editor
                          toolbar={{
                            options: [
                              "inline",
                              "blockType",
                              "fontSize",
                              "fontFamily",
                              "list",
                              "textAlign",
                              "colorPicker",
                              "link",
                              "embedded" /*, 'emoji'*/,
                              "image",
                              "remove",
                              "history",
                            ],
                          }}
                          handlePastedText={() => false}
                          toolbarClassName="toolbarClassName"
                          wrapperClassName="wrapperClassName"
                          editorClassName="editorClassName"
                          wrapperStyle={{
                            border: "1px solid #d6d6d6",
                            padding: 10,
                            borderRadius: 10,
                          }}
                          toolbarStyle={{
                            border: 0,
                            borderBottom: "1px solid #d6d6d6",
                          }}
                          editorState={editorData5}
                          onEditorStateChange={(value) =>
                            handelChange(value, 5, 2)
                          }
                        // onBlur={() => helpers.setTouched(true)}
                        />
                        {/* <MyTextArea type="text" className="form-control" name="reflection_question" /> */}
                      </div>
                    </div>
                    <div className="col-lg-12 col-md-12 col-sm-12">
                      <div className="form-group">
                        <label>Academics</label>
                        <Editor
                          toolbar={{
                            options: [
                              "inline",
                              "blockType",
                              "fontSize",
                              "fontFamily",
                              "list",
                              "textAlign",
                              "colorPicker",
                              "link",
                              "embedded" /*, 'emoji'*/,
                              "image",
                              "remove",
                              "history",
                            ],
                          }}
                          handlePastedText={() => false}
                          toolbarClassName="toolbarClassName"
                          wrapperClassName="wrapperClassName"
                          editorClassName="editorClassName"
                          wrapperStyle={{
                            border: "1px solid #d6d6d6",
                            padding: 10,
                            borderRadius: 10,
                          }}
                          toolbarStyle={{
                            border: 0,
                            borderBottom: "1px solid #d6d6d6",
                          }}
                          editorState={editorData6}
                          onEditorStateChange={(value) =>
                            handelChange(value, 6, 2)
                          }
                        // onBlur={() => helpers.setTouched(true)}
                        />
                        {/* <MyTextArea type="text" className="form-control" name="sel_compentencies" /> */}
                      </div>
                    </div>
                    <div className="col-lg-12 col-md-12 col-sm-12">
                      <div className="form-group">
                        <label>Teaching Tips</label>
                        <Editor
                          toolbar={{
                            options: [
                              "inline",
                              "blockType",
                              "fontSize",
                              "fontFamily",
                              "list",
                              "textAlign",
                              "colorPicker",
                              "link",
                              "embedded" /*, 'emoji'*/,
                              "image",
                              "remove",
                              "history",
                            ],
                          }}
                          handlePastedText={() => false}
                          toolbarClassName="toolbarClassName"
                          wrapperClassName="wrapperClassName"
                          editorClassName="editorClassName"
                          wrapperStyle={{
                            border: "1px solid #d6d6d6",
                            padding: 10,
                            borderRadius: 10,
                          }}
                          toolbarStyle={{
                            border: 0,
                            borderBottom: "1px solid #d6d6d6",
                          }}
                          editorState={editorData7}
                          onEditorStateChange={(value) =>
                            handelChange(value, 7, 2)
                          }
                        // onBlur={() => helpers.setTouched(true)}
                        />
                        {/* <MyTextArea type="text" className="form-control" name="lesson_set" /> */}
                      </div>
                    </div>
                    <div className="col-lg-12 col-md-12 col-sm-12">
                      <div className="form-group">
                        <label>Family Fun</label>
                        <Editor
                          toolbar={{
                            options: [
                              "inline",
                              "blockType",
                              "fontSize",
                              "fontFamily",
                              "list",
                              "textAlign",
                              "colorPicker",
                              "link",
                              "embedded" /*, 'emoji'*/,
                              "image",
                              "remove",
                              "history",
                            ],
                          }}
                          handlePastedText={() => false}
                          toolbarClassName="toolbarClassName"
                          wrapperClassName="wrapperClassName"
                          editorClassName="editorClassName"
                          wrapperStyle={{
                            border: "1px solid #d6d6d6",
                            padding: 10,
                            borderRadius: 10,
                          }}
                          toolbarStyle={{
                            border: 0,
                            borderBottom: "1px solid #d6d6d6",
                          }}
                          editorState={editorData8}
                          onEditorStateChange={(value) =>
                            handelChange(value, 8, 2)
                          }
                        // onBlur={() => helpers.setTouched(true)}
                        />
                        {/* <MyTextArea type="text" className="form-control" name="spark_it_up" /> */}
                      </div>
                    </div>
                    <div className="col-lg-12 col-md-12 col-sm-12">
                      <div className="form-group">
                        <label>Lyrics</label>
                        <Editor
                          toolbar={{
                            options: [
                              "inline",
                              "blockType",
                              "fontSize",
                              "fontFamily",
                              "list",
                              "textAlign",
                              "colorPicker",
                              "link",
                              "embedded" /*, 'emoji'*/,
                              "image",
                              "remove",
                              "history",
                            ],
                          }}
                          handlePastedText={() => false}
                          toolbarClassName="toolbarClassName"
                          wrapperClassName="wrapperClassName"
                          editorClassName="editorClassName"
                          wrapperStyle={{
                            border: "1px solid #d6d6d6",
                            padding: 10,
                            borderRadius: 10,
                          }}
                          toolbarStyle={{
                            border: 0,
                            borderBottom: "1px solid #d6d6d6",
                          }}
                          editorState={editorData9}
                          onEditorStateChange={(value) =>
                            handelChange(value, 9, 2)
                          }
                        // onBlur={() => helpers.setTouched(true)}
                        />
                        {/* <MyTextArea type="text" className="form-control" name="standards_alignment" /> */}
                      </div>
                    </div>
                    <div className="col-lg-12 col-md-12 col-sm-12">
                      <div className="form-group">
                        <label>Music Credits</label>
                        <Editor
                          toolbar={{
                            options: [
                              "inline",
                              "blockType",
                              "fontSize",
                              "fontFamily",
                              "list",
                              "textAlign",
                              "colorPicker",
                              "link",
                              "embedded" /*, 'emoji'*/,
                              "image",
                              "remove",
                              "history",
                            ],
                          }}
                          handlePastedText={() => false}
                          toolbarClassName="toolbarClassName"
                          wrapperClassName="wrapperClassName"
                          editorClassName="editorClassName"
                          wrapperStyle={{
                            border: "1px solid #d6d6d6",
                            padding: 10,
                            borderRadius: 10,
                          }}
                          toolbarStyle={{
                            border: 0,
                            borderBottom: "1px solid #d6d6d6",
                          }}
                          editorState={editorData10}
                          onEditorStateChange={(value) =>
                            handelChange(value, 10, 2)
                          }
                        // onBlur={() => helpers.setTouched(true)}
                        />
                        {/* <MyTextArea type="text" className="form-control" name="teach" /> */}
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
                        {getImageUrl != "" ? (
                          <img src={getImageUrl} className=" w-30 p-3" alt="" />
                        ) : null}
                        {getState ? (
                          <p style={{ color: "red" }}>
                            Only Image is allowed !
                          </p>
                        ) : null}
                      </div>
                    </div>
                    <div className="col-lg-12 col-md-12 col-sm-12">
                      {!getbutton ? (
                        getState ? (
                          <Button disabled type="submit" variant="contained">
                            Submit
                          </Button>
                        ) : (
                          <Button type="submit" variant="contained">
                            Submit
                          </Button>
                        )
                      ) : (
                        <Button
                          variant="contained"
                          style={{ backgroundColor: "blue", color: "white" }}
                          disabled
                        >
                          Wait Please!
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </Form>
            </Formik>
          ) : Format === "3" ? (
            <Formik
              enableReinitialize={true}
              initialValues={{
                curriculum_id: location.state.curriculum_id,
                suboption_id: location.state.suboption_id,
                title: "",
                ready: "",
                lesson_set: "",
                go: "",
                safety_first: "",
                game_reset: "",
                home_play: "",
                the_right_fit: "",
                guideline_addressed: "",
              }}
              validationSchema={Yup.object({
                title: Yup.string().required("Required"),
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

                formData.append("curriculum_id", values.curriculum_id);
                formData.append("suboption_id", values.suboption_id);
                formData.append("lesson_id", values.lesson_id);
                formData.append("title", values.title);
                formData.append("ready", Ready);
                formData.append("lesson_set", Set);
                formData.append("go", Go);
                formData.append("safety_first", SafetyFirst);
                formData.append("game_reset", GameReset);
                formData.append("home_play", HomePlay);
                formData.append("the_right_fit", TheRightFit);
                formData.append("guideline_addressed", Guideline);
                console.log(
                  "========11111111==============>",
                  getImage.pictureAsFile
                );
                if (getImage.pictureAsFile) {
                  console.log(
                    "======================>",
                    getImage.pictureAsFile
                  );
                  formData.append("image_url", getImage.pictureAsFile);
                }
                setbutton(true);
                console.log(values);

                add_afterLesson(formData)
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
                    get_lessons({
                      curriculum_id: location.state.curriculum_id,
                      suboption_id: location.state.suboption_id,
                    })
                      .then((res) => {
                        console.log("=======>", res.data.result);

                        setLessonPlans(
                          res.data.result.map((el, index) => ({
                            ...el,
                            id: el.lesson_id,
                            i: index,
                          }))
                        );
                        setLoader(false);
                      })
                      .catch((err) => {
                        console.log(err);
                      });
                    setImage({});
                    setImageUrl("");
                    setShowAddLessonPlans(false);
                    setbutton(false);
                    setEditorData1("");
                    setIntegration("");
                    setEditorData2("");
                    setObjective("");
                    setEditorData3("");
                    setTarget("");
                    setEditorData4("");
                    setPrep("");
                    setEditorData5("");
                    setQuestions("");
                    setEditorData6("");
                    setCompetencies("");
                    setEditorData7("");
                    setSet("");
                    setEditorData8("");
                    setSparkItUp("");
                    setEditorData9("");
                    setAlignment("");
                    setEditorData10("");
                    setTeach("");
                    setEditorData11("");
                    setCues("");
                    setEditorData12("");
                    setSuggestion("");
                    setEditorData13("");
                    setVocabulary("");
                    setReady("");
                    setGo("");
                    setAdaptation("");
                    setAcademics("");
                    setTeacherTips("");
                    setFamilyFun("");
                    setLyrics("");
                    setMusicCredits("");
                    setSafetyFirst("");
                    setGameReset("");
                    setHomePlay("");
                    setTheRightFit("");
                    setGuideline("");
                    setIntegrationIcon("");
                    setKeyWords("");
                    setState(false);
                  })
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
                    setImage({});
                    setImageUrl("");
                    setbutton(false);
                    setShowAddLessonPlans(false);

                    setEditorData1("");
                    setIntegration("");
                    setEditorData2("");
                    setObjective("");
                    setEditorData3("");
                    setTarget("");
                    setEditorData4("");
                    setPrep("");
                    setEditorData5("");
                    setQuestions("");
                    setEditorData6("");
                    setCompetencies("");
                    setEditorData7("");
                    setSet("");
                    setEditorData8("");
                    setSparkItUp("");
                    setEditorData9("");
                    setAlignment("");
                    setEditorData10("");
                    setTeach("");
                    setEditorData11("");
                    setCues("");
                    setEditorData12("");
                    setSuggestion("");
                    setEditorData13("");
                    setVocabulary("");
                    setReady("");
                    setGo("");
                    setAdaptation("");
                    setAcademics("");
                    setTeacherTips("");
                    setFamilyFun("");
                    setLyrics("");
                    setMusicCredits("");
                    setSafetyFirst("");
                    setGameReset("");
                    setHomePlay("");
                    setTheRightFit("");
                    setGuideline("");
                    setIntegrationIcon("");
                    setKeyWords("");
                    setState(false);
                  });
              }}
            >
              <Form>
                <div className="modal-body">
                  <h3 className="format-heading">FORMAT C</h3>

                  <div className="row">
                    <div className="col-lg-4 col-md-12 col-sm-12">
                      <div className="form-group">
                        <label>Name</label>
                        <MyTextInput
                          type="text"
                          className="form-control"
                          name="title"
                        />
                      </div>
                    </div>
                    <div className="col-lg-12 col-md-12 col-sm-12">
                      <div className="form-group spo">
                        <label>Ready</label>
                        <Editor
                          toolbar={{
                            options: [
                              "inline",
                              "blockType",
                              "fontSize",
                              "fontFamily",
                              "list",
                              "textAlign",
                              "colorPicker",
                              "link",
                              "embedded" /*, 'emoji'*/,
                              "image",
                              "remove",
                              "history",
                            ],
                          }}
                          handlePastedText={() => false}
                          toolbarClassName="toolbarClassName"
                          wrapperClassName="wrapperClassName"
                          editorClassName="editorClassName"
                          wrapperStyle={{
                            border: "1px solid #d6d6d6",
                            padding: 10,
                            borderRadius: 10,
                          }}
                          toolbarStyle={{
                            border: 0,
                            borderBottom: "1px solid #d6d6d6",
                          }}
                          editorState={editorData1}
                          onEditorStateChange={(value) =>
                            handelChange(value, 1, 3)
                          }
                        // onBlur={() => helpers.setTouched(true)}
                        />
                        {/* <MyTextEditor type="text" className="form-control" name="integration" />                                                 */}
                      </div>
                    </div>
                    <div className="col-lg-12 col-md-12 col-sm-12">
                      <div className="form-group">
                        <label>Set</label>
                        <Editor
                          toolbar={{
                            options: [
                              "inline",
                              "blockType",
                              "fontSize",
                              "fontFamily",
                              "list",
                              "textAlign",
                              "colorPicker",
                              "link",
                              "embedded" /*, 'emoji'*/,
                              "image",
                              "remove",
                              "history",
                            ],
                          }}
                          handlePastedText={() => false}
                          toolbarClassName="toolbarClassName"
                          wrapperClassName="wrapperClassName"
                          editorClassName="editorClassName"
                          wrapperStyle={{
                            border: "1px solid #d6d6d6",
                            padding: 10,
                            borderRadius: 10,
                          }}
                          toolbarStyle={{
                            border: 0,
                            borderBottom: "1px solid #d6d6d6",
                          }}
                          editorState={editorData2}
                          onEditorStateChange={(value) =>
                            handelChange(value, 2, 3)
                          }
                        // onBlur={() => helpers.setTouched(true)}
                        />
                        {/* <MyTextArea type="text" className="form-control" name="lesson_objective" /> */}
                      </div>
                    </div>
                    <div className="col-lg-12 col-md-12 col-sm-12">
                      <div className="form-group">
                        <label>Go</label>
                        <Editor
                          toolbar={{
                            options: [
                              "inline",
                              "blockType",
                              "fontSize",
                              "fontFamily",
                              "list",
                              "textAlign",
                              "colorPicker",
                              "link",
                              "embedded" /*, 'emoji'*/,
                              "image",
                              "remove",
                              "history",
                            ],
                          }}
                          handlePastedText={() => false}
                          toolbarClassName="toolbarClassName"
                          wrapperClassName="wrapperClassName"
                          editorClassName="editorClassName"
                          wrapperStyle={{
                            border: "1px solid #d6d6d6",
                            padding: 10,
                            borderRadius: 10,
                          }}
                          toolbarStyle={{
                            border: 0,
                            borderBottom: "1px solid #d6d6d6",
                          }}
                          editorState={editorData3}
                          onEditorStateChange={(value) =>
                            handelChange(value, 3, 3)
                          }
                        // onBlur={() => helpers.setTouched(true)}
                        />
                        {/* <MyTextArea type="text" className="form-control" name="lesson_target" /> */}
                      </div>
                    </div>
                    <div className="col-lg-12 col-md-12 col-sm-12">
                      <div className="form-group">
                        <label>Safety First</label>
                        <Editor
                          toolbar={{
                            options: [
                              "inline",
                              "blockType",
                              "fontSize",
                              "fontFamily",
                              "list",
                              "textAlign",
                              "colorPicker",
                              "link",
                              "embedded" /*, 'emoji'*/,
                              "image",
                              "remove",
                              "history",
                            ],
                          }}
                          handlePastedText={() => false}
                          toolbarClassName="toolbarClassName"
                          wrapperClassName="wrapperClassName"
                          editorClassName="editorClassName"
                          wrapperStyle={{
                            border: "1px solid #d6d6d6",
                            padding: 10,
                            borderRadius: 10,
                          }}
                          toolbarStyle={{
                            border: 0,
                            borderBottom: "1px solid #d6d6d6",
                          }}
                          editorState={editorData4}
                          onEditorStateChange={(value) =>
                            handelChange(value, 4, 3)
                          }
                        // onBlur={() => helpers.setTouched(true)}
                        />
                        {/* <MyTextArea type="text" className="form-control" name="prep" /> */}
                      </div>
                    </div>
                    <div className="col-lg-12 col-md-12 col-sm-12">
                      <div className="form-group">
                        <label>Game Reset</label>
                        <Editor
                          toolbar={{
                            options: [
                              "inline",
                              "blockType",
                              "fontSize",
                              "fontFamily",
                              "list",
                              "textAlign",
                              "colorPicker",
                              "link",
                              "embedded" /*, 'emoji'*/,
                              "image",
                              "remove",
                              "history",
                            ],
                          }}
                          handlePastedText={() => false}
                          toolbarClassName="toolbarClassName"
                          wrapperClassName="wrapperClassName"
                          editorClassName="editorClassName"
                          wrapperStyle={{
                            border: "1px solid #d6d6d6",
                            padding: 10,
                            borderRadius: 10,
                          }}
                          toolbarStyle={{
                            border: 0,
                            borderBottom: "1px solid #d6d6d6",
                          }}
                          editorState={editorData5}
                          onEditorStateChange={(value) =>
                            handelChange(value, 5, 3)
                          }
                        // onBlur={() => helpers.setTouched(true)}
                        />
                        {/* <MyTextArea type="text" className="form-control" name="reflection_question" /> */}
                      </div>
                    </div>
                    <div className="col-lg-12 col-md-12 col-sm-12">
                      <div className="form-group">
                        <label>Home Play</label>
                        <Editor
                          toolbar={{
                            options: [
                              "inline",
                              "blockType",
                              "fontSize",
                              "fontFamily",
                              "list",
                              "textAlign",
                              "colorPicker",
                              "link",
                              "embedded" /*, 'emoji'*/,
                              "image",
                              "remove",
                              "history",
                            ],
                          }}
                          handlePastedText={() => false}
                          toolbarClassName="toolbarClassName"
                          wrapperClassName="wrapperClassName"
                          editorClassName="editorClassName"
                          wrapperStyle={{
                            border: "1px solid #d6d6d6",
                            padding: 10,
                            borderRadius: 10,
                          }}
                          toolbarStyle={{
                            border: 0,
                            borderBottom: "1px solid #d6d6d6",
                          }}
                          editorState={editorData6}
                          onEditorStateChange={(value) =>
                            handelChange(value, 6, 3)
                          }
                        // onBlur={() => helpers.setTouched(true)}
                        />
                        {/* <MyTextArea type="text" className="form-control" name="sel_compentencies" /> */}
                      </div>
                    </div>
                    <div className="col-lg-12 col-md-12 col-sm-12">
                      <div className="form-group">
                        <label>The Right Fit</label>
                        <Editor
                          toolbar={{
                            options: [
                              "inline",
                              "blockType",
                              "fontSize",
                              "fontFamily",
                              "list",
                              "textAlign",
                              "colorPicker",
                              "link",
                              "embedded" /*, 'emoji'*/,
                              "image",
                              "remove",
                              "history",
                            ],
                          }}
                          handlePastedText={() => false}
                          toolbarClassName="toolbarClassName"
                          wrapperClassName="wrapperClassName"
                          editorClassName="editorClassName"
                          wrapperStyle={{
                            border: "1px solid #d6d6d6",
                            padding: 10,
                            borderRadius: 10,
                          }}
                          toolbarStyle={{
                            border: 0,
                            borderBottom: "1px solid #d6d6d6",
                          }}
                          editorState={editorData7}
                          onEditorStateChange={(value) =>
                            handelChange(value, 7, 3)
                          }
                        // onBlur={() => helpers.setTouched(true)}
                        />
                        {/* <MyTextArea type="text" className="form-control" name="lesson_set" /> */}
                      </div>
                    </div>
                    <div className="col-lg-12 col-md-12 col-sm-12">
                      <div className="form-group">
                        <label>Guideline Addressed</label>
                        <Editor
                          toolbar={{
                            options: [
                              "inline",
                              "blockType",
                              "fontSize",
                              "fontFamily",
                              "list",
                              "textAlign",
                              "colorPicker",
                              "link",
                              "embedded" /*, 'emoji'*/,
                              "image",
                              "remove",
                              "history",
                            ],
                          }}
                          handlePastedText={() => false}
                          toolbarClassName="toolbarClassName"
                          wrapperClassName="wrapperClassName"
                          editorClassName="editorClassName"
                          wrapperStyle={{
                            border: "1px solid #d6d6d6",
                            padding: 10,
                            borderRadius: 10,
                          }}
                          toolbarStyle={{
                            border: 0,
                            borderBottom: "1px solid #d6d6d6",
                          }}
                          editorState={editorData8}
                          onEditorStateChange={(value) =>
                            handelChange(value, 8, 3)
                          }
                        // onBlur={() => helpers.setTouched(true)}
                        />
                        {/* <MyTextArea type="text" className="form-control" name="spark_it_up" /> */}
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
                        {getImageUrl != "" ? (
                          <img src={getImageUrl} className=" w-30 p-3" alt="" />
                        ) : null}
                        {getState ? (
                          <p style={{ color: "red" }}>
                            Only Image is allowed !
                          </p>
                        ) : null}
                      </div>
                    </div>
                    <div className="col-lg-12 col-md-12 col-sm-12">
                      {!getbutton ? (
                        getState ? (
                          <Button disabled type="submit" variant="contained">
                            Submit
                          </Button>
                        ) : (
                          <Button type="submit" variant="contained">
                            Submit
                          </Button>
                        )
                      ) : (
                        <Button
                          variant="contained"
                          style={{ backgroundColor: "blue", color: "white" }}
                          disabled
                        >
                          Wait Please!
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </Form>
            </Formik>
          ) : Format === "4" ? (
            <Formik
              enableReinitialize={true}
              initialValues={{
                curriculum_id: location.state.curriculum_id,
                suboption_id: location.state.suboption_id,
                title: "",
                Integration: "",
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
                integration_icon: "",
                key_words: "",
              }}
              validationSchema={Yup.object({
                title: Yup.string().required("Required"),
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

                formData.append("curriculum_id", values.curriculum_id);
                formData.append("suboption_id", values.suboption_id);
                formData.append("title", values.title);
                formData.append("integration", Integration);
                formData.append("lesson_objective", Objective);
                formData.append("lesson_target", Target);
                formData.append("prep", Prep);
                formData.append("reflection_question", Questions);
                formData.append("sel_compentencies", Competencies);
                formData.append("lesson_set", Set);
                formData.append("spark_it_up", SparkItUp);
                formData.append("standards_alignment", Alignment);
                formData.append("teach", Teach);
                formData.append("teaching_cues", Cues);
                formData.append("teaching_suggestions", Suggestion);
                formData.append("integration_icon", IntegrationIcon);
                formData.append("key_words", KeyWords);

                if (getImage.pictureAsFile) {
                  formData.append("image_url", getImage.pictureAsFile);
                }
                setbutton(true);
                console.log(values);

                add_HighLesson(formData)
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
                    get_lessons({
                      curriculum_id: location.state.curriculum_id,
                      suboption_id: location.state.suboption_id,
                    })
                      .then((res) => {
                        console.log("=======>", res.data.result);

                        setLessonPlans(
                          res.data.result.map((el, index) => ({
                            ...el,
                            id: el.lesson_id,
                            i: index,
                          }))
                        );
                        setLoader(false);
                      })
                      .catch((err) => {
                        console.log(err);
                      });
                    setImage({});
                    setImageUrl("");
                    setShowAddLessonPlans(false);
                    setbutton(false);
                    setEditorData1("");
                    setIntegration("");
                    setEditorData2("");
                    setObjective("");
                    setEditorData3("");
                    setTarget("");
                    setEditorData4("");
                    setPrep("");
                    setEditorData5("");
                    setQuestions("");
                    setEditorData6("");
                    setCompetencies("");
                    setEditorData7("");
                    setSet("");
                    setEditorData8("");
                    setSparkItUp("");
                    setEditorData9("");
                    setAlignment("");
                    setEditorData10("");
                    setTeach("");
                    setEditorData11("");
                    setCues("");
                    setEditorData12("");
                    setSuggestion("");
                    setEditorData13("");
                    setVocabulary("");
                    setReady("");
                    setGo("");
                    setAdaptation("");
                    setAcademics("");
                    setTeacherTips("");
                    setFamilyFun("");
                    setLyrics("");
                    setMusicCredits("");
                    setSafetyFirst("");
                    setGameReset("");
                    setHomePlay("");
                    setTheRightFit("");
                    setGuideline("");
                    setIntegrationIcon("");
                    setKeyWords("");
                    setState(false);
                  })
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
                    setImage({});
                    setImageUrl("");
                    setbutton(false);
                    setEditorData1("");
                    setShowAddLessonPlans(false);
                    setIntegration("");
                    setEditorData2("");
                    setObjective("");
                    setEditorData3("");
                    setTarget("");
                    setEditorData4("");
                    setPrep("");
                    setEditorData5("");
                    setQuestions("");
                    setEditorData6("");
                    setCompetencies("");
                    setEditorData7("");
                    setSet("");
                    setEditorData8("");
                    setSparkItUp("");
                    setEditorData9("");
                    setAlignment("");
                    setEditorData10("");
                    setTeach("");
                    setEditorData11("");
                    setCues("");
                    setEditorData12("");
                    setSuggestion("");
                    setEditorData13("");
                    setVocabulary("");
                    setReady("");
                    setGo("");
                    setAdaptation("");
                    setAcademics("");
                    setTeacherTips("");
                    setFamilyFun("");
                    setLyrics("");
                    setMusicCredits("");
                    setSafetyFirst("");
                    setGameReset("");
                    setHomePlay("");
                    setTheRightFit("");
                    setGuideline("");
                    setIntegrationIcon("");
                    setKeyWords("");
                    setState(false);
                  });
              }}
            >
              <Form>
                <div className="modal-body">
                  <h3 className="format-heading">FORMAT D</h3>

                  <div className="row">
                    <div className="col-lg-4 col-md-12 col-sm-12">
                      <div className="form-group">
                        <label>Name</label>
                        <MyTextInput
                          type="text"
                          className="form-control"
                          name="title"
                        />
                      </div>
                    </div>
                    <div className="col-lg-12 col-md-12 col-sm-12">
                      <div className="form-group spo">
                        <label>Integration</label>
                        {console.log("===========aaaaa====>", editorData1)}
                        <Editor
                          toolbar={{
                            options: [
                              "inline",
                              "blockType",
                              "fontSize",
                              "fontFamily",
                              "list",
                              "textAlign",
                              "colorPicker",
                              "link",
                              "embedded" /*, 'emoji'*/,
                              "image",
                              "remove",
                              "history",
                            ],
                          }}
                          handlePastedText={() => false}
                          toolbarClassName="toolbarClassName"
                          wrapperClassName="wrapperClassName"
                          editorClassName="editorClassName"
                          wrapperStyle={{
                            border: "1px solid #d6d6d6",
                            padding: 10,
                            borderRadius: 10,
                          }}
                          toolbarStyle={{
                            border: 0,
                            borderBottom: "1px solid #d6d6d6",
                          }}
                          editorState={editorData1}
                          onEditorStateChange={(value) =>
                            handelChange(value, 1, 4)
                          }
                        // onBlur={() => helpers.setTouched(true)}
                        />
                        {/* <MyTextEditor type="text" className="form-control" name="integration" />                                                 */}
                      </div>
                    </div>
                    <div className="col-lg-12 col-md-12 col-sm-12">
                      <div className="form-group">
                        <label>Lesson Objective</label>
                        <Editor
                          toolbar={{
                            options: [
                              "inline",
                              "blockType",
                              "fontSize",
                              "fontFamily",
                              "list",
                              "textAlign",
                              "colorPicker",
                              "link",
                              "embedded" /*, 'emoji'*/,
                              "image",
                              "remove",
                              "history",
                            ],
                          }}
                          handlePastedText={() => false}
                          toolbarClassName="toolbarClassName"
                          wrapperClassName="wrapperClassName"
                          editorClassName="editorClassName"
                          wrapperStyle={{
                            border: "1px solid #d6d6d6",
                            padding: 10,
                            borderRadius: 10,
                          }}
                          toolbarStyle={{
                            border: 0,
                            borderBottom: "1px solid #d6d6d6",
                          }}
                          editorState={editorData2}
                          onEditorStateChange={(value) =>
                            handelChange(value, 2, 4)
                          }
                        // onBlur={() => helpers.setTouched(true)}
                        />
                        {/* <MyTextArea type="text" className="form-control" name="lesson_objective" /> */}
                      </div>
                    </div>
                    <div className="col-lg-12 col-md-12 col-sm-12">
                      <div className="form-group">
                        <label>Lesson Target</label>
                        <Editor
                          toolbar={{
                            options: [
                              "inline",
                              "blockType",
                              "fontSize",
                              "fontFamily",
                              "list",
                              "textAlign",
                              "colorPicker",
                              "link",
                              "embedded" /*, 'emoji'*/,
                              "image",
                              "remove",
                              "history",
                            ],
                          }}
                          handlePastedText={() => false}
                          toolbarClassName="toolbarClassName"
                          wrapperClassName="wrapperClassName"
                          editorClassName="editorClassName"
                          wrapperStyle={{
                            border: "1px solid #d6d6d6",
                            padding: 10,
                            borderRadius: 10,
                          }}
                          toolbarStyle={{
                            border: 0,
                            borderBottom: "1px solid #d6d6d6",
                          }}
                          editorState={editorData3}
                          onEditorStateChange={(value) =>
                            handelChange(value, 3, 4)
                          }
                        // onBlur={() => helpers.setTouched(true)}
                        />
                        {/* <MyTextArea type="text" className="form-control" name="lesson_target" /> */}
                      </div>
                    </div>
                    <div className="col-lg-12 col-md-12 col-sm-12">
                      <div className="form-group">
                        <label>Prep</label>
                        <Editor
                          toolbar={{
                            options: [
                              "inline",
                              "blockType",
                              "fontSize",
                              "fontFamily",
                              "list",
                              "textAlign",
                              "colorPicker",
                              "link",
                              "embedded" /*, 'emoji'*/,
                              "image",
                              "remove",
                              "history",
                            ],
                          }}
                          handlePastedText={() => false}
                          toolbarClassName="toolbarClassName"
                          wrapperClassName="wrapperClassName"
                          editorClassName="editorClassName"
                          wrapperStyle={{
                            border: "1px solid #d6d6d6",
                            padding: 10,
                            borderRadius: 10,
                          }}
                          toolbarStyle={{
                            border: 0,
                            borderBottom: "1px solid #d6d6d6",
                          }}
                          editorState={editorData4}
                          onEditorStateChange={(value) =>
                            handelChange(value, 4, 4)
                          }
                        // onBlur={() => helpers.setTouched(true)}
                        />
                        {/* <MyTextArea type="text" className="form-control" name="prep" /> */}
                      </div>
                    </div>
                    <div className="col-lg-12 col-md-12 col-sm-12">
                      <div className="form-group">
                        <label>Reflection Question</label>
                        <Editor
                          toolbar={{
                            options: [
                              "inline",
                              "blockType",
                              "fontSize",
                              "fontFamily",
                              "list",
                              "textAlign",
                              "colorPicker",
                              "link",
                              "embedded" /*, 'emoji'*/,
                              "image",
                              "remove",
                              "history",
                            ],
                          }}
                          handlePastedText={() => false}
                          toolbarClassName="toolbarClassName"
                          wrapperClassName="wrapperClassName"
                          editorClassName="editorClassName"
                          wrapperStyle={{
                            border: "1px solid #d6d6d6",
                            padding: 10,
                            borderRadius: 10,
                          }}
                          toolbarStyle={{
                            border: 0,
                            borderBottom: "1px solid #d6d6d6",
                          }}
                          editorState={editorData5}
                          onEditorStateChange={(value) =>
                            handelChange(value, 5, 4)
                          }
                        // onBlur={() => helpers.setTouched(true)}
                        />
                        {/* <MyTextArea type="text" className="form-control" name="reflection_question" /> */}
                      </div>
                    </div>
                    <div className="col-lg-12 col-md-12 col-sm-12">
                      <div className="form-group">
                        <label>Competencies</label>
                        <Editor
                          toolbar={{
                            options: [
                              "inline",
                              "blockType",
                              "fontSize",
                              "fontFamily",
                              "list",
                              "textAlign",
                              "colorPicker",
                              "link",
                              "embedded" /*, 'emoji'*/,
                              "image",
                              "remove",
                              "history",
                            ],
                          }}
                          handlePastedText={() => false}
                          toolbarClassName="toolbarClassName"
                          wrapperClassName="wrapperClassName"
                          editorClassName="editorClassName"
                          wrapperStyle={{
                            border: "1px solid #d6d6d6",
                            padding: 10,
                            borderRadius: 10,
                          }}
                          toolbarStyle={{
                            border: 0,
                            borderBottom: "1px solid #d6d6d6",
                          }}
                          editorState={editorData6}
                          onEditorStateChange={(value) =>
                            handelChange(value, 6, 4)
                          }
                        // onBlur={() => helpers.setTouched(true)}
                        />
                        {/* <MyTextArea type="text" className="form-control" name="sel_compentencies" /> */}
                      </div>
                    </div>
                    <div className="col-lg-12 col-md-12 col-sm-12">
                      <div className="form-group">
                        <label>Lesson Set</label>
                        <Editor
                          toolbar={{
                            options: [
                              "inline",
                              "blockType",
                              "fontSize",
                              "fontFamily",
                              "list",
                              "textAlign",
                              "colorPicker",
                              "link",
                              "embedded" /*, 'emoji'*/,
                              "image",
                              "remove",
                              "history",
                            ],
                          }}
                          handlePastedText={() => false}
                          toolbarClassName="toolbarClassName"
                          wrapperClassName="wrapperClassName"
                          editorClassName="editorClassName"
                          wrapperStyle={{
                            border: "1px solid #d6d6d6",
                            padding: 10,
                            borderRadius: 10,
                          }}
                          toolbarStyle={{
                            border: 0,
                            borderBottom: "1px solid #d6d6d6",
                          }}
                          editorState={editorData7}
                          onEditorStateChange={(value) =>
                            handelChange(value, 7, 4)
                          }
                        // onBlur={() => helpers.setTouched(true)}
                        />
                        {/* <MyTextArea type="text" className="form-control" name="lesson_set" /> */}
                      </div>
                    </div>
                    <div className="col-lg-12 col-md-12 col-sm-12">
                      <div className="form-group">
                        <label>Spark It Up</label>
                        <Editor
                          toolbar={{
                            options: [
                              "inline",
                              "blockType",
                              "fontSize",
                              "fontFamily",
                              "list",
                              "textAlign",
                              "colorPicker",
                              "link",
                              "embedded" /*, 'emoji'*/,
                              "image",
                              "remove",
                              "history",
                            ],
                          }}
                          handlePastedText={() => false}
                          toolbarClassName="toolbarClassName"
                          wrapperClassName="wrapperClassName"
                          editorClassName="editorClassName"
                          wrapperStyle={{
                            border: "1px solid #d6d6d6",
                            padding: 10,
                            borderRadius: 10,
                          }}
                          toolbarStyle={{
                            border: 0,
                            borderBottom: "1px solid #d6d6d6",
                          }}
                          editorState={editorData8}
                          onEditorStateChange={(value) =>
                            handelChange(value, 8, 4)
                          }
                        // onBlur={() => helpers.setTouched(true)}
                        />
                        {/* <MyTextArea type="text" className="form-control" name="spark_it_up" /> */}
                      </div>
                    </div>
                    <div className="col-lg-12 col-md-12 col-sm-12">
                      <div className="form-group">
                        <label>Standard Alignment</label>
                        <Editor
                          toolbar={{
                            options: [
                              "inline",
                              "blockType",
                              "fontSize",
                              "fontFamily",
                              "list",
                              "textAlign",
                              "colorPicker",
                              "link",
                              "embedded" /*, 'emoji'*/,
                              "image",
                              "remove",
                              "history",
                            ],
                          }}
                          handlePastedText={() => false}
                          toolbarClassName="toolbarClassName"
                          wrapperClassName="wrapperClassName"
                          editorClassName="editorClassName"
                          wrapperStyle={{
                            border: "1px solid #d6d6d6",
                            padding: 10,
                            borderRadius: 10,
                          }}
                          toolbarStyle={{
                            border: 0,
                            borderBottom: "1px solid #d6d6d6",
                          }}
                          editorState={editorData9}
                          onEditorStateChange={(value) =>
                            handelChange(value, 9, 4)
                          }
                        // onBlur={() => helpers.setTouched(true)}
                        />
                        {/* <MyTextArea type="text" className="form-control" name="standards_alignment" /> */}
                      </div>
                    </div>
                    <div className="col-lg-12 col-md-12 col-sm-12">
                      <div className="form-group">
                        <label>Teach</label>
                        <Editor
                          toolbar={{
                            options: [
                              "inline",
                              "blockType",
                              "fontSize",
                              "fontFamily",
                              "list",
                              "textAlign",
                              "colorPicker",
                              "link",
                              "embedded" /*, 'emoji'*/,
                              "image",
                              "remove",
                              "history",
                            ],
                          }}
                          handlePastedText={() => false}
                          toolbarClassName="toolbarClassName"
                          wrapperClassName="wrapperClassName"
                          editorClassName="editorClassName"
                          wrapperStyle={{
                            border: "1px solid #d6d6d6",
                            padding: 10,
                            borderRadius: 10,
                          }}
                          toolbarStyle={{
                            border: 0,
                            borderBottom: "1px solid #d6d6d6",
                          }}
                          editorState={editorData10}
                          onEditorStateChange={(value) =>
                            handelChange(value, 10, 4)
                          }
                        // onBlur={() => helpers.setTouched(true)}
                        />
                        {/* <MyTextArea type="text" className="form-control" name="teach" /> */}
                      </div>
                    </div>
                    <div className="col-lg-12 col-md-12 col-sm-12">
                      <div className="form-group">
                        <label>Teaching Cues</label>
                        <Editor
                          toolbar={{
                            options: [
                              "inline",
                              "blockType",
                              "fontSize",
                              "fontFamily",
                              "list",
                              "textAlign",
                              "colorPicker",
                              "link",
                              "embedded" /*, 'emoji'*/,
                              "image",
                              "remove",
                              "history",
                            ],
                          }}
                          handlePastedText={() => false}
                          toolbarClassName="toolbarClassName"
                          wrapperClassName="wrapperClassName"
                          editorClassName="editorClassName"
                          wrapperStyle={{
                            border: "1px solid #d6d6d6",
                            padding: 10,
                            borderRadius: 10,
                          }}
                          toolbarStyle={{
                            border: 0,
                            borderBottom: "1px solid #d6d6d6",
                          }}
                          editorState={editorData11}
                          onEditorStateChange={(value) =>
                            handelChange(value, 11, 4)
                          }
                        // onBlur={() => helpers.setTouched(true)}
                        />
                        {/* <MyTextArea type="text" className="form-control" name="teaching_cues" /> */}
                      </div>
                    </div>
                    <div className="col-lg-12 col-md-12 col-sm-12">
                      <div className="form-group">
                        <label>Teaching Suggestions</label>
                        <Editor
                          toolbar={{
                            options: [
                              "inline",
                              "blockType",
                              "fontSize",
                              "fontFamily",
                              "list",
                              "textAlign",
                              "colorPicker",
                              "link",
                              "embedded" /*, 'emoji'*/,
                              "image",
                              "remove",
                              "history",
                            ],
                          }}
                          handlePastedText={() => false}
                          toolbarClassName="toolbarClassName"
                          wrapperClassName="wrapperClassName"
                          editorClassName="editorClassName"
                          wrapperStyle={{
                            border: "1px solid #d6d6d6",
                            padding: 10,
                            borderRadius: 10,
                          }}
                          toolbarStyle={{
                            border: 0,
                            borderBottom: "1px solid #d6d6d6",
                          }}
                          editorState={editorData12}
                          onEditorStateChange={(value) =>
                            handelChange(value, 12, 4)
                          }
                        // onBlur={() => helpers.setTouched(true)}
                        />
                        {/* <MyTextArea type="text" className="form-control" name="teaching_suggestions" /> */}
                      </div>
                    </div>
                    <div className="col-lg-12 col-md-12 col-sm-12">
                      <div className="form-group">
                        <label>Integration Icons</label>
                        <Editor
                          toolbar={{
                            options: [
                              "inline",
                              "blockType",
                              "fontSize",
                              "fontFamily",
                              "list",
                              "textAlign",
                              "colorPicker",
                              "link",
                              "embedded" /*, 'emoji'*/,
                              "image",
                              "remove",
                              "history",
                            ],
                          }}
                          handlePastedText={() => false}
                          toolbarClassName="toolbarClassName"
                          wrapperClassName="wrapperClassName"
                          editorClassName="editorClassName"
                          wrapperStyle={{
                            border: "1px solid #d6d6d6",
                            padding: 10,
                            borderRadius: 10,
                          }}
                          toolbarStyle={{
                            border: 0,
                            borderBottom: "1px solid #d6d6d6",
                          }}
                          editorState={editorData13}
                          onEditorStateChange={(value) =>
                            handelChange(value, 13, 4)
                          }
                        // onBlur={() => helpers.setTouched(true)}
                        />
                        {/* <MyTextArea type="text" className="form-control" name="vocabulary" /> */}
                      </div>
                    </div>
                    <div className="col-lg-12 col-md-12 col-sm-12">
                      <div className="form-group">
                        <label>Key Words</label>
                        <Editor
                          toolbar={{
                            options: [
                              "inline",
                              "blockType",
                              "fontSize",
                              "fontFamily",
                              "list",
                              "textAlign",
                              "colorPicker",
                              "link",
                              "embedded" /*, 'emoji'*/,
                              "image",
                              "remove",
                              "history",
                            ],
                          }}
                          handlePastedText={() => false}
                          toolbarClassName="toolbarClassName"
                          wrapperClassName="wrapperClassName"
                          editorClassName="editorClassName"
                          wrapperStyle={{
                            border: "1px solid #d6d6d6",
                            padding: 10,
                            borderRadius: 10,
                          }}
                          toolbarStyle={{
                            border: 0,
                            borderBottom: "1px solid #d6d6d6",
                          }}
                          editorState={editorData14}
                          onEditorStateChange={(value) =>
                            handelChange(value, 14, 4)
                          }
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
                        {getImageUrl !== "" ? (
                          <img src={getImageUrl} className=" w-30 p-3" alt="" />
                        ) : null}
                        {getState ? (
                          <p style={{ color: "red" }}>
                            Only Image is allowed !
                          </p>
                        ) : null}
                      </div>
                    </div>
                    <div className="col-lg-12 col-md-12 col-sm-12">
                      {!getbutton ? (
                        getState ? (
                          <Button disabled type="submit" variant="contained">
                            Submit
                          </Button>
                        ) : (
                          <Button type="submit" variant="contained">
                            Submit
                          </Button>
                        )
                      ) : (
                        <Button
                          variant="contained"
                          style={{ backgroundColor: "blue", color: "white" }}
                          disabled
                        >
                          Wait Please!
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </Form>
            </Formik>
          ) : null}
        </Modal.Body>
      </Modal>
      {/* Ends Add LessonPlans */}

      {/* create dynamicForm modal */}

      <Modal show={openFormModal} keyboard={false}>
        <Modal.Header>
          ADD LESSON PLAN
          <i
            className="fas fa-cut"
            style={{ cursor: "pointer" }}
            onClick={() => {
              if (
                window.confirm(
                  "Are you sure you want to leave the current page?\nChanges will not be saved until you submit the form!"
                )
              ) {
                setOpenFormModal(false);
                // setDynamicFormEditData({});
              }
            }}
          ></i>
        </Modal.Header>
        <Modal.Body>
          <DynamicForm
            closeModal={() => setOpenFormModal(false)}
            // dynamicFormEditData={dynamicFormEditData}
            lessonPlanData={lessonPlanData}
            getCustomLessons={getCustomLessons}
          />
        </Modal.Body>
      </Modal>

      {/* Edit dynamicForm modal */}

      <Modal show={openEditFormModal} keyboard={false}>
        <Modal.Header>
          EDIT LESSON PLAN
          <i
            className="fas fa-cut"
            style={{ cursor: "pointer" }}
            onClick={() => {
              if (
                window.confirm(
                  "Are you sure you want to leave the current page?\nChanges will not be saved until you submit the form!"
                )
              ) {
                setOpenEditFormModal(false);
                setDynamicFormEditData({});
              }
            }}
          ></i>
        </Modal.Header>
        <Modal.Body>
          <DynamicForm
            closeModal={() => {
              setOpenEditFormModal(false);
            }}
            dynamicFormEditData={dynamicFormEditData}
            lessonPlanData={lessonPlanData}
            getCustomLessons={getCustomLessons}
          />
        </Modal.Body>
      </Modal>

      {/* View Lesson Plan Model */}

      <Modal show={ViewModel} keyboard={false}>
        <Modal.Header>
          LESSON PLAN
          <i
            className="fas fa-cut"
            style={{ cursor: "pointer" }}
            onClick={() => {
              setViewModel(false);
            }}
          ></i>
        </Modal.Header>
        <Modal.Body>
          <table style={{ borderCollapse: "collapse", width: "100%" }}>
            <tbody>
              {ViewData &&
                ViewData.data &&
                ViewData.data.map((item, index) => {
                  return renderViewData(item, index);
                })}
            </tbody>
          </table>
        </Modal.Body>
      </Modal>
      <Footer />
    </>
  );
}
