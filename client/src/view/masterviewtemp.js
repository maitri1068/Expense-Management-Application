import React, { FunctionComponent, useState } from "react";
import {
  Container,
  Typography,
  Button,
  Dialog,
  IconButton,
  FormControl,
  TextField,
  InputAdornment,
  Box,
  Grid,
  Snackbar,
  Alert,
  Slide,
} from "@mui/material";
import '../cssfiles/masterview.css'
import CloseIcon from "@mui/icons-material/Close";
import Masterform from "./masterform";
import Tableview from "./tableviewtemp";
import { useDispatch, useSelector } from "react-redux";

import * as Yup from "yup";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import { blue, green, grey, lightGreen, pink, purple, red } from "@mui/material/colors";
import { Label } from "@mui/icons-material";
import axios from "axios";
import { UseDispatch } from "react-redux";
import { setdata } from "../store/store";
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { isNumber } from "@mui/x-data-grid/internals";
import { useNavigate } from "react-router-dom";
import jsonData from "../assets/currencies.json";

export default function Masterview({
  handleopenform,
  handlecloseform,
  handlesubmitform,
  handleupdatemodal,
  handledeletemodal,
  handleupdateform,
  handlepreview
}) {
  const dispatch = useDispatch();
  const reduxStore = useSelector((store) => store.stud);
  const data = JSON.parse(localStorage.getItem("user"));
  const id = data[0]._id;
  const navigate = useNavigate();
  const symbol=jsonData.filter((obj)=>obj.name === data[0].Currancy)[0].symbol+" "

  const handleClick = () => {
    const searchInput = document.getElementById('search');
  if (searchInput) {
    searchInput.value = "";
    setShowClearIcon("none");
   
    let v = { value: "", userid: id };
    getsearchdata(v)
  }
  };

  async function getsearchdata(v){
  
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
    if(v.value !== 0){
      if(reduxStore.pageRights.formName === 'expense'){
        try {
          let i = await axios.post("http://localhost:1011/searchexpense", { value: v },   {
            headers: {
              authorization: `Bearer ${item.value}`,
            },
          });

          dispatch(setdata({ info: i.data }));
        } catch (error) {
          console.log(error);
        }
      }
      else if(reduxStore.pageRights.formName === 'income'){
        try {
          let i = await axios.post("http://localhost:1011/searchincome", { value: v },   {
            headers: {
              authorization: `Bearer ${item.value}`,
            },
          });

          dispatch(setdata({ info: i.data }));
        } catch (error) {
          console.log(error);
        }
      }
    }
    else{

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
  
      if(reduxStore.pageRights.formName === 'expense'){
        
        try {
  
          let i = await axios.post("http://localhost:1011/expensedetail", { userid: id },{
            headers: {
              authorization: `Bearer ${item.value}`,
            },
          });

          dispatch(setdata({ info: i.data }));
        } catch (error) {
          console.log(error);
        }
      }
      else if(reduxStore.pageRights.formName === 'income'){
        try {
          let i = await axios.post("http://localhost:1011/incomedetail", { userid: id },{
            headers: {
              authorization: `Bearer ${item.value}`,
            },
          });

          dispatch(setdata({ info: i.data }));
        } catch (error) {
          console.log(error);
        }
      }
    }
    
  }

  const handleChange = async (event) => {
    const data = JSON.parse(localStorage.getItem("user"));
    const id = data[0]._id;
    let val = event.target.value;
    if(isNumber(Number(val))){
      val=Number(val)
    }
    let v = { value: val, userid: id };

   getsearchdata(v)
    
    setShowClearIcon(event.target.value === "" ? "none" : "flex");
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    dispatch(setdata({modal:{'submission':false}}))
  };

 
  const [showClearIcon, setShowClearIcon] = useState("none");
  return (
    <Box container>
<Typography variant='h5' sx={{m:3,fontWeight:'bold'}}>{reduxStore.pageRights.pageName}</Typography> 
  
    <Grid container spacing={2}>
        <Grid item xs={12} sm={12} md={5}>
            <Box container className='form'>
         <Masterform
          handleopenform={handleopenform}
          handlesubmitform={handlesubmitform}
          handlecloseform={handlecloseform}
          handleupdateform={handleupdateform}
        />
        
       
            </Box>
      
        </Grid>
        <Grid item xs={12} sm={12} md={7} >
        <Box container className='expensecontainer'>
        <TextField
        id="search"
                sx={{
                    ml:3,
                  minWidth: 100,
                  width: "100%",
                  maxWidth: 500,
                  "@media (max-width: 600px)": {
                    width: "90%",
                    maxWidth: 300,
                  },
                }}
                size="small"
                variant="outlined"
                onChange={handleChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment
                      position="end"
                      style={{ display: showClearIcon }}
                      onClick={handleClick}
                    >
                      <ClearIcon />
                    </InputAdornment>
                  ),
                }}
              />

              <Box container>
              <Tableview
              handlepreview={handlepreview}
        handleupdatemodal={handleupdatemodal}
        handledeletemodal={handledeletemodal}
      /> 
           <Dialog open={reduxStore.modal.preview} >
            <Box container sx={{textAlign:'end' ,p:1}}>   <CloseRoundedIcon  onClick={()=>{dispatch(setdata({modal:{preview:false}}))}}></CloseRoundedIcon>
                <Box container sx={{m:1,p:1,textAlign:'start'}}>
                 
                  <Typography  sx={{m:1,fontSize:20,fontWeight:'bold'}}>{reduxStore.pageRights.formName === 'expense' ? 'Expense Information' : 'Income Information' }</Typography>
                  <Box container sx={{p:1,m:1,mt:2,backgroundColor:`rgb(240, 234, 254)`,border:1,borderColor:`rgb(240, 234, 254)`,borderRadius:5}}>
                    <Grid container spacing={2}>
                      <Grid item xs={6} sm={8} md={8}>
                        <Box Container sx={{m:2,width:500}}>
                          {reduxStore.pageRights.formName === 'expense' ?(<> <Typography  sx={{m:1,fontSize:18,fontWeight:'bold'}}>Category : {reduxStore.preview.Category}</Typography>
                       <Typography  sx={{m:1,fontSize:18,fontWeight:'bold',overflowWrap:'break-word'}}>Description : {reduxStore.preview.Description}</Typography> 
                       <Typography  sx={{m:1,fontSize:18,fontWeight:"bold",overflowWrap:'break-word'}}>Date : {reduxStore.preview.Date?.substr(0,10)}</Typography>
                       <Typography  sx={{m:1,fontSize:18,fontWeight:'bold',overflowWrap:'break-word'}}>Merchant : {reduxStore.preview.Merchant}</Typography>
                       <Typography  sx={{m:1,fontSize:18,fontWeight:'bold',overflowWrap:'break-word'}}>PaidBy : {reduxStore.preview.PaidBy}</Typography>
                       <Typography  sx={{m:1,fontSize:18,fontWeight:'bold',overflowWrap:'break-word'}}>PaymentMode : {reduxStore.preview.PaymentMode}</Typography></>) : <>
                      
                       <Typography  sx={{m:1,fontSize:18,fontWeight:'bold',overflowWrap:'break-word'}}>SourceOfIncome : {reduxStore.preview.SourceOfIncome}</Typography> 
                       <Typography  sx={{m:1,fontSize:18,fontWeight:"bold",overflowWrap:'break-word'}}>Date : {reduxStore.preview.Date?.substr(0,10)}</Typography> </>}
                       
                       
                        </Box>
                      
                      </Grid>
                      <Grid item xs={6} sm={4} md={4}>
                        <Box container sx={{m:1}}>     <Box sx={{background:reduxStore.pageRights.formName === 'expense' ? red[100] : green[100],p:2,textAlign:'center',fontWeight:'bold',border:1,borderColor:reduxStore.pageRights.formName === 'expense' ? red[200] : green[200],borderRadius:10,overflowWrap:'break-word'}}>{symbol}{reduxStore.preview.Amount?.toFixed(2)}</Box>
                   </Box>
                
                      </Grid>
                    </Grid>
                  </Box>
                </Box></Box>
        
          </Dialog>
              </Box>
        </Box>
        </Grid>
    </Grid>


    <Snackbar open={reduxStore.modal.submission} autoHideDuration={3000}  onClose={handleClose}  
    // TransitionComponent={Slide}  
  anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}>
   
     <Alert
   
   severity={(reduxStore.error.title || reduxStore.error.overspending) ? 'error' : 'success'}
   variant="filled"
   sx={{ width: '100%' }}
 >
   {}
  {reduxStore.error.title ? 'not valid transaction': reduxStore.error.overspending ? ('Overspending in '+reduxStore.error.Category) : 'Successfully inserted'}
 </Alert>
 
</Snackbar>
    </Box>
  );
}
