import React, { useState, useEffect } from "react";
import "../cssfiles/tableview.css";
import axios from "axios";
import {
  
  Box,
  Typography,
  Grid,
  Dialog,
  Pagination,
} from "@mui/material";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { useSelector, useDispatch } from "react-redux";
import { setdata } from "../store/store";
import { DataGrid } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useNavigate } from "react-router-dom";
import jsonData from "../assets/currencies.json";
import { green, red } from "@mui/material/colors";


export default function Tableview({ handleupdatemodal, handledeletemodal,handlepreview }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const reduxStore = useSelector((state) => state.stud);
  const [currentPage,setcurrentpage]=useState(1)
  const user=JSON.parse(localStorage.getItem("user"));
  const id = user[0] && user[0]._id;
  const symbol=jsonData.filter((obj)=>obj.name === user[0].Currancy)[0].symbol+" "


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

    if (reduxStore.pageRights.formName === "income") {
      try {
        const expense = await axios.post(
          "http://localhost:1011/incomedetail",
          { userid: id },
          {
            headers: {
              authorization: `Bearer ${item.value}`,
            },
          }
        );

        dispatch(setdata({ info: expense.data }));
      } catch (e) {
        console.log(e);
      }
    } else if (reduxStore.pageRights.formName === "expense") {
      try {
      
        const expense = await axios.post(
          "http://localhost:1011/expensedetail",
          { userid: id },
          {
            headers: {
              authorization: `Bearer ${item.value}`,
            },
          }
        );

        dispatch(setdata({ info: expense.data }));
      } catch (e) {
        console.log(e);
      }
    }
  }

  let data = reduxStore.info;
  useEffect(() => {
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
 
  const dataperpage=4
  const pagesize=Math.ceil(data.length/dataperpage)
 

  const handlePageChange = (event, page) => {
    setcurrentpage(page);
  };

  const getPageData = () => {
    let data=reduxStore.info
    data = data.map((key, ind) => ({ ...key, id: ind + 1 }));
    const startIndex = (currentPage - 1) * dataperpage;
    const endIndex = startIndex + dataperpage;
    return data.slice(startIndex, endIndex);
  };

  return (
    <Box
      container
      sx={{
        display: "flex-row",
        justifyContent: "center",
        alignItems: "center",
      }}
    >

      { reduxStore.pageRights.formName === 'expense' ?
         getPageData().map((s)=>{
          return(
            <Box container className='box' >
              <Grid container>
                <Grid item xs={12} sm={11} md={11}>
                <Grid container>
                  <Grid item xs={12} sm={9} md={9} sx={{fontWeight:'bold'}}>
                  {s.Category}
                  </Grid>
                  <Grid  item xs={12} sm={3} md={3} sx={{color:red[500],fontWeight:'bold'}}>
                  {symbol}{s.Amount?.toFixed(2)}
                  </Grid>
                </Grid>
                <Typography sx={{overflowWrap:'break-word'}}>{s.Description}</Typography>
                <Typography  sx={{overflowWrap:'break-word'}}>{Number(s.Date?.substr(8,2))+ " "+month[Number(s.Date?.substr(5,2))-1]+", "+Number(s.Date?.substr(0,4))}</Typography>
                </Grid>
                <Grid item xs={12} sm={1} md={1}>
                  <Typography> <VisibilityIcon sx={{borderRadius:'50%',width:20,height:20}} color='secondary' onClick={() => handlepreview(s._id)} ></VisibilityIcon></Typography>
             
                  <Typography> <EditIcon sx={{borderRadius:'50%',width:20,height:20}} color='primary' onClick={() => handleupdatemodal(s._id)}></EditIcon></Typography>
                  <Typography> <DeleteIcon sx={{borderRadius:'50%',width:20,height:20}} color='error' onClick={() => handledeletemodal(s._id)}></DeleteIcon></Typography>
               
               
               
                </Grid>
                
              </Grid>
             
            
          </Box>
          )
         }): getPageData().map((s)=>{
            return(
              <Box container className='box' >
               <Grid container>
                <Grid item xs={12} sm={10} md={11}>
                <Grid container>
                  <Grid item xs={12} sm={9} md={9} >
                    <Typography sx={{overflowWrap:'break-word',fontWeight:"bold"}}>    {s.SourceOfIncome}</Typography>
              
                  </Grid>
                  <Grid  item xs={12} sm={3} md={3} >
                    <Typography  sx={{overflowWrap:'break-word',color:green[500],fontWeight:'bold'}}> {symbol} {s.Amount?.toFixed(2)}</Typography>
                   
                  </Grid>
                </Grid>
                <Typography  sx={{overflowWrap:'break-word'}}>{Number(s.Date?.substr(8,2))+ " "+month[Number(s.Date?.substr(5,2))-1]+", "+Number(s.Date?.substr(0,4))}</Typography>
                </Grid>
                <Grid item xs={12} sm={1} md={1}>
                  <Typography> <VisibilityIcon sx={{borderRadius:'50%',width:20,height:20}} color='secondary' onClick={() => handlepreview(s._id)} ></VisibilityIcon></Typography>
                  <Typography> <EditIcon sx={{borderRadius:'50%',width:20,height:20}} color='primary' onClick={() => handleupdatemodal(s._id)}></EditIcon></Typography>
                  <Typography> <DeleteIcon sx={{borderRadius:'50%',width:20,height:20}} color='error' onClick={() => handledeletemodal(s._id)}></DeleteIcon></Typography>
               
               
               
                </Grid>
                
              </Grid>
            </Box>
            )
           })
        }
        <Box  sx={{justifyContent:'center',alignItems:'center',display:'flex'}}>
          <Pagination size="large" count={pagesize}
        page={currentPage}
        onChange={handlePageChange}
       color="secondary"></Pagination>
        </Box>
    
    </Box>
  );
}
