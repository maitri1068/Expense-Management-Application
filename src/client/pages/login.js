import React, { useState, useEffect } from "react";
import {
  TextField,
  FormControl,
  InputAdornment,
  InputLabel,
  IconButton,
  Container,
  OutlinedInput,
  Button,
  FormLabel,
  Typography,
  Select,
  MenuItem,
} from "@mui/material";
import { VisibilityOff, Visibility, Label } from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { string, number } from "yup";
import { useDispatch, useSelector } from "react-redux";
import { setdata } from "../store/store";
import axios from "axios";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Unstable_Grid2";
import { purple } from "@mui/material/colors";
import login from "../assets/login.png";
import "./login.css";
import jsonData from "../assets/currencies.json";

export default function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [error, seterror] = useState();

  const [seconds, setSeconds] = useState(30);
  const [showPassword, setShowPassword] = useState(false);
  let timer;

  useEffect(() => {
    localStorage.setItem("form", JSON.stringify(1));
  }, []);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleloginform = async (data) => {
    try {
      const i = await axios.post("http://localhost:1010/login", data);

      if (i.data === "you don't have account please signup first") {
        formik.values.userName = "";
        formik.values.password = "";
        seterror("you don't have account please signup first");
      } else if (i.data === "password incorrect") {
        seterror("password incorrect");
        formik.values.password = "";
      } else if (i.status === 201) {
        try {
          localStorage.setItem("isloggedin", JSON.stringify(true));
          localStorage.removeItem("latestIncome");
          localStorage.removeItem("latestExpense");
          const now = new Date();
          const item = {
            value: i.data,
            expiry: now.getTime() + 3600 * 8000,
          };
          localStorage.setItem("token", JSON.stringify(item));
          const d = await axios.post("http://localhost:1010/loginn", data);
          localStorage.setItem("user", JSON.stringify([d.data[0]]));
          dispatch(setdata({ userinfo: d.data[0] }));
        } catch (error) {
          console.log(error);
        }

        navigate("/");
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleragistrationform = async (data) => {
    try {
      const i = await axios.post("http://localhost:1010/finduser", data);

      if (i.status === 201) {
        try {
          const otp = await axios.post(
            "http://localhost:1010/varifymail",
            data
          );

          localStorage.setItem("regotp", JSON.stringify(otp.data));
          timer = setInterval(() => {
            setSeconds((prevSeconds) => prevSeconds - 1);
          }, 1000);
          localStorage.setItem("userinfo", JSON.stringify(data));
          localStorage.setItem("form", JSON.stringify(6));
          // dispatch(setdata({ form: 6 }));
        } catch (error) {
          console.log(error);
        }
      } else {
        // console.log(i.data);
        if (i.data === "user already exist with this username") {
          seterror(
            "user already exist with this username please use another username or sign-in"
          );
          // dispatch(setdata({ form: 1 }));
        } else if (i.data === "user already have account with this email") {
          seterror(
            "user already have account with this email please use another email or sign-in"
          );
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  // generate password reset otp
  const handleotp = async (data) => {
    try {
      console.log("email", data);
      const i = await axios.post("http://localhost:1010/passwordreset", data);
      if (i.data === "user doesn't exist") {
        formik.values.email = "";
        seterror("user doesn't exist please enter correct email");
      } else {
        localStorage.setItem("otp", JSON.stringify(i.data));
        console.log(i.data);
        localStorage.setItem("id", JSON.stringify(i.data.id));
        // dispatch(setdata({ form: 4 }));
        localStorage.setItem("form", JSON.stringify(4));
        timer = setInterval(() => {
          setSeconds((prevSeconds) => prevSeconds - 1);
        }, 1000);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (seconds === 0) {
      clearInterval(timer);
      localStorage.removeItem("otp");
      localStorage.removeItem("regotp");
    }
  }, [seconds]);

  // check password reset otp
  const checkotp = (data) => {
    console.log("check", data.otp);
    const op = JSON.parse(localStorage.getItem("otp"));
    console.log("op");
    if (op) {
      if (data.otp == op.otp) {
        localStorage.removeItem("otp");
        // dispatch(setdata({ form: 5 }));
        localStorage.setItem("form", JSON.stringify(5));
      } else {
        seterror("please enter correct otp");
      }
    } else {
      seterror("please get new otp");
    }
  };

  //update password
  const updatepassword = async (data) => {
    console.log(data);
    const user = JSON.parse(localStorage.getItem("id"));
    console.log("user", user);
    try {
      const i = axios.patch("http://localhost:1010/updatepassword", {
        password: data.password,
        id: user,
      });
      console.log("i", i);
      // dispatch(setdata({ form: 1 }));
      localStorage.setItem("form", JSON.stringify(1));
      formik.values["password"] = "";

      console.log(i);
    } catch (error) {
      console.log(error);
    }
  };

  //check registration otp
  const handleregotp = async (data) => {
    const op = JSON.parse(localStorage.getItem("regotp"));
    if (op) {
      const userinfo = JSON.parse(localStorage.getItem("userinfo"));
      console.log("userinfo", userinfo);
      console.log(op.otp);
      if (data.regotp == op.otp) {
        try {
          const i = await axios.post("http://localhost:1010/user", userinfo);
          console.log(i.status);
          if (i.status === 201) {
            // dispatch(setdata({ form: 1 }));
            localStorage.setItem("form", JSON.stringify(1));
            localStorage.removeItem("regotp");
            localStorage.removeItem("userinfo");
          }
          if (i.data === "user already have account") {
            seterror("user already have account");
            // dispatch(setdata({ form: 1 }));
            localStorage.setItem("form", JSON.stringify(1));
          } else if (i.data === "user already have account with this email") {
            seterror(
              "user already have account with this email please use another email or sign-in"
            );
          }
        } catch (err) {
          console.log(err);
        }
      } else {
        seterror("please enter correct otp");
      }
    } else {
      seterror("please get new otp");
    }
  };
  const ragistrationinitialValues = {
    userName: "",
    email: "",
    mobileNum: "",
    password: "",
    confpassword: "",
    Currancy: "",
  };
  const logininitialValues = {
    userName: "",
    password: "",
  };

  const ragistrationvalidationSchema = {
    userName: string().required("userName is required"),
    email: string().required("email is required").email(),
    mobileNum: number()
      .typeError("That doesn't look like a phone number")
      .positive("A phone number can't start with a minus")
      .integer("A phone number can't include a decimal point")
      .test(10, "plz check number", (val) => {
        if (val) return val.toString().length === 10;
      })
      .required("A phone number is required"),
    password: string()
      .required("Password is required")
      .min(4, "Password must be at least 4 characters long")
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
      ),
    confpassword: string()
      .required("confpassword is required")
      .oneOf([Yup.ref("password")], "Passwords must match"),
    Currancy: string().required("Currancy required"),
  };

  const loginvalidationSchema = {
    userName: string().required("userName is required"),
    // lpassword:string()
    password: string()
      .required("Password is required")
      .min(4, "Password must be at least 4 characters long")
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
      ),
  };

  const emailinitialValues = {
    email: "",
  };
  const emailvalidationSchema = {
    email: string().required("email is required").email(),
  };

  const otpinitialValues = {
    otp: "",
  };

  const otpvalidationSchema = {
    otp: number()
      .typeError("That doesn't look like otp")
      .positive("A otp can't start with a minus")
      .integer("A otp can't include a decimal point")
      .test(6, "plz check number", (val) => {
        if (val) return val.toString().length === 6;
      })
      .required("A otp is required"),
  };

  const regotpinitialValues = {
    regotp: "",
  };

  const regotpvalidationSchema = {
    regotp: number()
      .typeError("That doesn't look like otp")
      .positive("A otp can't start with a minus")
      .integer("A otp can't include a decimal point")
      .test(6, "plz check number", (val) => {
        if (val) return val.toString().length === 6;
      })
      .required("A otp is required"),
  };

  const resetpasswordinitialValues = {
    password: "",
    confpassword: "",
  };
  const resetpasswordvalidationSchema = {
    password: string()
      .required("Password is required")
      .min(4, "Password must be at least 4 characters long")
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
      ),
    confpassword: string()
      .required("confpassword is required")
      .oneOf([Yup.ref("password")], "Passwords must match"),
  };

  const formik = useFormik({
    initialValues:
      JSON.parse(localStorage.getItem("form")) === 1
        ? logininitialValues
        : JSON.parse(localStorage.getItem("form")) === 2
        ? ragistrationinitialValues
        : JSON.parse(localStorage.getItem("form")) === 3
        ? emailinitialValues
        : JSON.parse(localStorage.getItem("form")) === 4
        ? otpinitialValues
        : JSON.parse(localStorage.getItem("form")) === 5
        ? resetpasswordinitialValues
        : JSON.parse(localStorage.getItem("form")) === 6
        ? regotpinitialValues
        : null,
    validationSchema: Yup.object(
      JSON.parse(localStorage.getItem("form")) === 1
        ? loginvalidationSchema
        : JSON.parse(localStorage.getItem("form")) === 2
        ? ragistrationvalidationSchema
        : JSON.parse(localStorage.getItem("form")) === 3
        ? emailvalidationSchema
        : JSON.parse(localStorage.getItem("form")) === 4
        ? otpvalidationSchema
        : JSON.parse(localStorage.getItem("form")) === 5
        ? resetpasswordvalidationSchema
        : JSON.parse(localStorage.getItem("form")) === 6
        ? regotpvalidationSchema
        : null
    ),
    onSubmit: (values, { resetForm }) => {
      values = Object.fromEntries(
        Object.entries(values).filter(
          ([key, value]) => value !== "" && value !== undefined
        )
      );
      console.log(values);
      switch (JSON.parse(localStorage.getItem("form"))) {
        case 1:
          handleloginform(values);
          break;
        case 2:
          if (values.password === values.confpassword) {
            handleragistrationform(values);
          } else {
            alert("confirm password not matched");
          }

          break;
        case 3:
          handleotp(values);
          break;
        case 4:
          checkotp(values);
          break;
        case 5:
          updatepassword(values);
          break;
        case 6:
          handleregotp(values);
          break;
        default:
      }
    },
  });

  async function handleresetotp() {
    formik.values.otp = "";
    try {
      setSeconds(30);
      const email = formik.values["email"];

      if (JSON.parse(localStorage.getItem("form")) === 6) {
        const i = await axios.post("http://localhost:1010/varifymail", {
          email: email,
        });
        localStorage.setItem("regotp", JSON.stringify(i.data));
      } else {
        const i = await axios.post("http://localhost:1010/passwordreset", {
          email: email,
        });
        localStorage.setItem("otp", JSON.stringify(i.data));
      }
    } catch (error) {}
  }

  useEffect(() => {
    formik.setErrors({});
    formik.setTouched({});

    switch (JSON.parse(localStorage.getItem("form"))) {
      case 1:
        settouched({
          userName: false,
          password: false,
        });
        break;
      case 2:
        settouched({
          userName: false,
          password: false,
          email: false,
          mobileNum: false,
          Currancy: false,
          confpassword: false,
        });
        console.log(formik.touched["email"]);
        break;
      case 3:
        settouched({
          email: false,
        });

        break;
      case 4:
        settouched({
          otp: false,
        });

        break;
      case 5:
        settouched({
          password: false,
          confpassword: false,
        });
        break;
      case 6:
        settouched({
          regotp: false,
        });
        break;
      default:
    }
    // console.log("hello", formik.errors, formik.touched);
  }, [JSON.parse(localStorage.getItem("form"))]);

  const [touch, settouched] = useState({
    userName: false,
    password: false,
  });
  function handletouched() {
    switch (JSON.parse(localStorage.getItem("form"))) {
      case 1:
        settouched({
          userName: true,
          password: true,
        });
        break;
      case 2:
        settouched({
          userName: true,
          password: true,
          email: true,
          mobileNum: true,
          Currancy: true,
          confpassword: true,
        });
        // console.log(formik.touched["email"]);
        break;
      case 3:
        settouched({
          email: true,
        });

        break;
      case 4:
        settouched({
          otp: true,
        });

        break;
      case 5:
        settouched({
          password: true,
          confpassword: true,
        });
        break;
      case 6:
        settouched({
          regotp: true,
        });
        break;
      default:
    }
  }

  return (
    <Box container className="bodyy" sx={{ minHeight: 695 }}>
      <Grid
        container
        sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
      >
        <Grid
          item
          xs={12}
          sm={12}
          md={7}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Box className="shapee">
            {" "}
            <Box container sx={{ textAlign: "center", mt: 10 }}>
              {" "}
              <img src={login}></img>
            </Box>
          </Box>
        </Grid>
        <Grid item xs={12} sm={12} md={5}>
          <Box
            container
            sx={{
              display: "flex-col",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Container>
              <Typography
                sx={{
                  color: purple[50],
                  fontWeight: "bold",
                  fontSize: 30,
                  textAlign: "center",
                }}
              >
                {JSON.parse(localStorage.getItem("form")) === 1
                  ? "Login"
                  : JSON.parse(localStorage.getItem("form")) === 2
                  ? "Registration"
                  : JSON.parse(localStorage.getItem("form")) === 3
                  ? "Password assistance"
                  : JSON.parse(localStorage.getItem("form")) === 4
                  ? "Verification required"
                  : JSON.parse(localStorage.getItem("form")) === 5
                  ? "Create New Password"
                  : JSON.parse(localStorage.getItem("form")) === 6
                  ? "Verification required"
                  : null}
              </Typography>
            </Container>
            <Container
              className="form"
              sx={{ p: 2, width: 500, border: 1, mt: 1, borderRadius: 5 }}
            >
              <form onSubmit={formik.handleSubmit}>
                {JSON.parse(localStorage.getItem("form")) === 1 ? (
                  <>
                    <FormControl variant="outlined" fullWidth>
                      <InputLabel htmlFor="outlined-adornment-username">
                        Username
                      </InputLabel>

                      <OutlinedInput
                        id="outlined-adornment-username"
                        type="text"
                        label="userName"
                        name="userName"
                        value={formik.values["userName"]}
                        onChange={formik.handleChange}
                        sx={{ backgroundColor: purple[50] }}
                        onBlur={formik.handleBlur}
                        onFocus={() => {
                          seterror("");
                        }}
                      />
                    </FormControl>
                    {touch["userName"] && !formik.touched["userName"] && (
                      <div style={{ color: "red" }}>
                        {formik.errors["userName"]}
                      </div>
                    )}
                    {formik.touched["userName"] &&
                      formik.errors["userName"] && (
                        <div style={{ color: "red" }}>
                          {formik.errors["userName"]}
                        </div>
                      )}
                    <FormControl sx={{ mt: 2 }} variant="outlined" fullWidth>
                      <InputLabel htmlFor="outlined-adornment-lpassword">
                        Password
                      </InputLabel>
                      <OutlinedInput
                        id="outlined-adornment-lpassword"
                        type={showPassword ? "text" : "password"}
                        endAdornment={
                          <InputAdornment position="end">
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={handleClickShowPassword}
                              onMouseDown={handleMouseDownPassword}
                              edge="end"
                            >
                              {showPassword ? (
                                <VisibilityOff />
                              ) : (
                                <Visibility />
                              )}
                            </IconButton>
                          </InputAdornment>
                        }
                        label="Password"
                        name="password"
                        value={formik.values.password}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        sx={{ backgroundColor: purple[50] }}
                        onFocus={() => {
                          seterror("");
                        }}
                      />{" "}
                    </FormControl>{" "}
                    {touch["password"] && !formik.touched["password"] && (
                      <div style={{ color: "red" }}>
                        {formik.errors["password"]}
                      </div>
                    )}
                    {formik.touched["password"] &&
                      formik.errors["password"] && (
                        <div style={{ color: "red" }}>
                          {/* {formik.errors['lpassword']} */}
                          {formik.errors["password"]}
                        </div>
                      )}
                    {error && <div style={{ color: "red" }}>{error}</div>}
                    <FormLabel sx={{ display: "flex", mt: 1 }}>
                      <Link
                        onClick={() => {
                          seterror("");
                          localStorage.setItem("form", JSON.stringify(3));
                          // dispatch(setdata({ form: 3 }));
                        }}
                      >
                        Forgot Password?
                      </Link>
                    </FormLabel>
                  </>
                ) : JSON.parse(localStorage.getItem("form")) === 2 ? (
                  <>
                    <FormControl variant="outlined" fullWidth>
                      <InputLabel htmlFor="outlined-adornment-username">
                        Username
                      </InputLabel>

                      <OutlinedInput
                        id="outlined-adornment-username"
                        type="text"
                        label="userName"
                        name="userName"
                        value={formik.values["userName"]}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        sx={{ backgroundColor: purple[50] }}
                        onFocus={() => {
                          seterror("");
                        }}
                      />
                    </FormControl>
                    {touch["userName"] && !formik.touched["userName"] && (
                      <div style={{ color: "red" }}>
                        {formik.errors["userName"]}
                      </div>
                    )}
                    {formik.touched["userName"] &&
                      formik.errors["userName"] && (
                        <div style={{ color: "red" }}>
                          {formik.errors["userName"]}
                        </div>
                      )}
                    <FormControl sx={{ mt: 2 }} variant="outlined" fullWidth>
                      <InputLabel htmlFor="outlined-adornment-email">
                        Email
                      </InputLabel>
                      <OutlinedInput
                        id="outlined-adornment-email"
                        type="email"
                        label="Email"
                        name="email"
                        value={formik.values.email}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        sx={{ backgroundColor: purple[50] }}
                        onFocus={() => {
                          seterror("");
                        }}
                      />
                    </FormControl>
                    {/* {console.log(
                      formik.touched["email"],
                      formik.errors["email"]
                    )} */}
                    {touch["email"] && !formik.touched["email"] && (
                      <div style={{ color: "red" }}>
                        {formik.errors["email"]}
                      </div>
                    )}
                    {formik.touched["email"] && formik.errors["email"] && (
                      <div style={{ color: "red" }}>
                        {formik.errors["email"]}
                      </div>
                    )}
                    <TextField
                      type="text"
                      label="MobileNum"
                      fullWidth
                      margin="normal"
                      id="mobileNum"
                      name="mobileNum"
                      value={formik.values["mobileNum"]}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      sx={{ backgroundColor: purple[50] }}
                      onFocus={() => {
                        seterror("");
                      }}
                    />
                    {touch["mobileNum"] && !formik.touched["mobileNum"] && (
                      <div style={{ color: "red" }}>
                        {formik.errors["mobileNum"]}
                      </div>
                    )}
                    {formik.errors["mobileNum"] &&
                      formik.touched["mobileNum"] && (
                        <div style={{ color: "red" }}>
                          {formik.errors["mobileNum"]}
                        </div>
                      )}
                    <FormControl fullWidth>
                      <InputLabel id="demo-simple-select-label">
                        Currancy
                      </InputLabel>
                      <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        name="Currancy"
                        value={formik.values["Currancy"]}
                        label="Currancy"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        sx={{ backgroundColor: purple[50] }}
                        onFocus={() => {
                          seterror("");
                        }}
                      >
                        <MenuItem value="" disabled>
                          Select Currancy
                        </MenuItem>
                        {/* {console.log(jsonData)} */}
                        {jsonData?.map((obj) => (
                          //  console.log(obj.name)
                          <MenuItem value={obj.name}>{obj.name}</MenuItem>
                        ))}
                      </Select>
                      {touch["Currancy"] && !formik.touched["Currancy"] && (
                        <div style={{ color: "red" }}>
                          {formik.errors["Currancy"]}
                        </div>
                      )}
                      {formik.touched["Currancy"] &&
                        formik.errors["Currancy"] && (
                          <div style={{ color: "red" }}>
                            {formik.errors["Currancy"]}
                          </div>
                        )}
                    </FormControl>
                    <FormControl sx={{ mt: 2 }} variant="outlined" fullWidth>
                      <InputLabel htmlFor="outlined-adornment-password">
                        {" "}
                        Password
                      </InputLabel>
                      <OutlinedInput
                        id="outlined-adornment-password"
                        type="password"
                        label="Password"
                        name="password"
                        inputRef={formik.getFieldProps("password").ref}
                        value={formik.values.password}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        sx={{ backgroundColor: purple[50] }}
                        onFocus={() => {
                          seterror("");
                        }}
                      />
                    </FormControl>
                    {touch["password"] && !formik.touched["password"] && (
                      <div style={{ color: "red" }}>
                        {formik.errors["password"]}
                      </div>
                    )}
                    {formik.touched["password"] &&
                      formik.errors["password"] && (
                        <div style={{ color: "red" }}>
                          {formik.errors["password"]}
                        </div>
                      )}
                    <FormControl sx={{ mt: 2 }} variant="outlined" fullWidth>
                      <InputLabel htmlFor="outlined-adornment-confpassword">
                        Confirm Password
                      </InputLabel>
                      <OutlinedInput
                        id="outlined-adornment-confpassword"
                        type="password"
                        label="confPassword"
                        name="confpassword"
                        value={formik.values.confpassword}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        sx={{ backgroundColor: purple[50] }}
                        onFocus={() => {
                          seterror("");
                        }}
                      />
                    </FormControl>
                    {touch["confpassword"] &&
                      !formik.touched["confpassword"] && (
                        <div style={{ color: "red" }}>
                          {formik.errors["confpassword"]}
                        </div>
                      )}
                    {formik.touched["confpassword"] &&
                      formik.errors["confpassword"] && (
                        <>
                          {" "}
                          <div style={{ color: "red" }}>
                            {formik.errors["confpassword"]}
                          </div>
                          <div style={{ color: "red" }}>
                            {formik.values.password === formik.values.confpass}
                          </div>
                        </>
                      )}
                    {error && <div style={{ color: "red" }}>{error}</div>}
                  </>
                ) : JSON.parse(localStorage.getItem("form")) === 3 ? (
                  <>
                    <Typography>
                      Enter the email address associated with this account.
                    </Typography>
                    <FormControl sx={{ mt: 2 }} variant="outlined" fullWidth>
                      <InputLabel htmlFor="outlined-adornment-email">
                        Enter Email
                      </InputLabel>
                      <OutlinedInput
                        id="outlined-adornment-email"
                        type="email"
                        label="Email"
                        name="email"
                        value={formik.values.email}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        sx={{ backgroundColor: purple[50] }}
                        onFocus={() => {
                          seterror("");
                        }}
                      />
                    </FormControl>
                    {touch["email"] && !formik.touched["email"] && (
                      <div style={{ color: "red" }}>
                        {formik.errors["email"]}
                      </div>
                    )}
                    {formik.touched["email"] && formik.errors["email"] && (
                      <div style={{ color: "red" }}>
                        {formik.errors["email"]}
                      </div>
                    )}
                    {error && <div style={{ color: "red" }}>{error}</div>}
                  </>
                ) : JSON.parse(localStorage.getItem("form")) === 4 ? (
                  <>
                    <Typography>
                      To continue, complete this verification step. We've sent
                      an OTP to the mail {formik.values["email"]}. Please enter
                      it below to complete verification.
                    </Typography>
                    <TextField
                      type="number"
                      label="otp"
                      fullWidth
                      margin="normal"
                      id="otp"
                      name="otp"
                      value={formik.values["otp"]}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      sx={{ backgroundColor: purple[50] }}
                      onFocus={() => {
                        seterror("");
                      }}
                    />
                    <Box>
                      <Grid container>
                        <Grid item md={9}>
                          <Typography>
                            Time remaining {seconds >= 0 ? seconds : 0} sec{" "}
                          </Typography>
                        </Grid>
                        <Grid item md={3}>
                          {seconds <= 0 && (
                            <Link onClick={handleresetotp}>Resend OTP?</Link>
                          )}
                        </Grid>
                      </Grid>
                    </Box>
                    {touch["otp"] && !formik.touched["otp"] && (
                      <div style={{ color: "red" }}>{formik.errors["otp"]}</div>
                    )}
                    {formik.touched["otp"] && formik.errors["otp"] && (
                      <div style={{ color: "red" }}>{formik.errors["otp"]}</div>
                    )}
                    {error && <div style={{ color: "red" }}>{error}</div>}
                  </>
                ) : JSON.parse(localStorage.getItem("form")) === 5 ? (
                  <>
                    <Typography>
                      We'll ask for this password whenever you sign in.
                    </Typography>
                    <FormControl sx={{ mt: 2 }} variant="outlined" fullWidth>
                      <InputLabel htmlFor="outlined-adornment-password">
                        {" "}
                        Password
                      </InputLabel>
                      <OutlinedInput
                        id="outlined-adornment-password"
                        type="password"
                        label="New Password"
                        name="password"
                        inputRef={formik.getFieldProps("password").ref}
                        value={formik.values.password}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        sx={{ backgroundColor: purple[50] }}
                      />
                    </FormControl>
                    {touch["password"] && !formik.touched["password"] && (
                      <div style={{ color: "red" }}>
                        {formik.errors["password"]}
                      </div>
                    )}
                    {formik.touched["password"] &&
                      formik.errors["password"] && (
                        <div style={{ color: "red" }}>
                          {formik.errors["password"]}
                        </div>
                      )}
                    <FormControl sx={{ mt: 2 }} variant="outlined" fullWidth>
                      <InputLabel htmlFor="outlined-adornment-confpassword">
                        Confirm Password
                      </InputLabel>
                      <OutlinedInput
                        id="outlined-adornment-confpassword"
                        type="password"
                        label="confPassword"
                        name="confpassword"
                        value={formik.values.confpassword}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        sx={{ backgroundColor: purple[50] }}
                      />
                    </FormControl>
                    {touch["confpassword"] &&
                      !formik.touched["confpassword"] && (
                        <>
                          {" "}
                          <div style={{ color: "red" }}>
                            {formik.errors["confpassword"]}
                          </div>
                          <div style={{ color: "red" }}>
                            {formik.values.password === formik.values.confpass}
                          </div>
                        </>
                      )}
                    {formik.touched["confpassword"] &&
                      formik.errors["confpassword"] && (
                        <>
                          {" "}
                          <div style={{ color: "red" }}>
                            {formik.errors["confpassword"]}
                          </div>
                          <div style={{ color: "red" }}>
                            {formik.values.password === formik.values.confpass}
                          </div>
                        </>
                      )}
                    {error && <div style={{ color: "red" }}>{error}</div>}
                  </>
                ) : JSON.parse(localStorage.getItem("form")) === 6 ? (
                  <>
                    <Typography>
                      To continue, complete this verification step. We've sent
                      an OTP to the mail {formik.values["email"]}. Please enter
                      it below to complete verification.
                    </Typography>
                    <TextField
                      type="number"
                      label="regotp"
                      fullWidth
                      margin="normal"
                      id="regotp"
                      name="regotp"
                      value={formik.values["regotp"]}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      sx={{ backgroundColor: purple[50] }}
                      onFocus={() => {
                        seterror("");
                      }}
                    />
                    <Box>
                      <Grid container>
                        <Grid item md={9}>
                          <Typography>
                            Time remaining {seconds >= 0 ? seconds : 0} sec{" "}
                          </Typography>
                        </Grid>
                        <Grid item md={3}>
                          {seconds <= 0 && (
                            <Link onClick={handleresetotp}>Resend OTP?</Link>
                          )}
                        </Grid>
                      </Grid>
                    </Box>
                    {touch["regotp"] && !formik.touched["regotp"] && (
                      <div style={{ color: "red" }}>
                        {formik.errors["regotp"]}
                      </div>
                    )}
                    {formik.touched["regotp"] && formik.errors["regotp"] && (
                      <div style={{ color: "red" }}>
                        {formik.errors["regotp"]}
                      </div>
                    )}
                    {error && <div style={{ color: "red" }}>{error}</div>}
                  </>
                ) : null}

                <Button
                  variant="contained"
                  type="submit"
                  sx={{ mt: 1, mb: 1 }}
                  fullWidth
                  onClick={() => {
                    handletouched();
                  }}
                >
                  {JSON.parse(localStorage.getItem("form")) === 1
                    ? "Sign-in"
                    : JSON.parse(localStorage.getItem("form")) === 2
                    ? "Sign-up"
                    : JSON.parse(localStorage.getItem("form")) === 3
                    ? "Continue"
                    : JSON.parse(localStorage.getItem("form")) === 4
                    ? "Continue"
                    : JSON.parse(localStorage.getItem("form")) === 5
                    ? "Save changes and sign-in"
                    : JSON.parse(localStorage.getItem("form")) === 6
                    ? "Continue"
                    : null}
                </Button>
                <br></br>

                {JSON.parse(localStorage.getItem("form")) === 1 ? (
                  <FormLabel>
                    Don't have an account{" "}
                    <Link
                      onClick={() => {
                        localStorage.setItem("form", JSON.stringify(2));
                      }}
                    >
                      Sign-up
                    </Link>
                  </FormLabel>
                ) : JSON.parse(localStorage.getItem("form")) === 2 ? (
                  <FormLabel>
                    Already have an account{" "}
                    <Link
                      onClick={() => {
                        localStorage.setItem("form", JSON.stringify(1));
                      }}
                    >
                      Sign-in
                    </Link>
                  </FormLabel>
                ) : null}
              </form>
            </Container>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
