import { Box, Grid, Typography ,Button, Dialog} from '@mui/material'
import { blue, green, purple, red } from '@mui/material/colors'
import axios from 'axios'

import React, { useEffect, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';

export default function Reimbursement() {


  const user=JSON.parse(localStorage.getItem('user'))
  const id=user[0]._id
  const [get,setget]=useState(0)
  const [pay,setpay]=useState(0)
  const [open,setopen]=useState(false)
  const [transaction,settransaction]=useState()
  const navigate=useNavigate()
  useEffect(()=>{
    getdata()
  },[])

  async function getdata(){
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
      const i=await axios.post('http://localhost:1011/reimbursementinfo',{
        userid:id,
        transaction:'mytransaction',
        paidby:'me',
        flag:'pay'
      },   {
        headers: {
          authorization: `Bearer ${item.value}`,
        },
      })

      const i1=await axios.post('http://localhost:1011/reimbursementinfo',{
        userid:id,
        transaction:'othertransaction',
        paidby:'me',
        flag:'get'
      },   {
        headers: {
          authorization: `Bearer ${item.value}`,
        },
      })


      let combinedata=[]
      combinedata=i.data
      for(let i=0;i<combinedata.length;i++){
        for(let j=0;j<i1.data.length;j++){
          if(combinedata[i]._id === i1.data[j]._id){
            combinedata[i].TotalAmount=combinedata[i].TotalAmount-i1.data[j].TotalAmount
          }
        }
      }

      for(let i=0;i<i1.data.length;i++){
        const x=combinedata.filter((obj)=>obj._id === i1.data[i]._id)
  
        if(x.length === 0){
          i1.data[i].TotalAmount=(- i1.data[i].TotalAmount)
          combinedata.push(i1.data[i])
        }
      }
      localStorage.setItem('reimbursementinfo',JSON.stringify(combinedata))
    

     let g=0
     let p=0
      combinedata.forEach(e=> {
       if(e.TotalAmount < 0){
        g=g+Math.abs(e.TotalAmount)
       }
       else{
        p=p+e.TotalAmount
       }
      });

      setget(g)
      setpay(p)

    }

    catch(error){
      console.log(error)
    }
  

  }

  async function getinfo(name){
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
      const i=await axios.post('http://localhost:1011/reimbursementtransaction',{
        name:name
      },{
        headers: {
          authorization: `Bearer ${item.value}`,
        },
      })
      settransaction(i.data)

    }
    catch(error){
    console.log(error)
    }
  }

  return (
    <Box container>
         <Typography variant='h5' sx={{m:3,fontWeight:'bold'}}>Reimbursement</Typography> 
          <Box container>
            <Grid container spacing={5}>
              <Grid item xs={10} sm={10} md={8}>
                <Box>
                {JSON.parse(localStorage.getItem('reimbursementinfo')) && JSON.parse(localStorage.getItem('reimbursementinfo')).map((obj)=>{
                  return (<>
                  <Box container sx={{backgroundColor:`rgb(240, 234, 254)`,border:1,borderColor:`rgb(218, 202, 255)`,borderRadius:3,m:1,p:2}} onClick={()=>{setopen(true)
                  getinfo(obj._id)}}>
                    <Grid container >
                      <Grid item xs={10} sm={10} md={10}>
                        <Typography sx={{fontWeight:'bold'}}>{obj._id}</Typography>
                      </Grid>
                      <Grid item xs={2} sm={2} md={2}>
                        <Typography sx={{color:(obj.TotalAmount < 0 ? 'green' : 'red'),fontWeight:'bold'}}>{obj.TotalAmount < 0 ? '+' : '-'}{Math.abs(obj.TotalAmount.toFixed(2))}</Typography>
                      </Grid>
                    </Grid>
                  </Box>
                  </>)
                })}
                <Dialog open={open}>
                <Box container sx={{textAlign:'end' ,p:1}}>   <CloseRoundedIcon  onClick={()=>{setopen(false)}}></CloseRoundedIcon>
                <Box container sx={{m:1,p:1,textAlign:'start'}}>
                 <Typography sx={{fontWeight:'bold',fontSize:20}}>Transactions</Typography>
                  <Box container sx={{p:1}}>
                    {transaction && transaction.map((obj)=>{
                      return (<>
                      <Box container sx={{mt:2,p:2,backgroundColor:(obj.PaidBy === 'me' ? green[50] : red[50]),border:2,borderColor:(obj.PaidBy === 'me' ? green[100] : red[100]),borderRadius:5,minWidth:500}}>
                        <Grid container spacing={5}>
                          <Grid item xs={8} sm={8} md={8}>
                          <Typography sx={{overflowWrap:'break-word',fontWeight:'bold'}}>{obj.Category}</Typography>
                          <Typography sx={{overflowWrap:'break-word'}}>{obj.Description}</Typography>
                          <Typography sx={{overflowWrap:'break-word'}}>{obj.Date?.substr(0,10)}</Typography>
                          </Grid>
                          <Grid item xs={4} sm={4} md={4}>
                          <Typography sx={{overflowWrap:'break-word',fontWeight:'bold'}}>{obj.Amount.toFixed(2)}</Typography>
                          <Typography sx={{overflowWrap:'break-word'}}>PaidBy: {obj.PaidBy}</Typography>
                          <Typography sx={{overflowWrap:'break-word'}}>To: {obj.Merchant}</Typography>
                          </Grid>
                        </Grid>
                      </Box>
                      
                      </>)
                    })}
                  </Box>
                </Box>
                </Box>
                </Dialog>
                </Box>
              </Grid>
              <Grid item xs={2} sm={2} md={4}>
                <Box container sx={{p:1}}>  
                  <Box>
                  <Button variant='contained' fullWidth sx={{backgroundColor:green[100],color:'green',m:1,fontWeight:'bold',fontSize:20}}>{get.toFixed(2)}</Button>
                </Box>
                <Box>
                  <Button variant='contained' fullWidth sx={{backgroundColor:red[100],color:'red',m:1,fontWeight:'bold',fontSize:20}}>{pay.toFixed(2)}</Button>
                </Box>
                </Box>
              
              </Grid>
            </Grid>
          </Box>
    </Box>
  )
}
