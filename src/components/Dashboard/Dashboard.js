import React, { Component } from "react";
import studentImg from "../../assets/images/student.png";
import calenderImg from "../../assets/images/schedule.png";
import reportImg from "../../assets/images/checklist.png";
import Header from "../UI/Header/Header";
class Dashboard extends Component {
  state = {
    isAuthenticated: true,
  };

  componentDidMount() {
    this.setState({
      isAuthenticated: window.sessionStorage.getItem("isAuthenticated"),
    });
  }

  navigateToStudent = () => {
    this.props.history.push({
      pathname: "/admin/student",
    });
  };

  navigateToCalender = () => {
    this.props.history.push({
      pathname: "/admin/calendar",
    });
  };

  navigateToAssessment = () => {
    this.props.history.push({
      pathname: "/admin/assessment",
    });
  };

  render() {
    return (
      <div className="routing-wrap">
        <Header />
        <div className="page-wrap">
          <div className="page-title mr-b15">
            <h3>Dashboard</h3>
          </div>
          <div className="dash-card-wrap mr-t200">
            <div
              className="dash-card white-box"
              onClick={this.navigateToStudent}
            >
              <div className="d-icon">
                <img src={studentImg} alt="student" title="student" />
              </div>
              <h4>Students</h4>
            </div>
            <div
              className="dash-card white-box"
              onClick={this.navigateToCalender}
            >
              <div className="d-icon">
                <img src={calenderImg} alt="student" title="student" />
              </div>
              <h4>Calendar</h4>
            </div>
            <div
              className="dash-card white-box"
              onClick={this.navigateToAssessment}
            >
              <div className="d-icon">
                <img src={reportImg} alt="student" title="student" />
              </div>
              <h4>Assessment</h4>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Dashboard;
