import React, { Component } from "react";
import BackButton from "../UI/BackButton/BackButton";
import Header from "../UI/Header/Header";
import curriculumMethods from "../../services/curriculumApi";
import CircularProgress from "@material-ui/core/CircularProgress";
class Assessment extends Component {
  state = {
    curriculums: [],
    curriculum: "",
    units: [],
    unit: "",
    subunits: [],
    subunit: "",
    modules: [],
    module: "",
    userId: JSON.parse(window.sessionStorage.getItem("UserDetails")).user_id,
    showModules: false,
    curriculumId: 1,
  };

  componentDidMount() {
    this.fetchDropdownData();
  }

  navigateToAnalysis = (unit) => {
    var unitObject = {
      ...unit,
    };

    this.setState({ curriculumId: unit.curriculum_id });

    this.state.curriculums.forEach((element) => {
      if (unit.curriculum_id === element.curriculum_id) {
        unitObject.curriculum_name = element.name;
      }
    });

    sessionStorage.setItem("Unit", JSON.stringify(unitObject));
    if (unit.curriculum_id === 1 || unit.curriculum_id === 8) {
      this.props.history.push({
        pathname: "/admin/k2assessments",
      });
    } else {
      this.props.history.push({
        pathname: "/admin/assessmentAnalysis",
      });
    }
  };

  navigatetoAssAnalysis = (value) => {
    sessionStorage.setItem("Unit", JSON.stringify({ unit_name: value }));
    this.props.history.push({
      pathname: "/admin/otherAssessments",
    });
  };

  navigatetoCustAnalysis = () => {
    sessionStorage.setItem(
      "Unit",
      JSON.stringify({ unit_name: "Custom Assessments" })
    );
    this.props.history.push({
      pathname: "/admin/customAssessments",
    });
  };

  fetchDropdownData = async () => {
    const currresponse = await curriculumMethods.getCurriculumsList(
      this.state.userId
    );

    if (currresponse.status === 200) {
      this.setState({
        curriculums: currresponse.data.result,
      });
    }

    var unitData = {
      curriculum_id: 1,
      module_id: 0,
    };

    const unitresponse = await curriculumMethods.getUnitsList(unitData);
    if (unitresponse.status === 200) {
      this.setState({
        units: unitresponse.data.result,
      });
    }
  };

  handleDropdownvalues = async (event) => {
    await this.setState({ [event.target.name]: event.target.value });

    var curriculumData = {
      curriculum_id: 1,
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
    }
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
                Assessments
              </h3>
            </div>
            <div className="box-head white-box mr-b15">
              <h4>Assessments</h4>
            </div>
          </div>
          <div className="ass-wrap">
            <div className="a-unit-wrap">
              {/* <div className="ass-count-box-wrap">
                <div className="ass-count mr-b15">
                  <h3>28</h3>
                  <span>
                    Total <br />
                    Assessments
                  </span>
                </div>
                <div className="ass-count">
                  <h3>17</h3>
                  <span>
                    Completed <br />
                    Assessments
                  </span>
                </div>
              </div> */}

              <div className="unit-head-card">
                <div className="unit-form white-box">
                  <div className="ass-count">
                    <h5> Spark Assessments</h5>
                  </div>
                  <div className="row">
                    <div className="col-sm">
                      <div className="form-group blue-fill-input mr-b0">
                        <label htmlFor="curriculum">Curriculum</label>
                        <select
                          name="curriculum"
                          className="form-control"
                          id="curriculum"
                          value={this.state.curriculum}
                          onChange={this.handleDropdownvalues}
                        >
                          {this.state.curriculums.map((curriculum, index) => (
                            <option value={curriculum.name} key={index}>
                              {curriculum.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {this.state.showModules ? (
                      <div className="col-sm">
                        <div className="form-group blue-fill-input mr-b0">
                          <label htmlFor="module">Module</label>
                          <select
                            name="module"
                            className="form-control"
                            id="module"
                            value={this.state.module}
                            onChange={this.handleDropdownvalues}
                          >
                            <option value="">Select</option>
                            {this.state.modules.map((module, index) => (
                              <option value={module.module_name} key={index}>
                                {module.module_name}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    ) : null}
                  </div>
                </div>

                <div className="u-game-card white-box mr-b10">
                  {this.state.units.length > 0 ? (
                    <div className="row row-cols-5">
                      {this.state.units.map((unit, index) => (
                        <div
                          className="col"
                          onClick={() => this.navigateToAnalysis(unit)}
                          key={index}
                        >
                          <div className="g-blue-card">
                            <h4>{unit.unit_name}</h4>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <CircularProgress
                      style={{ margin: "10% 0% 10% 50%", color: "primary" }}
                    />
                  )}
                </div>

                <div className="unit-form white-box">
                  <div className="ass-count">
                    <h5> Other Assessments</h5>
                  </div>
                  <div className="row row-cols-5 mr-t10">
                    <div
                      className="col"
                      onClick={() =>
                        this.navigatetoAssAnalysis("Timed Assessments")
                      }
                    >
                      <div className="g-blue-card">
                        <h4>Timed Assessments</h4>
                      </div>
                    </div>
                    <div
                      className="col"
                      onClick={() =>
                        this.navigatetoAssAnalysis("Fitness Assessments")
                      }
                    >
                      <div className="g-blue-card">
                        <h4>Fitness Assessments</h4>
                      </div>
                    </div>
                    <div
                      className="col"
                      onClick={() => this.navigatetoCustAnalysis()}
                    >
                      <div className="g-blue-card">
                        <h4>Custom Assessments</h4>
                      </div>
                    </div>
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

export default Assessment;
