import React, { Component } from "react";
import Header from "../UI/Header/Header";

class Profile extends Component {
  state = {
    fullname: "",
    phone: "",
    email: "",
    dob: "",
  };

  componentDidMount() {
    this.assignProfileValues();
  }

  assignProfileValues = async () => {
    var sessionValues = JSON.parse(
      window.sessionStorage.getItem("UserDetails")
    );

    await this.setState({
      email: sessionValues.email,
      fullname: sessionValues.first_name + " " + sessionValues.last_name,
    });
  };

  render() {
    return (
      <div className="routing-wrap">
        <Header />
        <div className="page-wrap">
          <div className="page-title mr-b50">
            <h3>Profile</h3>
          </div>
          <div className="c-data-wrap mr-auto">
            <div className="row col-md-12 pd-t30 pd-l50 pd-b20">
              <div className="row col-md-12">
                <div className="col-md-6 pd10">
                  <label className="profile">
                    <i className="fa fa-user mr-r30" aria-hidden="true"></i>
                    <em></em> Full Name :
                  </label>
                </div>
                <div className="col-md-6 pd10">
                  <label className="profile-data">{this.state.fullname}</label>
                </div>
              </div>
              <div className="row col-md-12">
                <div className="col-md-6 pd10">
                  <label className="profile">
                    <i
                      className="fa fa-phone-square mr-r30"
                      aria-hidden="true"
                    ></i>
                    Mobile Number :
                  </label>
                </div>
                <div className="col-md-6 pd10">
                  <label className="profile-data">{this.state.phone}</label>
                </div>
              </div>
              <div className="row col-md-12">
                <div className="col-md-6 pd10">
                  <label className="profile">
                    <i className="fa fa-envelope mr-r30" aria-hidden="true"></i>
                    Email Address :
                  </label>
                </div>
                <div className="col-md-6 pd10">
                  <label className="profile-data">{this.state.email}</label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Profile;
