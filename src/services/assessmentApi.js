import api from "./api";

function getAssessmentByBuildingClass(assessmentObject) {
  return new Promise((resolve, reject) => {
    api
      .post(`/assessment/getAssessmentByBuildingClass`, assessmentObject)
      .then((response) => {
        resolve(response);
      });
  });
}

function getStudentsForTimer(timerObject) {
  return new Promise((resolve, reject) => {
    api
      .post(`/assessment/getStudentsForTimer`, timerObject)
      .then((response) => {
        resolve(response);
      });
  });
}

function getStudentsForLapcount(fitnessObject) {
  return new Promise((resolve, reject) => {
    api
      .post(`/assessment/getStudentsForLapcount`, fitnessObject)
      .then((response) => {
        resolve(response);
      });
  });
}

function getStudentsForEmailAssessments(emailObject) {
  return new Promise((resolve, reject) => {
    api
      .post(`/assessment/getStudentsForEmailAssessments`, emailObject)
      .then((response) => {
        resolve(response);
      });
  });
}

function getCustomAssessmentsList(customAssessments) {
  return new Promise((resolve, reject) => {
    api
      .post(`/assessment/getCustomAssessmentsList`, customAssessments)
      .then((response) => {
        resolve(response);
      });
  });
}

function getCustomAssessmentById(customObject) {
  return new Promise((resolve, reject) => {
    api
      .post(`/assessment/getCustomAssessmentById`, customObject)
      .then((response) => {
        resolve(response);
      });
  });
}

const assessmentMethods = {
  getAssessmentByBuildingClass,
  getStudentsForTimer,
  getStudentsForLapcount,
  getStudentsForEmailAssessments,
  getCustomAssessmentsList,
  getCustomAssessmentById,
};

export default assessmentMethods;
