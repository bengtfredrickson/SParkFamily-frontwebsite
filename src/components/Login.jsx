import React, { useState } from "react";
import { Formik, Form } from "formik";
import { MyTextInput } from "../services/web/inputServices";
import { login } from "../services/web/webServices";
import { Store } from "react-notifications-component";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { Button } from "react-bootstrap";
export default function Login() {
  const navigate = useNavigate();
  const [getbutton, setbutton] = useState(false);
  const css = `
    /* Importing fonts from Google */
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800;900&display=swap');

/* Reseting */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: 'Poppins', sans-serif;
}

body {
    background: #ecf0f3;
}

.wrapper {
    max-width: 350px;
    min-height: 500px;
    margin: 80px auto;
    padding: 40px 30px 30px 30px;
    background-color: #ecf0f3;
    border-radius: 15px;
    box-shadow: 13px 13px 20px #cbced1, -13px -13px 20px #fff;
}

.logo {
    width: 80px;
    margin: auto;
}

.logo img {
    width: 100%;
    height: 80px;
    object-fit: cover;
    border-radius: 50%;
    box-shadow: 0px 0px 3px #5f5f5f,
        0px 0px 0px 5px #ecf0f3,
        8px 8px 15px #a7aaa7,
        -8px -8px 15px #fff;
}

.wrapper .name {
    font-weight: 600;
    font-size: 1.4rem;
    letter-spacing: 1.3px;
    padding-left: 10px;
    color: #555;
}

.wrapper .form-field input {
    width: 100%;
    display: block;
    border: none;
    outline: none;
    background: none;
    font-size: 1.2rem;
    color: #666;
    padding: 10px 15px 10px 10px;
    /* border: 1px solid red; */
}

.wrapper .form-field {
    padding-left: 10px;
    margin-bottom: 20px;
    border-radius: 20px;
    box-shadow: inset 8px 8px 8px #cbced1, inset -8px -8px 8px #fff;
}

.wrapper .form-field .fas {
    color: #555;
}

.wrapper .btn {
    box-shadow: none;
    width: 100%;
    height: 40px;
    background-color: #03A9F4;
    color: #fff;
    border-radius: 25px;
    box-shadow: 3px 3px 3px #b1b1b1,
        -3px -3px 3px #fff;
    letter-spacing: 1.3px;
}

.wrapper .btn:hover {
    background-color: #039BE5;
    color:black;
}

.wrapper a {
    text-decoration: none;
    font-size: 0.8rem;
    color: #03A9F4;
}

.wrapper a:hover {
    color: #039BE5;
}
.user-box input:-webkit-autofill {
    transition: background-color 600000s 0s, color 600000s 0s;
}

@media(max-width: 380px) {
    .wrapper {
        margin: 30px 20px;
        padding: 40px 15px 15px 15px;
    }
}`;
  return (
    <>
      { }
      <style>{css}</style>
      <div className="wrapper">
        <div className="logo">
          <img src="images/logo.png" alt="" />
        </div>
        <div className="text-center mt-4 name">Ethuta</div>
        <Formik
          initialValues={{
            admin_email: "",
            admin_password: "",
          }}
          validationSchema={Yup.object({
            admin_email: Yup.string().email("Invalid email address"),
            admin_password: Yup.string().min(
              8,
              "Password is too short - should be 8 chars minimum."
            ),
          })}
          onSubmit={(values, { resetForm }) => {
            setbutton(true);

            login(values)
              .then((res) => {
                // setButton(true);
                console.log("Res=====>", res);
                Store.addNotification({
                  title: "Success",
                  message: res?.data?.message,
                  type: "success",
                  insert: "top",
                  container: "top-right",
                  animationIn: ["animate__animated", "animate__fadeIn"],
                  animationOut: ["animate__animated", "animate__fadeOut"],
                  dismiss: {
                    duration: 5000,
                    onScreen: true,
                  },
                });
                resetForm({ values: "" });
                localStorage.setItem(
                  "auth_token",
                  res?.data?.response?.authToken
                );
                navigate("/home");
                setbutton(false);
              })
              .catch((err) => { 
                if (err) {

                  Store.addNotification({
                    title: "Error!",
                    message: err?.response?.data?.message,
                    type: "danger",
                    insert: "top",
                    container: "top-right",
                    animationIn: ["animate__animated", "animate__fadeIn"],
                    animationOut: ["animate__animated", "animate__fadeOut"],
                    dismiss: {
                      duration: 5000,
                      onScreen: true,
                    },
                  });
                  setbutton(false);
                }

              });
          }}
        >
          <Form className="p-3 mt-3">
            <div className="form-field d-flex align-items-center user-box">
              <span className="far fa-user"></span>
              <MyTextInput
                type="email"
                name="admin_email"
                id="userName"
                placeholder="Username"
              />
            </div>
            <div className="form-field d-flex align-items-center user-box">
              <span className="fas fa-key"></span>
              <MyTextInput
                type="password"
                name="admin_password"
                id="pwd"
                placeholder="Password"
              />
            </div>
           
            {!getbutton ?  <button className="btn mt-3" type="submit">
              Login
            </button>: <Button variant="contained" style={{ backgroundColor: 'blue', color: "white" }} disabled>Wait Please!</Button>}
          </Form>
        </Formik>
        {/* <div className="text-center fs-6">
            <a href="#">Forget password?</a> or <a href="#">Sign up</a>
        </div> */}
      </div>
    </>
  );
}
