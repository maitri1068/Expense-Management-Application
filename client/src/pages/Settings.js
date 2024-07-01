import {Box, InputLabel, MenuItem, OutlinedInput, Select, TextField, Typography,FormControl ,Button } from '@mui/material'
import { useFormik } from 'formik';
import React, { useEffect, useState } from 'react'

import * as Yup from "yup";
import { string, number } from "yup";
import jsonData from "../assets/currencies.json";
import { purple } from '@mui/material/colors';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


export default function Settings() {
    const navigate=useNavigate()
    let user=JSON.parse(localStorage.getItem('user'))[0];
    const [isDisabled,setdisabled]=useState(true)
    const [changepassword,setchangepassword]=useState(false)
    const [open,setopen]=useState(false)
    const ragistrationinitialValues = {
        userName: user.userName,
        email: user.email,
        mobileNum: user.mobileNum,
        Currancy: user.Currancy,
        password:user.password,
        newpassword:user.password,
        confpassword:user.password,
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
      .required("Old Password is required")
     ,
      newpassword: string()
      .required("New Password is required")
      .min(4, "Password must be at least 4 characters long")
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
      ),
    confpassword: string()
      .required("confpassword is required")
      .oneOf([Yup.ref("newpassword")], "Passwords must match"),
    Currancy: string().required("Currancy required"),
  };

  async function handleuserupdate(val){
    const itemString = localStorage.getItem("token");

    const item = JSON.parse(itemString);
    const now = new Date();
    try {
      if (now.getTime() > item.expiry) {
       localStorage.clear()
       localStorage.setItem('form',JSON.stringify(1))
        navigate("/login", { replace: true });
      }
    } catch (error) {
      console.log(error);
    }
    try{
        const i=await axios.patch('http://localhost:1011/updateprofile',{data:val}, {
          headers: {
            authorization: `Bearer ${item.value}`,
          },
        })
        if(i.status === 201){
          localStorage.setItem('user',JSON.stringify([i.data ]))
          setchangepassword(false)
          setdisabled(true)
        }
   
    }
    catch(error){
        console.log(error)
    }
  }

  const formik = useFormik({
    initialValues:
      
         ragistrationinitialValues,
     
    validationSchema: Yup.object().shape( ragistrationvalidationSchema),
    onSubmit: (values) => {
   
     handleuserupdate({...values,_id:user._id})
    },
  });
  
  return (
    <>
     <Box>
     <Typography variant='h5' sx={{m:3,fontWeight:'bold'}}>Settings</Typography>
    <Box container >
<Typography variant='h6' sx={{ml:3,fontWeight:'bold'}}>User Profile <EditRoundedIcon sx={{ml:2}} onClick={()=>{setdisabled(false)
    setopen(true)}}></EditRoundedIcon></Typography>
<Box container sx={{m:3,p:2,maxWidth:600}}><form onSubmit={formik.handleSubmit}>
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
                        disabled={isDisabled}
                        onFocus={() => {
                        //   seterror("");
                        }}
                      />
                    </FormControl>
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
                        sx={{ backgroundColor: purple[50] }}
                        disabled={isDisabled}
                  
                      />
                    </FormControl>
                    {formik.touched["email"] && formik.errors["email"] && (
                      <div style={{ color: "red" }}>
                        {formik.errors["email"]}
                      </div>
                    )}
                    <FormControl sx={{ mt: 2 }} variant="outlined" fullWidth>
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
                      disabled={isDisabled}
              
                    /></FormControl>
                    
                    {formik.errors["mobileNum"] &&
                      formik.touched["mobileNum"] && (
                        <div style={{ color: "red" }}>
                          {formik.errors["mobileNum"]}
                        </div>
                      )}
                    <FormControl sx={{ mt: 2 }} variant="outlined" fullWidth>
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
                        sx={{ backgroundColor: purple[50] }}
                        disabled={isDisabled}
                    
                      >
                        <MenuItem value="" disabled>
                          Select Currancy
                        </MenuItem>
                       
                        {jsonData?.map((obj) => (
                      
                          <MenuItem value={obj.name}>{obj.name}</MenuItem>
                        ))}
                      </Select>
                      {formik.touched["Currancy"] &&
                        formik.errors["Currancy"] && (
                          <div style={{ color: "red" }}>
                            {formik.errors["Currancy"]}
                          </div>
                        )}
                    </FormControl>
                
                    <Typography sx={{mt:2,fontStyle:'italic'}} onClick={()=>{setchangepassword(true) 
                        setopen(true) 
                        formik.values.password=''
                        formik.values.confpassword=''
                        formik.values.newpassword=''}}>Want to change password?</Typography>

                    <Box container sx={{display:changepassword ? 'block' : 'none'}} >   
                    <FormControl variant="outlined" sx={{mt:2}} fullWidth>
                      <InputLabel htmlFor="outlined-adornment-username">
                        Old Password
                      </InputLabel>

                      <OutlinedInput
                        id="outlined-adornment-username"
                        type="password"
                        label="Old Password"
                        name="password"
                        value={formik.values["password"]}
                        onChange={formik.handleChange}
                        sx={{ backgroundColor: purple[50] }}
                     
                      
                      />
                    </FormControl>
                    {formik.touched["password"] &&
                      formik.errors["password"] && (
                        <div style={{ color: "red" }}>
                          {formik.errors["password"]}
                        </div>
                      )}
                      <FormControl variant="outlined" sx={{mt:2}} fullWidth>
                      <InputLabel htmlFor="outlined-adornment-username">
                        New Password
                      </InputLabel>

                      <OutlinedInput
                        id="outlined-adornment-username"
                        type="password"
                        label="New Password"
                        name="newpassword"
                        value={formik.values["newpassword"]}
                        onChange={formik.handleChange}
                        sx={{ backgroundColor: purple[50] }}
                     
                      
                      />
                    </FormControl>
                    {formik.touched["newpassword"] &&
                      formik.errors["newpassword"] && (
                        <div style={{ color: "red" }}>
                          {formik.errors["newpassword"]}
                        </div>
                      )}
                         <FormControl variant="outlined" sx={{mt:2}} fullWidth>
                      <InputLabel htmlFor="outlined-adornment-username">
                        Confirm Password
                      </InputLabel>

                      <OutlinedInput
                        id="outlined-adornment-username"
                        type="password"
                        label="Confirm Password"
                        name="confpassword"
                        value={formik.values["confpassword"]}
                        onChange={formik.handleChange}
                        sx={{ backgroundColor: purple[50] }}
                    
                       
                      />
                    </FormControl>
                    {formik.touched["confpassword"] &&
                      formik.errors["confpassword"] && (
                        <div style={{ color: "red" }}>
                          {formik.errors["confpassword"]}
                        </div>
                      )}    </Box>
               
                    {/* {error && <div style={{ color: "red" }}>{error}</div>} */}
                    
                    <Button type='submit' variant='contained' sx={{display:( open )?'block':'none',mt:2}}>Update</Button>
                  </form></Box>

    </Box> 
    </Box> 
    </>
  )
}
