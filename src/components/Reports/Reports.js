import React, { Component } from "react";
import Header from "../UI/Header/Header";

class Reports extends Component {
  render() {
    return (
      <div className="routing-wrap">
        <Header />
        <div className="page-wrap">
          <div className="page-title mr-b15">
            <h3>Reports</h3>
          </div>
          <div className="dash-card-wrap mr-t200">
            <h5 className="in-progress">In progress...</h5>
          </div>
        </div>
      </div>
    );
  }
}

export default Reports;
