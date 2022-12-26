import React, { Component } from "react";
import { NavLink, Switch, Route } from "react-router-dom";
import sparkMiniLogo from "../../assets/images/spark-mini-logo.png";
import Dashboard from "../../components/Dashboard/Dashboard";
import Student from "../../components/Student/Student";
import AddEditStudent from "../../components/Student/AddEditStudent/AddEditStudent";
import AttendanceReport from "../../components/Student/AttendanceReport/AttendanceReport";
import Calender from "../../components/Calender/Calender";
import Assessment from "../../components/Assessment/Assessment";
import AssessmentAnalysis from "../../components/Assessment/AssessmentAnalysis/AssessmentAnalysis";
import CreateViewClass from "../../components/CreateViewClasses/CreateViewClasses";
import Reports from "../../components/Reports/Reports";
import Profile from "../../components/Profile/Profile";
import Support from "../../components/Support/Support";
import K2Assessments from "../../components/Assessment/AssessmentAnalysis/K2Assessments";
import OtherAssessments from "../../components/Assessment/AssessmentAnalysis/OtherAssessments";
import CustomAssessments from "../../components/Assessment/AssessmentAnalysis/CustomAssessments";

class Layout extends Component {
  state = { isAuthenticated: window.sessionStorage.getItem("isAuthenticated") };

  render() {
    return (
      <main className="body-main-warp">
        <aside className="sidebar-wrap">
          <div className="sidemain-logo text-center mr-b30">
            <img src={sparkMiniLogo} alt="spark" title="spark" />
          </div>
          <nav className="sidenav">
            <ul>
              <li className="active-link">
                <NavLink
                  to={"/admin/dashboard"}
                  exact
                  activeClassName="active-link"
                >
                  <div className="n-icon">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M4.16667 7.50002C3.72464 7.50002 3.30072 7.32443 2.98816 7.01187C2.67559 6.6993 2.5 6.27538 2.5 5.83335V3.33335C2.5 2.89133 2.67559 2.4674 2.98816 2.15484C3.30072 1.84228 3.72464 1.66669 4.16667 1.66669H7.5C7.94203 1.66669 8.36595 1.84228 8.67851 2.15484C8.99107 2.4674 9.16667 2.89133 9.16667 3.33335V5.83335C9.16667 6.27538 8.99107 6.6993 8.67851 7.01187C8.36595 7.32443 7.94203 7.50002 7.5 7.50002H4.16667ZM4.16667 18.3334C3.72464 18.3334 3.30072 18.1578 2.98816 17.8452C2.67559 17.5326 2.5 17.1087 2.5 16.6667V10C2.5 9.55799 2.67559 9.13407 2.98816 8.82151C3.30072 8.50895 3.72464 8.33335 4.16667 8.33335H7.5C7.94203 8.33335 8.36595 8.50895 8.67851 8.82151C8.99107 9.13407 9.16667 9.55799 9.16667 10V16.6667C9.16667 17.1087 8.99107 17.5326 8.67851 17.8452C8.36595 18.1578 7.94203 18.3334 7.5 18.3334H4.16667ZM12.5 18.3334C12.058 18.3334 11.634 18.1578 11.3215 17.8452C11.0089 17.5326 10.8333 17.1087 10.8333 16.6667V15C10.8333 14.558 11.0089 14.1341 11.3215 13.8215C11.634 13.5089 12.058 13.3334 12.5 13.3334H15.8333C16.2754 13.3334 16.6993 13.5089 17.0118 13.8215C17.3244 14.1341 17.5 14.558 17.5 15V16.6667C17.5 17.1087 17.3244 17.5326 17.0118 17.8452C16.6993 18.1578 16.2754 18.3334 15.8333 18.3334H12.5ZM12.5 11.6667C12.058 11.6667 11.634 11.4911 11.3215 11.1785C11.0089 10.866 10.8333 10.442 10.8333 10V3.33335C10.8333 2.89133 11.0089 2.4674 11.3215 2.15484C11.634 1.84228 12.058 1.66669 12.5 1.66669H15.8333C16.2754 1.66669 16.6993 1.84228 17.0118 2.15484C17.3244 2.4674 17.5 2.89133 17.5 3.33335V10C17.5 10.442 17.3244 10.866 17.0118 11.1785C16.6993 11.4911 16.2754 11.6667 15.8333 11.6667H12.5Z"
                        fill="#0052A4"
                      />
                    </svg>
                  </div>
                  <span>Dashboard</span>
                </NavLink>
              </li>
              {/* <li>
                <NavLink
                  to={"/admin/createViewClass"}
                  activeClassName="active-link"
                >
                  <div className="n-icon">
                    <svg
                      width="20"
                      height="16"
                      viewBox="0 0 20 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M2.49998 5.5C2.50009 4.64961 2.7171 3.81329 3.13048 3.07013C3.54386 2.32697 4.13996 1.70152 4.86241 1.25293C5.58487 0.804331 6.4098 0.547412 7.25921 0.506462C8.10862 0.465511 8.95444 0.641882 9.71669 1.0189C10.4789 1.39592 11.1324 1.96112 11.6154 2.66107C12.0984 3.36101 12.3948 4.17258 12.4767 5.01902C12.5586 5.86546 12.4233 6.71881 12.0835 7.49838C11.7438 8.27795 11.2108 8.95798 10.535 9.47417C12.655 10.4225 14.1666 12.34 14.1666 14.6667C14.1666 14.8877 14.0788 15.0996 13.9226 15.2559C13.7663 15.4122 13.5543 15.5 13.3333 15.5H1.66665C1.44563 15.5 1.23367 15.4122 1.07739 15.2559C0.92111 15.0996 0.833313 14.8877 0.833313 14.6667C0.833313 12.34 2.34498 10.4225 4.46498 9.47417C3.85344 9.00787 3.35791 8.40658 3.01706 7.71721C2.67621 7.02784 2.49924 6.26904 2.49998 5.5ZM18.3333 15.5H15C15.221 15.5 15.433 15.4122 15.5892 15.2559C15.7455 15.0996 15.8333 14.8877 15.8333 14.6667C15.8333 12.34 14.3216 10.4225 12.2016 9.47417C12.9178 8.92706 13.4729 8.19661 13.8081 7.36003C14.1434 6.52345 14.2464 5.61183 14.1062 4.72155C13.966 3.83127 13.5878 2.99541 13.0117 2.30233C12.4356 1.60925 11.683 1.08472 10.8333 0.78417C11.9571 0.38526 13.1864 0.401098 14.2995 0.828828C15.4126 1.25656 16.3361 2.06801 16.9036 3.1168C17.471 4.16558 17.6449 5.38263 17.394 6.54837C17.143 7.71411 16.4837 8.75178 15.535 9.47417C17.655 10.4225 19.1666 12.34 19.1666 14.6667C19.1666 14.8877 19.0788 15.0996 18.9226 15.2559C18.7663 15.4122 18.5543 15.5 18.3333 15.5Z"
                        fill="#0052A4"
                      />
                    </svg>
                  </div>
                  <span>Create/View Classes</span>
                </NavLink>
              </li> */}
              <li>
                <NavLink to={"/admin/assessment"} activeClassName="active-link">
                  <div className="n-icon">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M8.33333 9.99998C10.1743 9.99998 11.6667 8.5076 11.6667 6.66665C11.6667 4.8257 10.1743 3.33331 8.33333 3.33331C6.49238 3.33331 5 4.8257 5 6.66665C5 8.5076 6.49238 9.99998 8.33333 9.99998Z"
                        fill="#0052A4"
                      />
                      <path
                        d="M8.89169 10.85C8.70835 10.8417 8.52502 10.8334 8.33335 10.8334C6.31669 10.8334 4.43335 11.3917 2.82502 12.35C2.09169 12.7834 1.66669 13.6 1.66669 14.4584V16.6667H9.38335C8.79476 15.827 8.43918 14.8464 8.35281 13.8247C8.26645 12.8029 8.45238 11.7765 8.89169 10.85ZM17.2917 13.3334C17.2917 13.15 17.2667 12.9834 17.2417 12.8084L18.1917 11.9667L17.3584 10.525L16.15 10.9334C15.8834 10.7084 15.5834 10.5334 15.25 10.4084L15 9.16669H13.3334L13.0834 10.4084C12.75 10.5334 12.45 10.7084 12.1834 10.9334L10.975 10.525L10.1417 11.9667L11.0917 12.8084C11.0667 12.9834 11.0417 13.15 11.0417 13.3334C11.0417 13.5167 11.0667 13.6834 11.0917 13.8584L10.1417 14.7L10.975 16.1417L12.1834 15.7334C12.45 15.9584 12.75 16.1334 13.0834 16.2584L13.3334 17.5H15L15.25 16.2584C15.5834 16.1334 15.8834 15.9584 16.15 15.7334L17.3584 16.1417L18.1917 14.7L17.2417 13.8584C17.2667 13.6834 17.2917 13.5167 17.2917 13.3334ZM14.1667 15C13.25 15 12.5 14.25 12.5 13.3334C12.5 12.4167 13.25 11.6667 14.1667 11.6667C15.0834 11.6667 15.8334 12.4167 15.8334 13.3334C15.8334 14.25 15.0834 15 14.1667 15Z"
                        fill="#0052A4"
                      />
                    </svg>
                  </div>
                  <span>Reports</span>
                </NavLink>
              </li>
              <li>
                <NavLink to={"/admin/profile"} activeClassName="active-link">
                  <div className="n-icon">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M10 1.66669C5.48252 1.66669 1.66669 5.48252 1.66669 10C1.66669 14.5175 5.48252 18.3334 10 18.3334C14.5175 18.3334 18.3334 14.5175 18.3334 10C18.3334 5.48252 14.5175 1.66669 10 1.66669ZM10 5.83335C11.4392 5.83335 12.5 6.89335 12.5 8.33335C12.5 9.77335 11.4392 10.8334 10 10.8334C8.56169 10.8334 7.50002 9.77335 7.50002 8.33335C7.50002 6.89335 8.56169 5.83335 10 5.83335ZM5.74502 13.9767C6.49252 12.8767 7.73919 12.1434 9.16669 12.1434H10.8334C12.2617 12.1434 13.5075 12.8767 14.255 13.9767C13.19 15.1167 11.6792 15.8334 10 15.8334C8.32085 15.8334 6.81002 15.1167 5.74502 13.9767Z"
                        fill="#0052A4"
                      />
                    </svg>
                  </div>
                  <span>Profile</span>
                </NavLink>
              </li>
              {/* <li>
                <NavLink to={"/admin/support"} activeClassName="active-link">
                  <div className="n-icon">
                    <svg
                      width="16"
                      height="13"
                      viewBox="0 0 16 13"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M4.98227e-09 3.66L7.61 7.61786C7.68634 7.65755 7.77111 7.67827 7.85714 7.67827C7.94318 7.67827 8.02795 7.65755 8.10429 7.61786L15.7143 3.66071V10.5357C15.7143 11.1287 15.4875 11.6992 15.0802 12.1302C14.673 12.5612 14.1163 12.82 13.5243 12.8536L13.3929 12.8571H2.32143C1.72847 12.8572 1.15798 12.6303 0.726978 12.2231C0.295976 11.8159 0.0371419 11.2591 0.00357152 10.6671L4.98227e-09 10.5357V3.66ZM2.32143 4.98228e-09H13.3929C13.9858 -3.88191e-05 14.5563 0.226824 14.9873 0.634051C15.4183 1.04128 15.6771 1.598 15.7107 2.19L15.7143 2.32143V2.45286L7.85714 6.53857L4.98227e-09 2.45286V2.32143C-3.88191e-05 1.72847 0.226824 1.15798 0.634051 0.726978C1.04128 0.295976 1.598 0.0371419 2.19 0.00357152L2.32143 4.98228e-09H13.3929H2.32143Z"
                        fill="#0052A4"
                      />
                    </svg>
                  </div>
                  <span>Support</span>
                </NavLink>
              </li> */}
            </ul>
          </nav>
        </aside>

        {this.state.isAuthenticated ? (
          <Switch>
            <Route
              path="/admin/dashboard"
              component={Dashboard}
              isAuthenticated={this.state.isAuthenticated}
            />
            <Route
              path="/admin/student"
              component={Student}
              isAuthenticated={this.state.isAuthenticated}
            />
            <Route
              path="/admin/addEditStudent"
              component={AddEditStudent}
              isAuthenticated={this.state.isAuthenticated}
            />
            <Route
              path="/admin/attendanceReport"
              component={AttendanceReport}
              isAuthenticated={this.state.isAuthenticated}
            />
            <Route
              path="/admin/calendar"
              component={Calender}
              isAuthenticated={this.state.isAuthenticated}
            />
            <Route
              path="/admin/assessment"
              component={Assessment}
              isAuthenticated={this.state.isAuthenticated}
            />
            <Route
              path="/admin/assessmentAnalysis"
              component={AssessmentAnalysis}
              isAuthenticated={this.state.isAuthenticated}
            />
            <Route
              path="/admin/k2assessments"
              component={K2Assessments}
              isAuthenticated={this.state.isAuthenticated}
            />
            <Route
              path="/admin/otherAssessments"
              component={OtherAssessments}
              isAuthenticated={this.state.isAuthenticated}
            />
            <Route
              path="/admin/customAssessments"
              component={CustomAssessments}
              isAuthenticated={this.state.isAuthenticated}
            />
            <Route
              path="/admin/createViewClass"
              component={CreateViewClass}
              isAuthenticated={this.state.isAuthenticated}
            />
            <Route
              path="/admin/reports"
              component={Reports}
              isAuthenticated={this.state.isAuthenticated}
            />
            <Route
              path="/admin/profile"
              component={Profile}
              isAuthenticated={this.state.isAuthenticated}
            />
            <Route
              path="/admin/support"
              component={Support}
              isAuthenticated={this.state.isAuthenticated}
            />
          </Switch>
        ) : null}
      </main>
    );
  }
}

export default Layout;
