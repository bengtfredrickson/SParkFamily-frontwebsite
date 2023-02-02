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
  .btn-color{
    background-color: #0e1c36;
    color: #fff;
    
  }
  
  .profile-image-pic{
    height: 200px;
    width: 200px;
    object-fit: contain;
  }
  
  
  
  .cardbody-color{
    background-color: #ebf2fa;
  }
  
  a{
    text-decoration: none;
  }
  `;
  return (
    <>
      { }
      <style>{css}</style>
      <div className="container">
        <div className="row">
          <div className="col-md-6 offset-md-3">
            <h2 className="text-center text-dark mt-5">Admin Login</h2>
            <div className="card my-5">



              {/* <div className="wrapper">
        <div className="logo">
          <img src="images/logo.png" alt="" />
        </div> */}
              {/* <div className="text-center mt-4 name">Ethuta</div> */}
              <Formik
                initialValues={{
                  username: "",
                  password: "",
                }}
                validationSchema={Yup.object({
                  username: Yup.string().email("Invalid email address").required(),
                  password: Yup.string().min(
                    8,
                    "Password is too short - should be 8 chars minimum."
                  ).required(),
                })}
                onSubmit={(values, { resetForm }) => {
                  setbutton(true);

                  login(values)
                    .then((res) => {
                      // setButton(true);
                      // console.log("Res=====>", res);
                      // if (!res.data.result) {
                      //   console.log("err?.result[0]?.data?.message", res?.data?.message)
                      //   Store.addNotification({
                      //     title: "Error!",
                      //     message: res?.data?.message,
                      //     type: "danger",
                      //     insert: "top",
                      //     container: "top-right",
                      //     className: "",
                      //     animationIn: ["animate__animated", "animate__fadeIn"],
                      //     animationOut: ["animate__animated", "animate__fadeOut"],
                      //     dismiss: {
                      //       duration: 5000,
                      //       onScreen: true,
                      //     },
                      //   });
                      //   setbutton(false);
                      // }
                      // else {
                        if(res.data.result){
                          console.log("Res=====>", res);
                          Store.addNotification({
                            title: "Success",
                            message: res?.data?.message,
                            type: "success",
                            insert: "top",
                            container: "top-right",
                            className: "rnc__notification-container--top-right",
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
                            res?.data?.result[0]?.token
                          );
                          navigate("/home");
                          setbutton(false);
                        }
                        else{
                          Store.addNotification({
                            title: "Error!",
                            message: res?.data?.message,
                            type: "danger",
                            insert: "top",
                            container: "top-right",
                            className: "",
                            animationIn: ["animate__animated", "animate__fadeIn"],
                            animationOut: ["animate__animated", "animate__fadeOut"],
                            dismiss: {
                              duration: 5000,
                              onScreen: true,
                            },
                          });
                          setbutton(false);
                        }
                        
                      // }


                    })
                    .catch((err) => {
                      if (err) {
                        Store.addNotification({
                          title: "Error!",
                          message: err?.data?.message,
                          type: "danger",
                          insert: "top",
                          container: "top-right",
                          className: "",
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
                <Form className="card-body cardbody-color p-lg-5">
                  <div className="text-center">
                    <img src="images/splash.png" className="img-fluid profile-image-pic img-thumbnail rounded-circle my-3" width="30px" alt="profile" />
                  </div>
                  <div className="mb-3">
                    <MyTextInput
                      className="form-control"
                      type="email"
                      name="username"
                      id="userName"
                      placeholder="Username"
                    />                  </div>
                  <div className="mb-3">
                    <MyTextInput
                      className="form-control"
                      type="password"
                      name="password"
                      id="pwd"
                      placeholder="Password"
                    />
                  </div>
                  <div className="text-center">
                    {!getbutton ? <button className="btn btn-color px-5 mb-5 w-100" type="submit">
                      Login
                    </button> : <Button className="btn btn-color px-5 mb-5 w-100" variant="contained" style={{ backgroundColor: 'blue', color: "white" }} disabled>Wait Please!</Button>}
                  </div>
                  {/* <div id="emailHelp" className="form-text text-center mb-5 text-dark">Not
                    Registered? <a href="#" className="text-dark fw-bold"> Create an
                      Account</a>
                  </div> */}
                </Form>

              </Formik>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
