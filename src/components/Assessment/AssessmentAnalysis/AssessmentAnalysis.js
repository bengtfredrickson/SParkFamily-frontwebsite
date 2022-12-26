import React, { Component } from "react";
import BackButton from "../../UI/BackButton/BackButton";
import Header from "../../UI/Header/Header";
import ReactApexChart from "react-apexcharts";
import fetchMethods from "../../../services/fetchApi";
import assessmentMethods from "../../../services/assessmentApi";
import moment from "moment";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import Paper from "@material-ui/core/Paper";
import TableFooter from "@material-ui/core/TableFooter";
import CircularProgress from "@material-ui/core/CircularProgress";
import { MuiPickersUtilsProvider, DatePicker } from "@material-ui/pickers";
import Moment from "@date-io/moment";
import { CSVLink } from "react-csv";

class AssessmentAnalysis extends Component {
  state = {
    series: [],
    options: {},
    unitData: JSON.parse(window.sessionStorage.getItem("Unit")),
    assessments: [],
    assessment: "",
    assessmentId: 0,
    assessName: "",
    studentData: [],
    fetchAssessment: "spark",
    buildings: [],
    building: "",
    teachers: [],
    teacher: "",
    loader: false,
    studentColumn: [],
    sortData: {
      sort_by: "student_id",
      order_by: "asc",
      offset: 0,
      limit: 5,
      status: 1,
    },
    query: "",
    filteredData: [],
    tableCount: 10,
    rowsPerPage: 5,
    page: 0,
    order: true,
    type: "pre",
    today: moment(),
    others: [],
    createdBy: JSON.parse(window.sessionStorage.getItem("UserDetails")).email,
    assessmentDate: moment(new Date()).format("yyyy-MM-DD"),
    showRubric: false,
    emailData: [],
    showEmail: false,
    emailOptions: {},
    emailSeries: [],
    showEmailBar: false,
    emailIndOptions: {},
    emailIndSeries: [],
    emailPartOptions: {},
    emailPartSeries: [],
    graphData: [],
    isRubric: false,
    noAssessments: false,
    showCSW: false,
    cswArray: [],
    questionTitle: "",
    questionSubTitle: "",
    coulda: [],
    shoulda: [],
    woulda: [],
    differentQues: [],
    ansArray1: [],
    ansArray2: [],
    ansArray3: [],
    ansArray4: [],
    ansArray5: [],
    exportData: [],
    showDifferent: false,
  };

  componentDidMount() {
    this.getData();
  }

  getData = async () => {
    if (this.state.unitData.curriculum_id !== undefined) {
      await this.setState({
        assessName:
          "Spark Assessment Analysis - " +
          this.state.unitData.curriculum_name +
          " " +
          this.state.unitData.unit_name,
      });

      var assessObject = {
        curriculum_id: this.state.unitData.curriculum_id,
        unit_id: this.state.unitData.unit_id,
      };

      const assessmentResponse =
        await fetchMethods.getAssessmentsListForCalendar(assessObject);

      if (assessmentResponse.data.result !== null) {
        await this.setState({
          assessments: assessmentResponse.data.result,
          assessmentId: assessmentResponse.data.result[0].assessment_id,
        });
      }

      var buildingObj = {
        createdBy: this.state.createdBy,
      };

      const buildingresponse = await fetchMethods.getBuildingsList(buildingObj);

      if (buildingresponse.status === 200) {
        await this.setState({
          buildings: buildingresponse.data.result,
          building: buildingresponse.data.result[0].building,
        });
      }

      if (this.state.building !== null) {
        var teacherData = {
          createdBy: this.state.createdBy,
          buildingName: this.state.building,
        };

        const teacherresponse = await fetchMethods.getTeachersList(teacherData);
        if (teacherresponse.status === 200) {
          await this.setState({
            teachers: teacherresponse.data.result,
            teacher:
              teacherresponse.data.result.length > 0
                ? teacherresponse.data.result[0].teacher_name
                : "",
          });
        }

        this.getAssessmentData();
      }
    }
    if (this.state.unitData.curriculum_id === 7) {
      this.setState({
        noAssessments: true,
      });
    }
  };

  getAssessmentData = async () => {
    if (this.state.assessments.length > 0) {
      for (let element of this.state.assessments) {
        if (element.assessment_name.search("Rubric")) {
          await this.setState({ isRubric: true });
        } else {
          await this.setState({ isRubric: false });
        }
      }
      if (this.state.isRubric === true) {
        var assessmentObject = {
          buildingName: this.state.building,
          className: this.state.teacher,
          date: this.state.assessmentDate,
          curriculum_id: this.state.unitData.curriculum_id,
          unit_id: this.state.unitData.unit_id,
          assessment_id: this.state.assessmentId,
          module_id: this.state.unitData.module_id,
          type: this.state.type,
          createdBy: this.state.createdBy,
        };

        const response = await assessmentMethods.getAssessmentByBuildingClass(
          assessmentObject
        );

        if (response.status === 200) {
          var columnsList = [
            { name: "student_id", title: "ID" },
            { name: "last_name", title: "Last Name" },
            { name: "first_name", title: "First Name" },
            { name: "grade", title: "Grade" },
            { name: "building", title: "Building" },
            { name: "teacher_name", title: "Class" },
            { name: "date", title: "Date" },
            { name: "cues", title: "Score" },
          ];

          await this.setState({
            studentData: response.data.result[0].students,
            filteredData: response.data.result[0].students,
            showRubric: true,
            exportData: response.data.result[0].students,
          });
        }

        this.state.exportData.forEach((element) => {
          delete element.assessment_id;
          delete element.createdBy;
        });

        var newObject = [];

        this.state.filteredData.forEach((element) => {
          newObject.push({
            ...element,
          });
        });

        await this.setState({
          filteredData: newObject,
          studentData: newObject,
          studentColumn: columnsList,
          tableCount: newObject.length,
        });
      }
      this.exportExcel();

      this.createGraph();
    }

    if (
      this.state.assessmentId === 49 ||
      this.state.assessmentId === 58 ||
      this.state.assessmentId === 60 ||
      this.state.assessmentId === 61 ||
      this.state.assessmentId === 62 ||
      this.state.assessmentId === 63 ||
      this.state.assessmentId === 64 ||
      this.state.assessmentId === 66 ||
      this.state.assessmentId === 67 ||
      this.state.assessmentId === 68 ||
      this.state.assessmentId === 69 ||
      this.state.assessmentId === 70 ||
      this.state.assessmentId === 72 ||
      this.state.assessmentId === 126 ||
      this.state.assessmentId === 128 ||
      this.state.assessmentId === 133 ||
      this.state.assessmentId === 134 ||
      this.state.assessmentId === 135 ||
      this.state.assessmentId === 136 ||
      this.state.assessmentId === 143 ||
      this.state.assessmentId === 147 ||
      this.state.assessmentId === 148 ||
      this.state.assessmentId === 149 ||
      this.state.assessmentId === 150 ||
      this.state.assessmentId === 151 ||
      this.state.assessmentId === 152 ||
      this.state.assessmentId === 156 ||
      this.state.assessmentId === 162 ||
      this.state.assessmentId === 166 ||
      this.state.assessmentId === 171 ||
      this.state.assessmentId === 175 ||
      this.state.assessmentId === 179 ||
      this.state.assessmentId === 183 ||
      this.state.assessmentId === 187 ||
      this.state.assessmentId === 195 ||
      this.state.assessmentId === 206 ||
      this.state.assessmentId === 210 ||
      this.state.assessmentId === 223 ||
      this.state.assessmentId === 229 ||
      this.state.assessmentId === 232 ||
      this.state.assessmentId === 235 ||
      this.state.assessmentId === 242 ||
      this.state.assessmentId === 246 ||
      this.state.assessmentId === 249 ||
      this.state.assessmentId === 252 ||
      this.state.assessmentId === 254 ||
      this.state.assessmentId === 255 ||
      this.state.assessmentId === 263 ||
      this.state.assessmentId === 264 ||
      this.state.assessmentId === 265 ||
      this.state.assessmentId === 266 ||
      this.state.assessmentId === 268 ||
      this.state.assessmentId === 269 ||
      this.state.assessmentId === 271 ||
      this.state.assessmentId === 272 ||
      this.state.assessmentId === 273 ||
      this.state.assessmentId === 274 ||
      this.state.assessmentId === 276 ||
      this.state.assessmentId === 277 ||
      this.state.assessmentId === 278
    ) {
      this.getEmailAssessmentData();
    } else if (
      this.state.assessmentId === 226 ||
      this.state.assessmentId === 253
    ) {
      this.getEmailBarAssessmentData();
    }
  };

  getEmailAssessmentData = async () => {
    var assessmentObject = {
      buildingName: this.state.building,
      className: this.state.teacher,
      date: this.state.assessmentDate,
      assessment_id: this.state.assessmentId,
      type: this.state.type,
      createdBy: this.state.createdBy,
    };

    const emailResponse =
      await assessmentMethods.getStudentsForEmailAssessments(assessmentObject);

    if (emailResponse.status === 200) {
      var emailcolumnsList = [
        { name: "student_id", title: "ID" },
        { name: "last_name", title: "Last Name" },
        { name: "first_name", title: "First Name" },
        { name: "grade", title: "Grade" },
        { name: "building", title: "Building" },
        { name: "teacher_name", title: "Class" },
        { name: "date", title: "Date" },
      ];

      await this.setState({
        studentData: emailResponse.data.result[0].students,
        filteredData: emailResponse.data.result[0].students,
        showRubric: false,
        showEmailBar: false,
        studentColumn: emailcolumnsList,
        exportData: emailResponse.data.result[0].students,
      });
    }

    this.state.exportData.forEach((element) => {
      delete element.assessment_id;
      delete element.createdBy;
    });

    var newObject = [];

    this.state.filteredData.forEach((element) => {
      newObject.push({
        ...element,
      });
    });

    this.setState({
      filteredData: newObject,
      studentData: newObject,
      tableCount: newObject.length,
    });

    this.state.studentData.forEach((data) => {
      if (data.result_data !== null) {
        this.setState({
          showEmail: true,
          showCSW: false,
          showDifferent: false,
          isRubric: false,
        });
      }
    });

    if (this.state.showEmail === true) {
      this.createEmailGraph();
      this.exportExcel();
    }
  };

  getEmailBarAssessmentData = async () => {
    var assessmentObject = {
      buildingName: this.state.building,
      className: this.state.teacher,
      date: this.state.assessmentDate,
      assessment_id: this.state.assessmentId,
      type: this.state.type,
      createdBy: this.state.createdBy,
    };

    const emailResponse =
      await assessmentMethods.getStudentsForEmailAssessments(assessmentObject);

    if (emailResponse.status === 200) {
      var emailcolumnsList = [
        { name: "student_id", title: "ID" },
        { name: "last_name", title: "Last Name" },
        { name: "first_name", title: "First Name" },
        { name: "grade", title: "Grade" },
        { name: "building", title: "Building" },
        { name: "teacher_name", title: "Class" },
        { name: "date", title: "Date" },
      ];

      await this.setState({
        studentData: emailResponse.data.result[0].students,
        filteredData: emailResponse.data.result[0].students,
        showRubric: false,
        showEmail: false,
        showCSW: false,
        showDifferent: false,
        exportData: emailResponse.data.result[0].students,
      });

      this.state.exportData.forEach((element) => {
        delete element.assessment_id;
        delete element.createdBy;
      });

      var newObject = [];

      this.state.filteredData.forEach((element) => {
        newObject.push({
          ...element,
        });
      });

      this.setState({
        filteredData: newObject,
        studentData: newObject,
        studentColumn: emailcolumnsList,
        tableCount: newObject.length,
      });

      this.state.studentData.forEach((data) => {
        if (data.result_data !== null) {
          this.setState({
            showEmailBar: true,
            showCSW: false,
          });
        }
      });

      if (this.state.showEmailBar === true) {
        this.createEmailBarGraph();
        this.exportExcel();
      }
    }
  };

  createGraph = async () => {
    if (this.state.showRubric === true) {
      var val0 = [];
      var val1 = [];
      var val2 = [];
      var val3 = [];
      this.state.studentData.forEach((element) => {
        if (element.cues === "0") {
          val0.push(element.cues);
        } else if (element.cues === "1") {
          val1.push(element.cues);
        } else if (element.cues === "2") {
          val2.push(element.cues);
        } else if (element.cues === "3") {
          val3.push(element.cues);
        }
      });

      if (
        val0.length === 0 &&
        val1.length === 0 &&
        val2.length === 0 &&
        val3.length === 0
      ) {
        await this.setState({
          showRubric: false,
          showEmailBar: false,
          showEmail: false,
          showCSW: false,
          showDifferent: false,
          isRubric: false,
          val0: [],
          val1: [],
          val2: [],
          val3: [],
        });
      } else {
        this.setState({
          showRubric: true,
          isRubric: true,
          showEmailBar: false,
          showEmail: false,
          showCSW: false,
          showDifferent: false,
          series: [val0.length, val1.length, val2.length, val3.length],
          options: {
            chart: {
              width: 260,
              type: "pie",
              toolbar: {
                show: true,
              },
            },
            dataLabels: {
              enabled: true,
            },
            labels: ["0 Score", "1 Score", "2 Score", "3 Score"],
            legend: {
              show: true,
              offsetX: 10,
              offsetY: 10,
            },
            responsive: [
              {
                breakpoint: 480,
                options: {
                  chart: {
                    width: 300,
                  },
                  legend: {
                    position: "bottom",
                  },
                },
              },
            ],
            stroke: {
              show: false,
            },
          },
        });
      }
    }
  };

  createEmailGraph = async () => {
    if (this.state.showEmail === true) {
      var label = [];

      var labelArray = [];
      var data = [];

      if (this.state.studentData.length > 0) {
        this.state.studentData.forEach((element) => {
          if (element.result_data !== null) {
            var resultData = {};

            resultData = JSON.parse(element.result_data);

            if (
              this.state.assessmentId === 49 ||
              this.state.assessmentId === 60 ||
              this.state.assessmentId === 61 ||
              this.state.assessmentId === 62 ||
              this.state.assessmentId === 63 ||
              this.state.assessmentId === 64 ||
              this.state.assessmentId === 66 ||
              this.state.assessmentId === 67 ||
              this.state.assessmentId === 68 ||
              this.state.assessmentId === 69 ||
              this.state.assessmentId === 126 ||
              this.state.assessmentId === 128 ||
              this.state.assessmentId === 133 ||
              this.state.assessmentId === 134 ||
              this.state.assessmentId === 135 ||
              this.state.assessmentId === 136 ||
              this.state.assessmentId === 210 ||
              this.state.assessmentId === 223 ||
              this.state.assessmentId === 229 ||
              this.state.assessmentId === 232 ||
              this.state.assessmentId === 235 ||
              this.state.assessmentId === 242 ||
              this.state.assessmentId === 246 ||
              this.state.assessmentId === 249 ||
              this.state.assessmentId === 252 ||
              this.state.assessmentId === 254
            ) {
              data.push(resultData);
              this.createGraphFor4(data);
            } else if (
              this.state.assessmentId === 70 ||
              this.state.assessmentId === 72 ||
              this.state.assessmentId === 143 ||
              this.state.assessmentId === 147 ||
              this.state.assessmentId === 148 ||
              this.state.assessmentId === 149 ||
              this.state.assessmentId === 150 ||
              this.state.assessmentId === 151 ||
              this.state.assessmentId === 152 ||
              this.state.assessmentId === 156 ||
              this.state.assessmentId === 162 ||
              this.state.assessmentId === 166 ||
              this.state.assessmentId === 171 ||
              this.state.assessmentId === 175 ||
              this.state.assessmentId === 179 ||
              this.state.assessmentId === 183 ||
              this.state.assessmentId === 187 ||
              this.state.assessmentId === 195 ||
              this.state.assessmentId === 206 ||
              this.state.assessmentId === 255 ||
              this.state.assessmentId === 263 ||
              this.state.assessmentId === 264 ||
              this.state.assessmentId === 265 ||
              this.state.assessmentId === 266 ||
              this.state.assessmentId === 268 ||
              this.state.assessmentId === 269 ||
              this.state.assessmentId === 271 ||
              this.state.assessmentId === 272 ||
              this.state.assessmentId === 273 ||
              this.state.assessmentId === 274 ||
              this.state.assessmentId === 276 ||
              this.state.assessmentId === 277 ||
              this.state.assessmentId === 278
            ) {
              data.push(resultData);
              this.createCSW(data);
            } else if (this.state.assessmentId === 58) {
              data.push(resultData);
              this.createDiffQuestions(data);
            }
          }
        });

        this.setState({
          emailSeries: labelArray,
          emailOptions: {
            chart: {
              width: 260,
              type: "pie",
              toolbar: {
                show: true,
              },
            },
            dataLabels: {
              enabled: true,
            },
            labels: label,
            legend: {
              show: false,
              offsetX: 10,
              offsetY: 10,
            },
            responsive: [
              {
                breakpoint: 480,
                options: {
                  chart: {
                    width: 300,
                  },
                  legend: {
                    position: "bottom",
                  },
                },
              },
            ],
            stroke: {
              show: false,
            },
          },
        });
      } else {
        await this.setState({
          showEmail: false,
        });
      }
    }
  };

  createGraphFor4 = async (data) => {
    if (this.state.assessmentId === 49) {
      var question1Options = [
        "I’m a bubblepopper and am not safe to myself or others.",
        "I’m a novice. I play safe some of the time.",
        "I’m nearly a pro, and I play safely most of the time.",
        "I’m a superstar! I play safely all of the time.",
      ];
      var question2Options = [
        "I couldn’t outmaneuver a tank.",
        "I have my learner’s permit. I can get around basic obstacles.",
        "I can run some tricky plays.",
        "You can’t catch me, but I can probably catch you!",
      ];
      var question3Options = [
        "I need constant reminders.",
        "I need reminders once a lesson.",
        "I follow the rules.",
        "I not only follow, but help enforce the rules.",
      ];
      var question4Options = [
        "It’s really all about me. Is anyone else playing?",
        "I notice others, and stay away from them.",
        "I cooperate and include others",
        "I give encouragement and work well with others.",
      ];

      var chartSeries = [];

      var chartCategory1 = {
        chart: {
          width: 260,
          type: "bar",
          toolbar: {
            show: true,
          },
        },
        dataLabels: {
          enabled: true,
        },
        legend: {
          show: true,
          offsetX: 10,
          offsetY: 10,
        },
        responsive: [
          {
            breakpoint: 480,
            options: {
              chart: {
                width: 300,
              },
              legend: {
                position: "bottom",
              },
            },
          },
        ],
        xaxis: {
          categories: this.splitChoices(question1Options),
          title: {
            text: "",
            floating: false,
            offsetY: 0,
            align: "center",
            style: {
              color: "#444",
            },
          },
        },
        stroke: {
          show: false,
        },
      };

      var chartCategory2 = {
        chart: {
          width: 260,
          type: "bar",
          toolbar: {
            show: true,
          },
        },
        dataLabels: {
          enabled: true,
        },
        legend: {
          show: true,
          offsetX: 10,
          offsetY: 10,
        },
        responsive: [
          {
            breakpoint: 480,
            options: {
              chart: {
                width: 300,
              },
              legend: {
                position: "bottom",
              },
            },
          },
        ],
        xaxis: {
          categories: this.splitChoices(question2Options),
          title: {
            text: "",
            floating: false,
            offsetY: 0,
            align: "center",
            style: {
              color: "#444",
            },
          },
        },
        stroke: {
          show: false,
        },
      };

      var chartCategory3 = {
        chart: {
          width: 260,
          type: "bar",
          toolbar: {
            show: true,
          },
        },
        dataLabels: {
          enabled: true,
        },
        legend: {
          show: true,
          offsetX: 10,
          offsetY: 10,
        },
        responsive: [
          {
            breakpoint: 480,
            options: {
              chart: {
                width: 300,
              },
              legend: {
                position: "bottom",
              },
            },
          },
        ],
        xaxis: {
          categories: this.splitChoices(question3Options),
          title: {
            text: "",
            floating: false,
            offsetY: 0,
            align: "center",
            style: {
              color: "#444",
            },
          },
        },
        stroke: {
          show: false,
        },
      };

      var chartCategory4 = {
        chart: {
          width: 260,
          type: "bar",
          toolbar: {
            show: true,
          },
        },
        dataLabels: {
          enabled: true,
        },
        legend: {
          show: true,
          offsetX: 10,
          offsetY: 10,
        },
        responsive: [
          {
            breakpoint: 480,
            options: {
              chart: {
                width: 300,
              },
              legend: {
                position: "bottom",
              },
            },
          },
        ],
        xaxis: {
          categories: this.splitChoices(question4Options),
          title: {
            text: "",
            floating: false,
            offsetY: 0,
            align: "center",
            style: {
              color: "#444",
            },
          },
        },
        stroke: {
          show: false,
        },
      };

      const option1 = [0, 0, 0, 0];
      const option2 = [0, 0, 0, 0];
      const option3 = [0, 0, 0, 0];
      const option4 = [0, 0, 0, 0];

      for (const item of data) {
        const answer1 = item.answer1;
        if (question1Options.includes(answer1)) {
          const idx = question1Options.findIndex((el) => el === answer1);
          option1[idx] = option1[idx] + 1;
          chartCategory1.xaxis.title.text = item.question1;
        }

        const answer2 = item.answer2;
        if (question2Options.includes(answer2)) {
          const idx = question2Options.findIndex((el) => el === answer2);
          option2[idx] = option2[idx] + 1;
          chartCategory2.xaxis.title.text = item.question2;
        }

        const answer3 = item.answer3;
        if (question3Options.includes(answer3)) {
          const idx = question3Options.findIndex((el) => el === answer3);
          option3[idx] = option3[idx] + 1;
          chartCategory3.xaxis.title.text = item.question3;
        }

        const answer4 = item.answer4;
        if (question4Options.includes(answer4)) {
          const idx = question4Options.findIndex((el) => el === answer4);
          option4[idx] = option4[idx] + 1;
          chartCategory4.xaxis.title.text = item.question4;
        }
      }

      chartSeries.push(option1, option2, option3, option4);
      var chartGraph = [
        {
          series: [{ name: "Question 1", data: option1 }],
          options: chartCategory1,
        },
        {
          series: [{ name: "Question 2", data: option2 }],
          options: chartCategory2,
        },
        {
          series: [{ name: "Question 3", data: option3 }],
          options: chartCategory3,
        },
        {
          series: [{ name: "Question 4", data: option4 }],
          options: chartCategory4,
        },
      ];
    }
    if (this.state.assessmentId === 61 || this.state.assessmentId === 62) {
      question1Options = [
        "Some of the time",
        "Most of the time",
        "All of the time",
      ];
      question2Options = [
        "Some of the time",
        "Most of the time",
        "All of the time",
      ];
      question3Options = [
        "Some of the time",
        "Most of the time",
        "All of the time",
      ];
      question4Options = [
        "Some of the time",
        "Most of the time",
        "All of the time",
      ];
      var question5Options = [
        "Some of the time",
        "Most of the time",
        "All of the time",
      ];
      var question6Options = [
        "Some of the time",
        "Most of the time",
        "All of the time",
      ];
      var question7Options = [
        "Some of the time",
        "Most of the time",
        "All of the time",
      ];
      var question8Options = [
        "Some of the time",
        "Most of the time",
        "All of the time",
      ];
      var question9Options = [
        "Some of the time",
        "Most of the time",
        "All of the time",
      ];

      chartSeries = [];

      chartCategory1 = {
        chart: {
          width: 260,
          type: "bar",
          toolbar: {
            show: true,
          },
        },
        dataLabels: {
          enabled: true,
        },
        legend: {
          show: true,
          offsetX: 10,
          offsetY: 10,
        },
        responsive: [
          {
            breakpoint: 480,
            options: {
              chart: {
                width: 300,
              },
              legend: {
                position: "bottom",
              },
            },
          },
        ],
        xaxis: {
          categories: this.splitChoices(question1Options),
          title: {
            text: "",
            floating: false,
            offsetY: 0,
            align: "center",
            style: {
              color: "#444",
            },
          },
        },
        stroke: {
          show: false,
        },
      };

      chartCategory2 = {
        chart: {
          width: 260,
          type: "bar",
          toolbar: {
            show: true,
          },
        },
        dataLabels: {
          enabled: true,
        },
        legend: {
          show: true,
          offsetX: 10,
          offsetY: 10,
        },
        responsive: [
          {
            breakpoint: 480,
            options: {
              chart: {
                width: 300,
              },
              legend: {
                position: "bottom",
              },
            },
          },
        ],
        xaxis: {
          categories: this.splitChoices(question2Options),
          title: {
            text: "",
            floating: false,
            offsetY: 0,
            align: "center",
            style: {
              color: "#444",
            },
          },
        },
        stroke: {
          show: false,
        },
      };

      chartCategory3 = {
        chart: {
          width: 260,
          type: "bar",
          toolbar: {
            show: true,
          },
        },
        dataLabels: {
          enabled: true,
        },
        legend: {
          show: true,
          offsetX: 10,
          offsetY: 10,
        },
        responsive: [
          {
            breakpoint: 480,
            options: {
              chart: {
                width: 300,
              },
              legend: {
                position: "bottom",
              },
            },
          },
        ],
        xaxis: {
          categories: this.splitChoices(question3Options),
          title: {
            text: "",
            floating: false,
            offsetY: 0,
            align: "center",
            style: {
              color: "#444",
            },
          },
        },
        stroke: {
          show: false,
        },
      };

      chartCategory4 = {
        chart: {
          width: 260,
          type: "bar",
          toolbar: {
            show: true,
          },
        },
        dataLabels: {
          enabled: true,
        },
        legend: {
          show: true,
          offsetX: 10,
          offsetY: 10,
        },
        responsive: [
          {
            breakpoint: 480,
            options: {
              chart: {
                width: 300,
              },
              legend: {
                position: "bottom",
              },
            },
          },
        ],
        xaxis: {
          categories: this.splitChoices(question4Options),
          title: {
            text: "",
            floating: false,
            offsetY: 0,
            align: "center",
            style: {
              color: "#444",
            },
          },
        },
        stroke: {
          show: false,
        },
      };

      var chartCategory5 = {
        chart: {
          width: 260,
          type: "bar",
          toolbar: {
            show: true,
          },
        },
        dataLabels: {
          enabled: true,
        },
        legend: {
          show: true,
          offsetX: 10,
          offsetY: 10,
        },
        responsive: [
          {
            breakpoint: 480,
            options: {
              chart: {
                width: 300,
              },
              legend: {
                position: "bottom",
              },
            },
          },
        ],
        xaxis: {
          categories: this.splitChoices(question5Options),
          title: {
            text: "",
            floating: false,
            offsetY: 0,
            align: "center",
            style: {
              color: "#444",
            },
          },
        },
        stroke: {
          show: false,
        },
      };

      var chartCategory6 = {
        chart: {
          width: 260,
          type: "bar",
          toolbar: {
            show: true,
          },
        },
        dataLabels: {
          enabled: true,
        },
        legend: {
          show: true,
          offsetX: 10,
          offsetY: 10,
        },
        responsive: [
          {
            breakpoint: 480,
            options: {
              chart: {
                width: 300,
              },
              legend: {
                position: "bottom",
              },
            },
          },
        ],
        xaxis: {
          categories: this.splitChoices(question6Options),
          title: {
            text: "",
            floating: false,
            offsetY: 0,
            align: "center",
            style: {
              color: "#444",
            },
          },
        },
        stroke: {
          show: false,
        },
      };

      var chartCategory7 = {
        chart: {
          width: 260,
          type: "bar",
          toolbar: {
            show: true,
          },
        },
        dataLabels: {
          enabled: true,
        },
        legend: {
          show: true,
          offsetX: 10,
          offsetY: 10,
        },
        responsive: [
          {
            breakpoint: 480,
            options: {
              chart: {
                width: 300,
              },
              legend: {
                position: "bottom",
              },
            },
          },
        ],
        xaxis: {
          categories: this.splitChoices(question7Options),
          title: {
            text: "",
            floating: false,
            offsetY: 0,
            align: "center",
            style: {
              color: "#444",
            },
          },
        },
        stroke: {
          show: false,
        },
      };

      var chartCategory8 = {
        chart: {
          width: 260,
          type: "bar",
          toolbar: {
            show: true,
          },
        },
        dataLabels: {
          enabled: true,
        },
        legend: {
          show: true,
          offsetX: 10,
          offsetY: 10,
        },
        responsive: [
          {
            breakpoint: 480,
            options: {
              chart: {
                width: 300,
              },
              legend: {
                position: "bottom",
              },
            },
          },
        ],
        xaxis: {
          categories: this.splitChoices(question8Options),
          title: {
            text: "",
            floating: false,
            offsetY: 0,
            align: "center",
            style: {
              color: "#444",
            },
          },
        },
        stroke: {
          show: false,
        },
      };

      var chartCategory9 = {
        chart: {
          width: 260,
          type: "bar",
          toolbar: {
            show: true,
          },
        },
        dataLabels: {
          enabled: true,
        },
        legend: {
          show: true,
          offsetX: 10,
          offsetY: 10,
        },
        responsive: [
          {
            breakpoint: 480,
            options: {
              chart: {
                width: 300,
              },
              legend: {
                position: "bottom",
              },
            },
          },
        ],
        xaxis: {
          categories: this.splitChoices(question9Options),
          title: {
            text: "",
            floating: false,
            offsetY: 0,
            align: "center",
            style: {
              color: "#444",
            },
          },
        },
        stroke: {
          show: false,
        },
      };

      const option1 = [0, 0, 0, 0];
      const option2 = [0, 0, 0, 0];
      const option3 = [0, 0, 0, 0];
      const option4 = [0, 0, 0, 0];
      const option5 = [0, 0, 0, 0];
      const option6 = [0, 0, 0, 0];
      const option7 = [0, 0, 0, 0];
      const option8 = [0, 0, 0, 0];
      const option9 = [0, 0, 0, 0];

      for (const item of data) {
        const answer1 = item.answer1;
        if (question1Options.includes(answer1)) {
          const idx = question1Options.findIndex((el) => el === answer1);
          option1[idx] = option1[idx] + 1;
          chartCategory1.xaxis.title.text = item.question1;
        }

        const answer2 = item.answer2;
        if (question2Options.includes(answer2)) {
          const idx = question2Options.findIndex((el) => el === answer2);
          option2[idx] = option2[idx] + 1;
          chartCategory2.xaxis.title.text = item.question2;
        }

        const answer3 = item.answer3;
        if (question3Options.includes(answer3)) {
          const idx = question3Options.findIndex((el) => el === answer3);
          option3[idx] = option3[idx] + 1;
          chartCategory3.xaxis.title.text = item.question3;
        }

        const answer4 = item.answer4;
        if (question4Options.includes(answer4)) {
          const idx = question4Options.findIndex((el) => el === answer4);
          option4[idx] = option4[idx] + 1;
          chartCategory4.xaxis.title.text = item.question4;
        }

        const answer5 = item.answer5;
        if (question5Options.includes(answer5)) {
          const idx = question5Options.findIndex((el) => el === answer5);
          option5[idx] = option5[idx] + 1;
          chartCategory5.xaxis.title.text = item.question5;
        }

        const answer6 = item.answer6;
        if (question6Options.includes(answer6)) {
          const idx = question6Options.findIndex((el) => el === answer6);
          option6[idx] = option6[idx] + 1;
          chartCategory6.xaxis.title.text = item.question6;
        }

        const answer7 = item.answer7;
        if (question7Options.includes(answer7)) {
          const idx = question7Options.findIndex((el) => el === answer7);
          option7[idx] = option7[idx] + 1;
          chartCategory7.xaxis.title.text = item.question7;
        }

        const answer8 = item.answer8;
        if (question8Options.includes(answer8)) {
          const idx = question8Options.findIndex((el) => el === answer8);
          option8[idx] = option8[idx] + 1;
          chartCategory8.xaxis.title.text = item.question8;
        }

        const answer9 = item.answer9;
        if (question9Options.includes(answer9)) {
          const idx = question9Options.findIndex((el) => el === answer9);
          option9[idx] = option9[idx] + 1;
          chartCategory9.xaxis.title.text = item.question9;
        }
      }

      chartSeries.push(
        option1,
        option2,
        option3,
        option4,
        option5,
        option6,
        option7,
        option7,
        option8,
        option9
      );
      chartGraph = [
        {
          series: [{ name: "Question 1", data: option1 }],
          options: chartCategory1,
        },
        {
          series: [{ name: "Question 2", data: option2 }],
          options: chartCategory2,
        },
        {
          series: [{ name: "Question 3", data: option3 }],
          options: chartCategory3,
        },
        {
          series: [{ name: "Question 4", data: option4 }],
          options: chartCategory4,
        },
        {
          series: [{ name: "Question 5", data: option5 }],
          options: chartCategory5,
        },
        {
          series: [{ name: "Question 6", data: option6 }],
          options: chartCategory6,
        },
        {
          series: [{ name: "Question 7", data: option7 }],
          options: chartCategory7,
        },
        {
          series: [{ name: "Question 8", data: option8 }],
          options: chartCategory8,
        },

        {
          series: [{ name: "Question 9", data: option9 }],
          options: chartCategory9,
        },
      ];
    }
    if (
      this.state.assessmentId === 60 ||
      this.state.assessmentId === 66 ||
      this.state.assessmentId === 68 ||
      this.state.assessmentId === 126 ||
      this.state.assessmentId === 134 ||
      this.state.assessmentId === 136 ||
      this.state.assessmentId === 223 ||
      this.state.assessmentId === 229 ||
      this.state.assessmentId === 232 ||
      this.state.assessmentId === 235 ||
      this.state.assessmentId === 242 ||
      this.state.assessmentId === 246 ||
      this.state.assessmentId === 254
    ) {
      question1Options = ["2", "3", "4", "5", "6", "7", "8", "9", "10"];
      question2Options = ["2", "3", "4", "5", "6", "7", "8", "9", "10"];
      question3Options = ["2", "3", "4", "5", "6", "7", "8", "9", "10"];
      question4Options = ["2", "3", "4", "5", "6", "7", "8", "9", "10"];

      chartSeries = [];

      chartCategory1 = {
        chart: {
          width: 260,
          type: "bar",
          toolbar: {
            show: true,
          },
        },
        dataLabels: {
          enabled: true,
        },
        legend: {
          show: true,
          offsetX: 10,
          offsetY: 10,
        },
        responsive: [
          {
            breakpoint: 480,
            options: {
              chart: {
                width: 300,
              },
              legend: {
                position: "bottom",
              },
            },
          },
        ],
        xaxis: {
          categories: question1Options,
          title: {
            text: "",
            floating: false,
            offsetY: 0,
            align: "center",
            style: {
              color: "#444",
            },
          },
        },
        stroke: {
          show: true,
        },
      };

      chartCategory2 = {
        chart: {
          width: 260,
          type: "bar",
          toolbar: {
            show: true,
          },
        },
        dataLabels: {
          enabled: true,
        },
        legend: {
          show: true,
          offsetX: 10,
          offsetY: 10,
        },
        responsive: [
          {
            breakpoint: 480,
            options: {
              chart: {
                width: 300,
              },
              legend: {
                position: "bottom",
              },
            },
          },
        ],
        xaxis: {
          categories: question2Options,
          title: {
            text: "",
            floating: false,
            offsetY: 0,
            align: "center",
            style: {
              color: "#444",
            },
          },
        },
        stroke: {
          show: false,
        },
      };

      chartCategory3 = {
        chart: {
          width: 260,
          type: "bar",
          toolbar: {
            show: true,
          },
        },
        dataLabels: {
          enabled: true,
        },
        legend: {
          show: true,
          offsetX: 10,
          offsetY: 10,
        },
        responsive: [
          {
            breakpoint: 480,
            options: {
              chart: {
                width: 300,
              },
              legend: {
                position: "bottom",
              },
            },
          },
        ],
        xaxis: {
          categories: question3Options,
          title: {
            text: "",
            floating: false,
            offsetY: 0,
            align: "center",
            style: {
              color: "#444",
            },
          },
        },
        stroke: {
          show: false,
        },
      };

      chartCategory4 = {
        chart: {
          width: 260,
          type: "bar",
          toolbar: {
            show: true,
          },
        },
        dataLabels: {
          enabled: true,
        },
        legend: {
          show: true,
          offsetX: 10,
          offsetY: 10,
        },
        responsive: [
          {
            breakpoint: 480,
            options: {
              chart: {
                width: 300,
              },
              legend: {
                position: "bottom",
              },
            },
          },
        ],
        xaxis: {
          categories: question4Options,
          title: {
            text: "",
            floating: false,
            offsetY: 0,
            align: "center",
            style: {
              color: "#444",
            },
          },
        },
        stroke: {
          show: false,
        },
      };

      const option1 = [0, 0, 0, 0, 0, 0, 0, 0, 0];
      const option2 = [0, 0, 0, 0, 0, 0, 0, 0, 0];
      const option3 = [0, 0, 0, 0, 0, 0, 0, 0, 0];
      const option4 = [0, 0, 0, 0, 0, 0, 0, 0, 0];

      for (const item of data) {
        const answer1 = item.answer1;
        if (question1Options.includes(answer1)) {
          const idx = question1Options.findIndex((el) => el === answer1);
          option1[idx] = option1[idx] + 1;

          if (
            this.state.assessmentId === 60 ||
            this.state.assessmentId === 66 ||
            this.state.assessmentId === 68 ||
            this.state.assessmentId === 126 ||
            this.state.assessmentId === 254
          ) {
            chartCategory1.xaxis.title.text =
              item.question1 +
              " -- (Lightin' it up! 2 - 4 Times, Startin' to glow! 5 - 7 Times, SPARKin'! 8 - 10 Times)";
          } else if (
            this.state.assessmentId === 134 ||
            this.state.assessmentId === 136 ||
            this.state.assessmentId === 223 ||
            this.state.assessmentId === 229 ||
            this.state.assessmentId === 232 ||
            this.state.assessmentId === 235 ||
            this.state.assessmentId === 242 ||
            this.state.assessmentId === 246
          ) {
            chartCategory1.xaxis.title.text =
              item.question1 +
              " -- (Rookie 2-4 Times, Semi-Pro 5 - 7 Times, Professional 8 - 10 Times)";
          }
        }

        const answer2 = item.answer2;
        if (question2Options.includes(answer2)) {
          const idx = question2Options.findIndex((el) => el === answer2);
          option2[idx] = option2[idx] + 1;

          if (
            this.state.assessmentId === 60 ||
            this.state.assessmentId === 66 ||
            this.state.assessmentId === 68 ||
            this.state.assessmentId === 126 ||
            this.state.assessmentId === 254
          ) {
            chartCategory2.xaxis.title.text =
              item.question2 +
              " -- (Lightin' it up! 2 - 4 Times, Startin' to glow! 5 - 7 Times, SPARKin'! 8 - 10 Times)";
          } else if (
            this.state.assessmentId === 134 ||
            this.state.assessmentId === 136 ||
            this.state.assessmentId === 223 ||
            this.state.assessmentId === 229 ||
            this.state.assessmentId === 232 ||
            this.state.assessmentId === 235 ||
            this.state.assessmentId === 242 ||
            this.state.assessmentId === 246
          ) {
            chartCategory2.xaxis.title.text =
              item.question2 +
              " -- (Rookie 2-4 Times, Semi-Pro 5 - 7 Times, Professional 8 - 10 Times)";
          }
        }

        const answer3 = item.answer3;
        if (question3Options.includes(answer3)) {
          const idx = question3Options.findIndex((el) => el === answer3);
          option3[idx] = option3[idx] + 1;

          if (
            this.state.assessmentId === 60 ||
            this.state.assessmentId === 66 ||
            this.state.assessmentId === 68 ||
            this.state.assessmentId === 126 ||
            this.state.assessmentId === 254
          ) {
            chartCategory3.xaxis.title.text =
              item.question3 +
              " -- (Lightin' it up! 2 - 4 Times, Startin' to glow! 5 - 7 Times, SPARKin'! 8 - 10 Times)";
          } else if (
            this.state.assessmentId === 134 ||
            this.state.assessmentId === 136 ||
            this.state.assessmentId === 223 ||
            this.state.assessmentId === 229 ||
            this.state.assessmentId === 232 ||
            this.state.assessmentId === 235 ||
            this.state.assessmentId === 242 ||
            this.state.assessmentId === 246
          ) {
            chartCategory3.xaxis.title.text =
              item.question3 +
              " -- (Rookie 2-4 Times, Semi-Pro 5 - 7 Times, Professional 8 - 10 Times)";
          }
        }

        const answer4 = item.answer4;
        if (question4Options.includes(answer4)) {
          const idx = question4Options.findIndex((el) => el === answer4);
          option4[idx] = option4[idx] + 1;

          if (
            this.state.assessmentId === 60 ||
            this.state.assessmentId === 66 ||
            this.state.assessmentId === 68 ||
            this.state.assessmentId === 126 ||
            this.state.assessmentId === 254
          ) {
            chartCategory4.xaxis.title.text =
              item.question4 +
              " -- (Lightin' it up! 2 - 4 Times, Startin' to glow! 5 - 7 Times, SPARKin'! 8 - 10 Times)";
          } else if (
            this.state.assessmentId === 134 ||
            this.state.assessmentId === 136 ||
            this.state.assessmentId === 223 ||
            this.state.assessmentId === 229 ||
            this.state.assessmentId === 232 ||
            this.state.assessmentId === 235 ||
            this.state.assessmentId === 242 ||
            this.state.assessmentId === 246
          ) {
            chartCategory4.xaxis.title.text =
              item.question4 +
              " -- (Rookie 2-4 Times, Semi-Pro 5 - 7 Times, Professional 8 - 10 Times)";
          }
        }
      }

      chartSeries.push(option1, option2, option3, option4);
      chartGraph = [
        {
          series: [{ name: "Question 1", data: option1 }],
          options: chartCategory1,
        },
        {
          series: [{ name: "Question 2", data: option2 }],
          options: chartCategory2,
        },
        {
          series: [{ name: "Question 3", data: option3 }],
          options: chartCategory3,
        },
        {
          series: [{ name: "Question 4", data: option4 }],
          options: chartCategory4,
        },
      ];
    }
    if (
      this.state.assessmentId === 63 ||
      this.state.assessmentId === 64 ||
      this.state.assessmentId === 69 ||
      this.state.assessmentId === 133 ||
      this.state.assessmentId === 135 ||
      this.state.assessmentId === 210
    ) {
      question1Options = ["2", "3", "4", "5", "6", "7", "8", "9", "10"];
      question2Options = ["2", "3", "4", "5", "6", "7", "8", "9", "10"];
      question3Options = ["2", "3", "4", "5", "6", "7", "8", "9", "10"];

      chartSeries = [];

      chartCategory1 = {
        chart: {
          width: 260,
          type: "bar",
          toolbar: {
            show: true,
          },
        },
        dataLabels: {
          enabled: true,
        },
        legend: {
          show: true,
          offsetX: 10,
          offsetY: 10,
        },
        responsive: [
          {
            breakpoint: 480,
            options: {
              chart: {
                width: 300,
              },
              legend: {
                position: "bottom",
              },
            },
          },
        ],
        xaxis: {
          categories: question1Options,
          title: {
            text: "",
            floating: false,
            offsetY: 0,
            align: "center",
            style: {
              color: "#444",
            },
          },
        },
        stroke: {
          show: true,
        },
      };

      chartCategory2 = {
        chart: {
          width: 260,
          type: "bar",
          toolbar: {
            show: true,
          },
        },
        dataLabels: {
          enabled: true,
        },
        legend: {
          show: true,
          offsetX: 10,
          offsetY: 10,
        },
        responsive: [
          {
            breakpoint: 480,
            options: {
              chart: {
                width: 300,
              },
              legend: {
                position: "bottom",
              },
            },
          },
        ],
        xaxis: {
          categories: question2Options,
          title: {
            text: "",
            floating: false,
            offsetY: 0,
            align: "center",
            style: {
              color: "#444",
            },
          },
        },
        stroke: {
          show: false,
        },
      };

      chartCategory3 = {
        chart: {
          width: 260,
          type: "bar",
          toolbar: {
            show: true,
          },
        },
        dataLabels: {
          enabled: true,
        },
        legend: {
          show: true,
          offsetX: 10,
          offsetY: 10,
        },
        responsive: [
          {
            breakpoint: 480,
            options: {
              chart: {
                width: 300,
              },
              legend: {
                position: "bottom",
              },
            },
          },
        ],
        xaxis: {
          categories: question3Options,
          title: {
            text: "",
            floating: false,
            offsetY: 0,
            align: "center",
            style: {
              color: "#444",
            },
          },
        },
        stroke: {
          show: false,
        },
      };

      const option1 = [0, 0, 0, 0, 0, 0, 0, 0, 0];
      const option2 = [0, 0, 0, 0, 0, 0, 0, 0, 0];
      const option3 = [0, 0, 0, 0, 0, 0, 0, 0, 0];

      for (const item of data) {
        const answer1 = item.answer1;
        if (question1Options.includes(answer1)) {
          const idx = question1Options.findIndex((el) => el === answer1);
          option1[idx] = option1[idx] + 1;

          if (
            this.state.assessmentId === 63 ||
            this.state.assessmentId === 64 ||
            this.state.assessmentId === 69
          ) {
            chartCategory1.xaxis.title.text =
              item.question1 +
              " -- (Lightin' it up! 2 - 4 Times, Startin' to glow! 5 - 7 Times, SPARKin'! 8 - 10 Times)";
          } else if (
            this.state.assessmentId === 133 ||
            this.state.assessmentId === 135 ||
            this.state.assessmentId === 210
          ) {
            chartCategory1.xaxis.title.text =
              item.question1 +
              " -- (Rookie 2-4 Times, Semi-Pro 5 - 7 Times, Professional 8 - 10 Times)";
          }
        }

        const answer2 = item.answer2;
        if (question2Options.includes(answer2)) {
          const idx = question2Options.findIndex((el) => el === answer2);
          option2[idx] = option2[idx] + 1;

          if (
            this.state.assessmentId === 63 ||
            this.state.assessmentId === 64 ||
            this.state.assessmentId === 69
          ) {
            chartCategory2.xaxis.title.text =
              item.question2 +
              " -- (Lightin' it up! 2 - 4 Times, Startin' to glow! 5 - 7 Times, SPARKin'! 8 - 10 Times)";
          } else if (
            this.state.assessmentId === 133 ||
            this.state.assessmentId === 135 ||
            this.state.assessmentId === 210
          ) {
            chartCategory2.xaxis.title.text =
              item.question2 +
              " -- (Rookie 2-4 Times, Semi-Pro 5 - 7 Times, Professional 8 - 10 Times)";
          }
        }

        const answer3 = item.answer3;
        if (question3Options.includes(answer3)) {
          const idx = question3Options.findIndex((el) => el === answer3);
          option3[idx] = option3[idx] + 1;

          if (
            this.state.assessmentId === 63 ||
            this.state.assessmentId === 64 ||
            this.state.assessmentId === 69
          ) {
            chartCategory3.xaxis.title.text =
              item.question3 +
              " -- (Lightin' it up! 2 - 4 Times, Startin' to glow! 5 - 7 Times, SPARKin'! 8 - 10 Times)";
          } else if (
            this.state.assessmentId === 133 ||
            this.state.assessmentId === 135 ||
            this.state.assessmentId === 210
          ) {
            chartCategory3.xaxis.title.text =
              item.question3 +
              " -- (Rookie 2-4 Times, Semi-Pro 5 - 7 Times, Professional 8 - 10 Times)";
          }
        }
      }

      chartSeries.push(option1, option2, option3);
      chartGraph = [
        {
          series: [{ name: "Question 1", data: option1 }],
          options: chartCategory1,
        },
        {
          series: [{ name: "Question 2", data: option2 }],
          options: chartCategory2,
        },
        {
          series: [{ name: "Question 3", data: option3 }],
          options: chartCategory3,
        },
      ];
    }
    if (this.state.assessmentId === 67) {
      question1Options = [
        "Some of the time",
        "Most of the time",
        "All of the time",
      ];
      question2Options = [
        "Some of the time",
        "Most of the time",
        "All of the time",
      ];
      question3Options = [
        "Some of the time",
        "Most of the time",
        "All of the time",
      ];
      question4Options = [
        "Some of the time",
        "Most of the time",
        "All of the time",
      ];
      question5Options = [
        "Some of the time",
        "Most of the time",
        "All of the time",
      ];
      question6Options = [
        "Some of the time",
        "Most of the time",
        "All of the time",
      ];
      question7Options = [
        "Some of the time",
        "Most of the time",
        "All of the time",
      ];

      chartSeries = [];

      chartCategory1 = {
        chart: {
          width: 260,
          type: "bar",
          toolbar: {
            show: true,
          },
        },
        dataLabels: {
          enabled: true,
        },
        legend: {
          show: true,
          offsetX: 10,
          offsetY: 10,
        },
        responsive: [
          {
            breakpoint: 480,
            options: {
              chart: {
                width: 300,
              },
              legend: {
                position: "bottom",
              },
            },
          },
        ],
        xaxis: {
          categories: this.splitChoices(question1Options),
          title: {
            text: "",
            floating: false,
            offsetY: 0,
            align: "center",
            style: {
              color: "#444",
            },
          },
        },
        stroke: {
          show: false,
        },
      };

      chartCategory2 = {
        chart: {
          width: 260,
          type: "bar",
          toolbar: {
            show: true,
          },
        },
        dataLabels: {
          enabled: true,
        },
        legend: {
          show: true,
          offsetX: 10,
          offsetY: 10,
        },
        responsive: [
          {
            breakpoint: 480,
            options: {
              chart: {
                width: 300,
              },
              legend: {
                position: "bottom",
              },
            },
          },
        ],
        xaxis: {
          categories: this.splitChoices(question2Options),
          title: {
            text: "",
            floating: false,
            offsetY: 0,
            align: "center",
            style: {
              color: "#444",
            },
          },
        },
        stroke: {
          show: false,
        },
      };

      chartCategory3 = {
        chart: {
          width: 260,
          type: "bar",
          toolbar: {
            show: true,
          },
        },
        dataLabels: {
          enabled: true,
        },
        legend: {
          show: true,
          offsetX: 10,
          offsetY: 10,
        },
        responsive: [
          {
            breakpoint: 480,
            options: {
              chart: {
                width: 300,
              },
              legend: {
                position: "bottom",
              },
            },
          },
        ],
        xaxis: {
          categories: this.splitChoices(question3Options),
          title: {
            text: "",
            floating: false,
            offsetY: 0,
            align: "center",
            style: {
              color: "#444",
            },
          },
        },
        stroke: {
          show: false,
        },
      };

      chartCategory4 = {
        chart: {
          width: 260,
          type: "bar",
          toolbar: {
            show: true,
          },
        },
        dataLabels: {
          enabled: true,
        },
        legend: {
          show: true,
          offsetX: 10,
          offsetY: 10,
        },
        responsive: [
          {
            breakpoint: 480,
            options: {
              chart: {
                width: 300,
              },
              legend: {
                position: "bottom",
              },
            },
          },
        ],
        xaxis: {
          categories: this.splitChoices(question4Options),
          title: {
            text: "",
            floating: false,
            offsetY: 0,
            align: "center",
            style: {
              color: "#444",
            },
          },
        },
        stroke: {
          show: false,
        },
      };

      chartCategory5 = {
        chart: {
          width: 260,
          type: "bar",
          toolbar: {
            show: true,
          },
        },
        dataLabels: {
          enabled: true,
        },
        legend: {
          show: true,
          offsetX: 10,
          offsetY: 10,
        },
        responsive: [
          {
            breakpoint: 480,
            options: {
              chart: {
                width: 300,
              },
              legend: {
                position: "bottom",
              },
            },
          },
        ],
        xaxis: {
          categories: this.splitChoices(question5Options),
          title: {
            text: "",
            floating: false,
            offsetY: 0,
            align: "center",
            style: {
              color: "#444",
            },
          },
        },
        stroke: {
          show: false,
        },
      };

      chartCategory6 = {
        chart: {
          width: 260,
          type: "bar",
          toolbar: {
            show: true,
          },
        },
        dataLabels: {
          enabled: true,
        },
        legend: {
          show: true,
          offsetX: 10,
          offsetY: 10,
        },
        responsive: [
          {
            breakpoint: 480,
            options: {
              chart: {
                width: 300,
              },
              legend: {
                position: "bottom",
              },
            },
          },
        ],
        xaxis: {
          categories: this.splitChoices(question6Options),
          title: {
            text: "",
            floating: false,
            offsetY: 0,
            align: "center",
            style: {
              color: "#444",
            },
          },
        },
        stroke: {
          show: false,
        },
      };

      chartCategory7 = {
        chart: {
          width: 260,
          type: "bar",
          toolbar: {
            show: true,
          },
        },
        dataLabels: {
          enabled: true,
        },
        legend: {
          show: true,
          offsetX: 10,
          offsetY: 10,
        },
        responsive: [
          {
            breakpoint: 480,
            options: {
              chart: {
                width: 300,
              },
              legend: {
                position: "bottom",
              },
            },
          },
        ],
        xaxis: {
          categories: this.splitChoices(question7Options),
          title: {
            text: "",
            floating: false,
            offsetY: 0,
            align: "center",
            style: {
              color: "#444",
            },
          },
        },
        stroke: {
          show: false,
        },
      };

      const option1 = [0, 0, 0, 0];
      const option2 = [0, 0, 0, 0];
      const option3 = [0, 0, 0, 0];
      const option4 = [0, 0, 0, 0];
      const option5 = [0, 0, 0, 0];
      const option6 = [0, 0, 0, 0];
      const option7 = [0, 0, 0, 0];

      for (const item of data) {
        const answer1 = item.answer1;
        if (question1Options.includes(answer1)) {
          const idx = question1Options.findIndex((el) => el === answer1);
          option1[idx] = option1[idx] + 1;
          chartCategory1.xaxis.title.text = item.question1;
        }

        const answer2 = item.answer2;
        if (question2Options.includes(answer2)) {
          const idx = question2Options.findIndex((el) => el === answer2);
          option2[idx] = option2[idx] + 1;
          chartCategory2.xaxis.title.text = item.question2;
        }

        const answer3 = item.answer3;
        if (question3Options.includes(answer3)) {
          const idx = question3Options.findIndex((el) => el === answer3);
          option3[idx] = option3[idx] + 1;
          chartCategory3.xaxis.title.text = item.question3;
        }

        const answer4 = item.answer4;
        if (question4Options.includes(answer4)) {
          const idx = question4Options.findIndex((el) => el === answer4);
          option4[idx] = option4[idx] + 1;
          chartCategory4.xaxis.title.text = item.question4;
        }

        const answer5 = item.answer5;
        if (question5Options.includes(answer5)) {
          const idx = question5Options.findIndex((el) => el === answer5);
          option5[idx] = option5[idx] + 1;
          chartCategory5.xaxis.title.text = item.question5;
        }

        const answer6 = item.answer6;
        if (question6Options.includes(answer6)) {
          const idx = question6Options.findIndex((el) => el === answer6);
          option6[idx] = option6[idx] + 1;
          chartCategory6.xaxis.title.text = item.question6;
        }

        const answer7 = item.answer7;
        if (question7Options.includes(answer7)) {
          const idx = question7Options.findIndex((el) => el === answer7);
          option7[idx] = option7[idx] + 1;
          chartCategory7.xaxis.title.text = item.question7;
        }
      }

      chartSeries.push(
        option1,
        option2,
        option3,
        option4,
        option5,
        option6,
        option7,
        option7
      );
      chartGraph = [
        {
          series: [{ name: "Question 1", data: option1 }],
          options: chartCategory1,
        },
        {
          series: [{ name: "Question 2", data: option2 }],
          options: chartCategory2,
        },
        {
          series: [{ name: "Question 3", data: option3 }],
          options: chartCategory3,
        },
        {
          series: [{ name: "Question 4", data: option4 }],
          options: chartCategory4,
        },
        {
          series: [{ name: "Question 5", data: option5 }],
          options: chartCategory5,
        },
        {
          series: [{ name: "Question 6", data: option6 }],
          options: chartCategory6,
        },
        {
          series: [{ name: "Question 7", data: option7 }],
          options: chartCategory7,
        },
      ];
    }
    if (
      this.state.assessmentId === 128 ||
      this.state.assessmentId === 249 ||
      this.state.assessmentId === 252
    ) {
      question1Options = [
        "Some of the time",
        "Most of the time",
        "All of the time",
      ];
      question2Options = [
        "Some of the time",
        "Most of the time",
        "All of the time",
      ];
      question3Options = [
        "Some of the time",
        "Most of the time",
        "All of the time",
      ];
      question4Options = [
        "Some of the time",
        "Most of the time",
        "All of the time",
      ];
      question5Options = [
        "Some of the time",
        "Most of the time",
        "All of the time",
      ];
      question6Options = [
        "Some of the time",
        "Most of the time",
        "All of the time",
      ];
      question7Options = [
        "Some of the time",
        "Most of the time",
        "All of the time",
      ];
      question8Options = [
        "Some of the time",
        "Most of the time",
        "All of the time",
      ];

      chartSeries = [];

      chartCategory1 = {
        chart: {
          width: 260,
          type: "bar",
          toolbar: {
            show: true,
          },
        },
        dataLabels: {
          enabled: true,
        },
        legend: {
          show: true,
          offsetX: 10,
          offsetY: 10,
        },
        responsive: [
          {
            breakpoint: 480,
            options: {
              chart: {
                width: 300,
              },
              legend: {
                position: "bottom",
              },
            },
          },
        ],
        xaxis: {
          categories: this.splitChoices(question1Options),
          title: {
            text: "",
            floating: false,
            offsetY: 0,
            align: "center",
            style: {
              color: "#444",
            },
          },
        },
        stroke: {
          show: false,
        },
      };

      chartCategory2 = {
        chart: {
          width: 260,
          type: "bar",
          toolbar: {
            show: true,
          },
        },
        dataLabels: {
          enabled: true,
        },
        legend: {
          show: true,
          offsetX: 10,
          offsetY: 10,
        },
        responsive: [
          {
            breakpoint: 480,
            options: {
              chart: {
                width: 300,
              },
              legend: {
                position: "bottom",
              },
            },
          },
        ],
        xaxis: {
          categories: this.splitChoices(question2Options),
          title: {
            text: "",
            floating: false,
            offsetY: 0,
            align: "center",
            style: {
              color: "#444",
            },
          },
        },
        stroke: {
          show: false,
        },
      };

      chartCategory3 = {
        chart: {
          width: 260,
          type: "bar",
          toolbar: {
            show: true,
          },
        },
        dataLabels: {
          enabled: true,
        },
        legend: {
          show: true,
          offsetX: 10,
          offsetY: 10,
        },
        responsive: [
          {
            breakpoint: 480,
            options: {
              chart: {
                width: 300,
              },
              legend: {
                position: "bottom",
              },
            },
          },
        ],
        xaxis: {
          categories: this.splitChoices(question3Options),
          title: {
            text: "",
            floating: false,
            offsetY: 0,
            align: "center",
            style: {
              color: "#444",
            },
          },
        },
        stroke: {
          show: false,
        },
      };

      chartCategory4 = {
        chart: {
          width: 260,
          type: "bar",
          toolbar: {
            show: true,
          },
        },
        dataLabels: {
          enabled: true,
        },
        legend: {
          show: true,
          offsetX: 10,
          offsetY: 10,
        },
        responsive: [
          {
            breakpoint: 480,
            options: {
              chart: {
                width: 300,
              },
              legend: {
                position: "bottom",
              },
            },
          },
        ],
        xaxis: {
          categories: this.splitChoices(question4Options),
          title: {
            text: "",
            floating: false,
            offsetY: 0,
            align: "center",
            style: {
              color: "#444",
            },
          },
        },
        stroke: {
          show: false,
        },
      };

      chartCategory5 = {
        chart: {
          width: 260,
          type: "bar",
          toolbar: {
            show: true,
          },
        },
        dataLabels: {
          enabled: true,
        },
        legend: {
          show: true,
          offsetX: 10,
          offsetY: 10,
        },
        responsive: [
          {
            breakpoint: 480,
            options: {
              chart: {
                width: 300,
              },
              legend: {
                position: "bottom",
              },
            },
          },
        ],
        xaxis: {
          categories: this.splitChoices(question5Options),
          title: {
            text: "",
            floating: false,
            offsetY: 0,
            align: "center",
            style: {
              color: "#444",
            },
          },
        },
        stroke: {
          show: false,
        },
      };

      chartCategory6 = {
        chart: {
          width: 260,
          type: "bar",
          toolbar: {
            show: true,
          },
        },
        dataLabels: {
          enabled: true,
        },
        legend: {
          show: true,
          offsetX: 10,
          offsetY: 10,
        },
        responsive: [
          {
            breakpoint: 480,
            options: {
              chart: {
                width: 300,
              },
              legend: {
                position: "bottom",
              },
            },
          },
        ],
        xaxis: {
          categories: this.splitChoices(question6Options),
          title: {
            text: "",
            floating: false,
            offsetY: 0,
            align: "center",
            style: {
              color: "#444",
            },
          },
        },
        stroke: {
          show: false,
        },
      };

      chartCategory7 = {
        chart: {
          width: 260,
          type: "bar",
          toolbar: {
            show: true,
          },
        },
        dataLabels: {
          enabled: true,
        },
        legend: {
          show: true,
          offsetX: 10,
          offsetY: 10,
        },
        responsive: [
          {
            breakpoint: 480,
            options: {
              chart: {
                width: 300,
              },
              legend: {
                position: "bottom",
              },
            },
          },
        ],
        xaxis: {
          categories: this.splitChoices(question7Options),
          title: {
            text: "",
            floating: false,
            offsetY: 0,
            align: "center",
            style: {
              color: "#444",
            },
          },
        },
        stroke: {
          show: false,
        },
      };

      chartCategory8 = {
        chart: {
          width: 260,
          type: "bar",
          toolbar: {
            show: true,
          },
        },
        dataLabels: {
          enabled: true,
        },
        legend: {
          show: true,
          offsetX: 10,
          offsetY: 10,
        },
        responsive: [
          {
            breakpoint: 480,
            options: {
              chart: {
                width: 300,
              },
              legend: {
                position: "bottom",
              },
            },
          },
        ],
        xaxis: {
          categories: this.splitChoices(question8Options),
          title: {
            text: "",
            floating: false,
            offsetY: 0,
            align: "center",
            style: {
              color: "#444",
            },
          },
        },
        stroke: {
          show: false,
        },
      };

      const option1 = [0, 0, 0, 0];
      const option2 = [0, 0, 0, 0];
      const option3 = [0, 0, 0, 0];
      const option4 = [0, 0, 0, 0];
      const option5 = [0, 0, 0, 0];
      const option6 = [0, 0, 0, 0];
      const option7 = [0, 0, 0, 0];
      const option8 = [0, 0, 0, 0];

      for (const item of data) {
        const answer1 = item.answer1;
        if (question1Options.includes(answer1)) {
          const idx = question1Options.findIndex((el) => el === answer1);
          option1[idx] = option1[idx] + 1;
          chartCategory1.xaxis.title.text = item.question1;
        }

        const answer2 = item.answer2;
        if (question2Options.includes(answer2)) {
          const idx = question2Options.findIndex((el) => el === answer2);
          option2[idx] = option2[idx] + 1;
          chartCategory2.xaxis.title.text = item.question2;
        }

        const answer3 = item.answer3;
        if (question3Options.includes(answer3)) {
          const idx = question3Options.findIndex((el) => el === answer3);
          option3[idx] = option3[idx] + 1;
          chartCategory3.xaxis.title.text = item.question3;
        }

        const answer4 = item.answer4;
        if (question4Options.includes(answer4)) {
          const idx = question4Options.findIndex((el) => el === answer4);
          option4[idx] = option4[idx] + 1;
          chartCategory4.xaxis.title.text = item.question4;
        }

        const answer5 = item.answer5;
        if (question5Options.includes(answer5)) {
          const idx = question5Options.findIndex((el) => el === answer5);
          option5[idx] = option5[idx] + 1;
          chartCategory5.xaxis.title.text = item.question5;
        }

        const answer6 = item.answer6;
        if (question6Options.includes(answer6)) {
          const idx = question6Options.findIndex((el) => el === answer6);
          option6[idx] = option6[idx] + 1;
          chartCategory6.xaxis.title.text = item.question6;
        }

        const answer7 = item.answer7;
        if (question7Options.includes(answer7)) {
          const idx = question7Options.findIndex((el) => el === answer7);
          option7[idx] = option7[idx] + 1;
          chartCategory7.xaxis.title.text = item.question7;
        }

        const answer8 = item.answer8;
        if (question8Options.includes(answer8)) {
          const idx = question8Options.findIndex((el) => el === answer8);
          option8[idx] = option8[idx] + 1;
          chartCategory8.xaxis.title.text = item.question8;
        }
      }

      chartSeries.push(
        option1,
        option2,
        option3,
        option4,
        option5,
        option6,
        option7,
        option7,
        option8
      );
      chartGraph = [
        {
          series: [{ name: "Question 1", data: option1 }],
          options: chartCategory1,
        },
        {
          series: [{ name: "Question 2", data: option2 }],
          options: chartCategory2,
        },
        {
          series: [{ name: "Question 3", data: option3 }],
          options: chartCategory3,
        },
        {
          series: [{ name: "Question 4", data: option4 }],
          options: chartCategory4,
        },
        {
          series: [{ name: "Question 5", data: option5 }],
          options: chartCategory5,
        },
        {
          series: [{ name: "Question 6", data: option6 }],
          options: chartCategory6,
        },
        {
          series: [{ name: "Question 7", data: option7 }],
          options: chartCategory7,
        },
        {
          series: [{ name: "Question 8", data: option8 }],
          options: chartCategory8,
        },
      ];
    }

    if (chartGraph.length !== undefined || chartGraph.length > 0) {
      await this.setState({
        graphData: chartGraph,
        showEmail: true,
        showRubric: false,
        showEmailBar: false,
        showCSW: false,
        showDifferent: false,
        isRubric: false,
      });
    }
  };

  createCSW = async (data) => {
    var couldArray = [];
    var shouldArray = [];
    var wouldArray = [];

    var newCswArray = [];
    var title = "";
    var subtitle = "";

    if (data.length > 0) {
      this.setState({
        showCSW: true,
        showEmail: false,
        showEmailBar: false,
        showDifferent: false,
      });

      newCswArray.question1 = data[0].question1;
      newCswArray.question2 = data[0].question2;
      newCswArray.question3 = data[0].question3;

      data.forEach((element) => {
        couldArray.push(element.answer1);

        shouldArray.push(element.answer2);

        wouldArray.push(element.answer3);
      });
    }

    if (this.state.assessmentId === 70) {
      title = "What a Mess";
      subtitle =
        "You are still involved in a softball activity when the recess bell rings. All the kids in your group run off to recess, leaving the equipment scattered everywhere. You see your teacher picking it all up alone.";
    } else if (this.state.assessmentId === 72) {
      title = "Try a Little Harder";
      subtitle =
        "You are having a difficult time with some of the stunts, but you are learning and having fun. Your partner for Partner Stunts is very frustrated with his own lack of skill and doesn’t give much effort.";
    } else if (this.state.assessmentId === 143) {
      title = "Let's Get Moving!";
      subtitle =
        "You are playing Aerobic Bowiling and your group has set a goal of 50 points before the stop signal. The students are starting to slow down with just 1 minute to go, They don't seem to be motivated to reach goal.";
    } else if (this.state.assessmentId === 147) {
      title = "Can We Agree?";
      subtitle =
        "When playing a tag game, the person you are chasing steps out of bounds to avoid being tagged. When you remind them of the rules, they disagree and say they were in bounds.";
    } else if (this.state.assessmentId === 148) {
      title = "Sticking Together";
      subtitle =
        "You are doing the Survivor Challenge and you really want to finish first. Someone in your group has the idea that you should all split up to get the tasks finished faster. Others in your group agree";
    } else if (this.state.assessmentId === 149) {
      title = "Be a Friend";
      subtitle =
        "You are doing a fitness circuit and one of the members of your group physically can’t do the tasks because of low fitness levels. Some of the other groupmates are saying mean things and calling him a wimp.";
    } else if (this.state.assessmentId === 150) {
      title = "My Ideas";
      subtitle =
        "You are part of a group whose goal is to create an aerobic dance routine. The “leaders” in the group are taking over and the routine seems to be coming along just fine without your input. But, you feel like you have some good ideas too.";
    } else if (this.state.assessmentId === 151) {
      title = "Knot Cool";
      subtitle =
        "You arrive at class and are instructed to grab a rope and start jumping. You notice that most of the ropes are tied up in a big knot.";
    } else if (this.state.assessmentId === 152) {
      title = "Jump to the End";
      subtitle =
        "You are getting ready to do a movement band activity in a group of 4 but no one wants to be the Ender. Everyone just wants to be the Jumper.";
    } else if (this.state.assessmentId === 156) {
      title = "Let's Get Together";
      subtitle =
        "Your group is playing Pass the Hat. Every time one of your groupmates is the leader, she moves so quickly the group can’t keep up. The group is getting tired and frustrated.";
    } else if (this.state.assessmentId === 162) {
      title = "Listen Up!";
      subtitle =
        "During the basketball unit your teacher is giving instructions for a game that your class has never played. You are toward the back of the group, standing near a friend who keeps talking to you and making it hard to hear the teacher.";
    } else if (this.state.assessmentId === 166) {
      title = "Lift It Back Up";
      subtitle =
        "Your group is having difficulty getting a cooperative task accomplished. One of your groupmates is very frustrated with the lack of progress and is starting to bring the whole group down with negative comments.";
    } else if (this.state.assessmentId === 171) {
      title = "Be Brave";
      subtitle =
        "Your group is doing the Create a Dance activity and one student has a lot of great ideas. Everyone else is being quiet because all her moves work well and the dance looks pretty cool. However, you do have some ideas you want to share that are different from hers.";
    } else if (this.state.assessmentId === 175) {
      title = "Don't Be a Sore Winner";
      subtitle =
        "During a game of Quick-Play Mini-Football your team has outscored your opponent by a lot. The other team is getting frustrated while your team is having a great time. Kids on your team are starting to brag and tease the other team.";
    } else if (this.state.assessmentId === 179) {
      title = "Let's Settle This";
      subtitle =
        "During a game of Mini-Hockey a player from the other team disagrees with you about a shot. You both thought you saw it perfectly, but you have opposite opinions – one says it was good, the other says it wasn’t.";
    } else if (this.state.assessmentId === 183) {
      title = "Seriously Uncool";
      subtitle =
        "Your group is playing Paddle Call Ball and one of your groupmates keeps hitting the ball as high as she can, making it hard for your group to be successful. Everyone else in the group is getting very frustrated.";
    } else if (this.state.assessmentId === 187) {
      title = "What's It Matter?";
      subtitle =
        "You and a group are heading out to play 3 Flies Up and you grab a soccer ball. Several of the kids don’t like the ball you’ve chosen and want to play with a foam ball instead.";
    } else if (this.state.assessmentId === 195) {
      title = "Hired Help";
      subtitle =
        "During the soccer unit you are placed in a group with classmates of much lower skill than you. Your teacher is hoping you will help them because you have played soccer for several years and are pretty good. You’d rather be playing with kids your same skill level, or better, so you can be challenged.";
    } else if (this.state.assessmentId === 206) {
      title = "What's So Fun About That?";
      subtitle =
        "You are on a team of 3 for Mini-Volleyball and everyone has a different skill level. You play on an after school volleyball team, but the other 2 are brand new to the game. You notice that they are trying hard, but they just aren’t very skilled yet.";
    } else if (this.state.assessmentId === 255) {
      title = "Discouraging News";
      subtitle =
        "Your class is doing the Pacific Crest Trail in Map Challenges, and is competing against another, older class. You’re way behind the older students and your class is starting to get discouraged.";
    } else if (this.state.assessmentId === 263) {
      title = "Kick it Up";
      subtitle =
        "You and a couple of friends regularly participate in a cardio kickboxing class every Tuesday and Thursday. There is a yoga class offered at the same time. You would like to try the yoga class, but your friends are not interested in going.";
    } else if (this.state.assessmentId === 264) {
      title = "Personal Trainer";
      subtitle =
        "An elderly family member hears that you have learned a lot about strength training and asks you to help them set up a training program.";
    } else if (this.state.assessmentId === 265) {
      title = "Can I Go?";
      subtitle =
        "As part of your fitness plan you go walking every Tuesday with your friends. Your little brother asks if he can go with you next time.";
    } else if (this.state.assessmentId === 266) {
      title = "Shuttle Launch";
      subtitle =
        "You really enjoy playing badminton in physical education and you know there are others who like to play. There are no school teams, clubs or leagues in the area. You wish there were more opportunities to play.";
    } else if (this.state.assessmentId === 268) {
      title = "Playin' Hoops";
      subtitle =
        "You are playing a game of basketball at the local gym when another high school student comes over in a wheelchair. He asks if he can join your game.";
    } else if (this.state.assessmentId === 269) {
      title = "No Way";
      subtitle =
        "While doing a group activity one of your group members says that the group will never be successful and wants to quit. You need that group member for your group to succeed.";
    } else if (this.state.assessmentId === 271) {
      title = "Give the Dance A Chance";
      subtitle =
        "A multicultural dance production visits your school for an assembly. One of the people sitting next to you begins making fun of the dancers.";
    } else if (this.state.assessmentId === 272) {
      title = "Calling Foul";
      subtitle =
        "While playing a game of Ultimate, 2 opposing players begin arguing over a foul call. You are the captain of one of the teams.";
    } else if (this.state.assessmentId === 273) {
      title = "Forget The Flags";
      subtitle =
        "You are playing a game of flag football during physical education class. Many of the players start tackling instead of grabbing for flags.";
    } else if (this.state.assessmentId === 274) {
      title = "Face-Off";
      subtitle =
        "While playing a hockey game one of the players on your team begins calling one of the players on the other team names. The student is often bullied and called these names.";
    } else if (this.state.assessmentId === 276) {
      title = "Not Short on Shortstops";
      subtitle =
        "You have been assigned to captain and figure out positions for your softball team. Three of the players on your team really want to be shortstop.";
    } else if (this.state.assessmentId === 277) {
      title = "Take The Lead";
      subtitle =
        "You consider yourself a pretty good volleyball player. One of the local middle schools is starting a team and needs a coach.";
    } else if (this.state.assessmentId === 278) {
      title = "Pick-Up At The Park";
      subtitle =
        "While visiting another country, you see families playing a game at the park. You don’t understand it, but they seem to be pretty into it.";
    }

    await this.setState({
      cswArray: newCswArray,
      questionTitle: title,
      questionSubTitle: subtitle,
      coulda: couldArray,
      shoulda: shouldArray,
      woulda: wouldArray,
    });
  };

  createDiffQuestions = async (data) => {
    var quesArray = [];
    var ans1Array = [];
    var ans2Array = [];
    var ans3Array = [];
    var ans4Array = [];
    var ans5Array = [];

    if (data.length > 0) {
      this.setState({
        showDifferent: true,
        showEmail: false,
        showEmailBar: false,
        showCSW: false,
        showRubric: false,
      });

      quesArray.question1 = data[0].question1;
      quesArray.question2 = data[0].question2;
      quesArray.question3 = data[0].question3;
      quesArray.question4 = data[0].question4;
      quesArray.question5 = data[0].question5;

      data.forEach((element) => {
        ans1Array.push(element.answer1);
        ans2Array.push(element.answer2);
        ans3Array.push(element.answer3);
        ans4Array.push(element.answer4);
        ans5Array.push(element.answer5);
      });
    }

    await this.setState({
      differentQues: quesArray,
      ansArray1: ans1Array,
      ansArray2: ans2Array,
      ansArray3: ans3Array,
      ansArray4: ans4Array,
      ansArray5: ans5Array,
    });
  };

  splitChoices(list) {
    var choiceArr = [];
    for (let i in list) {
      if (list[i] !== null) {
        var newStr = this.cutString(list[i], 50);
        var result = "";
        result = newStr.replace(/.{16}\S*\s+/g, "$&@").split(/\s+@/);

        if (result[1] !== undefined) {
          if (result[1].lastIndexOf(" ") === -1) {
            result[1] = result[1];
          } else {
            result[1] = result[1].substr(0, result[1].lastIndexOf(" "));
          }
        }

        choiceArr.push(result);
      }
    }
    return choiceArr;
  }

  cutString(s, n) {
    var cut = s.indexOf(" ", n);
    if (cut === -1) return s;
    return s.substring(0, cut);
  }

  createEmailBarGraph = async () => {
    if (this.state.showEmailBar === true) {
      var indCategory = [];
      var indLabelArray = [];

      var checkOne1 = [];
      var checkOne2 = [];
      var checkOne3 = [];
      var checkOne4 = [];
      var checkOne5 = [];
      var checkOne6 = [];
      var checkOne7 = [];
      var checkOne8 = [];
      var checkOne9 = [];
      var checkOne10 = [];
      var checkOne11 = [];
      var checkOne12 = [];
      var checkOne13 = [];
      var checkOne14 = [];
      var checkOne15 = [];
      var checkOne16 = [];
      var checkOne17 = [];
      var checkOne18 = [];
      var checkOne19 = [];
      var checkOne20 = [];
      var checkOne21 = [];
      var checkOne22 = [];
      var checkOne23 = [];
      var checkOne24 = [];
      var checkOne25 = [];
      var checkOne26 = [];
      var checkOne27 = [];
      var checkOne28 = [];
      var checkOne29 = [];
      var checkOne30 = [];
      var checkOne31 = [];

      var partCategory = [];
      var partLabelArray = [];
      var checkTwo1 = [];
      var checkTwo2 = [];
      var checkTwo3 = [];
      var checkTwo4 = [];
      var checkTwo5 = [];
      var checkTwo6 = [];
      var checkTwo7 = [];
      var checkTwo8 = [];
      var checkTwo9 = [];
      var checkTwo10 = [];
      var checkTwo11 = [];
      var checkTwo12 = [];

      if (this.state.studentData.length > 0) {
        this.state.studentData.forEach((element) => {
          if (element.result_data !== null) {
            var resultData = {};

            resultData = JSON.parse(element.result_data);

            if (
              this.state.assessmentId === 226 ||
              this.state.assessmentId === 253
            ) {
              if (resultData.checkOne1 !== undefined) {
                checkOne1.push(resultData.checkOne1);
              }

              if (resultData.checkOne2 !== undefined) {
                checkOne2.push(resultData.checkOne2);
              }

              if (resultData.checkOne3 !== undefined) {
                checkOne3.push(resultData.checkOne3);
              }

              if (resultData.checkOne4 !== undefined) {
                checkOne4.push(resultData.checkOne4);
              }

              if (resultData.checkOne5 !== undefined) {
                checkOne5.push(resultData.checkOne5);
              }

              if (resultData.checkOne6 !== undefined) {
                checkOne6.push(resultData.checkOne6);
              }

              if (resultData.checkOne7 !== undefined) {
                checkOne7.push(resultData.checkOne7);
              }

              if (resultData.checkOne8 !== undefined) {
                checkOne8.push(resultData.checkOne8);
              }

              if (resultData.checkOne9 !== undefined) {
                checkOne9.push(resultData.checkOne9);
              }

              if (resultData.checkOne10 !== undefined) {
                checkOne10.push(resultData.checkOne10);
              }

              if (resultData.checkOne11 !== undefined) {
                checkOne11.push(resultData.checkOne11);
              }

              if (resultData.checkOne13 !== undefined) {
                checkOne13.push(resultData.checkOne13);
              }

              // checkOne12.push(resultData.checkOne12);
              // checkOne15.push(resultData.checkOne15);

              if (resultData.checkOne14 !== undefined) {
                checkOne14.push(resultData.checkOne14);
              }

              if (resultData.checkOne16 !== undefined) {
                checkOne16.push(resultData.checkOne16);
              }

              if (resultData.checkOne17 !== undefined) {
                checkOne17.push(resultData.checkOne17);
              }

              if (resultData.checkOne18 !== undefined) {
                checkOne18.push(resultData.checkOne18);
              }

              if (resultData.checkOne19 !== undefined) {
                checkOne19.push(resultData.checkOne19);
              }

              if (resultData.checkOne20 !== undefined) {
                checkOne20.push(resultData.checkOne20);
              }

              if (resultData.checkOne21 !== undefined) {
                checkOne21.push(resultData.checkOne21);
              }

              if (resultData.checkOne22 !== undefined) {
                checkOne22.push(resultData.checkOne22);
              }

              if (resultData.checkOne23 !== undefined) {
                checkOne23.push(resultData.checkOne23);
              }

              if (resultData.checkOne24 !== undefined) {
                checkOne24.push(resultData.checkOne24);
              }

              if (resultData.checkOne25 !== undefined) {
                checkOne25.push(resultData.checkOne25);
              }

              if (resultData.checkOne26 !== undefined) {
                checkOne26.push(resultData.checkOne26);
              }

              if (resultData.checkOne27 !== undefined) {
                checkOne27.push(resultData.checkOne27);
              }

              if (resultData.checkOne28 !== undefined) {
                checkOne28.push(resultData.checkOne28);
              }

              if (resultData.checkOne29 !== undefined) {
                checkOne29.push(resultData.checkOne29);
              }

              if (resultData.checkOne30 !== undefined) {
                checkOne30.push(resultData.checkOne30);
              }

              if (resultData.checkOne31 !== undefined) {
                checkOne31.push(resultData.checkOne31);
              }

              if (resultData.checkTwo1 !== undefined) {
                checkTwo1.push(resultData.checkTwo1);
              }

              if (resultData.checkTwo2 !== undefined) {
                checkTwo2.push(resultData.checkTwo2);
              }

              if (resultData.checkTwo3 !== undefined) {
                checkTwo3.push(resultData.checkTwo3);
              }

              if (resultData.checkTwo4 !== undefined) {
                checkTwo4.push(resultData.checkTwo4);
              }

              if (resultData.checkTwo5 !== undefined) {
                checkTwo5.push(resultData.checkTwo5);
              }

              if (resultData.checkTwo6 !== undefined) {
                checkTwo6.push(resultData.checkTwo6);
              }

              if (resultData.checkTwo7 !== undefined) {
                checkTwo7.push(resultData.checkTwo7);
              }

              if (resultData.checkTwo8 !== undefined) {
                checkTwo8.push(resultData.checkTwo8);
              }

              if (resultData.checkTwo9 !== undefined) {
                checkTwo9.push(resultData.checkTwo9);
              }

              if (resultData.checkTwo10 !== undefined) {
                checkTwo10.push(resultData.checkTwo10);
              }

              if (resultData.checkTwo11 !== undefined) {
                checkTwo11.push(resultData.checkTwo11);
              }

              if (resultData.checkTwo12 !== undefined) {
                checkTwo12.push(resultData.checkTwo12);
              }
            }
          }
        });

        indLabelArray.push(
          checkOne1.length,
          checkOne2.length,
          checkOne3.length,
          checkOne4.length,
          checkOne5.length,
          checkOne6.length,
          checkOne7.length,
          checkOne8.length,
          checkOne9.length,
          checkOne10.length,
          checkOne11.length,
          // checkOne12.length,
          checkOne13.length,
          checkOne14.length,
          // checkOne15.length,
          checkOne16.length,
          checkOne17.length,
          checkOne18.length,
          checkOne19.length,
          checkOne20.length,
          checkOne21.length,
          checkOne22.length,
          checkOne23.length,
          checkOne24.length,
          checkOne25.length,
          checkOne26.length,
          checkOne27.length,
          checkOne28.length,
          checkOne29.length,
          checkOne30.length,
          checkOne31.length
        );

        indCategory.push(
          "Jog and Jump",
          "Double Bounce",
          "Single Bounce",
          "Hop",
          "Forward",
          "Backward",
          "Straddle",
          "Ball",
          "Skier",
          "Rocker",
          "Hopscotch",
          "Heel Taps",
          "Side Swing",
          "Heel/Toe Taps",
          "Toe Taps",
          "Twister",
          "The X",
          "Hot Peppers",
          "Can Can",
          "March Step",
          "Swing Kick",
          "Heel Click",
          "Razzle Dazzle",
          "180° Turn",
          "2 X 180° Turn",
          "Crossovers",
          "Double Unders",
          "Crisscross Crossovers",
          "Create a Trick"
        );

        partLabelArray.push(
          checkTwo1.length,
          checkTwo2.length,
          checkTwo3.length,
          checkTwo4.length,
          checkTwo5.length,
          checkTwo6.length,
          checkTwo7.length,
          checkTwo8.length,
          checkTwo9.length,
          checkTwo10.length,
          checkTwo11.length,
          checkTwo12.length
        );

        partCategory.push(
          "Turner and Jumper",
          "Front-to-Front",
          "Front-to-Back",
          "Back-to-Front",
          "Back-to-Back",
          ["Side-by-Side", "Facing Same"],
          ["Side-by-Side", "Facing Opposite"],
          ["2-Rope Exchange", "Facing Same"],
          ["2-Rope Exchange", "Facing Opposite"],
          "Turn While Jumping",
          ["Partner Trick", "with Tossable"],
          ["Create Your Own", "Partner Trick"]
        );

        this.setState({
          emailIndSeries: [{ name: "Individual Tricks", data: indLabelArray }],
          emailIndOptions: {
            chart: {
              width: 260,
              type: "bar",
              toolbar: {
                show: true,
              },
            },
            dataLabels: {
              enabled: true,
            },
            legend: {
              show: true,
              offsetX: 10,
              offsetY: 10,
            },
            responsive: [
              {
                breakpoint: 480,
                options: {
                  chart: {
                    width: 300,
                  },
                  legend: {
                    position: "bottom",
                  },
                },
              },
            ],
            xaxis: {
              categories: indCategory,
              title: {
                text: "Individual Tricks - 10X in a Row",
                floating: false,
                offsetY: 0,
                align: "center",
                style: {
                  color: "#444",
                },
              },
            },
            stroke: {
              show: false,
            },
          },
        });
        this.setState({
          emailPartSeries: [
            {
              name: "Partner Tricks",
              data: partLabelArray,
            },
          ],
          emailPartOptions: {
            chart: {
              width: 260,
              type: "bar",
              toolbar: {
                show: true,
              },
            },
            dataLabels: {
              enabled: true,
            },
            legend: {
              show: true,
              offsetX: 10,
              offsetY: 10,
            },
            responsive: [
              {
                breakpoint: 480,
                options: {
                  chart: {
                    width: 300,
                  },
                  legend: {
                    position: "bottom",
                  },
                },
              },
            ],
            xaxis: {
              categories: partCategory,
              title: {
                text: "Partner Tricks - 10X in a Row",
                floating: false,
                offsetY: 0,
                align: "center",
                style: {
                  color: "#444",
                },
              },
            },
            stroke: {
              show: false,
            },
          },
        });
      } else {
        await this.setState({
          showEmailBar: false,
        });
      }
    }
  };

  handleDropdownValues = async (event) => {
    await this.setState({ [event.target.name]: event.target.value });

    this.state.assessments.forEach((element) => {
      if (element.assessment_name === this.state.assessment) {
        this.setState({
          assessmentId: element.assessment_id,
        });
      }
    });

    if (this.state.building) {
      var teacherData = {
        createdBy: this.state.createdBy,
        buildingName: this.state.building,
      };

      const teacherresponse = await fetchMethods.getTeachersList(teacherData);
      if (teacherresponse.status === 200) {
        this.setState({
          teachers: teacherresponse.data.result,
        });
      }
    }

    this.getAssessmentData();
  };

  createSortHandler = (property) => (event) => {
    let newSortedData = { ...this.state.sortData };
    newSortedData.sort_by = property;
    newSortedData.order_by =
      this.state.sortData.order_by === "asc" ? "desc" : "asc";

    var sortedData = this.stableSort(
      this.state.studentData,
      this.getComparator(newSortedData.order_by, property)
    );

    this.setState({ sortData: newSortedData, studentData: [...sortedData] });
  };

  stableSort(array, comparator) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
      const order = comparator(a[0], b[0]);
      if (order !== 0) return order;
      return a[1] - b[1];
    });

    return stabilizedThis.map((el) => el[0]);
  }

  getComparator(order, orderBy) {
    return order === "desc"
      ? (a, b) => this.descendingComparator(a, b, orderBy)
      : (a, b) => -this.descendingComparator(a, b, orderBy);
  }

  descendingComparator(a, b, orderBy) {
    if (orderBy === "student_id" || orderBy === "cues") {
      return b[orderBy] - a[orderBy] < 0 ? -1 : 1;
    } else {
      if (b[orderBy] > a[orderBy]) {
        return -1;
      }
      if (b[orderBy] < a[orderBy]) {
        return 1;
      }
      return 0;
    }
  }

  handleSearchData = async (event) => {
    this.setState({ query: event.target.value });

    var newArray = [];
    this.state.studentData.filter((data) => {
      if (event.target.value === "") {
        this.setState({
          studentData: this.state.filteredData,
          tableCount: this.state.filteredData.length,
          page: 0,
        });
      }
      if (
        data.student_id === event.target.value ||
        data.first_name.toLowerCase() === event.target.value.toLowerCase() ||
        data.last_name.toLowerCase() === event.target.value.toLowerCase() ||
        data.grade.toLowerCase() === event.target.value.toLowerCase() ||
        data.building.toLowerCase() === event.target.value.toLowerCase() ||
        data.teacher_name.toLowerCase() === event.target.value.toLowerCase() ||
        data.building.toLowerCase() === event.target.value.toLowerCase()
      ) {
        newArray.push(data);
        this.setState({
          studentData: newArray,
          tableCount: newArray.length,
          page: 0,
        });
      }
    });
  };

  handleChangePage = (event, newPage) => {
    this.setState({
      page: newPage,
    });
  };

  handleChangeRowsPerPage = (event) => {
    this.setState({
      rowsPerPage: parseInt(event.target.value),
      page: 0,
    });
  };

  changeEventDate = async (date) => {
    await this.setState({
      assessmentDate: moment(date).format("yyyy-MM-DD"),
    });

    this.getAssessmentData();
  };

  exportExcel = () => {
    var studentData = this.state.studentData;
    var exportArray = [];

    if (this.state.isRubric === true) {
      if (studentData.length > 0) {
        studentData.forEach((element) => {
          delete element.assessment_id;
          delete element.createdBy;
        });

        this.setState({
          exportData: studentData,
        });
      }
    } else {
      this.state.studentData.forEach((data) => {
        var resultData = {};
        var newExportObject = {};

        if (data.result_data !== null) {
          resultData = JSON.parse(data.result_data);
        }

        newExportObject = {
          student_id: data.student_id,
          last_name: data.last_name,
          first_name: data.first_name,
          building: data.building,
          email: data.email,
          result_date: data.result_date,
          class: data.teacher_name,
          type: data.type,
          [resultData.question1]: [resultData.answer1],
          [resultData.question2]: [resultData.answer2],
          [resultData.question3]: [resultData.answer3],
          [resultData.question4]: [resultData.answer4],
          [resultData.question5]: [resultData.answer5],
          [resultData.question6]: [resultData.answer6],
          [resultData.question7]: [resultData.answer7],
          [resultData.question8]: [resultData.answer8],
          [resultData.question9]: [resultData.answer9],
        };

        exportArray.push(newExportObject);
      });

      exportArray.forEach((element) => {
        if (element.undefined) {
          delete element.undefined;
        }
      });

      this.setState({
        exportData: exportArray,
      });
    }
  };

  render() {
    return (
      <div className="routing-wrap">
        <Header />
        <div className="page-wrap flex-page-wrap">
          <div className="flex-head">
            <div className="page-title mr-b15">
              <h3>
                <BackButton getPath="/admin/assessment" />
                Assessments
              </h3>
            </div>
            <div className="box-head white-box mr-b20 mr-t20">
              <h4>{this.state.assessName}</h4>
            </div>
          </div>

          <div className="ass-wrap">
            <div className="a-unit-wrap">
              <div className="unit-head-card">
                <div className="unit-form white-box">
                  <div className="row">
                    <div className="col-sm">
                      <div className="form-group blue-fill-input mr-b0">
                        <label htmlFor="assessment">Assessment Type</label>
                        <select
                          name="assessment"
                          className="form-control"
                          id="assessment"
                          value={this.state.assessment}
                          onChange={this.handleDropdownValues}
                        >
                          {this.state.assessments !== null
                            ? this.state.assessments.map(
                                (assessment, index) => (
                                  <option
                                    value={assessment.assessment_name}
                                    key={index}
                                  >
                                    {assessment.assessment_name}
                                  </option>
                                )
                              )
                            : null}
                        </select>
                      </div>
                    </div>
                    <div className="col-sm">
                      <div className="form-group blue-fill-input mr-b0">
                        <label htmlFor="type">Pre-Mid-Post</label>
                        <select
                          name="type"
                          className="form-control"
                          id="type"
                          value={this.state.type}
                          onChange={this.handleDropdownValues}
                        >
                          <option value="pre">Pre Test</option>
                          <option value="mid">Mid Test</option>
                          <option value="post">Post Test</option>
                        </select>
                      </div>
                    </div>
                    <div className="col-sm">
                      <div className="form-group blue-fill-input mr-b0">
                        <label htmlFor="building">Building</label>
                        <select
                          name="building"
                          className="form-control"
                          id="building"
                          value={this.state.building}
                          onChange={this.handleDropdownValues}
                        >
                          {this.state.buildings.map((building, index) => (
                            <option value={building.building} key={index}>
                              {building.building}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="col-sm">
                      <div className="form-group blue-fill-input mr-b0">
                        <label htmlFor="teacher">Class</label>
                        <select
                          name="teacher"
                          className="form-control"
                          id="teacher"
                          value={this.state.teacher}
                          onChange={this.handleDropdownValues}
                        >
                          <option value="">Select</option>

                          {this.state.teachers.length > 0
                            ? this.state.teachers.map((teacher, index) => (
                                <option
                                  value={teacher.teacher_name}
                                  key={index}
                                >
                                  {teacher.teacher_name}
                                </option>
                              ))
                            : null}
                        </select>
                      </div>
                    </div>
                    <div className="col-sm">
                      <div className="form-group blue-fill-input mr-b0">
                        <MuiPickersUtilsProvider utils={Moment}>
                          <label htmlFor="assessmentDate">Select Date</label>
                          <DatePicker
                            value={this.state.assessmentDate}
                            onChange={(date) => this.changeEventDate(date)}
                            format="yyyy-MM-DD"
                            inputVariant="outlined"
                            className="form-control"
                          />
                        </MuiPickersUtilsProvider>
                      </div>
                    </div>
                  </div>
                </div>

                {this.state.showRubric === true ? (
                  <div className="d-flex justify-content-center white-box mr-t20 pd20">
                    <ReactApexChart
                      options={this.state.options}
                      series={this.state.series}
                      type="pie"
                      width={300}
                    />
                  </div>
                ) : null}

                {this.state.showEmail === true ? (
                  this.state.graphData.length > 0 ? (
                    this.state.graphData.map((item, index) => (
                      <div
                        className="d-flex justify-content-center white-box mr-t20 pd20"
                        key={index}
                      >
                        <ReactApexChart
                          series={item.series}
                          options={item.options}
                          type="bar"
                          height={250}
                          width={850}
                        />
                      </div>
                    ))
                  ) : (
                    <div className="d-flex justify-content-center white-box mr-t20 pd20">
                      <ReactApexChart
                        series={this.state.emailSeries}
                        options={this.state.emailOptions}
                        type="pie"
                        height={250}
                        width={850}
                      />
                    </div>
                  )
                ) : null}

                {this.state.showEmailBar === true ? (
                  <div>
                    <div className="d-flex justify-content-center white-box mr-t20 pd20">
                      <ReactApexChart
                        options={this.state.emailIndOptions}
                        series={this.state.emailIndSeries}
                        type="bar"
                        height={300}
                        width={850}
                      />
                    </div>
                    <div className="d-flex justify-content-center white-box mr-t20 pd20">
                      <ReactApexChart
                        options={this.state.emailPartOptions}
                        series={this.state.emailPartSeries}
                        type="bar"
                        height={300}
                        width={800}
                      />
                    </div>
                  </div>
                ) : null}

                {this.state.showCSW === true ? (
                  <div className="d-flex  white-box mr-t20 pd20 csw-box">
                    {this.state.cswArray ? (
                      <div>
                        <div className="text-center white-box pd10">
                          <h4 className="question-title">
                            {this.state.questionTitle}
                          </h4>
                          <h5 className="question-subtitle">
                            {this.state.questionSubTitle}
                          </h5>
                        </div>
                        <div className="data-title mr-t10 pd10">
                          <h6 className="csw-data">
                            Coulda: {this.state.cswArray.question1}
                          </h6>
                          <ul>
                            {this.state.coulda.map((i) => (
                              <li className="csw-answer">{i}</li>
                            ))}
                          </ul>
                        </div>
                        <div className="data-title pd10">
                          <h6 className="csw-data">
                            Shoulda: {this.state.cswArray.question2}
                          </h6>
                          <ul>
                            {this.state.shoulda.map((i) => (
                              <li className="csw-answer">{i}</li>
                            ))}
                          </ul>
                        </div>
                        <div className="data-title pd10">
                          <h6 className="csw-data">
                            Woulda: {this.state.cswArray.question3}
                          </h6>
                          <ul>
                            {this.state.woulda.map((i) => (
                              <li className="csw-answer">{i}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    ) : null}
                  </div>
                ) : null}

                {this.state.showDifferent === true ? (
                  <div className="d-flex  white-box mr-t20 pd20 csw-box">
                    {this.state.differentQues ? (
                      <div>
                        <div className="data-title pd10">
                          <h6 className="csw-data">
                            {this.state.differentQues.question1}
                          </h6>
                          <ul>
                            {this.state.ansArray1.map((i) => (
                              <li className="csw-answer">{i}</li>
                            ))}
                          </ul>
                        </div>
                        <div className="data-title pd10">
                          <h6 className="csw-data">
                            {this.state.differentQues.question2}
                          </h6>
                          <ul>
                            {this.state.ansArray2.map((i) => (
                              <li className="csw-answer">{i}</li>
                            ))}
                          </ul>
                        </div>
                        <div className="data-title pd10">
                          <h6 className="csw-data">
                            {this.state.differentQues.question3}
                          </h6>
                          <ul>
                            {this.state.ansArray3.map((i) => (
                              <li className="csw-answer">{i}</li>
                            ))}
                          </ul>
                        </div>
                        <div className="data-title pd10">
                          <h6 className="csw-data">
                            {this.state.differentQues.question4}
                          </h6>
                          <ul>
                            {this.state.ansArray4.map((i) => (
                              <li className="csw-answer">{i}</li>
                            ))}
                          </ul>
                        </div>
                        <div className="data-title pd10">
                          <h6 className="csw-data">
                            {this.state.differentQues.question5}
                          </h6>
                          <ul>
                            {this.state.ansArray5.map((i) => (
                              <li className="csw-answer">{i}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    ) : null}
                  </div>
                ) : null}

                <div className="ass-s-list-wrap">
                  <div className="c-data-wrap mr-t20">
                    <div className="data-head">
                      <div className="data-title">
                        <h5>Students List</h5>
                      </div>

                      <div className="head-right-block">
                        <div className="cus-search mr-r10">
                          <input
                            type="text"
                            name="search"
                            id="search"
                            placeholder="Search"
                            value={this.state.query}
                            onChange={this.handleSearchData}
                          />
                        </div>
                        {this.state.noAssessments === false ? (
                          <CSVLink
                            data={this.state.exportData}
                            className="s-blue-btn m-btn"
                            filename="StudentData.csv"
                          >
                            <label className="pd-t10 pd-l20">
                              Export To Excel
                            </label>
                          </CSVLink>
                        ) : null}
                      </div>
                    </div>
                    {this.state.noAssessments === true ? (
                      <div className="ass-s-list-wrap mr-t10">
                        <div className="ass-count pd-t20 pd-b50">
                          <h5> No assessments for this curriculum. </h5>
                        </div>
                      </div>
                    ) : this.state.studentData.length === 0 ? (
                      <div className="ass-s-list-wrap mr-t10">
                        <div className="ass-count pd-t20 pd-b50">
                          <h5> No students data.</h5>
                        </div>
                      </div>
                    ) : (
                      <div className="cus-table">
                        <div className="table-str">
                          <Paper className="container">
                            <Table id="myTable" size="small">
                              <TableHead>
                                <TableRow>
                                  {this.state.studentColumn.map(
                                    (column, index) => (
                                      <TableCell
                                        key={column.name}
                                        className="align-top"
                                      >
                                        <TableSortLabel
                                          active={
                                            this.state.sortData.sort_by ===
                                            column.name
                                          }
                                          direction={
                                            this.state.sortData.sort_by ===
                                            column.name
                                              ? this.state.sortData.order_by
                                              : "asc"
                                          }
                                          onClick={this.createSortHandler(
                                            column.name
                                          )}
                                        >
                                          {column.title}
                                          {this.state.sortData.sort_by ===
                                          column.name ? (
                                            <span
                                              style={{
                                                border: 0,
                                                clip: "rect(0 0 0 0)",
                                                height: 1,
                                                margin: -1,
                                                overflow: "hidden",
                                                padding: 0,
                                                position: "absolute",
                                                top: 20,
                                                width: 1,
                                              }}
                                            >
                                              {this.state.sortData.order_by ===
                                              "desc"
                                                ? "sorted descending"
                                                : "sorted ascending"}
                                            </span>
                                          ) : null}
                                        </TableSortLabel>
                                      </TableCell>
                                    )
                                  )}
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {this.state.studentData.length === 0 ? (
                                  <CircularProgress
                                    style={{
                                      margin: "10% 0% 10% 50%",
                                      color: "primary",
                                    }}
                                  />
                                ) : (
                                  this.state.studentData
                                    .slice(
                                      this.state.page * this.state.rowsPerPage,
                                      this.state.page * this.state.rowsPerPage +
                                        this.state.rowsPerPage
                                    )
                                    .map((data, index) => (
                                      <TableRow key={index}>
                                        <TableCell>{data.student_id}</TableCell>
                                        <TableCell>{data.last_name}</TableCell>
                                        <TableCell>{data.first_name}</TableCell>
                                        <TableCell>{data.grade}</TableCell>
                                        <TableCell>{data.building}</TableCell>
                                        <TableCell>
                                          {data.teacher_name}
                                        </TableCell>
                                        <TableCell>
                                          {data.result_date}
                                        </TableCell>
                                        {this.state.showRubric === true ? (
                                          <TableCell>{data.cues}</TableCell>
                                        ) : null}
                                      </TableRow>
                                    ))
                                )}
                              </TableBody>
                              <TableFooter>
                                <TableRow>
                                  <TablePagination
                                    rowsPerPageOptions={[5, 10]}
                                    colSpan={8}
                                    count={this.state.tableCount}
                                    rowsPerPage={this.state.rowsPerPage}
                                    page={this.state.page}
                                    SelectProps={{
                                      inputProps: {
                                        "aria-label": "rows per page",
                                      },
                                      native: true,
                                    }}
                                    onChangePage={this.handleChangePage}
                                    onChangeRowsPerPage={
                                      this.handleChangeRowsPerPage
                                    }
                                  />
                                </TableRow>
                              </TableFooter>
                            </Table>
                          </Paper>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default AssessmentAnalysis;
