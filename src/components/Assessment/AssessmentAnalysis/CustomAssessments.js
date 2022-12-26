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

class CustomAssessments extends Component {
  state = {
    timedNumberSeries: [],
    timedNumberOptions: {},
    checklistSeries: [],
    checklistOptions: {},
    unitData: JSON.parse(window.sessionStorage.getItem("Unit")),
    assessments: [],
    assessment: "",
    assessmentId: 1,
    assessName: "",
    studentData: [],
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
    today: moment(),
    createdBy: JSON.parse(window.sessionStorage.getItem("UserDetails")).email,
    assessmentDate: moment(new Date()).format("yyyy-MM-DD"),
    type: "pre",
    customs: [],
    custom: "",
    headers: [],
    format: "timed",
    showChecklist: false,
  };

  componentDidMount() {
    this.getData();
  }

  getData = async () => {
    if (this.state.unitData) {
      this.setState({
        assessName:
          "Other Assessment Analysis - " + this.state.unitData.unit_name,
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
    }

    this.getAssessmentData();
  };

  getAssessmentData = async () => {
    const customAssessments = await assessmentMethods.getCustomAssessmentsList({
      createdBy: this.state.createdBy,
    });

    if (customAssessments.data.result.length > 0) {
      this.setState({
        customs: customAssessments.data.result,
      });

      this.state.customs.forEach((element) => {
        if (element.custom_assessment_name === this.state.custom) {
          this.setState({
            assessmentId: element.custom_assessment_id,
          });
        }
      });

      var columnsList = [
        { name: "student_id", title: "ID" },
        { name: "last_name", title: "Last Name" },
        { name: "first_name", title: "First Name" },
        { name: "grade", title: "Grade" },
        { name: "building", title: "Building" },
        { name: "teacher_name", title: "Class" },
        { name: "date", title: "Date" },
        { name: "result", title: "Result" },
      ];

      var customObject = {
        buildingName: this.state.building,
        className: this.state.teacher,
        date: this.state.assessmentDate,
        custom_assessment_id: this.state.assessmentId,
        type: this.state.type,
        assessment_format: this.state.format,
        createdBy: this.state.createdBy,
      };

      const response = await assessmentMethods.getCustomAssessmentById(
        customObject
      );

      this.setState({
        studentData: response.data.result[0].students,
        filteredData: response.data.result[0].students,
      });
    }

    if (this.state.filteredData.length > 0) {
      var newObject = [];

      this.state.filteredData.forEach((element) => {
        newObject.push({
          ...element,
        });
      });

      this.setState({
        filteredData: newObject,
        studentData: newObject,
        studentColumn: columnsList,
        tableCount: newObject.length,
      });
    }

    if (this.state.format === "timed" || this.state.format === "number") {
      this.createTimedNumberGraph();
      this.setState({ showChecklist: false });
    }

    if (this.state.format === "checklist") {
      this.createCheckListGraph();
    }

    if (this.state.studentData.length > 0) {
      this.exportExcel();
    }
  };

  createTimedNumberGraph = async () => {
    var newArray = [];

    this.state.studentData.forEach((element) => {
      var timedata = [];

      if (element.result !== null) {
        timedata.push(element.student_id, element.result);
        newArray.push(timedata);
      }
    });

    await this.setState({
      showChecklist: false,
      timedNumberSeries: [
        {
          name: "Result",
          data: newArray,
        },
      ],
      timedNumberOptions: {
        chart: {
          height: 150,
          type: "scatter",
          zoom: {
            enabled: false,
            type: "xy",
          },
        },
        yaxis: {
          labels: {
            formatter: function (val) {
              return val;
            },
          },
        },
      },
    });
  };

  createCheckListGraph = async () => {
    var val0 = [];
    var val1 = [];
    var val2 = [];
    var val3 = [];

    this.state.studentData.forEach((element) => {
      if (element.result === "0") {
        val0.push(element.result);
      } else if (element.result === "1") {
        val1.push(element.result);
      } else if (element.result === "2") {
        val2.push(element.result);
      } else if (element.result === "3") {
        val3.push(element.result);
      }
    });

    if (
      val0.length === 0 &&
      val1.length === 0 &&
      val2.length === 0 &&
      val3.length === 0
    ) {
      this.setState({ showChecklist: false });
    } else {
      this.setState({
        showChecklist: true,
        checklistSeries: [val0.length, val1.length, val2.length, val3.length],
        checklistOptions: {
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
  };

  handleDropdownValues = async (event) => {
    await this.setState({ [event.target.name]: event.target.value });

    for (let element of this.state.customs) {
      if (element.custom_assessment_name === this.state.custom) {
        await this.setState({
          assessmentId: element.custom_assessment_id,
        });
      }
    }

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
    if (orderBy === "student_id" || orderBy === "result") {
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

  exportExcel = async () => {
    this.setState({
      headers: [
        { label: "Student ID", key: "student_id" },
        { label: "First Name", key: "first_name" },
        { label: "Last Name", key: "last_name" },
        { label: "Grade", key: "grade" },
        { label: "Building", key: "building" },
        { label: "Class", key: "teacher_name" },
        { label: "Result Date", key: "result_date" },
        { label: "Type", key: "type" },
        { label: "Assessment Format", key: "assessment_format" },
        { label: "Result", key: "result" },
      ],
    });
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
                        <label htmlFor="type">Custom Assessments</label>

                        <select
                          name="custom"
                          className="form-control"
                          id="custom"
                          value={this.state.custom}
                          onChange={this.handleDropdownValues}
                        >
                          {this.state.customs.map((custom, index) => (
                            <option
                              value={custom.custom_assessment_name}
                              key={index}
                            >
                              {custom.custom_assessment_name}
                            </option>
                          ))}
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
                        <label htmlFor="type">Format</label>
                        <select
                          name="format"
                          className="form-control"
                          id="format"
                          value={this.state.format}
                          onChange={this.handleDropdownValues}
                        >
                          <option value="timed">Timed</option>
                          <option value="number">Number</option>
                          <option value="checklist">Checklist</option>
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

                {this.state.format === "timed" ||
                this.state.format === "number" ? (
                  <div className="d-flex justify-content-center white-box mr-t20 pd20">
                    <ReactApexChart
                      options={this.state.timedNumberOptions}
                      series={this.state.timedNumberSeries}
                      type="scatter"
                      height={250}
                      width={850}
                    />
                  </div>
                ) : null}

                {this.state.showChecklist === true &&
                this.state.format === "checklist" ? (
                  <div className="d-flex justify-content-center white-box mr-t20 pd20">
                    <ReactApexChart
                      options={this.state.checklistOptions}
                      series={this.state.checklistSeries}
                      type="pie"
                      width={300}
                    />
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
                        <CSVLink
                          data={this.state.studentData}
                          headers={this.state.headers}
                          className="s-blue-btn m-btn"
                          filename="StudentData.csv"
                        >
                          <label className="pd-t10 pd-l20">
                            Export To Excel
                          </label>
                        </CSVLink>
                      </div>
                    </div>

                    {this.state.studentData.length === 0 ? (
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
                                        <TableCell>{data.result}</TableCell>
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

export default CustomAssessments;
