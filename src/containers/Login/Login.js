import React, { Component } from "react";
import sparkLogo from "../../assets/images/spark-logo.png";
import $ from "jquery";
import userMethods from "../../services/userApi";
import cookie from "react-cookies";
import moment from "moment";
class Login extends Component {
  state = {
    authenticated: false,
    username: "",
    password: "",
    deviceId: "",
    isEmailValid: false,
    errorEmail: "",
    errorPassword: "",
    loader: false,
    showIcon: false,
    showError: false,
    errorMessage: "",
  };

  getlocalIP = async () => {};

  validateEmail(email) {
    const pattern = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;

    return pattern.test(email);
  }

  handleEmailChange = async (event) => {
    this.setState({ username: event.target.value });

    // Checks if email is valid or not
    await this.setState({
      isEmailValid: this.validateEmail(this.state.username),
    });

    if (!this.validateEmail(this.state.username)) {
      await this.setState({ errorEmail: "Please enter valid email address" });
    } else {
      await this.setState({ errorEmail: "" });
    }
  };

  handlePasswordChange = (event) => {
    this.setState({ password: event.target.value });
  };

  togglePassword = () => {
    var pssInput = document.getElementById("toggle");

    if (pssInput.type === "password") {
      pssInput.type = "text";
      this.setState({ showIcon: true });
    } else {
      pssInput.type = "password";
      this.setState({ showIcon: false });
    }
  };

  redirectToDashboard = async () => {
    this.setState({ loader: true });

    this.getlocalIP();

    if (this.state.username === "") {
      this.setState({ errorEmail: "Please enter email address" });
    }

    if (this.state.password === "") {
      this.setState({ errorPassword: "Please enter password" });
    } else {
      this.setState({
        errorPassword: "",
      });
    }

    if (
      this.validateEmail(this.state.username) &&
      this.state.username !== "" &&
      this.state.password !== ""
    ) {
      // var loginObject = {
      //   username: "test@testmail.com",
      //   password:
      //     "$2a$12$QXkBtxHQWfIBmZXEH6g05.jNCZjtmElcNHjxDby2mHC01AI6HlATe",
      //   deviceid: this.state.deviceId,
      // };
      var loginObject = {
        username: this.state.username,
        password: this.state.password,
        deviceid: this.state.deviceId,
      };

      let response = await userMethods.userLogin(loginObject);

      if (response.data.result != null) {
        this.setState({ authenticated: true, loader: false });
        window.sessionStorage.setItem("isAuthenticated", true);
        window.sessionStorage.setItem(
          "UserDetails",
          JSON.stringify(response.data.result[0])
        );
        this.props.history.replace({
          pathname: "/admin/dashboard",
        });
      } else {
        this.setState({
          authenticated: false,
          loader: false,
          showError: true,
          errorMessage: response.data.message,
        });
      }
    } else {
      this.setState({
        authenticated: false,
        loader: false,
      });
    }
  };

  rememberCredentials = (event) => {
    var isChecked = event.target.checked;

    if (isChecked) {
      cookie.save("username", this.state.username, {
        path: "/",
        maxAge: 2592000,
      });
      cookie.save("password", this.state.password, {
        path: "/",
        maxAge: 2592000,
      });
    } else {
      cookie.remove("username", { path: "/" });
      cookie.remove("password", { path: "/" });
    }
  };

  render() {
    return (
      <section className="login-wrap">
        <div className="login-form-wrap">
          <div className="left-form-col">
            <div className="login-form">
              <h1 className="l-title text-center mr-b60">LOGIN</h1>
              <form action="">
                <div className="form-group line-input mr-b30">
                  <label htmlFor="">Email Address</label>
                  <input
                    type="email"
                    className="form-control"
                    value={this.state.username}
                    name="email"
                    placeholder="Enter email address"
                    onChange={this.handleEmailChange}
                    autoFocus
                    autoComplete="off"
                    required
                  />
                  <div className="color-red">
                    <i>{this.state.errorEmail}</i>
                  </div>
                </div>
                <div className="form-group line-input mr-b30">
                  <label htmlFor="">Password</label>
                  <div className="input-w-icon">
                    <input
                      id="toggle"
                      type="password"
                      className="form-control"
                      placeholder="Enter password"
                      name="password"
                      onChange={this.handlePasswordChange}
                      autoComplete="off"
                      required
                    />
                    <button
                      type="button"
                      className="input-btn"
                      onClick={this.togglePassword}
                    >
                      {this.state.showIcon ? (
                        <i className="fa fa-eye" aria-hidden="true"></i>
                      ) : (
                        <i className="fa fa-eye-slash" aria-hidden="true"></i>
                      )}
                    </button>
                  </div>

                  <div className="color-red">
                    <i>{this.state.errorPassword}</i>
                  </div>
                </div>

                {this.state.showError ? (
                  <div className="color-red mr-b20">
                    <i>{this.state.errorMessage}</i>
                  </div>
                ) : null}
                <div className="form-e-link d-flex justify-content-between mr-b50">
                  <label htmlFor="remember" className="cus-check mr0">
                    <input
                      type="checkbox"
                      name="remember"
                      id="remember"
                      onChange={this.rememberCredentials}
                    />
                    <span></span>
                    Remember me
                  </label>
                </div>
                <button
                  type="button"
                  className="s-blue-btn w-100"
                  onClick={this.redirectToDashboard}
                  disabled={this.state.loader}
                >
                  LOGIN &nbsp;
                  {this.state.loader ? (
                    <i className="fa fa-spinner fa-spin"></i>
                  ) : null}
                </button>
              </form>
            </div>
            <div className="bottom-link">
              <a href="#">Privacy</a>
            </div>
          </div>
          <div className="right-svg-block">
            <div className="top-logo text-center">
              <img src={sparkLogo} alt="spark" title="spark" />
            </div>
          </div>
        </div>
      </section>
    );
  }
}

export default Login;
