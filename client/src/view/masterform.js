import React, { useEffect, useState } from "react";
import {TextField,Button,  Grid, FormControl,Box,MenuItem,InputLabel,Select,Input, RadioGroup, FormControlLabel, Radio,} from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import AddBoxRoundedIcon from "@mui/icons-material/AddBoxRounded";
import { setdata } from "../store/store";
import '../cssfiles/masterview.css'
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FormLabel } from "react-bootstrap";


export default function Masterform({
  handlesubmitform,
  handlecloseform,
  handleupdateform,
}) {
  const navigate=useNavigate()
  const data = JSON.parse(localStorage.getItem("user"));
  const id = data[0]._id;

  const reduxStore = useSelector((state) => state.stud);
  const initialValues = {};
  const [sxupdate, setsxupdate] = useState({ display: "none" });
  const isupdate=reduxStore.modal.update
  
  const updatedata = reduxStore.FormData;

  const dispatch = useDispatch();
  reduxStore.formfield.forEach(field => {
    initialValues[field.name] = isupdate ? updatedata[0][field.name] : "";
  });
  const key = "Category" + id + "";
  const formik = useFormik({
    initialValues,
    validationSchema: Yup.object(reduxStore.formValidation),
    onSubmit: async (values, { resetForm }) => {
      const random = Date.now();
      if(formik.values['transaction'] === 'othertransaction' && formik.values['PaidBy'] !== 'me'){
     
        dispatch(setdata({ modal: { 'submission': true } }))
        dispatch(setdata({ error: { 'title': true }}))
       
      }
      else{
        dispatch(setdata({ error: { 'title': false }}))
        if(reduxStore.pageRights.formName === 'expense'){
          try{
            const i=await axios.post('http://localhost:1011/getcategorybudget',{
              userid:id,
              category:formik.values['Category']
            })
            const j=await axios.post('http://localhost:1011/budgetinfo',{
              userid:id
            })
            console.log(i,j)
            const budget=j.data.filter((obj)=>obj.Category === formik.values.Category)
            console.log("budgetinfo",budget)
            console.log("budget",(i.data[0].TotalExpense+formik.values.Amount))
            console.log((i.data[0].TotalExpense+formik.values.Amount) >= budget[0].Amount)
            if((i.data[0].TotalExpense+formik.values.Amount) >= budget[0].Amount){
              dispatch(setdata({error: {'overspending':true}}))
              dispatch(setdata({error:{'Category': formik.values.Category}}))
            }
            else{
              
              dispatch(setdata({error:{'overspending':false}}))
            }
          }
          catch(error){
            console.log(error)
          }
        }
        
        isupdate
        ? handleupdateform({ ...values, id: updatedata[0].id })
        : handlesubmitform({ ...values, id: random });
       
      }
  
        const blankValues = Object.keys(values).reduce((acc, curr) => {
          acc[curr] = '';
          return acc;
        }, {});
       
        resetForm({ values: blankValues });
        
      handlecloseform();
    },
  });

  useEffect(() => {
 
    Object.assign(formik.values, updatedata[0]) 
  },[updatedata[0]]);

  useEffect(() => {
    
    Object.keys(initialValues).forEach(field => {
      formik.setFieldValue(field, ''); // Set each field value to empty string
    });
    dispatch(setdata({modal:{update:false}}))
    // getdata();
  }, []);

  function handlecategory() {
    const category = formik.values["AddCategory"];
    const maincategory=formik.values['Category']
    
    let categories = JSON.parse(localStorage.getItem(key));
    const temp=categories.filter((obj)=>obj.name !== maincategory)
    const tempdata=categories.filter((obj)=>obj.name === maincategory)[0].subCategory
    tempdata.push(category)
    console.log(tempdata)
    temp.push({name:maincategory,subCategory:tempdata})

    if (categories == null) {
      localStorage.setItem(key, JSON.stringify([temp]));
    } else {
      // let val = JSON.stringify([...categories, category]);
      localStorage.setItem(key, JSON.stringify(temp));
    }
    let data = JSON.parse(localStorage.getItem(key));

    dispatch(setdata({ Category: data }));
    document.getElementById("AddCategory").value = "";
  }
  return (
    <>
      {/* <Typography variant="h6" sx={{ m: "auto", fontWeight: "bold" }}>
        Enetr {reduxStore.pageRights.formName} details
      </Typography> */}
      <form onSubmit={formik.handleSubmit}>
        {reduxStore.formfield.map((field) => {
          return (
            <>
              {field.type === "text" ? (
                <>
                  <TextField
                  variant="standard"
                    label={field.label}
                    value={formik.values[field.name]}
                    margin="normal"
                    rows={3}
                    fullWidth
                    size="small"
                    id={field.name}
                    name={field.name}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={
                      formik.touched[field.name] &&
                      Boolean(formik.errors[field.name])
                    }
                  />{" "}
                  {formik.touched[field.name] && formik.errors[field.name] && (
                    <div style={{ color: "red" }}>
                      {formik.errors[field.name]}
                    </div>
                  )}
                </>
              ) : field.type === "number" ? (
                <>
                  <TextField
                  variant="standard"
                    type="number"
                    label={field.label}
                    fullWidth
                    margin="normal"
                    size="small"
                    id={field.name}
                    name={field.name}
                    value={formik.values[field.name]}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.touched[field.name] && formik.errors[field.name] && (
                    <div style={{ color: "red" }}>
                      {formik.errors[field.name]}
                    </div>
                  )}
                </>
              ) : field.type === "date" ? (
                <Grid item xs={12} sm={6}>
                  <TextField
                    type="date"
                    variant="standard"
                    margin="normal"
                    label={field.label}
                    fullWidth
                    size="small"
                    InputLabelProps={{ shrink: true }}
                    id={field.name}
                    name={field.name}
                    value={formik.values[field.name]}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={
                      formik.touched[field.name] &&
                      Boolean(formik.errors[field.name])
                    }
                  />
                  {formik.touched[field.name] && formik.errors[field.name] && (
                    <div style={{ color: "red" }}>
                      {formik.errors[field.name]}
                    </div>
                  )}
                </Grid>
              ) : field.type === "dropdown" ? (
                <Box sx={{ minWidth: 120, mt: 1 }}>
                  <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">
                      {field.label}
                    </InputLabel>
                    <Select
                    variant="standard"
                    labelId="demo-simple-select-standard-label"
                    id="demo-simple-select-standard"
                      name={field.name}
                      value={formik.values[field.name]}
                      label={field.name}
                      size="small"
                      onChange={formik.handleChange}
                      
                    >
                      <MenuItem value="" disabled>
                        Select {field.label}
                      </MenuItem>
                      {field.name === "SubCategory" &&  JSON.parse(localStorage.getItem(key)) && (
                       
                         JSON.parse(localStorage.getItem(key)).filter((obj)=>obj.name === formik.values['Category'])[0]?.subCategory?.map((obj) => (
                            <MenuItem value={obj}>{obj}</MenuItem>
                          ))
                      
                        
                      )
                      }
                      {field.name !== "SubCategory" &&
                        field?.list?.map((obj) => (
                          <MenuItem value={obj}>{obj}</MenuItem>
                        ))}
                    </Select>
                    {formik.touched[field.name] &&
                      formik.errors[field.name] && (
                        <div style={{ color: "red" }}>
                          {formik.errors[field.name]}
                        </div>
                      )}
                  </FormControl>
                </Box>
              ) : field.type === "button" ? (
                <>
                  <Button
                    variant="contained"
                    sx={{ mt: 1 }}
                    size="small"
                    className="buttoncolor"
                    style={{backgroundColor: `rgb(104, 6, 164)`}}
                    onClick={() => {
                      if (field.label === "Add New Category") {
                        if (sxupdate.mt === 1) {
                          setsxupdate({ display: "none" });
                        } else {
                          setsxupdate({ mt: 1 });
                        }
                      }
                    }}
                  >
                    {field.label}
                  </Button>

                  <Input
                  variant='standard'
                    label={field.name}
                    defaultValue={formik.values[field.name]}
                  
                    fullWidth
                    size="small"
                    id={field.name}
                    name={field.name}
                    placeholder="enetr category and press + button"
                    sx={sxupdate}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    endAdornment={
                      <AddBoxRoundedIcon
                        fontSize="large"
                        color="error"
                        onClick={handlecategory}
                      ></AddBoxRoundedIcon>
                    }
                  />
                  {/*  */}
                </>
              ) : field.type === "file" ? (
                <Grid item xs={12} sm={6}>
                  <TextField
                    type="file"
                    margin="normal"
                    label={field.label}
                    fullWidth
                    size="small"
                    InputLabelProps={{ shrink: true }}
                    id={field.name}
                    name={field.name}
                    value={formik.values[field.name]}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={
                      formik.touched[field.name] &&
                      Boolean(formik.errors[field.name])
                    }
                  />
                  {formik.touched[field.name] && formik.errors[field.name] && (
                    <div style={{ color: "red" }}>
                      {formik.errors[field.name]}
                    </div>
                  )}
                </Grid>
              ) : 
              field.type === 'radio' ? (
              <>
              <FormControl>
  
  <RadioGroup
    aria-labelledby="demo-radio-buttons-group-label"
    name={field.name}
    value={formik.values[field.name]}
    onChange={formik.handleChange}
    onBlur={formik.handleBlur}
    label={field.label}
 
    row>
      {field.options.map((obj)=>{return (<>
        <FormControlLabel value={obj} control={<Radio />} label={obj} onClick={()=>{formik.setFieldValue(field.name,obj)}}/>
      </>)})}
    {/* <FormControlLabel value=" control={<Radio />} label="Female" />
    <FormControlLabel value="male" control={<Radio />} label="Male" />
    <FormControlLabel value="other" control={<Radio />} label="Other" /> */}
  </RadioGroup>
</FormControl>
              </>
              ) : null}
            </>
          );
        })}

        <Grid container>
          <Grid item xs={6} sm={3} md={5}>
          <Button variant="contained" className="buttoncolor"   style={{backgroundColor: `rgb(104, 6, 164)`}} size="small" type="submit" sx={{ m: 1 }}>
        {reduxStore.pageRights.formName === 'expense' ? isupdate ? 'Update Expense' : 'Add expense' : reduxStore.pageRights.formName === 'income'? isupdate ? 'Update Income' : 'Add Income' :null}
       
        </Button>
          </Grid>
          <Grid item xs={6} sm={5} md={6}>
          <Button variant="contained" className="buttoncolor"  style={{backgroundColor: `rgb(104, 6, 164)`}} size="small"  sx={{ m: 1 }} onClick={()=>{
           Object.keys(initialValues).forEach(field => {
            formik.setFieldValue(field, ''); 
          });
       dispatch(setdata({modal:{update:false}}))
        }}>
      CLEAR {reduxStore.pageRights.formName}
        </Button>
          </Grid>
        </Grid>
        
     
      
      </form>
    </>
  );
}
