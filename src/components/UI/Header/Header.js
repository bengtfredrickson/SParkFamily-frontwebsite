import React, { Component } from "react";
import Modal from "@material-ui/core/Modal";
import { withRouter } from "react-router-dom";
class Header extends Component {
  state = {
    showLogout: false,
    loader: false,
    firstname: JSON.parse(window.sessionStorage.getItem("UserDetails"))
      .first_name
      ? JSON.parse(window.sessionStorage.getItem("UserDetails")).first_name
      : JSON.parse(window.sessionStorage.getItem("UserDetails")).firstname,
    lastname: JSON.parse(window.sessionStorage.getItem("UserDetails")).last_name
      ? JSON.parse(window.sessionStorage.getItem("UserDetails")).last_name
      : JSON.parse(window.sessionStorage.getItem("UserDetails")).lastname,
  };

  handleClose = () => {
    this.setState({ showLogout: false });
  };

  logout = () => {
    this.setState({
      showLogout: true,
    });
  };

  logoutUser = () => {
    this.setState({ loader: true, showLogout: false });
    window.sessionStorage.clear();
    this.props.history.push({
      pathname: "/",
    });
  };

  render() {
    return (
      <header className="head-wrap">
        <div className="head-title">
          <h5>
            <b>
              Welcome {this.state.firstname} {this.state.lastname}
            </b>
          </h5>

          <button type="button" className="trans-btn" onClick={this.logout}>
            <svg
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M11.1995 2.12031C10.8314 1.9595 10.4027 2.12753 10.2419 2.49561C10.0811 2.86369 10.2491 3.29242 10.6172 3.45322C12.9835 4.48699 14.5454 6.82743 14.5454 9.45441C14.5454 13.0692 11.6146 15.9999 7.99997 15.9999C4.3849 15.9999 1.45452 13.0695 1.45452 9.45441C1.45452 6.82801 3.01588 4.48757 5.38151 3.45312C5.74953 3.29221 5.91742 2.86342 5.75648 2.49541C5.59557 2.1274 5.16678 1.9595 4.79877 2.12044C1.90824 3.38436 0 6.24479 0 9.45437C0 13.8728 3.58162 17.4544 8 17.4544C12.4179 17.4544 16 13.8725 16 9.45437C16 6.24404 14.091 3.38347 11.1995 2.12031Z"
                fill="#0052A4"
              ></path>
              <path
                d="M7.99972 8C8.40138 8 8.72698 7.6744 8.72698 7.27274V0.727294C8.72702 0.325602 8.40138 0 7.99972 0C7.59806 0 7.27246 0.325602 7.27246 0.72726V7.2727C7.27246 7.67436 7.59806 8 7.99972 8Z"
                fill="#0052A4"
              ></path>
            </svg>
          </button>

          {this.state.showLogout ? (
            <Modal
              open={this.state.showLogout}
              aria-labelledby="logoutModal"
              aria-hidden="true"
            >
              <div
                className="modal-dialog modal-sm modal-dialog-centered"
                role="document"
              >
                <div className="modal-content ">
                  <div className="modal-header">
                    <h5 className="modal-title" id="exampleModalLabel">
                      Logout?
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
                    <div className="text-center">
                      <h6>Are you sure you want to logout?</h6>
                    </div>
                  </div>

                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={this.logoutUser}
                      disabled={this.state.loader}
                    >
                      Logout
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
      </header>
    );
  }
}

export default withRouter(Header);
