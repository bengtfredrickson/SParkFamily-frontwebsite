import React, { Component } from "react";
import BackButton from "../UI/BackButton/BackButton";
import Header from "../UI/Header/Header";
import studentMethods from "../../services/studentApi";

import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import Paper from "@material-ui/core/Paper";
import TableFooter from "@material-ui/core/TableFooter";
import Modal from "@material-ui/core/Modal";

import EditTwoToneIcon from "@material-ui/icons/EditTwoTone";
import DeleteTwoToneIcon from "@material-ui/icons/DeleteTwoTone";
import CircularProgress from "@material-ui/core/CircularProgress";
class Student extends Component {
  state = {
    studentData: [],
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
    showDelete: false,
    delete_id: 0,
    createdBy: JSON.parse(window.sessionStorage.getItem("UserDetails")).email,
    noData: false,
  };

  componentDidMount() {
    this.getStudentRecords();
  }

  navigateToDashboard = () => {
    this.props.history.push({ pathname: "/admin/dashboard" });
  };

  addNewStudent = () => {
    window.sessionStorage.removeItem("StudentId");
    this.props.history.push({ pathname: "/admin/addEditStudent" });
  };

  getStudentRecords = async () => {
    const response = await studentMethods.getStudentData({
      createdBy: this.state.createdBy,
    });

    if (response.data.result.length === 0) {
      this.setState({ studentData: response.data.result });
    }
    if (response.status === 200) {
      var columnsList = [
        { name: "student_id", title: "ID" },
        { name: "last_name", title: "Last Name" },
        { name: "first_name", title: "First Name" },
        { name: "grade", title: "Grade" },
        { name: "building", title: "Building" },
        { name: "teacher_name", title: "Class" },
        { name: "email", title: "Email" },
        { name: "action", title: "Action" },
      ];

      this.setState({
        studentData: response.data.result,
        filteredData: response.data.result,
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
        studentColumn: columnsList,
        tableCount: newObject.length,
      });
    }
  };

  editStudentRecord = (studentId) => {
    window.sessionStorage.setItem("StudentId", studentId);
    this.props.history.push({ pathname: "/admin/addEditStudent" });
  };

  deleteStudentRecord = (studentId) => {
    this.setState({
      showDelete: true,
      delete_id: studentId,
    });
  };

  deleteStudent = async () => {
    this.setState({
      loader: true,
    });

    const response = await studentMethods.deleteStudentData(
      this.state.delete_id
    );

    if (response.status === 200) {
      this.setState({
        loader: false,
        showDelete: false,
      });
      this.getStudentRecords();
    }
  };

  handleClose = () => {
    this.setState({ showDelete: false });
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
    if (orderBy === "student_id") {
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
        data.email.toLowerCase() === event.target.value.toLowerCase()
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

  attendanceReport = () => {
    this.props.history.push({ pathname: "/admin/attendanceReport" });
  };

  render() {
    return (
      <div className="routing-wrap">
        <Header />
        <div className="page-wrap">
          <div className="page-title mr-b15">
            <h3>
              <BackButton getPath="/admin/dashboard" />
              Students
            </h3>
          </div>

          <div className="c-data-wrap mr-t20">
            <div className="data-head">
              <div className="data-title">
                <h5>Students List</h5>
              </div>
              <div className="head-right-block">
                <div className="cus-search">
                  <input
                    type="text"
                    name="search"
                    id="search"
                    placeholder="Search"
                    value={this.state.query}
                    onChange={this.handleSearchData}
                  />
                </div>
                <div className="">
                  <button
                    type="button"
                    className="s-blue-btn m-btn mr-l20"
                    onClick={this.addNewStudent}
                  >
                    + Add new
                  </button>
                </div>
                <div className=" col-md-4">
                  <button
                    type="button"
                    className="s-blue-btn m-btn"
                    onClick={this.attendanceReport}
                  >
                    Attendance Report
                  </button>
                </div>
              </div>
            </div>
            <div className="cus-table">
              {this.state.studentData.length === 0 ? (
                <div className="data-title text-center mr-t20 mr-b20">
                  <h5>No data to display</h5>
                </div>
              ) : (
                <div className="table-str">
                  <Paper className="container">
                    <Table id="myTable">
                      <TableHead>
                        <TableRow>
                          {this.state.studentColumn.map((column, index) => (
                            <TableCell key={column.name} className="align-top">
                              <TableSortLabel
                                active={
                                  this.state.sortData.sort_by === column.name
                                }
                                direction={
                                  this.state.sortData.sort_by === column.name
                                    ? this.state.sortData.order_by
                                    : "asc"
                                }
                                onClick={this.createSortHandler(column.name)}
                              >
                                {column.title}
                                {this.state.sortData.sort_by === column.name ? (
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
                                    {this.state.sortData.order_by === "desc"
                                      ? "sorted descending"
                                      : "sorted ascending"}
                                  </span>
                                ) : null}
                              </TableSortLabel>
                            </TableCell>
                          ))}
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {this.state.studentData.length === 0 ? (
                          <CircularProgress className="centered" />
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
                                <TableCell>{data.teacher_name}</TableCell>
                                <TableCell>{data.email}</TableCell>
                                <TableCell>
                                  <button
                                    type="button"
                                    className="trans-btn"
                                    onClick={() =>
                                      this.editStudentRecord(data.student_id)
                                    }
                                  >
                                    <EditTwoToneIcon
                                      style={{ color: "#0052A4" }}
                                    />
                                  </button>
                                  <button
                                    type="button"
                                    className="trans-btn mr-l10"
                                    onClick={() =>
                                      this.deleteStudentRecord(data.student_id)
                                    }
                                  >
                                    <DeleteTwoToneIcon
                                      style={{ color: "#0052A4" }}
                                    />
                                  </button>
                                </TableCell>
                              </TableRow>
                            ))
                        )}
                      </TableBody>
                      <TableFooter>
                        <TableRow>
                          <TablePagination
                            rowsPerPageOptions={[5, 10, 25]}
                            colSpan={8}
                            count={this.state.tableCount}
                            rowsPerPage={this.state.rowsPerPage}
                            page={this.state.page}
                            SelectProps={{
                              inputProps: { "aria-label": "rows per page" },
                              native: true,
                            }}
                            onChangePage={this.handleChangePage}
                            onChangeRowsPerPage={this.handleChangeRowsPerPage}
                          />
                        </TableRow>
                      </TableFooter>
                    </Table>
                  </Paper>
                </div>
              )}
            </div>

            {this.state.showDelete ? (
              <Modal
                open={this.state.showDelete}
                aria-labelledby="DeleteModal"
                aria-hidden="true"
              >
                <div
                  className="modal-dialog modal-dialog-centered"
                  role="document"
                >
                  <div className="modal-content ">
                    <div className="modal-header">
                      <h5 className="modal-title" id="exampleModalLabel">
                        Delete Student Record?
                      </h5>
                      <button
                        type="button"
                        className="close"
                        data-dismiss="modal"
                        aria-label="Close"
                        onClick={this.handleClose}
                      >
                        <span aria-hidden="true">
                          <svg
                            width="10"
                            height="18"
                            viewBox="0 0 10 18"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M2.91937 9.00008L9.82886 1.70718L8.48899 0.292969L0.23964 9.00008L8.48899 17.7072L9.82886 16.293L2.91937 9.00008Z"
                              fill="white"
                            />
                          </svg>
                        </span>
                      </button>
                    </div>

                    <div className="modal-body">
                      <div className="mr-l30">
                        <h6>Are you sure you want to delete this student?</h6>
                        <h6 className="pd-t10">
                          <b>Note:</b> <i>This action cannot be undone!</i>
                        </h6>
                      </div>
                    </div>

                    <div className="modal-footer">
                      <button
                        type="button"
                        className="btn btn-primary"
                        onClick={this.deleteStudent}
                        disabled={this.state.loader}
                      >
                        Delete
                        {this.state.loader ? (
                          <span>
                            &nbsp; <i className="fa fa-spinner fa-spin"></i>
                          </span>
                        ) : null}
                      </button>
                      <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={this.handleClose}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              </Modal>
            ) : null}
          </div>
        </div>
      </div>
    );
  }
}

export default Student;
