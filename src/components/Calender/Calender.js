import React, { Component } from "react";
import BackButton from "../UI/BackButton/BackButton";
import Header from "../UI/Header/Header";
import {
  DatePicker,
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
  TimePicker,
} from "@material-ui/pickers";
import Moment from "@date-io/moment";
import moment from "moment";
import calendarMethods from "../../services/calendarApi";
import curriculumMethods from "../../services/curriculumApi";
import fetchMethods from "../../services/fetchApi";
import lessonMethods from "../../services/lessonApi";
// import watchIcon from "../../assets/images/watch-icon.png";
// import locationIcon from "../../assets/images/location.png";
import EditIcon from "@material-ui/icons/Edit";
class Calender extends Component {
  state = {
    selectedDate: moment(new Date()).format("yyyy-MM-DD"),
    eventsList: [],
    showEdit: false,
    eventDate: moment(new Date()).format("yyyy-MM-DD"),
    displayStartTime: moment(new Date()),
    displayEndTime: moment(new Date()).add(1, "hour"),
    startTime: moment(new Date()).format("hh:mm"),
    endTime: moment(new Date()).add(1, "hour").format("hh:mm"),
    errorTime: "",
    showTimeError: false,
    loader: false,
    eventId: null,
    grades: [],
    grade: "",
    curriculums: [],
    curriculum: "",
    userId: JSON.parse(window.sessionStorage.getItem("UserDetails")).user_id,
    showModules: false,
    modules: [],
    module: "",
    units: [],
    unit: "",
    teachers: [],
    teacher: "",
    lessons: [],
    lesson: "",
    buildings: [],
    building: "",
    assessments: [],
    assessment: "",
    showAssessments: false,
    createdBy: JSON.parse(window.sessionStorage.getItem("UserDetails")).email,
    curriculum_id: 1,
    assessment_id: 1,
    unit_id: 1,
    module_id: 0,
    lesson_id: 1,
    suboptions: [],
  };

  componentDidMount() {
    this.fetchEventsByDate();
    this.fetchDropDownData();
  }

  changeCalenderDate = async (date) => {
    await this.setState({
      selectedDate: moment(date).format("yyyy-MM-DD"),
    });
    this.fetchEventsByDate();
  };

  fetchEventsByDate = async () => {
    var getCalendarObejct = {
      trn_date: this.state.selectedDate,
      createdBy: this.state.createdBy,
    };
    const response = await calendarMethods.getCalendarEventDataByDate(
      getCalendarObejct
    );

    if (response.status === 200) {
      this.setState({
        eventsList: response.data.result.events,
      });
    }
  };

  fetchDropDownData = async () => {
    const currresponse = await curriculumMethods.getCurriculumsList(
      this.state.userId
    );

    if (currresponse.status === 200) {
      this.setState({
        curriculums: currresponse.data.result,
      });
    }

    const graderesponse = await fetchMethods.getGradesList();

    if (graderesponse.status === 200) {
      this.setState({
        grades: graderesponse.data.result,
      });
    }
    var buildingObj = {
      createdBy: this.state.createdBy,
    };

    const buildingresponse = await fetchMethods.getBuildingsList(buildingObj);

    if (buildingresponse.status === 200) {
      this.setState({
        buildings: buildingresponse.data.result,
      });
    }

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
  };

  changeEventDate = async (date) => {
    await this.setState({
      eventDate: moment(date).format("yyyy-MM-DD"),
    });
  };

  handleStartTime = async (stime) => {
    await this.setState({
      displayStartTime: moment(stime),
      startTime: moment(stime).format("hh:mm"),
    });

    var startParse = Date.parse(this.state.displayStartTime);
    var endParse = Date.parse(this.state.displayEndTime);

    if (startParse >= endParse) {
      await this.setState({
        showTimeError: true,
        errorTime: "Start time should be less than End time",
        displayStartTime: moment(stime),
      });
    } else {
      await this.setState({
        showTimeError: false,
        errorTime: "",
        displayStartTime: moment(stime),
      });
    }
  };

  handleEndTime = async (etime) => {
    await this.setState({
      endTime: moment(etime).format("hh:mm"),
      displayEndTime: moment(etime),
    });

    var startParse = Date.parse(this.state.displayStartTime);
    var endParse = Date.parse(this.state.displayEndTime);

    if (startParse === endParse) {
      await this.setState({
        showTimeError: true,
        errorTime: "Start time and End time can not be same",
        displayEndTime: moment(etime),
      });
    } else if (startParse >= endParse) {
      await this.setState({
        showTimeError: true,
        errorTime: "End time should be greater than Start time",
        displayEndTime: moment(etime),
      });
    } else {
      await this.setState({
        showTimeError: false,
        errorTime: "",
        displayEndTime: moment(etime),
      });
    }
  };

  handleCalendarFormValues = async (event) => {
    await this.setState({ [event.target.name]: event.target.value });
    if (this.state.building !== null) {
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

    if (this.state.curriculums.length > 0) {
      var curriculumData = {
        curriculum_id: 0,
      };

      this.state.curriculums.forEach((element) => {
        if (this.state.curriculum === element.name) {
          curriculumData.curriculum_id = element.curriculum_id;
        }
      });

      var unitData = {
        curriculum_id: curriculumData.curriculum_id,
        module_id: 0,
      };

      if (this.state.curriculum === "3-6") {
        const modulesresponse = await curriculumMethods.getModulesList(
          curriculumData
        );
        if (modulesresponse.status === 200) {
          this.setState({
            showModules: true,
            modules: modulesresponse.data.result,
          });

          this.state.modules.forEach((element) => {
            if (this.state.module === element.module_name) {
              unitData.module_id = element.module_id;
            }
          });
        }
      } else {
        this.setState({
          showModules: false,
        });
      }

      const unitresponse = await curriculumMethods.getUnitsList(unitData);
      if (unitresponse.status === 200) {
        this.setState({
          units: unitresponse.data.result,
        });

        var lessonData = {
          curriculum_id: curriculumData.curriculum_id,
          unit_id: 0,
        };

        this.state.units.forEach((element) => {
          if (this.state.unit === element.unit_name) {
            lessonData.unit_id = element.unit_id;
          }
        });

        var suboptionData = {
          option_id: 0,
          curriculum_id: 0,
          unit_id: 0,
          subunit_id: 0,
        };

        const lessonresponse = await lessonMethods.getLessonsList(lessonData);
        if (lessonresponse.status === 200) {
          this.setState({
            lessons: lessonresponse.data.result,
          });

          if (this.state.lessons !== null) {
            this.state.lessons.forEach((element) => {
              if (element.option_name === this.state.lesson) {
                suboptionData.option_id = element.option_id;
                suboptionData.curriculum_id = element.curriculum_id;
                suboptionData.unit_id = element.unit_id;
                suboptionData.subunit_id = element.subunit_id;
              }
            });
          }

          const suboptionsresponse = await curriculumMethods.getSuboptionsList(
            suboptionData
          );

          if (suboptionsresponse.status === 200) {
            this.setState({
              suboptions: suboptionsresponse.data.result,
            });
          }

          if (this.state.suboptions !== null) {
            var lessonDataObject = {
              curriculum_id: 0,
              suboption_id: 0,
            };

            this.state.suboptions.forEach((suboption) => {
              if (suboption.suboption_name.includes("Lesson Plan")) {
                lessonDataObject.curriculum_id = suboption.curriculum_id;
                lessonDataObject.suboption_id = suboption.suboption_id;
              }
            });
          }
        }

        const assessmentResponse =
          await fetchMethods.getAssessmentsListForCalendar(lessonData);

        if (assessmentResponse.status === 200) {
          this.setState({
            assessments: assessmentResponse.data.result,
          });

          if (this.state.assessments !== null) {
            this.setState({
              showAssessments: true,
            });

            this.state.assessments.forEach((element) => {
              if (element.assessment_name === this.state.assessment) {
                this.setState({
                  assessment_id: element.assessment_id,
                });
              }
            });
          }
        }

        this.setState({
          curriculum_id: suboptionData.curriculum_id,
          unit_id: suboptionData.unit_id,
          module_id: unitData.module_id,
          suboption_id: lessonDataObject.suboption_id,
          lesson_id: 0,
        });
      }
    }
  };

  addUpdateCalendarEvent = async (name) => {
    this.setState({ loader: true });

    var addUpdateEventObject = {
      trn_grade: this.state.grade,
      trn_unit: this.state.unit,
      trn_lesson: this.state.lesson,
      trn_start_time: this.state.startTime,
      trn_end_time: this.state.endTime,
      trn_date: moment(this.state.eventDate).format("yyyy-MM-DD"),
      trn_building_name: this.state.building,
      trn_remainder: "none",
      trn_curriculum: this.state.curriculum,
      trn_module: this.state.module,
      trn_teacher: this.state.teacher,
      trn_assessment: this.state.assessment,
      createdBy: this.state.createdBy,
      curriculum_id: this.state.curriculum_id,
      unit_id: this.state.unit_id,
      module_id: this.state.module_id,
      suboption_id: this.state.suboption_id,
      assessment_id: this.state.assessment_id,
      lesson_id: this.state.lesson_id,
    };

    let response = null;

    if (name === "add") {
      response = await calendarMethods.addCalendarEventData(
        addUpdateEventObject
      );
    }

    if (name === "update") {
      response = await calendarMethods.updateCalendarEventData(
        addUpdateEventObject,
        this.state.eventId
      );
    }

    if (response.status === 200) {
      this.setState({ loader: false });
      this.resetForm();
      this.fetchEventsByDate();
    }
  };

  editCalendarEventById = async (eventId) => {
    this.setState({ showEdit: true, eventId: eventId });
    const response = await calendarMethods.getCalendarEventDataById(eventId);

    if (response.data.result.length > 0) {
      var newStartTime = response.data.result[0].trn_start_time;
      var newEndTime = response.data.result[0].trn_end_time;

      var newDisplayStartTime = moment()
        .set("hour", newStartTime.split(":")[0])
        .set("minute", newStartTime.split(":")[1])
        .set("second", newStartTime.split(":")[2]);

      var newDisplayEndTime = moment()
        .set("hour", newEndTime.split(":")[0])
        .set("minute", newEndTime.split(":")[1])
        .set("second", newEndTime.split(":")[2]);

      await this.setState({
        grade: response.data.result[0].trn_grade,
        building: response.data.result[0].trn_building_name,
        lesson: response.data.result[0].trn_lesson,
        eventDate: response.data.result[0].trn_date,
        displayStartTime: newDisplayStartTime,
        displayEndTime: newDisplayEndTime,
        startTime: newDisplayStartTime.format("hh:mm"),
        endTime: newDisplayEndTime.format("hh:mm"),
        teacher: response.data.result[0].trn_teacher,
        curriculum: response.data.result[0].trn_curriculum,
        unit: response.data.result[0].trn_unit,
        module: response.data.result[0].trn_module,
        assessment: response.data.result[0].trn_assessment,
        curriculum_id: this.state.curriculum_id,
      });
    }
  };

  resetForm = async () => {
    await this.setState({
      showEdit: false,
      selectedDate: moment(new Date()).format("yyyy-MM-DD"),
      eventDate: moment(new Date()).format("yyyy-MM-DD"),
      displayStartTime: moment(new Date()),
      displayEndTime: moment(new Date()).add(1, "hour"),
      startTime: moment(new Date()).format("hh:mm"),
      endTime: moment(new Date()).add(1, "hour").format("hh:mm"),
      errorTime: "",
      showTimeError: false,
      unit: "",
      lesson: "",
      grade: "",
      building: "",
      loader: false,
      curriculum: "",
      teacher: "",
      module: "",
      assessment: "",
      showAssessments: false,
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
                <BackButton getPath="/admin/dashboard" />
                Calendar
              </h3>
            </div>
            <div className="box-head white-box">
              <h4>Lesson Calendar</h4>
            </div>
          </div>

          <div className="event-wrap white-box mr-t10">
            <div className="e-cal-col col" style={{ paddingLeft: "5px" }}>
              <div className="cal-wrap">
                <h5 className="mr-b20">Calendar 2021</h5>
                <MuiPickersUtilsProvider utils={Moment}>
                  <DatePicker
                    value={this.state.selectedDate}
                    onChange={this.changeCalenderDate}
                    format="yyyy-MM-DD"
                    inputVariant="outlined"
                    variant="static"
                  />
                </MuiPickersUtilsProvider>
              </div>
            </div>
            <div className="timeline-col col-md-4">
              <div className="timeline-warp">
                <h5>Timeline</h5>
                <div className="timeline-list mr-t30">
                  <ul>
                    {this.state.eventsList.length === 0 ? (
                      <label style={{ color: "#fff" }}>
                        No events scheduled
                      </label>
                    ) : (
                      this.state.eventsList.map((event, index) => (
                        <li key={index}>
                          <div className="timeline-card">
                            <time>
                              {event.trn_start_time.split(":")[0] +
                                ":" +
                                event.trn_start_time.split(":")[1]}
                            </time>
                            <div className="timeline-w-card">
                              <h4 className="row">
                                <div align="left" className="col-md-9">
                                  {event.trn_lesson} {event.trn_grade}
                                </div>
                                <div align="right" className="col-md-3">
                                  <EditIcon
                                    className="edit-icon"
                                    onClick={() =>
                                      this.editCalendarEventById(
                                        event.trn_event_id
                                      )
                                    }
                                  />
                                </div>
                              </h4>
                              <span>
                                <i
                                  className="fa fa-clock-o"
                                  aria-hidden="true"
                                ></i>
                                {event.trn_start_time.split(":")[0] +
                                  ":" +
                                  event.trn_start_time.split(":")[1]}
                                &nbsp; - &nbsp;
                                {event.trn_end_time.split(":")[0] +
                                  ":" +
                                  event.trn_end_time.split(":")[1]}
                              </span>
                              <span>
                                <i
                                  className="fa fa-map-marker"
                                  aria-hidden="true"
                                ></i>
                                {event.trn_unit} :<br />
                                {event.trn_building_name}
                              </span>
                              {event.trn_assessment !== "" ? (
                                <span>
                                  <i
                                    className="fa fa-file-text-o"
                                    aria-hidden="true"
                                  ></i>
                                  {event.trn_assessment}
                                </span>
                              ) : null}
                            </div>
                          </div>
                        </li>
                      ))
                    )}
                  </ul>
                </div>
              </div>
            </div>
            <div className="event-form-col col">
              <div className="event-form">
                <h5 className="mr-b20">Add/ Edit Event</h5>
                <form action="">
                  <div className="form-group blue-fill-input mr-b0">
                    <label htmlFor="building">Building</label>
                    <select
                      name="building"
                      className="form-control"
                      id="building"
                      value={this.state.building}
                      onChange={(e) => this.handleCalendarFormValues(e)}
                    >
                      <option value="">Select</option>
                      {this.state.buildings.map((building, index) => (
                        <option value={building.building} key={index}>
                          {building.building}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group blue-fill-input mr-b0">
                    <label htmlFor="teacher">Class</label>
                    <select
                      name="teacher"
                      className="form-control"
                      id="teacher"
                      value={this.state.teacher}
                      onChange={(e) => this.handleCalendarFormValues(e)}
                    >
                      <option value="">Select</option>
                      {this.state.teachers.map((teacher, index) => (
                        <option value={teacher.teacher_name} key={index}>
                          {teacher.teacher_name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group blue-fill-input mr-b0">
                    <label htmlFor="grade">Grade</label>
                    <select
                      name="grade"
                      className="form-control"
                      id="grade"
                      value={this.state.grade}
                      onChange={(e) => this.handleCalendarFormValues(e)}
                    >
                      <option value="">Select</option>
                      {this.state.grades.map((grade, index) => (
                        <option value={grade.grade_name} key={index}>
                          {grade.grade_name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group blue-fill-input mr-b0">
                    <label htmlFor="curriculum">Curriculum</label>
                    <select
                      value={this.state.curriculum}
                      onChange={(e) => this.handleCalendarFormValues(e)}
                      name="curriculum"
                      className="form-control"
                      id="curriculum"
                    >
                      <option value="">Select</option>
                      {this.state.curriculums.map((curriculum, index) => (
                        <option value={curriculum.name} key={index}>
                          {curriculum.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {this.state.showModules ? (
                    <div className="form-group blue-fill-input mr-b0">
                      <label htmlFor="module">Module</label>
                      <select
                        value={this.state.module}
                        onChange={(e) => this.handleCalendarFormValues(e)}
                        name="module"
                        className="form-control"
                        id="module"
                      >
                        <option value="">Select</option>
                        {this.state.modules.map((module, index) => (
                          <option value={module.module_name} key={index}>
                            {module.module_name}
                          </option>
                        ))}
                      </select>
                    </div>
                  ) : null}

                  <div className="form-group blue-fill-input mr-b0">
                    <label htmlFor="unit">Unit</label>
                    <select
                      value={this.state.unit}
                      onChange={(e) => this.handleCalendarFormValues(e)}
                      name="unit"
                      className="form-control"
                      id="unit"
                    >
                      <option value="">Select</option>
                      {this.state.units.map((unit, index) => (
                        <option value={unit.unit_name} key={index}>
                          {unit.unit_name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group blue-fill-input mr-b0">
                    <label htmlFor="lesson">Lesson</label>
                    <select
                      name="lesson"
                      className="form-control"
                      id="lesson"
                      value={this.state.lesson}
                      onChange={(e) => this.handleCalendarFormValues(e)}
                    >
                      <option value="">Select</option>
                      {this.state.lessons != null
                        ? this.state.lessons.map((lesson, index) => (
                            <option value={lesson.option_name} key={index}>
                              {lesson.option_name}
                            </option>
                          ))
                        : null}
                    </select>
                  </div>
                  {this.state.showAssessments ? (
                    <div className="form-group blue-fill-input mr-b0">
                      <label htmlFor="assessment">Assessments</label>
                      <select
                        name="assessment"
                        className="form-control"
                        id="assessment"
                        value={this.state.assessment}
                        onChange={(e) => this.handleCalendarFormValues(e)}
                      >
                        <option value="">Select</option>
                        {this.state.assessments != null
                          ? this.state.assessments.map((assessment, index) => (
                              <option
                                value={assessment.assessment_name}
                                key={index}
                              >
                                {assessment.assessment_name}
                              </option>
                            ))
                          : null}
                      </select>
                    </div>
                  ) : null}

                  <div className="form-group blue-fill-input mr-b0">
                    <MuiPickersUtilsProvider utils={Moment}>
                      <label htmlFor="eventDate">Event Date</label>
                      <KeyboardDatePicker
                        value={this.state.eventDate}
                        onChange={(date) => this.changeEventDate(date)}
                        format="DD-MM-yyyy"
                        inputVariant="outlined"
                      />
                    </MuiPickersUtilsProvider>
                  </div>
                  <div className="row">
                    <div className="col-sm">
                      <div className="form-group blue-fill-input mr-b0">
                        <MuiPickersUtilsProvider utils={Moment}>
                          <label htmlFor="">Start Time</label>
                          <TimePicker
                            autoOk
                            value={this.state.displayStartTime}
                            onChange={this.handleStartTime}
                          />
                        </MuiPickersUtilsProvider>
                      </div>
                    </div>
                    <div className="col-sm">
                      <div className="form-group blue-fill-input mr-b0">
                        <MuiPickersUtilsProvider utils={Moment}>
                          <label htmlFor="">End Time</label>
                          <TimePicker
                            autoOk
                            value={this.state.displayEndTime}
                            onChange={this.handleEndTime}
                          />
                        </MuiPickersUtilsProvider>
                      </div>
                    </div>
                  </div>
                  {this.state.showTimeError ? (
                    <div className="mandatory">
                      <i>{this.state.errorTime}</i>
                    </div>
                  ) : null}
                  <div className="form-group mr-b0 mr-t20 row">
                    {this.state.showEdit ? (
                      <button
                        type="button"
                        className="s-darkblue-btn m-btn mr-l15"
                        onClick={() => this.addUpdateCalendarEvent("update")}
                        disabled={this.state.loader}
                      >
                        Update Schedule &nbsp;
                        {this.state.loader ? (
                          <i className="fa fa-spinner fa-spin"></i>
                        ) : null}
                      </button>
                    ) : (
                      <button
                        type="button"
                        className="s-darkblue-btn m-btn mr-l15"
                        onClick={() => this.addUpdateCalendarEvent("add")}
                        disabled={this.state.loader}
                      >
                        Add Schedule
                        {this.state.loader ? (
                          <i className="fa fa-spinner fa-spin"></i>
                        ) : null}
                      </button>
                    )}

                    <button
                      type="button"
                      className="s-darkblue-btn btn-clear m-btn mr-l15 "
                      onClick={this.resetForm}
                    >
                      Clear
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Calender;
