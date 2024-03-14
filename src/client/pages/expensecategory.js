import React, { useEffect, useState } from "react";
import "./expensecategory.css";
import Dashboardnav from "./dashboardnav";
import {
  Box,
  Grid,
  InputLabel,
  Menu,
  MenuItem,
  Select,
  Typography,
  Button,
  FormControl,
  Tooltip,
} from "@mui/material";

import { styled, alpha } from "@mui/material/styles";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { useFormik } from "formik";
import * as yup from "yup";
import {  string } from "yup";

import axios from "axios";
import { PieChart } from "@mui/x-charts";
import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarExport,
} from "@mui/x-data-grid";

import { isDisabled } from "@testing-library/user-event/dist/utils";
import { useNavigate } from "react-router-dom";

const StyledcategoryperiodMenu = styled((props) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: "bottom",
      horizontal: "right",
    }}
    transformOrigin={{
      vertical: "top",
      horizontal: "right",
    }}
    {...props}
  />
))(({ theme }) => ({
  "& .MuiPaper-root": {
    borderRadius: 6,
    marginTop: theme.spacing(1),
    minWidth: 180,
    color:
      theme.palette.mode === "light"
        ? "rgb(55, 65, 81)"
        : theme.palette.grey[300],
    boxShadow:
      "rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px",
    "& .MuiMenu-list": {
      padding: "4px 0",
    },
    "& .MuiMenuItem-root": {
      "& .MuiSvgIcon-root": {
        fontSize: 18,
        color: theme.palette.text.secondary,
        marginRight: theme.spacing(1.5),
      },
      "&:active": {
        backgroundColor: alpha(
          theme.palette.primary.main,
          theme.palette.action.selectedOpacity
        ),
      },
    },
  },
}));

const StyledcategoryyearMenu = styled((props) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: "bottom",
      horizontal: "right",
    }}
    transformOrigin={{
      vertical: "top",
      horizontal: "right",
    }}
    {...props}
  />
))(({ theme }) => ({
  "& .MuiPaper-root": {
    borderRadius: 6,
    marginTop: theme.spacing(1),
    minWidth: 180,
    color:
      theme.palette.mode === "light"
        ? "rgb(55, 65, 81)"
        : theme.palette.grey[300],
    boxShadow:
      "rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px",
    "& .MuiMenu-list": {
      padding: "4px 0",
    },
    "& .MuiMenuItem-root": {
      "& .MuiSvgIcon-root": {
        fontSize: 18,
        color: theme.palette.text.secondary,
        marginRight: theme.spacing(1.5),
      },
      "&:active": {
        backgroundColor: alpha(
          theme.palette.primary.main,
          theme.palette.action.selectedOpacity
        ),
      },
    },
  },
}));


export default function Expensecategory() {
  const [anchor1, setAnchor1] = React.useState(null);
  const [anchor2, setAnchor2] = React.useState(null);
  const navigate=useNavigate()
  const [columns, setcolumns] = useState([
    { field: "id", headerName: "id", width: 200 },
    { field: "Date", headerName: "Date", width: 200 },
    { field: "TotalExpense", headerName: "TotalExpense", width: 200 },
  ]);
  const [tabledata, settabledata] = useState();
  const [msg, setmsg] = useState("");
  const [text, settext] = useState("");
  const [pietext, setpietext] = useState("");

  const open1 = Boolean(anchor1);
  const open2 = Boolean(anchor2);

  const data = JSON.parse(localStorage.getItem("user"));
  const id = data[0]._id;
  const d = new Date();
  //c for category
  const [c, setc] = useState();
  //piechart data
  const [piedata, setpiedata] = useState();

  const ITEM_HEIGHT = 48;

  useEffect(() => {
    formik.setFieldValue("category","")
    formik.setFieldValue("categoryyear","")
    formik.setFieldValue("categoryperiod","")
    setmsg("");
    getcategorylist();
    getdata();
  }, []);


  const month = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const handleClick1 = (event) => {
    setAnchor1(event.currentTarget);
  };
  const handleClose1 = async () => {
    setAnchor1(null);
  };
  const handleClick2 = (event) => {
    setAnchor2(event.currentTarget);
  };
  const handleClose2 = async () => {
    setAnchor2(null);
  };

  async function getcategorylist() {
    
    const itemString = localStorage.getItem("token");

    const item = JSON.parse(itemString);
    const now = new Date();
    try {
      if (now.getTime() > item.expiry) {
       localStorage.clear()
        navigate("/login", { replace: true });
      }
    } catch (error) {
      console.log(error);
    }
    try {
      let i = await axios.post("http://localhost:1010/categorylist", {
        userid: id,
      },
      {
        headers: {
          authorization: `Bearer ${item.value}`,
        },
      });
      setc(i.data);
    } catch (error) {
      console.log(error);
    }
  }
  const getrowid = (row) => row.id;



  async function getdata() {
    
    const itemString = localStorage.getItem("token");

    const item = JSON.parse(itemString);
    const now = new Date();
    try {
      if (now.getTime() > item.expiry) {
       localStorage.clear()
        navigate("/login", { replace: true });
      }
    } catch (error) {
      console.log(error);
    }
  
    setmsg("");
    settext("Current month Categorization ");
    try {
      let i1 = await axios.post("http://localhost:1010/dailycategory", {
        userid: id,
      },{
        headers: {
          authorization: `Bearer ${item.value}`,
        },
      });
      if(i1.data === null){
        setmsg("sorry")
        settext("")
      }
      else{
        setmsg("")
      }
      
      setdata(i1.data,'All','All')
     
    } catch (error) {
      console.log(error);
    }
  }


  async function handlecategory(val) {
    let m=month.indexOf(formik.values.categoryperiod ) < 0 ? 'All' : month.indexOf(formik.values.categoryperiod )
    let year= formik.values.categoryyear ? formik.values.categoryyear : new Date().getFullYear()
    console.log("month",m,"year",formik.values.categoryyear ? formik.values.categoryyear : new Date().getFullYear())
    setpiedata("");
    setmsg("");

    settext((month.indexOf(formik.values.categoryperiod ) < 0 ? '' : formik.values.categoryperiod )+" "+year+" "+val+ " Expense Detail")
    

    const itemString = localStorage.getItem("token");

    const item = JSON.parse(itemString);
    const now = new Date();
    try {
      if (now.getTime() > item.expiry) {
       localStorage.clear()
        navigate("/login", { replace: true });
      }
    } catch (error) {
      console.log(error);
    }
    try {
      let i = await axios.post("http://localhost:1010/categoryinformation", {
        month:m,
        year:year,
        userid: id,
        category: val,
      },{
        headers: {
          authorization: `Bearer ${item.value}`,
        },
      });
      if(i.data.table.length === 0){
        setmsg("Data for "+(month.indexOf(formik.values.categoryperiod ) < 0 ? '' : formik.values.categoryperiod )+" "+year +" " +val+" Expense Detail is unavailable.")
        settext("")
      }

      console.log(i.data)
      if(val === 'All'){
        val=i.data.table.map((key, ind) => ({
          id: ind + 1,
          Category:key._id ,
          TotalExpense: key.TotalExpense,
        }));
  
        setcolumns([
          { field: "id", headerName: "id", width: 100 },
          { field: "Category", headerName: "Category", width: 200 },
          { field: "TotalExpense", headerName: "TotalExpense", width: 100 },
        ]);
    
        settabledata(val)
      }
      else{
        if(m !== 'All'){
          val=i.data.table.map((key, ind) => ({
            id: ind + 1,
            Date: key._id+'/'+(m+1)+'/'+year,
            TotalExpense: key.TotalExpense,
          }));
    
          setcolumns([
            { field: "id", headerName: "id", width: 100 },
            { field: "Date", headerName: "Date", width: 100 },
            { field: "TotalExpense", headerName: "TotalExpense", width: 100 },
          ]);
      
          settabledata(val)
        }
        else{
          val=i.data.table.map((key, ind) => ({
            id: ind + 1,
            Month: month[key._id-1],
            TotalExpense: key.TotalExpense,
          }));
    
          setcolumns([
            { field: "id", headerName: "id", width: 100 },
            { field: "Month", headerName: "Month", width: 100 },
            { field: "TotalExpense", headerName: "TotalExpense", width: 100 },
          ]);
      
          settabledata(val)
        }
      }
      
     
      val = i.data.pie.map((i) => ({
        id: i._id,
        label: i._id.toString(),
        value: i.TotalExpense,
      }));
      setpiedata(val)
    } catch (error) {
      console.log(error);
    }
  }

  async function handleyear(val) {
    let m=month.indexOf(formik.values.categoryperiod ) < 0 ? 'All' : month.indexOf(formik.values.categoryperiod )
    let category=formik.values.category ?  formik.values.category : 'All'
    let year =val
    settext((month.indexOf(formik.values.categoryperiod ) < 0 ? '' : formik.values.categoryperiod )+" "+year+" "+(formik.values.category ?  formik.values.category +" Expense Detail" : 'Expense Categorization') )
   
    const itemString = localStorage.getItem("token");

    const item = JSON.parse(itemString);
    const now = new Date();
    try {
      if (now.getTime() > item.expiry) {
       localStorage.clear()
        navigate("/login", { replace: true });
      }
    } catch (error) {
      console.log(error);
    }
    try{
    const i=await axios.post('http://localhost:1010/expenseyear',{
      userid:id,
      month:m,
      year:val,
      category:category
    },{
      headers: {
        authorization: `Bearer ${item.value}`,
      },
    })
    if(i.data.length === 0){
      setmsg("Data for "+(month.indexOf(formik.values.categoryperiod ) < 0 ? '' : formik.values.categoryperiod )+" "+year +" " +(formik.values.category ?  formik.values.category +" Expense Detail" : ' Expense Categorization') +" is unavailable.")
      settext("")
    }
    else{
setmsg("")
    }
 
    setdata(i.data,m,category)

   }
   catch(error){
    console.log(error)
   }
  }

  function setdata(data,month,category){
    let val;
    if(category === 'All'){
      val= data.map((key, ind) => ({
        id: ind + 1,
        Category:  key._id.toString(),
        TotalExpense: key.TotalExpense,
      }));
      setcolumns([
        { field: "id", headerName: "id", width: 100 },
        { field: "Category", headerName: "Category", width: 200 },
        { field: "TotalExpense", headerName: "TotalExpense", width: 100 },
      ]);
  
      settabledata(val)
    
    }
    else{

      if(month === 'All'){
        val=data.map((key, ind) => ({
          id: ind + 1,
          Month: month[key._id-1],
          TotalExpense: key.TotalExpense,
        }));
       
        setcolumns([
          { field: "id", headerName: "id", width: 100 },
          { field: "Month", headerName: "Month", width: 100 },
          { field: "TotalExpense", headerName: "TotalExpense", width: 100 },
        ]);

        settabledata(val)
      }
      else{
        val=data.map((key, ind) => ({
          id: ind + 1,
          Date: key._id?.substr(0,10),
          TotalExpense: key.TotalExpense,
        }));
  
        setcolumns([
          { field: "id", headerName: "id", width: 100 },
          { field: "Date", headerName: "Date", width: 100 },
          { field: "TotalExpense", headerName: "TotalExpense", width: 100 },
        ]);
        settabledata(val)
      }
    
    }
    val = data.map((i) => ({
      id: i._id,
      label: i._id.length > 5 ? i._id?.substr(0,10) : i._id.toString(),
      value: i.TotalExpense,
    }));
    console.log(val)
    setpiedata(val)
  }

async function handlecategoryperiod(val){
 
  let m=month.indexOf(val ) < 0 ? 'All' :month.indexOf(val )
  let category=formik.values.category ?  formik.values.category : 'All'
  let year=formik.values.categoryyear ? formik.values.categoryyear : new Date().getFullYear()
  settext((month.indexOf(val) < 0 ? '' : val)+" "+year+" "+(formik.values.category ?  formik.values.category +" Expense Detail" : 'Expense Categorization') )

  const itemString = localStorage.getItem("token");

  const item = JSON.parse(itemString);
  const now = new Date();
  try {
    if (now.getTime() > item.expiry) {
     localStorage.clear()
      navigate("/login", { replace: true });
    }
  } catch (error) {
    console.log(error);
  }
try{
  let i = await axios.post("http://localhost:1010/expenseyear", {
    year: year,
    userid: id,
    month: m,
    category:category
  },{
    headers: {
      authorization: `Bearer ${item.value}`,
    },
  });
  if(i.data.length === 0){
    setmsg("Data for "+(month.indexOf(val ) < 0 ? '' : val )+" "+year +" " +(formik.values.category ?  formik.values.category +" Expense Detail" : ' Expense Categorization') +" is unavailable.")
    settext("")
  }
  else{
    setmsg("")
  }
  setdata(i.data,m,category)
 
}
catch(error){
  console.log(error)
}
  }

  let year = [];
  for (let i = 1, j = 1; i <= 5, j <= 5; i++, j++) {
    year.push(new Date().getFullYear() - i);
    year.push(new Date().getFullYear() + j);
  }
  year.push(new Date().getFullYear());
  year.sort();

  const formik = useFormik({
    initialValues: {
      category: "",
      categoryyear: "",
      categoryperiod:""
    },
    validationSchema: yup.object({
      category: string(),
      categoryperiod:string(),
      categoryyear: string(),
    }),
    onSubmit: (values) => {
      alert(values);
    },
  });

  function CustomToolbar() {
    return (
      <GridToolbarContainer>
        <GridToolbarExport />
      </GridToolbarContainer>
    );
  }
  return (
    <>
      <Typography variant='h5' sx={{m:3,fontWeight:'bold'}}>Categorization</Typography> 
      {/* <Dashboardnav></Dashboardnav> */}
      <Box container>
       
        <Box
          container
          className="containerrr"
       
        >
          <Grid
            container
            spacing={2}
            sx={{
              p: 2,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Grid item xs={12} sm={12} md={6}>
              <Box sx={{ minWidth: 120, maxWidth: 450 }}>
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">
                    Category
                  </InputLabel>
                  <Select
                    size="small"
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    name="category"
                    value={formik.values["category"]}
                    label="category"
                    onChange={formik.handleChange}
                  >
                    <MenuItem value="" disabled>
                      Select category
                    </MenuItem>
                    <MenuItem value="All"  onClick={() => {
                          formik.setFieldValue("category",'All');
                          handlecategory('All');
                        }} >
                     All
                    </MenuItem>

                    {c?.map((obj) => (
                      <MenuItem
                        value={obj._id}
                        onClick={() => {
                          formik.setFieldValue("category", obj._id);
                          handlecategory(obj._id);
                        }}
                      >
                        {obj._id}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
            </Grid>

            <Grid item xs={6} sm={6} md={3}>
              <Tooltip
                title={
                  isDisabled
                    ? "To filter expenses by month, first select a category."
                    : "Select a month to filter expenses within the chosen category"
                }
              >
                {" "}
                <Button
                  id="demo-customized-button"
                  aria-controls={open1 ? "demo-customized-menu" : undefined}
                  aria-haspopup="true"
                  aria-expanded={open1 ? "true" : undefined}
                  variant="contained"
                  disableElevation
                  name="categoryyear"
                  value={formik.values.categoryyear}
                  onChange={formik.handleChange}
                  onClick={handleClick1}
                  endIcon={<KeyboardArrowDownIcon />}
                >
                  {formik.values.categoryyear
                    ? formik.values.categoryyear
                    : "Expense Year"}
                </Button>
              </Tooltip>

              <StyledcategoryyearMenu
                id="demo-customized-menu"
                MenuListProps={{
                  "aria-labelledby": "demo-customized-button",
                }}
                anchorEl={anchor1}
                open={open1}
                onClose={handleClose1}
                name="categoryyear"
                label="categoryyear"
                value={formik.values.categoryyear}
                onChange={formik.handleChange}
                PaperProps={{
                  style: {
                    maxHeight: ITEM_HEIGHT * 4.5,
                    width: "20ch",
                  },
                }}
              >
                {year.map((obj) => (
                  <MenuItem
                    onClick={() => {
                     
                      formik.setFieldValue("categoryyear", obj);
                      handleyear(obj)
                      handleClose1();
                    }}
                    onChange={formik.handleChange}
                    disableRipple
                  >
                    {obj}
                  </MenuItem>
                ))}
              </StyledcategoryyearMenu>
            </Grid>
            <Grid item xs={6} sm={6} md={3}>
              <Tooltip
                title={
                  isDisabled
                    ? "To filter expenses by year, first select a category."
                    : "Select a year to filter expenses within the chosen category"
                }
              >
                {" "}
                <Button
                  id="demo-customized-button"
                  aria-controls={open2 ? "demo-customized-menu" : undefined}
                  aria-haspopup="true"
                  aria-expanded={open2 ? "true" : undefined}
                  variant="contained"
                  disableElevation
                  name="categoryperiod"
                  value={formik.values.categoryperiod}
                  onChange={formik.handleChange}
                  onClick={handleClick2}
                  endIcon={<KeyboardArrowDownIcon />}
                  // disabled={isDisabled}
                >
                  {formik.values.categoryperiod
                    ? formik.values.categoryperiod
                    : "Expense period"}
                </Button>
              </Tooltip>

              <StyledcategoryperiodMenu
                id="demo-customized-menu"
                MenuListProps={{
                  "aria-labelledby": "demo-customized-button",
                }}
                anchorEl={anchor2}
                open={open2}
                onClose={handleClose2}
                name="categoryperiod"
                label="categoryperiod"
                value={formik.values.categoryperiod}
                onChange={formik.handleChange}
                PaperProps={{
                  style: {
                    maxHeight: ITEM_HEIGHT * 4.5,
                    width: "20ch",
                  },
                }}
              >
                 <MenuItem
                    onClick={() => {
             
                      formik.setFieldValue("categoryperiod", 'All');
                      handlecategoryperiod('All');
                      handleClose2();
                    }}
                    onChange={formik.handleChange}
                    disableRipple
                  >All</MenuItem>
                {month.map((obj) => (
                  <MenuItem
                    onClick={() => {
                  
                      formik.setFieldValue("categoryperiod", obj);
                      handlecategoryperiod(obj);
                      handleClose2();
                    }}
                    onChange={formik.handleChange}
                    disableRipple
                  >
                    {obj}
                  </MenuItem>
                ))}
              </StyledcategoryperiodMenu>
            </Grid>
            
          </Grid>
        </Box>
        <Box
          container
          className="containerrr"
          sx={{
          
            minHeight: 280,
          }}
        >
        {msg && <Typography
            variant="h6"
            sx={{
              color: "red",
              fontStyle: "italic",
            }}
          >
            {msg}
          </Typography>}  
          {text &&  <Typography
                      sx={{
                        fontSize: 20,
                        fontWeight: "bold",
                        textAlign: "left",
                        m: 1,
                      }}
                    >
                      {text}
                    </Typography>}
         
          <Grid container>
            <Grid xs={12} sm={12} md={6}>
              <Box container sx={{ p: 3 }}>
                {msg === '' && tabledata && (
                  <>
                   
                    <DataGrid
                      id="table"
                      rows={tabledata}
                      columns={columns}
                      initialState={{
                        pagination: {
                          paginationModel: { pageSize: 5, page: 0 },
                        },
                      }}
                      slots={{
                        toolbar: CustomToolbar,
                      }}
                      getRowId={getrowid}
                      pageSizeOptions={[5, 10, 25]}
                      sx={{ fontWeight: "bold", maxWidth: 600 }}
                    />
                  </>
                )}
              </Box>
            </Grid>
            <Grid xs={12} sm={12} md={6}>
              <Box container sx={{ p: 3 }}>
              
                <Typography
                  sx={{
                    fontSize: 20,
                    fontWeight: "bold",
                    textAlign: "left",
                    m: 1,
                  }}
                >
                  {pietext}
                </Typography>
                {piedata && (
                  <PieChart
                    series={[
                      {
                        data: piedata,
                        highlightScope: {
                          faded: "global",
                          highlighted: "item",
                        },
                        faded: {
                          innerRadius: 30,
                          additionalRadius: -30,
                          color: "gray",
                        },
                      },
                    ]}
                    height={250}
                  />
                )}
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </>
  );
}
