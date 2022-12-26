import api from "./api";

function userLogin(userObject) {
  return new Promise((resolve, reject) => {
    api.post("/login/sparkLogin", userObject).then((response) => {
      resolve(response);
    });
  });
}

const userMethods = {
  userLogin,
};

export default userMethods;
