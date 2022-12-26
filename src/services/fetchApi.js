import api from "./api";

function getGradesList() {
  return new Promise((resolve, reject) => {
    api.get(`/fetch/getGradesList`).then((response) => {
      resolve(response);
    });
  });
}

function getBuildingsList(buildingObj) {
  return new Promise((resolve, reject) => {
    api.post(`/fetch/getBuildingsList`, buildingObj).then((response) => {
      resolve(response);
    });
  });
}

function getTeachersList(teacherData) {
  return new Promise((resolve, reject) => {
    api.post(`/fetch/getTeachersList`, teacherData).then((response) => {
      resolve(response);
    });
  });
}

function getAssessmentsListForCalendar(assessmentObject) {
  return new Promise((resolve, reject) => {
    api
      .post(`/fetch/getAssessmentsListForCalendar`, assessmentObject)
      .then((response) => {
        resolve(response);
      });
  });
}

function getOtherAssessments(label) {
  return new Promise((resolve, reject) => {
    api.post(`/fetch/getOtherAssessments`, label).then((response) => {
      resolve(response);
    });
  });
}

const fetchMethods = {
  getGradesList,
  getBuildingsList,
  getTeachersList,
  getAssessmentsListForCalendar,
  getOtherAssessments,
};

export default fetchMethods;
