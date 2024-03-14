import { Avatar, Box, Grid, IconButton, Typography } from '@mui/material'
import { purple } from '@mui/material/colors'
import React, { useEffect, useState } from 'react'
import './temp.css'
import Menuroute from './menuroute'
import AccountBalanceRoundedIcon from "@mui/icons-material/AccountBalanceRounded";
import AssessmentRoundedIcon from "@mui/icons-material/AssessmentRounded";
import CategoryRoundedIcon from "@mui/icons-material/CategoryRounded";
import PaidRoundedIcon from "@mui/icons-material/PaidRounded";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import InsightsRoundedIcon from '@mui/icons-material/InsightsRounded';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded'; 

import { Link, useNavigate } from 'react-router-dom';
import Dashboard from './dashboard'

export default function Temp() {
  
    const navigate=useNavigate()
    useEffect(()=>{
      navigate('/dashboard')
    },[])

    const menuItems = [{Name:'Dashboard',url:'/dashboard'},{Name:'My Expense',url:'/expense'} ,{Name:'My Income',url:'/income'} , {Name:'Reports And Analytics',url:'/reports'}, {Name:'Categorization',url:'/categorization'},{Name:'Calendar View',url:'/calender'} ];
 
    function handlelogout() {
      localStorage.clear()
      localStorage.setItem('form',JSON.stringify(1))
      navigate("/login");
  }

  return (
    <>
    <Box container sx={{p:5}} className='body'>
        <Grid container spacing={3}>
            <Grid item xs={12} sm={12} md={3}>
            <Box container sx={{p:2}} className='container'>


                <Grid container className='header' >
                    <Grid item xs={2} sm={2} md={2}>
                    <IconButton
            color="black"
            size="large"
          >
            <Avatar
              sx={{ width: 32, height: 32, backgroundColor: purple[300] }}
            >
              {JSON.parse(
                localStorage.getItem("user")
              ) && JSON.parse(
                localStorage.getItem("user")
              )[0].userName[0].toUpperCase()}
            </Avatar>
          </IconButton>
                    </Grid>
                    <Grid item xs={10} sm={10} md={10} sx={{display:'flex'}} >

                        <Typography sx={{m:1}}>
                            
                            {JSON.parse(
                localStorage.getItem("user")
              ) && JSON.parse(
                localStorage.getItem("user")
              )[0].userName}
              </Typography>
                    </Grid>
                </Grid>

                <Grid>
                <Box sx={{mt:3}}>
                    {menuItems && menuItems?.map((obj,index)=>(
                        <>
                        <Link to={obj.url} style={{textDecoration:'none',color:'black'}}> <Typography className='menu'> {index === 0 && (
                    <InsightsRoundedIcon sx={{mr:1}}></InsightsRoundedIcon>
                  )}
                  {index === 1 && (
                    <AccountBalanceRoundedIcon sx={{mr:1}}></AccountBalanceRoundedIcon>
                  )}
                  {index === 2 && (
                    <PaidRoundedIcon sx={{mr:1}}></PaidRoundedIcon>
                  )}
                  {index === 3 && <AssessmentRoundedIcon sx={{mr:1}}></AssessmentRoundedIcon>}
                  {index === 4 && <CategoryRoundedIcon sx={{mr:1}}></CategoryRoundedIcon>}
                  {index === 5 && (
                    <CalendarMonthRoundedIcon sx={{mr:1}}></CalendarMonthRoundedIcon>
                  )}{obj.Name}</Typography></Link>
                       </>
                        
                    ))}
                </Box>
                </Grid>


                <Grid sx={{mt:10}}>
                    <Box >
                      <Link to='/setting' style={{textDecoration:'none',color:'black'}}> <Typography className='menu'><SettingsRoundedIcon sx={{mr:1}}></SettingsRoundedIcon>Setting</Typography></Link>
                     
                        <Typography className='menu' onClick={handlelogout}><PersonRoundedIcon sx={{mr:1}}></PersonRoundedIcon>LogOut</Typography>
                    </Box>
                </Grid>
          
            </Box>
            </Grid>
            <Grid item xs={12} sm={12} md={9}>
            <Box container sx={{p:3}} className='container items'>
                 <Menuroute></Menuroute>    
            </Box>
            </Grid>
        </Grid>
    </Box>

 
    
      
    </>
  )
}
