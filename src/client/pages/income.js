import React from 'react'
import Controller from '../controller/controller';
import { string,number,date } from "yup";
import * as Yup from "yup";
import { useDispatch, useSelector } from 'react-redux';
import { setdata } from '../store/store';
import { Box, Dialog, TextField } from '@mui/material';
import Dashboardnav from './dashboardnav';
import { green } from '@mui/material/colors';
import { Window } from '@mui/icons-material';
import './income.css'

export default function Expense() {
    
    
    const dispatch=useDispatch()
    const formfield=[
        
        {name:'SourceOfIncome',label:'SourceOfIncome',type:'text'},
        {name:'Date',label:'Date',type:'date'},
        {name:'Amount',label:'Amount',type:'number'},  
    ]

    const formValidation={
       SourceOfIncome:string().required("Source of income required"),
       Date:date().required("Date required"),
       Amount:number().required("Amount required").min(0),
    }

    const tableviewfield=[
        {id:'SourceOfIncome',name:'SourceOfIncome',label:'SourceOfIncome',type:'text'},
        {id:'Date',name:'Date',label:'Date',type:'text'},
        {id:'Amount',name:'Amount',label:'Amount',type:'text'},
    ]
    
    const pageRights={
        pageName:"My Income",formName:"income",addForm:true,isviewupdate:true,update:true,delete:true
    }
  
    dispatch(setdata({formfield,formValidation,tableviewfield,pageRights}))

  return (
    <Box >
    {/* <Dashboardnav></Dashboardnav> */}
    
    <Controller/>
   
       </Box>
  )
}
