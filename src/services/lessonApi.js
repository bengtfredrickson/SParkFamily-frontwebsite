import api from "./api";

function getLessonsList(lessonData) {
  return new Promise((resolve, reject) => {
    api.post(`/lesson/getLessonsList`, lessonData).then((response) => {
      resolve(response);
    });
  });
}

function getLessonPlans(lessonObject) {
  return new Promise((resolve, reject) => {
    api.post(`/lesson/getLessonPlans`, lessonObject).then((response) => {
      resolve(response);
    });
  });
}

const lessonMethods = {
  getLessonsList,
  getLessonPlans,
};

export default lessonMethods;
