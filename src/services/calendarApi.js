import api from "./api";

function getCalendarEventDataByDate(getCalendarObejct) {
  return new Promise((resolve, reject) => {
    api
      .post(`/calendar/getCalendarEventDataByDate`, getCalendarObejct)
      .then((response) => {
        resolve(response);
      });
  });
}

function addCalendarEventData(addUpdateEventObject) {
  return new Promise((resolve, reject) => {
    api
      .post("/calendar/addCalendarEventData", addUpdateEventObject)
      .then((response) => {
        resolve(response);
      });
  });
}

function getCalendarEventDataById(eventId) {
  return new Promise((resolve, reject) => {
    api
      .get(`/calendar/getCalendarEventDataById?trn_event_id=${eventId}`)
      .then((response) => {
        resolve(response);
      });
  });
}

function updateCalendarEventData(addUpdateEventObject, eventId) {
  return new Promise((resolve, reject) => {
    api
      .patch(
        `/calendar/updateCalendarEventData?trn_event_id=${eventId}`,
        addUpdateEventObject
      )
      .then((response) => {
        resolve(response);
      });
  });
}

const calendarMethods = {
  getCalendarEventDataByDate,
  addCalendarEventData,
  getCalendarEventDataById,
  updateCalendarEventData,
};

export default calendarMethods;
