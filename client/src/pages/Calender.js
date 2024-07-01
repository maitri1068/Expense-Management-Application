import React, { useEffect, useState } from "react";
import { Box, Grid, Typography } from "@mui/material";
import {Calendar, momentLocalizer} from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { green, red } from "@mui/material/colors";
import axios from "axios";
import'../cssfiles/calender.css'
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import { useNavigate } from "react-router-dom";
import jsonData from "../assets/currencies.json";
moment.locale("en-GB");

const localizer = momentLocalizer(moment);

export default function Calender() {

  const [events, setEvents] = useState([]);
  const [expense,setexpense]=useState()
  const [income,setincome]=useState()
  const navigate=useNavigate()
  const data = JSON.parse(localStorage.getItem("user"));
  const id = data[0]._id;
  const symbol=jsonData.filter((obj)=>obj.name === data[0].Currancy)[0].symbol+" "
 
  useEffect(()=>{
    getdata()
    getdayinfo(new Date())
  },[])
 

  async function getexpenseincomedata(month,year){
    
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
      const i=await axios.post("http://localhost:1011/expenseperiod",{
        period:'Daily',
        userid:id,
        month:month,
        year:year
    
      }, {
        headers: {
          authorization: `Bearer ${item.value}`,
        },
      })
      const i1=await axios.post("http://localhost:1011/incomeperiod",{
        period:'Daily',
        userid:id,
        month:month,
        year:year
    
      }, {
        headers: {
          authorization: `Bearer ${item.value}`,
        },
      })
      const data=i.data.map((obj,key)=>({start:new Date(year,month,obj._id),end:new Date(year,month,obj._id),title:`- ${obj.TotalExpense.toFixed(2)}`}))
      const data1= i1.data.map((obj,key)=>({start:new Date(year,month,obj._id),end:new Date(year,month,obj._id),title:`+ ${obj.TotalIncome.toFixed(2)}`}))
   
    
      let combinedData=[]
      
      combinedData=data
      
      for(let i=0;i<combinedData.length;i++){
        let flag=0
        for(let j=0;j<data1.length;j++){
          if(new Date(combinedData[i].start).getTime() === new Date(data1[j].start).getTime()){
            combinedData[i].title=combinedData[i].title + '\n '+data1[j].title
            flag=1
           
          }
         
        }
        if(!flag)
        combinedData[i].title=combinedData[i].title + '\n + 0'
      }


      for(let i=0;i<data1.length;i++){
        let flag=1;
        for(let j=0;j<data.length;j++){
       
          if(new Date(data[j].start).getTime() === new Date(data1[i].start).getTime()){
            flag=0
          }
        }
        if(flag){
          let y={
            start:data1[i].start,
            end:data1[i].end,
            title:'- 0'+'\n '+data1[i].title
          }
          combinedData.push(y)
        }
      }

   for(let i=0;i<combinedData.length;i++){
    let x=combinedData[i].title.split('\n');

        let expense=Number(x[0]?.substr(2)).toFixed(2)
        let income=Number(x[1]?.substr(3)).toFixed(2)
       
        if(expense-income < 0){
         combinedData[i].title=combinedData[i].title+'\n +'+(income-expense)
        }
        else{
          combinedData[i].title=combinedData[i].title+'\n -'+(expense-income)
        }

   }
      

   setEvents(combinedData)
  }
  catch(error){
    console.log(error)
  }
  }

  async function getdata(){
    const month=new Date().getMonth()
    const year=new Date().getFullYear()
    getexpenseincomedata(month,year)

}
 
  async function getdayinfo(start){
    
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
      const i =await axios.post('http://localhost:1011/dayinfo',{
        userid:id,
        date:start
      },
      {
        headers: {
          authorization: `Bearer ${item.value}`,
        },
      })
     
      setexpense(i.data.expense)
      setincome(i.data.income)
    }
    catch(error){
      console.log(error)
    }
  }

  const handleSlotSelect = async({ start }) => {
    getdayinfo(start)
   

  };

  const handleNavigate = async(event)=>{
    const month=new Date(event).getMonth()
    const year=new Date(event).getFullYear()
    getdayinfo(new Date(year,month,1))
    getexpenseincomedata(month,year)
  
  }
  const CustomToolbar = toolbar => {
    const goToToday = () => {
      toolbar.onNavigate('TODAY');
    };
  
    const goToNext = () => {
      toolbar.onNavigate('NEXT');
    };
  
    const goToBack = () => {
      toolbar.onNavigate('PREV');
    };
    const currentDate = moment(toolbar.date);
    const formattedDate = currentDate.format('MMMM YYYY');
    return (
      <>
      <Box container sx={{m:1}}>
      <ButtonGroup variant="outlined" aria-label="Basic button group" sx={{mr:10}}>
  <Button onClick={goToBack}>Back</Button>
  <Button  onClick={goToToday}>Current Month</Button>
  <Button  onClick={goToNext}>Next</Button>
</ButtonGroup>

{formattedDate}
      </Box>
      </>
    
    );
  };
  const dayStyleGetter = (date) => {
    let backgroundColor='inherit';
    const hasEvents = events.some(event => 
      {
       if( moment(event.start).isSame(date, 'day')){
        let x=event.title.split('\n');
        let expense=Number(x[0]?.substr(2))
        let income=Number(x[1]?.substr(3))
        if(expense-income < 0){
          backgroundColor=green[100]
        }
        else{
          backgroundColor=red[100]
        }
       
       }
      }
   );

    
    const style = {
      backgroundColor,
    };
    return {
      style: style
    };
  };
  
  const eventStyleGetter = (event, start, end, isSelected) => {
   
    let backgroundColor = 'inherit'; 
   
    return {
      style: {
        backgroundColor,
        borderRadius: '5px',
        opacity: '0.8',
        // fontWeight:'bold',
        color: 'black',
        border: '0px',
        display: 'block',
        margin: '2px',
        cursor:'default',
      },
  
    };
  };

  return <>
  <Box container>
  <Typography variant='h5' sx={{m:3,fontWeight:'bold'}}>Calendar</Typography> 
  
  <Box container >
  <Grid container spacing={2}>
    <Grid item xs={12} sm={12} md={8}>
    <Box className='calenderbox'  sx={{maxWidth:900}}>

        <Calendar
          localizer={localizer}
          defaultDate={new Date()}
          views={['month']} 
          selectable={true}
          defaultView="month"
          events={events}
          style={{ height: "100vh" }}
          onSelectSlot={handleSlotSelect}
            titleAccessor={(event) => (
              <Box container onClick={()=>{getdayinfo(event.start)}} >
                {event.title.split("\n").map((line, index) => (
                  (index === 2 ? <Box sx={{textAlign:'center'}}><Typography  sx={{fontWeight:'bold',color:(line[1] ==='+'?'green':'red')}}>{line}</Typography></Box> : <><Box>{line}</Box></>)
                ))}
                
              </Box>
            )}
            components={{
              
              toolbar: CustomToolbar
            }}
            onNavigate={handleNavigate}
            dayPropGetter={dayStyleGetter}
           
            eventPropGetter={eventStyleGetter} 
        />
    
      </Box>
    </Grid>
    <Grid item xs={12} sm={12} md={4}>
      <Box container sx={{m:2,mt:7}}>   <Box  container >
         <Typography sx={{fontWeight:'bold'}}>Expense Details</Typography>
     
         {expense && expense?.map((obj)=>(
           <Box container sx={{mt:1,p:1,backgroundColor:red[50],border:1,borderColor:red[100],borderRadius:5}}>
           <Grid container>
             <Grid item xs={6} sm={6} md={8}><Typography>{obj.Category}</Typography></Grid>
             <Grid item  xs={6} sm={6} md={4}><Typography>{symbol}{obj.Amount.toFixed(2)}</Typography></Grid>
           </Grid>
           <Typography>{obj.Description}</Typography>
           <Typography>{obj.Date?.substr(0,10)}</Typography>
           </Box>      
         ))} 
         {expense && expense.length === 0 ? <Typography>Sorry, you dont have expenses on this day </Typography>: null}
          
        </Box>

        <Box container sx={{mt:3}}>
         <Typography sx={{fontWeight:'bold'}}>Income Deatils</Typography>
      
         {income && income?.map((obj)=>(
           <Box container sx={{mt:1,p:1,backgroundColor:green[50],border:1,borderColor:green[100],borderRadius:5}}>
           <Grid container>
             <Grid item xs={6} sm={6} md={8}><Typography>{obj.SourceOfIncome}</Typography></Grid>
             <Grid item  xs={6} sm={6} md={4}><Typography>{symbol}{obj.Amount.toFixed(2)}</Typography></Grid>
           </Grid>
           <Typography>{obj.Date?.substr(0,10)}</Typography>
           </Box>      
         ))} 
         {income && income.length === 0 && <Typography>Sorry, you dont have income on this day</Typography>}
          
        </Box></Box>
   
    </Grid>

  </Grid>
  
  </Box>
  </Box>
 
  </>;
}
