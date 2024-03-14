import React from 'react';
import img1 from '../assets/m1.png';
import dashboard from '../assets/dashboard.png';
import { Box, Grid, Typography, Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import './content.css';
import { purple } from '@mui/material/colors';
import { useNavigate } from 'react-router-dom';

export default function Content() {
  const navigate=useNavigate(

  )
  return (
    <div className='body'  >
      <Box container className='start' sx={{ p:8,pt:15}}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Box
              container
              sx={{
                mt: { xs: 0, md: 15 },
                p: { xs: 2, md: 4 },
                textAlign: 'start',
                justifyContent: 'center',
              }}
            >
              <Typography
                className='slogan'
                sx={{ fontSize: { xs: 20, md: 30 }, fontWeight: 'bold' }}
              >
                ExpenseForge streamlines your spending, empowering you to shape
                a financially secure future with precision control over your
                expenses.
              </Typography>
              <Button
                variant='contained'
                sx={{ mt: 3, backgroundColor: purple[700] }}
                onClick={()=>{navigate('/login',{replace:true})}}
              >
                Get Started
              </Button>
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box
              container
              className='shape'
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <img
                src={img1}
                alt='example'
                style={{ maxWidth: '100%', height: 'auto' }}
              />
            </Box>
          </Grid>
        </Grid>
      </Box>
    
    </div>
  );
}
