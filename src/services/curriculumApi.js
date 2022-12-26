import api from "./api";

function getCurriculumsList(userId) {
  return new Promise((resolve, reject) => {
    api.get(`/curriculum/getCurriculumsList/${userId}`).then((response) => {
      resolve(response);
    });
  });
}

function getModulesList(curriculumData) {
  return new Promise((resolve, reject) => {
    api.post(`/curriculum/getModulesList`, curriculumData).then((response) => {
      resolve(response);
    });
  });
}

function getUnitsList(unitData) {
  return new Promise((resolve, reject) => {
    api.post(`/curriculum/getUnitsList`, unitData).then((response) => {
      resolve(response);
    });
  });
}

function getSubunitsList(subunitData) {
  return new Promise((resolve, reject) => {
    api.post(`/curriculum/getSubunitsList`, subunitData).then((response) => {
      resolve(response);
    });
  });
}

function getSuboptionsList(suboptionData) {
  return new Promise((resolve, reject) => {
    api
      .post(`/curriculum/getSuboptionsList`, suboptionData)
      .then((response) => {
        resolve(response);
      });
  });
}

const curriculumMethods = {
  getCurriculumsList,
  getModulesList,
  getUnitsList,
  getSubunitsList,
  getSuboptionsList,
};

export default curriculumMethods;
