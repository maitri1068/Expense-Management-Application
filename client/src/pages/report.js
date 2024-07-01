import React, { useEffect, useRef, useState } from "react";
import "../cssfiles/expensereport.css";
import {
  Box,
  Grid,
  TextField,
  Typography,
  Button,
  Menu,
  MenuItem,
  Tooltip,
  Dialog,
} from "@mui/material";
import { styled, alpha } from "@mui/material/styles";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { useFormik } from "formik";
import * as yup from "yup";
import { date, string } from "yup";
import axios from "axios";
import { LineChart, PieChart } from "@mui/x-charts";
import { UseDispatch, useDispatch, useSelector } from "react-redux";
import store from "../store/store";
import { setdata } from "../store/store";
import DownloadForOfflineIcon from "@mui/icons-material/DownloadForOffline";
import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarExport,
} from "@mui/x-data-grid";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { grey, purple } from "@mui/material/colors";
import { useNavigate } from "react-router-dom";

const StyledMenu = styled((props) => (
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
const StyledperiodMenu = styled((props) => (
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
  
const Styledchartmenu = styled((props) => (
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


export default function Expensereport() {
  const navigate=useNavigate()
 const ITEM_HEIGHT=48
  const dispatch = useDispatch();
  const reduxStore = useSelector((state) => state.stud);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [anchorch, setAnchorch] = useState(null);
  const [anchorp, setAnchorp] = useState(null);
  const [period, setperiod] = useState("Daily");
  const [columns, setcolumns] = useState([
    { field: "id", headerName: "id", width: 100 },
    { field: "Date", headerName: "Date", width: 100 },
    { field: "TotalExpense", headerName: "TotalExpense", width: 100 },
  ]);
  const [incomecolumns,setincomecolumns]=useState([
    { field: "id", headerName: "id", width: 100 },
    { field: "Date", headerName: "Date", width: 100 },
    { field: "TotalIncome", headerName: "TotalIncome", width: 100 },
  ])
  const [temp, settemp] = useState();
  const [incometemp,setincometemp]=useState()
  const op = Boolean(anchorch);
  const open = Boolean(anchorEl);
  const openn=Boolean(anchorp)
  const [expenseprintopen, setexpenseprintopen] = useState(false);
  const [incomeprintopen, setincomeprintopen] = useState(false);
  const [fname, setfname] = useState();
  const data = JSON.parse(localStorage.getItem("user"));
  const id = data[0]._id;
  const [sdate,setdate]=useState(false)
  const [msg,setmsg]=useState('')
  const [expensemsg,setexpensemsg]=useState('')
  const [incomemsg,setincomemsg]=useState('')
  const expenseperiodd=['Monthly','Quaterly']
  const type = ["LineChart", "PieChart", "TabularForm"];
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
  
  let year = [];
  for (let i = 1, j = 1; i <= 5, j <= 5; i++, j++) {
    year.push(new Date().getFullYear() - i);
    year.push(new Date().getFullYear() + j);
  }
  year.push(new Date().getFullYear());
  year.sort();

  const d = new Date();
  const lastdate=new Date(d.getFullYear(), d.getMonth() + 1, 0)
 
  const formik = useFormik({
    initialValues: {
      startdate:
        d.getFullYear() +
        "-" +
        (d.getMonth() < 9 ? "0" + (d.getMonth() + 1) : d.getMonth() + 1) +
        "-" +
        "01",
      enddate:
      lastdate.getFullYear() +
      "-" +
      (lastdate.getMonth() < 9 ? "0" + (lastdate.getMonth() + 1) : lastdate.getMonth() + 1) +
      "-" +
      (lastdate.getDate()),
      expenseyear: "",
      charttype: "LineChart",
      expenseperiod:""
    },
    validationSchema: yup.object({
      startdate: date().max(new Date()),
      enddate: date().max(new Date()),
      expenseyear: string(),
      charttype: string(),
      expenseperiod:string()
    }),
    onSubmit: (values) => {
      alert(values);
    },
  });


  function handlfilename(val) {
   
  
    const chartElement = document.getElementById(val);
    html2canvas(chartElement).then((canvas) => {
      const imageDataURL = canvas.toDataURL("image/png");
      const downloadLink = document.createElement("a");
      downloadLink.href = imageDataURL;
      downloadLink.download = `${fname}.png`;
      downloadLink.click();
    });
    // }
  }

  function CustomToolbar() {
    return (
      <GridToolbarContainer>
        <GridToolbarExport />
      </GridToolbarContainer>
    );
  }

  const handleclick = (e) => {
    setAnchorch(e.currentTarget);
  };
  const handleclose = async () => {
    setAnchorch(null);
 
  };
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
   
  };
  const handleClose = async () => {
    setAnchorEl(null);
   
  };

  const handleClickk = (event) => {
    setAnchorp(event.currentTarget);
    
  };
  const handleClosee = async () => {
    setAnchorp(null);
    
  };

  function handleenter(val) {
    document.getElementById(val).style = "color:red";
  }
  function handleleave(val) {
    document.getElementById(val).style = "color:grey";
  }


  useEffect(() => {
    getdata();
  }, [formik.values.startdate, formik.values.enddate]);

  useEffect(() => {
    getdata()
    // handleyear(new Date().getFullYear());
    // handlechart("LineChart");
  }, []);

  async function handleyear(val) {
    
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
    setdate(false)
    
    let period=formik.values.expenseperiod ? formik.values.expenseperiod : 'Monthly'
    try {
      let i = await axios.post("http://localhost:1011/expenseperiod", {
        year: val,
        userid: id,
        period: period
      }, {
        headers: {
          authorization: `Bearer ${item.value}`,
        },
      });
      let i1 = await axios.post("http://localhost:1011/incomeperiod", {
        year: val,
        userid: id,
        period: period
      }, {
        headers: {
          authorization: `Bearer ${item.value}`,
        },
      });
      if(i.data.length !== 0){
        let a=[]
        for(let i=1;i<=12;i++){
         a.push(i)
        }
        let b = ['Q1','Q2','Q3','Q4']
        
        if(period === 'Monthly'){
      
          a.forEach(e => {
           let x=i.data.filter((o)=>o._id === e)
         
           if(x.length === 0){
             i.data.push({_id:e,TotalExpense:0})
           }
          });
  
          function customSort(a, b) {
         
            return a._id - b._id;
        }
        i.data.sort(customSort)
        }
        else{
       
          b.forEach(e => {
           let x=i.data.filter((o)=>o._id === e)
       
           if(x.length === 0){
             i.data.push({_id:e,TotalExpense:0})
           }
          });
          function customSort(a, b) {
            const idA = parseInt(a._id.slice(1));
            const idB = parseInt(b._id.slice(1));
            return idA - idB;
        }

        i.data.sort(customSort)
        }
      }

      if(i1.data.length !== 0){
        let a=[]
        for(let i=1;i<=12;i++){
         a.push(i)
        }
        let b = ['Q1','Q2','Q3','Q4']
        
        if(period === 'Monthly'){
          a.forEach(e => {
            let x=i1.data.filter((o)=>o._id === e)
            
            if(x.length === 0){
              i1.data.push({_id:e,TotalIncome:0})
            }
           });
      
  
          function customSort(a, b) {
         
            return a._id - b._id;
        }
        
        i1.data.sort(customSort);
       
        }
        else{
          b.forEach(e => {
            let x=i1.data.filter((o)=>o._id === e)
          
            if(x.length === 0){
              i1.data.push({_id:e,TotalIncome:0})
            }
           });
       
          function customSort(a, b) {
            const idA = parseInt(a._id.slice(1));
            const idB = parseInt(b._id.slice(1));
            return idA - idB;
        }
        
        i1.data.sort(customSort);
        i.data.sort(customSort)
        }
      }
      


      if(i.data.length === 0 && i1.data.length === 0){
        setmsg("Data for "+val+" is not available")
      }
      else if(i.data.length === 0){
        setexpensemsg("Data for "+val+" Expense Detail is not available")
      }
      else if(i1.data.length === 0){
        setincomemsg("Data for "+val+" Income Detail is not available")
      }
      else{
        setmsg("")
        setexpensemsg("")
        setincomemsg("")
      }
      localStorage.setItem('expensechartdata',JSON.stringify(i.data))
      localStorage.setItem('incomechartdata',JSON.stringify(i1.data))
      handlechart(formik.values.charttype)
    } 
    catch (error) {
      console.log(error);
    }
  }

  async function handleperiod(val){
    
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
    setdate(false)
    let year=formik.values.expenseyear ? formik.values.expenseyear : new Date().getFullYear()
    try {
      let i = await axios.post("http://localhost:1011/expenseperiod", {
        year: year,
        userid: id,
        period: val
      }, {
        headers: {
          authorization: `Bearer ${item.value}`,
        },
      });
      let i1 = await axios.post("http://localhost:1011/incomeperiod", {
        year: year,
        userid: id,
        period: val
      }, {
        headers: {
          authorization: `Bearer ${item.value}`,
        },
      });
    
      if(i.data.length !== 0){
        let a=[]
        for(let i=1;i<=12;i++){
         a.push(i)
        }
        let b = ['Q1','Q2','Q3','Q4']
        
        if(val === 'Monthly'){
      
          a.forEach(e => {
           let x=i.data.filter((o)=>o._id === e)
           
           if(x.length === 0){
             i.data.push({_id:e,TotalExpense:0})
           }
          });
  
          function customSort(a, b) {
         
            return a._id - b._id;
        }
        i.data.sort(customSort)
        }
        else{
       
          b.forEach(e => {
           let x=i.data.filter((o)=>o._id === e)
          
           if(x.length === 0){
             i.data.push({_id:e,TotalExpense:0})
           }
          });
          function customSort(a, b) {
            const idA = parseInt(a._id.slice(1));
            const idB = parseInt(b._id.slice(1));
            return idA - idB;
        }

        i.data.sort(customSort)
        }
      }

      if(i1.data.length !== 0){
        let a=[]
        for(let i=1;i<=12;i++){
         a.push(i)
        }
        let b = ['Q1','Q2','Q3','Q4']
        
        if(val === 'Monthly'){
          a.forEach(e => {
            let x=i1.data.filter((o)=>o._id === e)
            
            if(x.length === 0){
              i1.data.push({_id:e,TotalIncome:0})
            }
           });
      
  
          function customSort(a, b) {
         
            return a._id - b._id;
        }
        
        i1.data.sort(customSort);
       
        }
        else{
          b.forEach(e => {
            let x=i1.data.filter((o)=>o._id === e)
           
            if(x.length === 0){
              i1.data.push({_id:e,TotalIncome:0})
            }
           });
       
          function customSort(a, b) {
            const idA = parseInt(a._id.slice(1));
            const idB = parseInt(b._id.slice(1));
            return idA - idB;
        }
        
        i1.data.sort(customSort);
        i.data.sort(customSort)
        }
      }
      
     

      if(i.data.length === 0 && i1.data.length === 0){
        setmsg("Data for "+year+" is not available")
      }
      else if(i.data.length === 0){
        setexpensemsg("Data for "+year+" Expense Detail is not available")
      }
      else if(i1.data.length === 0){
        setincomemsg("Data for "+year+" Income Detail is not available")
      }
      else{
        setmsg("")
        setexpensemsg("")
        setincomemsg("")
      }
   
      dispatch(setdata({expensechartdata:i.data}))
      localStorage.setItem('expensechartdata',JSON.stringify(i.data))
      dispatch(setdata({incomechartdata:i1.data}))
      localStorage.setItem('incomechartdata',JSON.stringify(i1.data))
      handlechart(formik.values.charttype,val,year)

    } 
    catch (error) {
      console.log(error);
    }
  }
   
  async function handlechart(val,period,year) {
    if(!period){
      period='Monthly'
    }
    if(!year){
      year=new Date().getFullYear()
    }
   
    if(sdate && val === 'TabularForm'){
      let val=JSON.parse(localStorage.getItem('expensechartdata'))
      let val1=JSON.parse(localStorage.getItem('incomechartdata'))
      val= val.map((key, ind) => ({
        id: ind + 1,
        Date: key._id,
        TotalExpense: key.TotalExpense.toFixed(2),
      }));
      val1= val1.map((key, ind) => ({
        id: ind + 1,
        Date:  key._id,
        TotalIncome: key.TotalIncome.toFixed(2),
      }));
      setcolumns([
        { field: "id", headerName: "id", width: 100 },
        { field: "Date", headerName: "date", width: 100 },
        { field: "TotalExpense", headerName: "TotalExpense", width: 100 },
      ]);
      setincomecolumns([
        { field: "id", headerName: "id", width: 100 },
        { field: "Date", headerName: "Date", width: 100 },
        { field: "TotalIncome", headerName: "TotalIncome", width: 100 },
      ]);
      setincometemp(val1)
      settemp(val);
    }
    else{
      
    if(val === 'PieChart'){
      
      piedataform(period,year)
    }
    else if(val === 'LineChart'){
    
      linedataform(period,year)
    }
    else if(val === 'TabularForm'){
    
      tabularformdata(period,year)
    }
    }
  
  }


  // data conversion for tabular form
      function tabularformdata(period,year){
        let val=JSON.parse(localStorage.getItem('expensechartdata'))
        let val1=JSON.parse(localStorage.getItem('incomechartdata'))
       

        if (period === "Monthly") {
          val= val.map((key, ind) => ({
            id: ind + 1,
            Month:  month[key._id - 1],
            TotalExpense: key.TotalExpense.toFixed(2),
          }));
          val1= val1.map((key, ind) => ({
            id: ind + 1,
            Month:  month[key._id - 1],
            TotalIncome: key.TotalIncome.toFixed(2),
          }));
          setcolumns([
            { field: "id", headerName: "id", width: 100 },
            { field: "Month", headerName: "Month", width: 200 },
            { field: "TotalExpense", headerName: "TotalExpense", width: 100 },
          ]);
          setincomecolumns([
            { field: "id", headerName: "id", width: 100 },
            { field: "Month", headerName: "Month", width: 200 },
            { field: "TotalIncome", headerName: "TotalIncome", width: 100 },
          ]);
          setincometemp(val1)
          settemp(val);
        } else if (period === "Quaterly") {
          val= val.map((key, ind) => ({
            id: ind + 1,
            Quater: key._id,
            TotalExpense: key.TotalExpense.toFixed(2),
          }));
          val1= val1.map((key, ind) => ({
            id: ind + 1,
            Quater:  key._id,
            TotalIncome: key.TotalIncome.toFixed(2),
          }));
          setcolumns([
            { field: "id", headerName: "id", width: 100 },
            { field: "Quater", headerName: "Quater", width: 200 },
            { field: "TotalExpense", headerName: "TotalExpense", width: 100 },
          ]);
          setincomecolumns([
            { field: "id", headerName: "id", width: 100 },
            { field: "Quater", headerName: "Quater", width: 200 },
            { field: "TotalIncome", headerName: "TotalIncome", width: 100 },
          ]);
          setincometemp(val1)
          settemp(val);
        }
        
      }
      
  const getrowid = (row) => row.id;
  // data conversion for pie chart
      function piedataform(period,year){
        let val=JSON.parse(localStorage.getItem('expensechartdata'))
        let val1=JSON.parse(localStorage.getItem('incomechartdata'))
        val = val.map((i) => ({
          id: i._id,
          label: i._id.toString(),
          value: i.TotalExpense,
        }));
        settemp(val)
        val1 = val1.map((i) => ({
          id: i._id,
          label: i._id.toString(),
          value: i.TotalIncome,
        }));
        setincometemp(val1)
      
      }
  //data conversion for line chart
      function linedataform(period,year){
        let val=JSON.parse(localStorage.getItem('expensechartdata'))
        let val1=JSON.parse(localStorage.getItem('incomechartdata'))
        settemp(val)
        setincometemp(val1)
    
      }

  // get initial data    
  async function getdata() {
    
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

    try {
      let i = await axios.post("http://localhost:1011/expensereport", {
        startdate: formik.values.startdate,
        enddate: formik.values.enddate,
      }, {
        headers: {
          authorization: `Bearer ${item.value}`,
        },
      });
      let i1 = await axios.post("http://localhost:1011/incomereport", {
        startdate: formik.values.startdate,
        enddate: formik.values.enddate,
      }, {
        headers: {
          authorization: `Bearer ${item.value}`,
        },
      });



      if(i.data.length === 0 && i1.data.length === 0){
        setmsg("Data between "+formik.values.startdate+" and "+formik.values.enddate+"is not available")
      }
      else if(i.data.length === 0){
        setexpensemsg("Expense Data between "+formik.values.startdate+" and "+formik.values.enddate+"is not available")
      }
      else if(i1.data.length === 0){
        setincomemsg("Income Data between "+formik.values.startdate+" and "+formik.values.enddate+"is not available")
      }
      else{
        setmsg("")
        setexpensemsg("")
        setincomemsg("")
      }

    
      localStorage.setItem('expensechartdata',JSON.stringify(i.data))
      localStorage.setItem('incomechartdata',JSON.stringify(i1.data))
      setdate(true)
      handlechart(formik.values.charttype,'Monthly',2024)
    } catch (error) {
      console.log(error);
    }
  }

  

  return (
    < >
      {/* <Dashboardnav></Dashboardnav> */}
      <Box container >
      <Typography variant='h5' sx={{m:3,fontWeight:'bold'}}>Reports And Analytics</Typography> 
        <Box container className="containerr">
          <Grid container spacing={1} >
            <Grid xs={6} sm={6} md={3} item>
              <Typography sx={{ m: 1 }}>StartDate</Typography>
              <TextField
                type="date"
                name="startdate"
                value={formik.values.startdate}
                onChange={formik.handleChange}
                size="small"
              ></TextField>
            </Grid>
            <Grid xs={6} sm={6} md={3} item>
              <Typography sx={{ m: 1 }}>EndDate</Typography>
              <TextField
                type="date"
                name="enddate"
                value={formik.values.enddate}
                onChange={formik.handleChange}
                size="small"
              ></TextField>
              {formik.touched["enddate"] &&
                formik.errors["enddate"] &&
                alert(formik.errors["enddate"])}
            </Grid>
            <Grid xs={12} sm={12} md={2}  item sx={{display:'flex',justifyContent:'center',alignItems:'center',mt:3}}>
              <Button
                className="buttoncol"
                style={{backgroundColor: `rgb(104, 6, 164)`}} 
                id="demo-customized-button"
                aria-controls={open ? "demo-customized-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={open ? "true" : undefined}
                variant="contained"
                disableElevation
                name="expenseyear"
                value={formik.values.expenseyear}
                onChange={formik.handleChange}
                onClick={handleClick}
                endIcon={<KeyboardArrowDownIcon />}
              >
                {formik.values.expenseyear
                  ? formik.values.expenseyear
                  : "Expense Year"}
              </Button>
              <StyledMenu
                id="demo-customized-menu"
                MenuListProps={{
                  "aria-labelledby": "demo-customized-button",
                }}
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                name="expenseyear"
                value={formik.values.expenseyear}
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
                      setperiod(obj);
                      // formik.setFieldValue("expenseyear", obj);
                      // formik.setFieldValue('startdate',  obj+ "-" + "01"  + "-" + "01")
                      // formik.setFieldValue('enddate',  obj + "-" + "12"  + "-" + "31")
                    
                      handleyear(obj);
                      
                   
                      handleClose();
                    }}
                    onChange={formik.handleChange}
                    disableRipple
                  >
                    {obj}
                  </MenuItem>
                ))}
              </StyledMenu>
            </Grid>
            <Grid xs={12} sm={12} md={2} item sx={{display:'flex',justifyContent:'center',alignItems:'center',mt:3}}>
              <Button
                className="buttoncol"
                style={{backgroundColor: `rgb(104, 6, 164)`}} 
                id="demo-customized-button"
                aria-controls={openn ? "demo-customized-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={openn ? "true" : undefined}
                variant="contained"
                disableElevation
                name="expenseperiod"
                value={formik.values.expenseperiod}
                onChange={formik.handleChange}
                onClick={handleClickk}
                endIcon={<KeyboardArrowDownIcon />}
              >
                {formik.values.expenseperiod
                  ? formik.values.expenseperiod
                  : "Expense Period"}
              </Button>
              <StyledperiodMenu
                id="demo-customized-menu"
                MenuListProps={{
                  "aria-labelledby": "demo-customized-button",
                }}
                anchorEl={anchorp}
                open={openn}
                onClose={handleClosee}
                name="expenseperiod"
                value={formik.values.expenseperiod}
                onChange={formik.handleChange}
              >
                {expenseperiodd.map((obj) => (
                  <MenuItem
                    onClick={() => {
                    //   setperiod(obj);
                      formik.setFieldValue("expenseperiod", obj);
                     handleperiod(obj);
                      handleClosee();
                    }}
                    onChange={formik.handleChange}
                    disableRipple
                  >
                    {obj}
                  </MenuItem>
                ))}
              </StyledperiodMenu>
            </Grid>
            <Grid xs={12} sm={12} md={2} item sx={{display:'flex',justifyContent:'center',alignItems:'center',mt:3}}>
              <Button
                className="buttoncol"
                style={{backgroundColor: `rgb(104, 6, 164)`}} 
                id="demo-customized-button"
                aria-controls={open ? "demo-customized-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={open ? "true" : undefined}
                variant="contained"
                disableElevation
                name="charttype"
                value={formik.values.charttype}
                onChange={formik.handleChange}
                onClick={handleclick}
                endIcon={<KeyboardArrowDownIcon />}
              
              >
                {formik.values.charttype
                  ? formik.values.charttype
                  : "Expense Display Type"}
              </Button>
              <Styledchartmenu
                id="demo-customized-menu"
                MenuListProps={{
                  "aria-labelledby": "demo-customized-button",
                }}
                anchorEl={anchorch}
                open={op}
                onClose={handleclose}
                name="charttype"
                value={formik.values.charttype}
                onChange={formik.handleChange}
              >
                {type.map((obj) => (
                  <MenuItem
                    onClick={() => {
                      handlechart(obj,formik.values.expenseperiod,formik.values.expenseyear);
                      handleclose();
                      formik.setFieldValue("charttype", obj);
                    }}
                    disableRipple
                  >
                    {obj}
                  </MenuItem>
                ))}
              </Styledchartmenu>
            </Grid>
          </Grid>
        </Box>

        <Box
          container
          className="containerrr"
          sx={{ mt: 4, pb: 5, textAlign: "center", height: "auto" }}
        >
          <Typography>{msg}</Typography>
            <Grid container spacing={2}>

            <Grid item xs={12} sm={12} md={6}>
             {msg === '' && expensemsg !== '' &&  <Typography>{expensemsg}</Typography> }
              {msg === '' && expensemsg === '' &&    <Box>  <Typography>Expense Report</Typography>
            {formik.values.charttype !== "TabularForm" && (
            <Box
              container
              id="download"
              sx={{
                display: "flex",
                alignItems: "end",
                justifyContent: "end",
                mr: 3,
              }}
            >
              <Tooltip title="Download report">
            
                  <DownloadForOfflineIcon
                    sx={{ fontSize: 30 }}
                    color="primary"
                    onClick={() => {
                     setexpenseprintopen(true)
                    }}
                  ></DownloadForOfflineIcon>
       
              </Tooltip>
            </Box>
          )}
          <Dialog open={expenseprintopen}>
            <Box container sx={{ p: 2, border: 1, m: 3 }}>
              <Box id="close" sx={{ textAlign: "end" }}>
                <CloseRoundedIcon
                  onMouseEnter={() => {
                    handleenter("close");
                  }}
                  onMouseLeave={() => {
                    handleleave("close");
                  }}
                  onClick={() => setexpenseprintopen(false)}
                ></CloseRoundedIcon>
              </Box>

              <Typography>Enter File Name</Typography>
              <TextField
                sx={{ m: 1, pr: 2 }}
                fullWidth
                name="filename"
                value={fname}
                onChange={(e) => setfname(e.target.value)}
              ></TextField>
              <Button
                sx={{ m: 1 }}
                type="submit"
                variant="contained"
                onClick={() => {
                  setexpenseprintopen(false)
                  handlfilename(formik.values.charttype);
                }}
              >
                {" "}
                OK{" "}
              </Button>
            </Box>
          </Dialog>
          <Box
            id="TabularForm"
            container
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              p: 3,
            }}
          >
     
            {temp && formik.values.charttype === 'TabularForm' && (
              <>
                {
                  <DataGrid
                    id="table"
                    rows={temp}
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
                }
              </>
            )}
          </Box>
          <Box
            container
           
            id="LineChart"
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              backgroundColor:'white',
              border:1,
              borderRadius:5,
              borderColor:grey[100]
            }}
          > 
        
          
            {temp &&
              formik.values.charttype === "LineChart" && (
              <>
           
                      <LineChart
                  xAxis={[
                    {
                      data: temp?.map(
                        (i) => i._id
                      ),
                      label:
                      sdate ? 'Date' : 
                       formik.values.expenseperiod === "Quaterly"
                          ? "Quater"
                          :"Month",
                      min:0,
                      scaleType: "point"
                    },
                  ]}
                  series={[
                    {
                      data: temp?.map(
                        (i) => i.TotalExpense
                      ),
                      label: "expense",
                    },
                  ]}
                  yAxis={[
                    {
                      min: 0,
                    },
                  ]}
                  width={400}
                  height={300}
                /></>
              
                
              )}{" "}
          </Box>
          <Box
            container
         
            id="PieChart"
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              ml: 2,
            }}
          >
          
            {temp &&
              formik.values.charttype === "PieChart" && (
                <PieChart
                  series={[
                    {
                      data: temp,
                      highlightScope: { faded: "global", highlighted: "item" },
                      faded: {
                        innerRadius: 30,
                        additionalRadius: -30,
                        color: "gray",
                      },
                    },
                  ]}
                  height={300}
                />
              )}
          </Box></Box>}
           
            
            </Grid>
            <Grid item xs={12} sm={12} md={6}>
            {msg === '' && incomemsg !== '' &&  <Typography>{incomemsg}</Typography> }
              {msg === '' && incomemsg==='' &&    <Box>   <Typography>Income Report</Typography>
            {formik.values.charttype !== "TabularForm" && (
            <Box
              container
              id="download"
              sx={{
                display: "flex",
                alignItems: "end",
                justifyContent: "end",
                mr: 3,
              }}
            >
              <Tooltip title="Download report">
            
                  <DownloadForOfflineIcon
                    sx={{ fontSize: 30 }}
                    color="primary"
                    onClick={() => {
                  setincomeprintopen(true)
                    }}
                  ></DownloadForOfflineIcon>
       
              </Tooltip>
            </Box>
          )}
          <Dialog open={incomeprintopen}>
            <Box container sx={{ p: 2, border: 1, m: 3 }}>
              <Box id="close" sx={{ textAlign: "end" }}>
                <CloseRoundedIcon
                  onMouseEnter={() => {
                    handleenter("close");
                  }}
                  onMouseLeave={() => {
                    handleleave("close");
                  }}
                  onClick={() => setincomeprintopen(false)}
                ></CloseRoundedIcon>
              </Box>

              <Typography>Enter File Name</Typography>
              <TextField
                sx={{ m: 1, pr: 2 }}
                fullWidth
                name="filename"
                value={fname}
                onChange={(e) => setfname(e.target.value)}
              ></TextField>
              <Button
                sx={{ m: 1 }}
                type="submit"
                variant="contained"
                onClick={() => {
                  setincomeprintopen(false)
                  handlfilename(formik.values.charttype+'t');
                }}
              >
                {" "}
                OK{" "}
              </Button>
            </Box>
          </Dialog>
          <Box
            id="TabularFormm"
            container
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              p: 3,
            }}
          >
     
            {incometemp && formik.values.charttype === 'TabularForm' && (
              <>
                {
                  <DataGrid
                    id="table"
                    rows={incometemp}
                    columns={incomecolumns}
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
                }
              </>
            )}
          </Box>
          <Box
            container
           
            id="LineChartt"
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              backgroundColor:'white',
              border:1,
              borderRadius:5,
              borderColor:grey[100]
            }}
          >
          
            {incometemp &&
              formik.values.charttype === "LineChart" && (
                <LineChart
                  xAxis={[
                    {
                      data: incometemp?.map((i)=> i._id),
                      label:
                      sdate ? 'Date' : 
                      formik.values.expenseperiod === "Quaterly"
                         ? "Quater"
                         :"Month",
                      min:0,
                      scaleType: "point"
                    },
                  ]}
                  series={[
                    {
                      data: incometemp?.map(
                        (i) => i.TotalIncome
                      ),
                      label: "income",
                    },
                  ]}
                  yAxis={[
                    {
                      min: 0,
                    },
                  ]}
                  width={400}
                  height={300}
                />
              )}{" "}
          </Box>
          <Box
            container
    
            id="PieChartt"
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              ml: 2,
      
            }}
          >
           
            {incometemp &&
              formik.values.charttype === "PieChart" && (
                <PieChart
                  series={[
                    {
                      data: incometemp,
                      highlightScope: { faded: "global", highlighted: "item" },
                      faded: {
                        innerRadius: 30,
                        additionalRadius: -30,
                        color: "gray",
                      },
                    },
                  ]}
                  height={300}
                />
              )}</Box>
         
          </Box>}
           
            </Grid>
          </Grid>



        </Box>
      </Box>
    </>
  );
}
