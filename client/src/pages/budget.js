import { Box, Grid, Typography, FormControl,Button, TextField , Dialog,} from '@mui/material'
import { useFormik } from 'formik'
import { styled } from '@mui/material/styles';
import React, { useEffect, useState } from 'react'
import * as Yup from 'yup'
import { green } from '@mui/material/colors';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import axios from 'axios';
import MuiAccordion from '@mui/material/Accordion';
import MuiAccordionSummary from '@mui/material/AccordionSummary';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import { useNavigate } from 'react-router-dom';

const Accordion = styled((props) => (
    <MuiAccordion disableGutters elevation={0} square {...props} />
  ))(({ theme }) => ({
    border: `1px solid ${theme.palette.divider}`,
    '&:not(:last-child)': {
      borderBottom: 0,
    },
    '&::before': {
      display: 'none',
    },
  }));
  
  const AccordionSummary = styled((props) => (
    <MuiAccordionSummary
      {...props}
    />
  ))(({ theme }) => ({
    flexDirection: 'row-reverse',
    '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
      transform: 'rotate(90deg)',
    },
    '& .MuiAccordionSummary-content': {
      marginLeft: theme.spacing(1),
    },
  }));
  
  const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
    padding: theme.spacing(2),
  }));
  
export default function Budget() {
    const [open,setopen]=useState(false)
    const [category,setcategory]=useState()
    const [Essential,setessential]=useState(0)
    const [Discreationary,setdiscreationary]=useState(0)
    const [Saving,setsaving]=useState(0)
    const [Dept,setdept]=useState(0)
    const [Insurance,setinsurance]=useState(0)
    const [Emergency,setemergency]=useState(0)
    const [income,setincome]=useState()
    const [expanded, setExpanded] = React.useState('panel1');
    const user=JSON.parse(localStorage.getItem('user'))
    const id=user[0]._id
    const navigate=useNavigate()

    const [list,setlist]=useState([{name:'Essential Expenses',subCategory:['Housing','Education','Taxes','Transportation']},{name:'Discreationary Spending',subCategory:['Personal Care','Food','Clothing','Entertainment']},{name:'Saving & Investment',subCategory:['stock','SIP']},{name:'Dept Payment',subCategory:['loan']},{name:'Insurance',subCategory:['Medical','Car']},{name:'Emergency',subCategory:['medical']}])

    const formik = useFormik({
        initialValues : {
        Amount:'',
        },
        validationSchema: Yup.object({
        Amount:Yup.number().required('Amount required'),
        }),
        onSubmit: (values, { resetForm }) => {
            setopen(false)
    
         createbudget(values,category)
         resetForm()
        },
      });

      async function getdata(){
        const key='Category'+id
        const categorytemp=JSON.parse(localStorage.getItem(key))
        if(categorytemp){
          setlist(categorytemp)
        }
        const itemString = localStorage.getItem("token");

        const item = JSON.parse(itemString);
        const now=new Date()
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
            const i=await axios.post('http://localhost:1011/budgetinfo',{
                userid:id
            },{
              headers: {
                authorization: `Bearer ${item.value}`,
              },
            })

            const income = await axios.post("http://localhost:1011/userincomee", {
      
            userid: id,
         
        },{
          headers: {
            authorization: `Bearer ${item.value}`,
          },
        });
            setincome(income.data[0].TotalIncome)
           
            i.data.forEach(e => {
                e.Category === 'Essential Expenses' ? setessential(e.Amount) : e.Category === 'Discreationary Spending' ? setdiscreationary(e.Amount) : e.Category === 'Saving & Investment' ? setsaving(e.Amount) : e.Category === 'Dept Payment' ? setdept(e.Amount) : e.Category === 'Insurance' ? setinsurance(e.Amount) :  setemergency(e.Amount) 
            });
        }
        catch(error){
            console.log(error)
        }
      }

      useEffect(()=>{
        getdata()
      },[])

 

      const handleChange = (panel) => (event, newExpanded) => {
        setExpanded(newExpanded ? panel : false);
      };

      async function createbudget(values,category){
        const budget={
            Category:category,
            Amount:values.Amount,
            userid:id
        }
        try{
            const i=await axios.post('http://localhost:1011/budget',{
                data:budget
            })
            if(i.status === 201){
                category === 'Essential Expenses' ? setessential(values.Amount) : category === 'Discreationary Spending' ? setdiscreationary(values.Amount) : category === 'Saving & Investment' ? setsaving(values.Amount) : category === 'Dept Payment' ? setdept(values.Amount) : category === 'Insurance' ? setinsurance(values.Amount) :  setemergency(values.Amount) 
            }

        }
        catch(error){
            console.log(error)
        }
      }

      async function handlebudgetcategory(val){
        setcategory(val)
        setopen(true)
       
      }
  return (
    
    <Box container>
        <Typography variant='h5' sx={{m:3,fontWeight:'bold'}}>My Budget</Typography> 
        <Box container sx={{m:1,p:2}}>
            <Box container sx={{backgroundColor:green[50],border:2,borderColor:green[100],borderRadius:3,p:1,mb:2,textAlign:'center'}}><Typography variant='h6' sx={{fontWeight:'bold'}}>Income :{income}</Typography></Box>
        <Grid container spacing={2}>
            {list.map((obj,ind)=>{
                return (<>
                <Grid item xs={4} sm={4} md={4}>
        <Accordion expanded={expanded === 'panel'+(ind+1)} onChange={handleChange('panel'+(ind+1))}>
        <AccordionSummary
          aria-controls={'panel'+(ind+1)+'d-content'}  
          id={"panel"+(ind+1)+"d-header"}
        >
       <Box sx={{m:1,p:1}}>
                <Typography sx={{fontSize:40}}>{ obj.name === 'Essential Expenses' ? Essential : obj.name === 'Discreationary Spending' ? Discreationary : obj.name === 'Saving & Investment' ?Saving : category === 'Dept Payment' ? Dept : obj.name === 'Insurance' ? Insurance :  Emergency }</Typography>
                <Typography sx={{mt:3}}>{obj.name}<EditRoundedIcon fontSize='small' sx={{ml:2}} onClick={()=>{handlebudgetcategory(obj.name)}}></EditRoundedIcon></Typography>
            </Box>
        </AccordionSummary>
        <AccordionDetails>
          
         <Box container sx={{ml:1,pl:1}} >
            {obj.subCategory && obj.subCategory.map((o)=>{
                return (<>
                <Typography>{o}</Typography>
                </>)
            })}     
         </Box>
        </AccordionDetails>
      </Accordion>
           
        </Grid>
                </>)
            })}
        </Grid>
        <Dialog open={open}>
        <Box container sx={{textAlign:'end' ,p:1}}>   <CloseRoundedIcon  onClick={()=>{setopen(false)}}></CloseRoundedIcon>
        
        <Box container sx={{m:1,p:1,textAlign:'start'}}>
            <Typography>{category}</Typography>
                <form onSubmit={formik.handleSubmit}>
                <FormControl>
                 
                    <TextField variant='standard' type='number' label='Enter Budget' name='Amount' value={formik.values.Amount} onChange={formik.handleChange} onBlur={formik.handleBlur}></TextField>

                </FormControl>
                {formik.touched['Amount'] && formik.errors['Amount'] && (
                    <div style={{color:'red'}}>{formik.errors['Amount']}</div>
                )}
                <Box sx={{mt:1,textAlign:'center'}}><Button variant='contained' type='submit'>OK</Button></Box>
                
                </form>
              

            </Box>
        </Box>
            
        </Dialog>
        </Box>
    </Box>
  )
}
