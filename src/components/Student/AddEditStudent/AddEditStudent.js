import React, { Component } from "react";
import studentMethods from "../../../services/studentApi";
import fetchMethods from "../../../services/fetchApi";
import BackButton from "../../UI/BackButton/BackButton";
import Header from "../../UI/Header/Header";
import CsvDownload from "react-json-to-csv";
import XLSX from "xlsx";
import { make_cols } from "./MakeColumns";
import { SheetJSFT } from "./types";
class AddEditStudent extends Component {
  state = {
    studentId: window.sessionStorage.getItem("StudentId"),
    showEdit: false,
    firstName: "",
    lastName: "",
    grades: [],
    grade: "",
    gender: "Female",
    building: "",
    teacher: "",
    email: "",
    fnameError: false,
    lnameError: false,
    gradeError: false,
    genderError: false,
    buildingError: false,
    teacherError: false,
    emailError: false,
    studentData: {},
    loader: false,
    sampleStudentData: [
      {
        firstName: "Student 1 First Name",
        lastName: "Student 1 Last Name",
        grade: "Pre-K",
        building: "Wenzel School",
        // gender: "Male",
        teacher: "Starkey (3rd)",
        email: "student1@example.com",
      },
      {
        firstName: "Student 2 First Name",
        lastName: "Student 2 Last Name",
        grade: "Kindergarten",
        building: "Wall School",
        // gender: "Female",
        teacher: "Starkey (3rd)",
        email: "student2@example.com",
      },
    ],
    uploadBulkObject: [],
    file: {},
    data: [],
    cols: [],
    loader1: false,
    createdBy: JSON.parse(window.sessionStorage.getItem("UserDetails")).email,
  };

  componentDidMount() {
    this.bindValues();
    if (this.state.studentId !== null) {
      this.fetchStudentDataById();
    }
  }

  bindValues = async () => {
    const response = await fetchMethods.getGradesList();

    if (response.status === 200) {
      this.setState({ grades: response.data.result });
    }
  };

  fetchStudentDataById = async () => {
    this.setState({ showEdit: true });

    const response = await studentMethods.getStudentDataById(
      this.state.studentId
    );

    if (response.status === 200) {
      this.setState({
        firstName: response.data.result[0].first_name,
        lastName: response.data.result[0].last_name,
        grade: response.data.result[0].grade,
        building: response.data.result[0].building,
        // gender: response.data.result[0].gender,
        teacher: response.data.result[0].teacher_name,
        email: response.data.result[0].email,
      });
    }
  };

  cancelStudentData = () => {
    this.props.history.push({
      pathname: "/admin/student",
    });
  };

  handleFormValues = async (event) => {
    await this.setState({ [event.target.name]: event.target.value });
  };

  editStudentRecord = async () => {
    if (this.state.firstName === "") {
      this.setState({ fnameError: true });
    } else {
      this.setState({ fnameError: false });
    }

    if (this.state.lastName === "") {
      this.setState({ lnameError: true });
    } else {
      this.setState({ lnameError: false });
    }

    if (this.state.grade === "") {
      this.setState({ gradeError: true });
    } else {
      this.setState({ gradeError: false });
    }

    if (this.state.building === "") {
      this.setState({ buildingError: true });
    } else {
      this.setState({ buildingError: false });
    }

    if (this.state.teacher === "") {
      this.setState({ teacherError: true });
    } else {
      this.setState({ teacherError: false });
    }

    if (this.state.email === "") {
      this.setState({ emailError: true });
    } else {
      this.setState({ emailError: false });
    }

    if (
      this.state.firstName !== "" &&
      this.state.lastName !== "" &&
      this.state.grade !== "" &&
      this.state.building !== "" &&
      this.state.teacher !== "" &&
      this.state.email !== ""
    ) {
      this.setState({ loader: true });

      var updateStudentRecord = {
        studentId: this.state.studentId,
        firstName: this.state.firstName,
        lastName: this.state.lastName,
        grade: this.state.grade,
        building: this.state.building,
        // gender: this.state.gender,
        teacher: this.state.teacher,
        email: this.state.email,
        createdBy: this.state.createdBy,
      };

      const response = await studentMethods.updateStudentData(
        updateStudentRecord
      );

      if (response.status === 200) {
        this.setState({ loader: false });
        this.props.history.push({
          pathname: "/admin/student",
        });
      }
    }
  };

  addStudentRecord = async () => {
    if (this.state.firstName === "") {
      this.setState({ fnameError: true });
    } else {
      this.setState({ fnameError: false });
    }

    if (this.state.lastName === "") {
      this.setState({ lnameError: true });
    } else {
      this.setState({ lnameError: false });
    }

    if (this.state.grade === "") {
      this.setState({ gradeError: true });
    } else {
      this.setState({ gradeError: false });
    }

    if (this.state.building === "") {
      this.setState({ buildingError: true });
    } else {
      this.setState({ buildingError: false });
    }

    if (this.state.teacher === "") {
      this.setState({ teacherError: true });
    } else {
      this.setState({ teacherError: false });
    }

    // if (this.state.email === "") {
    //   this.setState({ emailError: true });
    // } else {
    //   this.setState({ emailError: false });
    // }

    if (
      this.state.firstName !== "" &&
      this.state.lastName !== "" &&
      this.state.grade !== "" &&
      this.state.building !== "" &&
      this.state.teacher !== ""
    ) {
      this.setState({ loader: true });

      var addStudentRecord = {
        firstName: this.state.firstName,
        lastName: this.state.lastName,
        grade: this.state.grade,
        building: this.state.building,
        teacher: this.state.teacher,
        email: this.state.email,
        createdBy: this.state.createdBy,
      };

      const response = await studentMethods.postStudentData(addStudentRecord);

      if (response.status === 200) {
        this.setState({ loader: false });
        this.props.history.push({
          pathname: "/admin/student",
        });
      }
    }
  };

  validateEmail(email) {
    const pattern = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;

    return pattern.test(email);
  }

  handleChange = (e) => {
    const files = e.target.files;
    if (files && files[0]) this.setState({ file: files[0] });
  };

  handleFile = () => {
    this.setState({ loader1: true });
    /* Boilerplate to set up FileReader */
    const reader = new FileReader();
    const rABS = !!reader.readAsBinaryString;

    reader.onload = (e) => {
      /* Parse data */
      const bstr = e.target.result;
      const wb = XLSX.read(bstr, {
        type: rABS ? "binary" : "array",
        bookVBA: true,
      });
      /* Get first worksheet */
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      /* Convert array of arrays */
      const data = XLSX.utils.sheet_to_json(ws);
      /* Update state */
      this.setState({ data: data, cols: make_cols(ws["!ref"]) }, async () => {
        this.state.data.forEach((element) => {
          element.createdBy = this.state.createdBy;
        });
        const response = await studentMethods.postBulkStudentData(
          this.state.data
        );
        if (response.status === 200) {
          this.setState({ loader: false });
          this.props.history.push({
            pathname: "/admin/student",
          });
        }
      });
    };

    if (rABS) {
      reader.readAsBinaryString(this.state.file);
    } else {
      reader.readAsArrayBuffer(this.state.file);
    }
  };

  handleEmailValues = async (event) => {
    this.setState({ email: event.target.value });

    if (!this.validateEmail(event.target.value)) {
      await this.setState({ emailError: true });
    } else {
      await this.setState({ emailError: false });
    }
  };

  render() {
    return (
      <div className="routing-wrap">
        <Header />
        <div className="page-wrap">
          <div className="page-title mr-b15">
            <h3>
              <BackButton getPath="/admin/student" />
              {this.state.showEdit ? "Edit Student" : "Add new student"}
            </h3>
          </div>
          <div className="add-s-form-wrap">
            <div className="row row-cols-3">
              {this.state.showEdit ? (
                <div className="col">
                  <div className="form-group blue-fill-input mr-b20">
                    <label htmlFor="studentId">Student Id</label>
                    <input
                      type="text"
                      className="form-control background-disabled"
                      name="studentId"
                      id="studentId"
                      value={this.state.studentId}
                      disabled
                    />
                  </div>
                </div>
              ) : null}
              <div className="col">
                <div className="form-group blue-fill-input mr-b20">
                  <label htmlFor="firstName">
                    First Name<em className="mandatory">* </em>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    name="firstName"
                    id="firstName"
                    value={this.state.firstName}
                    onChange={(e) => this.handleFormValues(e)}
                  />
                  {this.state.fnameError ? (
                    <div className="mandatory">
                      <i>First name required</i>
                    </div>
                  ) : null}
                </div>
              </div>
              <div className="col">
                <div className="form-group blue-fill-input mr-b20">
                  <label htmlFor="lastName">
                    Last Name<em className="mandatory">* </em>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    name="lastName"
                    id="lastName"
                    value={this.state.lastName}
                    onChange={(e) => this.handleFormValues(e)}
                  />
                  {this.state.lnameError ? (
                    <div className="mandatory">
                      <i>Last name required</i>
                    </div>
                  ) : null}
                </div>
              </div>
              <div className="col">
                <div className="form-group blue-fill-input mr-b20">
                  <label htmlFor="grade">
                    Grade<em className="mandatory">* </em>
                  </label>
                  <select
                    value={this.state.grade}
                    onChange={(e) => this.handleFormValues(e)}
                    name="grade"
                    className="form-control"
                    id="grade"
                  >
                    <option value="">Select</option>
                    {this.state.grades.map((grade, index) => (
                      <option value={grade.grade_name} key={index}>
                        {grade.grade_name}
                      </option>
                    ))}
                  </select>
                  {this.state.gradeError ? (
                    <div className="mandatory">
                      <i>Grade required</i>
                    </div>
                  ) : null}
                </div>
              </div>
              {/* <div className="col">
                <div className="form-group blue-fill-input mr-b20">
                  <label htmlFor="gender">
                    Gender<em className="mandatory">* </em>
                  </label>
                  <select
                    value={this.state.gender}
                    onChange={(e) => this.handleFormValues(e)}
                    name="gender"
                    className="form-control"
                    id="gender"
                  >
                    <option value="Female">Female</option>
                    <option value="Male">Male</option>
                  </select>
                </div>
              </div> */}
              <div className="col">
                <div className="form-group blue-fill-input mr-b20">
                  <label htmlFor="building">
                    Building<em className="mandatory">* </em>
                  </label>
                  <input
                    type="text"
                    value={this.state.building}
                    onChange={(e) => this.handleFormValues(e)}
                    name="building"
                    className="form-control"
                    id="building"
                  />
                  {this.state.buildingError ? (
                    <div className="mandatory">
                      <i>Building name required</i>
                    </div>
                  ) : null}
                </div>
              </div>
              <div className="col">
                <div className="form-group blue-fill-input mr-b20">
                  <label htmlFor="teacher">
                    Class<em className="mandatory">* </em>
                  </label>
                  <input
                    type="text"
                    value={this.state.teacher}
                    onChange={(e) => this.handleFormValues(e)}
                    name="teacher"
                    className="form-control"
                    id="teacher"
                  />
                  {this.state.teacherError ? (
                    <div className="mandatory">
                      <i>Class name required</i>
                    </div>
                  ) : null}
                </div>
              </div>
              <div className="col">
                <div className="form-group blue-fill-input mr-b20">
                  <label htmlFor="building">Email</label>
                  <input
                    type="text"
                    value={this.state.email}
                    onChange={(e) => this.handleEmailValues(e)}
                    name="email"
                    className="form-control"
                    id="email"
                  />
                  {this.state.emailError && this.state.email !== "" ? (
                    <div className="mandatory">
                      <i>Invalid Email!</i>
                    </div>
                  ) : null}
                </div>
              </div>

              <div className="col-12 s-b-btn mr-t30 mr-b20 text-right">
                <button
                  type="button"
                  className="trans-blue-btn m-btn"
                  onClick={this.cancelStudentData}
                >
                  Cancel
                </button>

                {this.state.showEdit ? (
                  <button
                    type="button"
                    className="s-blue-btn m-btn"
                    onClick={this.editStudentRecord}
                  >
                    Update &nbsp;
                    {this.state.loader ? (
                      <i className="fa fa-spinner fa-spin"></i>
                    ) : null}
                  </button>
                ) : (
                  <button
                    type="button"
                    className="s-blue-btn m-btn"
                    onClick={this.addStudentRecord}
                  >
                    Add &nbsp;
                    {this.state.loader ? (
                      <i className="fa fa-spinner fa-spin"></i>
                    ) : null}
                  </button>
                )}
              </div>
            </div>
          </div>
          {this.state.showEdit ? null : (
            <div className="add-s-form-wrap mr-t40">
              <div className="row row-cols-3">
                <div className="col">
                  <div className="form-group blue-fill-input mr-b20">
                    <label htmlFor="">Upload Class Roster</label>

                    <div className="custom-file col-md-12">
                      <input
                        type="file"
                        className="custom-file-input"
                        id="file"
                        accept={SheetJSFT}
                        onChange={this.handleChange}
                      />

                      <label className="custom-file-label">Upload file</label>
                    </div>

                    <CsvDownload
                      data={this.state.sampleStudentData}
                      className="trans-blue-btn m-btn"
                      filename="SampleStudentData.csv"
                    >
                      Download sample file
                    </CsvDownload>
                  </div>
                </div>

                <div className="col-12 s-b-btn mr-t10 mr-b20 text-right">
                  <button
                    type="button"
                    className="trans-blue-btn m-btn"
                    onClick={this.cancelStudentData}
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    className="s-blue-btn m-btn"
                    onClick={this.handleFile}
                  >
                    Add &nbsp;
                    {this.state.loader1 ? (
                      <i className="fa fa-spinner fa-spin"></i>
                    ) : null}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default AddEditStudent;
