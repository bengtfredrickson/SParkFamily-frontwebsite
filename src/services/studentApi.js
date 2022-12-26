import api from "./api";

function getStudentData(createdBy) {
  return new Promise((resolve, reject) => {
    api.post("/student/getStudentData", createdBy).then((response) => {
      resolve(response);
    });
  });
}

function getStudentDataById(studentId) {
  return new Promise((resolve, reject) => {
    api.get(`/student/getStudentDataById/${studentId}`).then((response) => {
      resolve(response);
    });
  });
}

function updateStudentData(updateStudentRecord) {
  return new Promise((resolve, reject) => {
    api
      .post("/student/updateStudentData", updateStudentRecord)
      .then((response) => {
        resolve(response);
      });
  });
}

function postStudentData(addStudentRecord) {
  return new Promise((resolve, reject) => {
    api.post("/student/postStudentData", addStudentRecord).then((response) => {
      resolve(response);
    });
  });
}

function postBulkStudentData(postBulkObject) {
  return new Promise((resolve, reject) => {
    api
      .post("/student/postBulkStudentData", postBulkObject)
      .then((response) => {
        resolve(response);
      });
  });
}

function deleteStudentData(studentId) {
  return new Promise((resolve, reject) => {
    api.patch(`/student/deleteStudentData/${studentId}`).then((response) => {
      resolve(response);
    });
  });
}

function getStudentAttendanceData(attendanceObject) {
  return new Promise((resolve, reject) => {
    api
      .post("/student/getStudentAttendanceData", attendanceObject)
      .then((response) => {
        resolve(response);
      });
  });
}

const studentMethods = {
  getStudentData,
  getStudentDataById,
  updateStudentData,
  postStudentData,
  postBulkStudentData,
  deleteStudentData,
  getStudentAttendanceData,
};

export default studentMethods;
