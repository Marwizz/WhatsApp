import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Card, Col, Container, Label, Row } from "reactstrap";
import { Form, Button, Input, Tooltip } from "antd";
import AuthSlider from "../../AuthenticationInner/authCarousel";
import { createLoginHistory } from "../../../functions/SuperAdmin/LoginHistory";

import ButtonComponent from "./SwitchLogin";

const initialState = {
  email: "",
  password: "",
};
const LoginUserCover = (props) => {
  const { year, version, handleButtonClick } = props;

  const [loginUser, setLoginUser] = useState({});
  const [IP, setIP] = useState();

  const [values, setValues] = useState(initialState);
  const [formErrors, setFormErrors] = useState({});

  const { email, password } = values;

  const [showPassword, setShowPassword] = useState(false);
  // const [version, setVersion] = useState();
  // const [year ,setYear] = useState();

  let navigate = useNavigate();
  const dispatch = useDispatch();

  // const { user } = useSelector((state) => ({ ...state }));

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  // const [err, setErr] = useState(false);
  const [isSubmit, setIsSubmit] = useState(false);

  // useEffect(() => {
  //   isSubmit && findIP();
  //   isSubmit && createHistory(loginUser, IP);
  // }, [isSubmit]);

  // const loadVersion = () => {
  //   getActiveVersion().then((res) => {
  //     console.log(res);
  //     setVersion(res.VersionNo);
  //     setYear(res.year);

  //   });
  // };

  const login = () => {
    setIsSubmit(true);
    setFormErrors(validate(values));

    axios
      .post(`${process.env.REACT_APP_API_URL_MARWIZ}/api/login`, values)
      .then((res) => {
        console.log(res);
        setLoginUser(res.user);
        setIsSubmit(true);

        localStorage.setItem("user", res.user._id);
        localStorage.setItem("adminToken", res.token);
        // dispatch({
        //   type: "LOGGED_IN",
        //   payload: {
        //     user: res.user,
        //   },
        // });

        createHistory(res.user);
        // window.location.replace("/landing");
        window.location.replace("/dashboard");
        // navigate("/dashboard");
      })
      .catch((err) => {
        console.log(err);

        toast.error("Authentication failed!");
      });
  };

  // const findIP = () => {
  //   fetch(
  //     "https://geolocation-db.com/json/0f761a30-fe14-11e9-b59f-e53803842572"
  //   )
  //     .then((response) => response.json())
  //     .then((data) => {
  //       setIP(data.IPv4);
  //       console.log(data.IPv4);
  //     });
  // };

  const createHistory = (loginUser) => {
    console.log("login history value", loginUser);
    let id = loginUser._id;
    let username = loginUser.UserName;
    console.log(id, username);
    createLoginHistory(id, username).then((res) => {
      console.log(res);
    });
  };

  const [errEmail, seterrEmail] = useState(false);
  const [errPassword, setErrPassword] = useState(false);
  const validate = (values) => {
    const errors = {};
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (values.email === "") {
      errors.email = "email is required!";
      // toast.error("Email is required!")
      seterrEmail(true);
    } else if (!regex.test(values.email)) {
      errors.email = "invalid email address!";
      seterrEmail(true);
    } else {
      seterrEmail(false);
    }
    if (values.password === "") {
      errors.password = "password is required!";
      // toast.error("Password is required!")
      setErrPassword(true);
    }
    if (values.password !== "") {
      setErrPassword(false);
    }
    return errors;
  };
  const validClassEmail =
    errEmail && isSubmit ? "form-control is-invalid" : "form-control";
  const validClassPassword =
    errPassword && isSubmit ? "form-control is-invalid" : "form-control pe-5";

  document.title = "SignIn | ZIYA";
  return (
    <React.Fragment>
      <ToastContainer />

      <div className="auth-page-wrapper auth-bg-cover py-5 d-flex justify-content-center align-items-center min-vh-100">
        <div className="bg-overlay"></div>
        <div className="auth-page-content overflow-hidden pt-lg-5">
          <Container>
            <Row>
              <Col lg={12}>
                <Card className="overflow-hidden">
                  <Row className="g-0">
                    <AuthSlider />

                    <Col lg={6}>
                      <div className="p-lg-5 p-4">
                        <div>
                          <h5 className="text-primary">Sign In</h5>
                          <p className="text-muted">
                            Welcome! Sign in with email to access Ziya.
                          </p>
                        </div>

                        <div className="mt-4">
                          <form>
                            <div className="mb-3">
                              <Label htmlFor="email" className="form-label">
                                Email
                              </Label>
                              <Input
                                name="email"
                                className={validClassEmail}
                                placeholder="Enter email"
                                type="email"
                                onChange={handleChange}
                                // onBlur={validation.handleBlur}
                                value={email}
                              />
                              {/* //validation */}
                              {isSubmit && (
                                <p className="text-danger">
                                  {formErrors.email}
                                </p>
                              )}
                            </div>

                            <div className="mb-3">
                              {/* <div className="float-end">
                                <p
                                  className="text-muted mb-0 cursor-pointer"
                                  onClick={() => handleButtonClick("4")}
                                >
                                  Forgot password?
                                </p>
                              </div> */}
                              <Label
                                className="form-label"
                                htmlFor="password-input"
                              >
                                Password
                              </Label>
                              <div className="position-relative auth-pass-inputgroup mb-3">
                                <Input
                                  name="password"
                                  value={password}
                                  type={showPassword ? "text" : "password"}
                                  className={validClassPassword}
                                  placeholder="Enter Password"
                                  onChange={handleChange}
                                  // onBlur={validation.handleBlur}
                                />
                                {/* validation */}
                                {isSubmit && (
                                  <p className="text-danger">
                                    {formErrors.password}
                                  </p>
                                )}
                                <button
                                  className="btn btn-link position-absolute end-0 top-0 text-decoration-none text-muted"
                                  type="button"
                                  id="password-addon"
                                  onClick={() => setShowPassword(!showPassword)}
                                >
                                  {showPassword ? (
                                    <i class="ri-eye-off-fill  align-middle"></i>
                                  ) : (
                                    <i className="ri-eye-fill align-middle"></i>
                                  )}
                                </button>
                              </div>
                            </div>

                            <div className="mb-4">
                              <p className="mb-0 fs-12 text-muted fst-italic">
                                By login you agree to the Ziya &nbsp;
                                <span
                                  style={{ cursor: "pointer" }}
                                  className=" text-primary text-decoration-underline fst-normal fw-medium "
                                  onClick={() => handleButtonClick("5")}
                                >
                                  Terms of Use
                                </span>
                              </p>
                            </div>
                            <div>
                              <Row>
                                <button
                                  type="button"
                                  className="btn  btn-success "
                                  onClick={login}
                                >
                                  {/* <i class="ri-whatsapp-line label-icon align-middle rounded-pill fs-16 me-2 "></i> */}
                                  Sign in
                                </button>
                              </Row>
                            </div>
                            {/* small buttons */}
                            {/* <ButtonComponent /> */}

                            <div className="mt-3">
                              <Row>
                                <Col lg={4}>
                                  <Row className="m-1">
                                    <button
                                      type="button"
                                      class="btn btn-primary btn-label waves-effect waves-light rounded-pill active"
                                      onClick={() =>
                                        handleButtonClick("loginPage")
                                      }
                                    >
                                      <i class="ri-mail-fill label-icon align-middle rounded-pill fs-16 me-2"></i>{" "}
                                      Email
                                    </button>
                                  </Row>
                                </Col>
                                <Col lg={4}>
                                  <Row className="m-1">
                                    <button
                                      onClick={() => handleButtonClick("2")}
                                      type="button"
                                      class="btn btn-danger btn-label waves-effect waves-light rounded-pill"
                                    >
                                      <i class="ri-phone-lock-fill label-icon align-middle rounded-pill fs-16 me-2"></i>{" "}
                                      OTP
                                    </button>
                                  </Row>
                                </Col>

                                <Col lg={4}>
                                  <Row className="m-1">
                                    <button
                                      onClick={() => handleButtonClick("3")}
                                      type="button"
                                      class="btn btn-success btn-label waves-effect waves-light rounded-pill active"
                                    >
                                      <i class="ri-whatsapp-line label-icon align-middle rounded-pill fs-16 me-2 "></i>
                                      WhatsApp
                                    </button>
                                  </Row>
                                </Col>
                              </Row>
                            </div>

                            <div>
                              <Row>
                                <Col lg={12}>
                                  <div className="text-end fw-bold  text-primary mt-4 ">
                                    Version: {version}
                                  </div>
                                </Col>
                              </Row>
                            </div>
                          </form>
                        </div>
                      </div>
                    </Col>
                  </Row>
                </Card>
              </Col>
            </Row>
          </Container>
        </div>

        <footer className="footer">
          <Container>
            <Row>
              <Col lg={12}>
                <div className="text-center">
                  <p className="mb-0">&copy; {year} | BarodaWeb: The e-Catalogue Designer </p>
                </div>
              </Col>
            </Row>
          </Container>
        </footer>
      </div>
    </React.Fragment>
  );
};

export default LoginUserCover;
