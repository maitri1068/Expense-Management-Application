import * as React from "react";
import { useState, useEffect } from "react";
import "../cssfiles/dashboard.css";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import {Button,Dialog,FormControl,TextField, Tooltip} from "@mui/material";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import {green,grey,red} from "@mui/material/colors";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { LineChart } from "@mui/x-charts";
import jsonData from "../assets/currencies.json";

export default function Dashboard() {

  const [income, setincome] = useState(0);
  const [budget, setbudget] = useState(0);
  const [expense, setexpense] = useState(0);
  const [SourceOfIncome, setSourceofIncome] = useState(0);
  const [Datee, setDate] = useState(0);
  const [Amount, setAmount] = useState(0);
  const [open, setopen] = useState(false);
  const [label, setlabel] = useState();
  const [val, setval] = useState(0);
  const typographyRef = React.useRef(null);
  const navigate=useNavigate()

  const data = JSON.parse(localStorage.getItem("user"));
  const id = data && data[0]._id;
  const symbol=jsonData.filter((obj)=>obj.name === data[0].Currancy)[0].symbol+" "
  let combinedData = [];

  useEffect(() => {
    getchartdata();
    getlatestuserinfo();
  }, [income]);

  useEffect(() => {
    getuserdetail();
  }, []);

  async function getchartdata() {
    
    const itemString = localStorage.getItem("token");

    let item = JSON.parse(itemString);
    const now=new Date()
    try {
      if(item){
        if (now.getTime() > item.expiry) {
          localStorage.clear()
          localStorage.setItem('form',JSON.stringify(1))
           navigate("/login", { replace: true });
         }
         
             
    let i = await axios.post("http://localhost:1011/expenseperiod", {
      period: "Daily",
      userid: id,
    },
    {
      headers: {
        authorization: `Bearer ${item.value}`,
      },
    });
    let income = await axios.post("http://localhost:1011/currentmonthincome", {
      userid: id,
    },
    {
      headers: {
        authorization: `Bearer ${item.value}`,
      },
    });
 

    let expenseData = i.data;
    let incomeData = income.data;

    // Merge expense and income data into combinedData
    expenseData.forEach(({ _id, TotalExpense }) => {
      combinedData.push({ _id, TotalExpense, TotalIncome: null });
    });

    incomeData.forEach(({ _id, TotalIncome }) => {
      // Check if the date already exists in combinedData
      const index = combinedData.findIndex((item) => item._id === _id);

      if (index === -1) {
        // If date does not exist, add new entry
        combinedData.push({ _id, TotalExpense: null, TotalIncome });
      } else {
        // If date exists, update income
        combinedData[index].TotalIncome = TotalIncome;
      }
    });
    combinedData.sort((a, b) => a._id - b._id);
    localStorage.setItem("dashboardchart", JSON.stringify(combinedData));
      }
      
    } catch (error) {
      console.log(error);
    }


   
  }

  async function handleincomedata() {
    
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
  
    try {
      const i = await axios.post("http://localhost:1011/income", {
        SourceOfIncome: SourceOfIncome,
        Date: Datee,
        Amount: Amount,
        userid: id,
      },{
        headers: {
          authorization: `Bearer ${item.value}`,
        },
      });
     
      if (i.status === 201) {
        setopen(false);
        getuserdetail();
        getlatestuserinfo();
      }
    } catch (error) {
      console.log(error);
    }
  }
  async function getlatestuserinfo() {
    
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
    try {
      let i = await axios.post("http://localhost:1011/latestuserinfo", {
        userid: id,
      },{
        headers: {
          authorization: `Bearer ${item.value}`,
        },
      });
      localStorage.setItem(
        "latestExpense",
        JSON.stringify(i.data.latestExpense)
      );
      localStorage.setItem("latestIncome", JSON.stringify(i.data.latestIncome));
    } catch (error) {
      console.log(error);
    }
  }

  async function getuserdetail() {
    
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
    try {
      const income = await axios.post("http://localhost:1011/userincomee", {
      
          userid: data[0]._id,
       
      },{
        headers: {
          authorization: `Bearer ${item.value}`,
        },
      });

      const budget = await axios.post("http://localhost:1011/userbudget", {
       
          userid: data[0]._id,
       
      },{
        headers: {
          authorization: `Bearer ${item.value}`,
        },
      });

      const expense = await axios.post("http://localhost:1011/userexpense", {
       
          userid: data[0]._id,
      
      },{
        headers: {
          authorization: `Bearer ${item.value}`,
        },
      });
     
      setincome(income.data[0].TotalIncome);
      setbudget(budget.data[0].TotalBudget);
      setexpense(expense.data[0].TotalExpense);
    } catch (error) {
      console.log(error);
    }
  }

  async function setuserdetail(label) {
    
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
    try {
      const i = await axios.post("http://localhost:1011/userincome", {
        value: val,
        username: data[0].userName,
        
        label: label,
      },{
        headers: {
          authorization: `Bearer ${item.value}`,
        },
      });

    

      if (label === "budget") setbudget(i.data["budget"]);
    } catch (error) {
      console.log(error);
    }
  }


  const handleenter = (val) => {
    const incomeIconButton = document.getElementById(val);
    if (incomeIconButton) {
      incomeIconButton.style.visibility = "visible";
    }
  };

  const handleleave = (val) => {
    const incomeIconButton = document.getElementById(val);
    if (incomeIconButton) {
      incomeIconButton.style.visibility = "hidden";
    }
  };
  function handleclick(val) {
    setlabel(val);
    setopen(true);
  }
  function handlesubmit() {
    setopen(false);

    if (label === "budget") {
      setbudget(val);
      setuserdetail("budget");
    }
    setval("");
  }



  return (
    <Box
      className="bgdash"
      sx={{
        height: "auto",
      }}
    >
        <Typography variant='h5' sx={{m:3,fontWeight:'bold'}}>Dashboard</Typography> 
      
      <Box container>
        <Box container>
          <Box
         
            container
            sx={{
             p:2,
              display: "flex",
              justifyContent: "center",
              alignItems: "cenetr",
            }}
          >
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} md={3}>
                <Tooltip title={"Income "+income }> <Box  className="Income boxx"
                  onMouseEnter={() => {
                    handleenter("income");
                  }}
                  onMouseLeave={() => {
                    handleleave("income");
                  }} > <Typography variant="h3"  style={{ whiteSpace:"nowrap",textOverflow:'ellipsis',overflow:'hidden'}} sx={{ p: 2 }} ref={typographyRef}>{income}</Typography>
                  <Typography>
                    Income{" "}
                    <IconButton
                      id="income"
                      sx={{ visibility: "hidden", m: "auto" }}
                      onClick={() => {
                        handleclick("income");
                      }}
                    >
                      +
                    </IconButton>
                  </Typography></Box></Tooltip>
               
                
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
            
                      <Tooltip title={"Budget " + budget}>      <Box className="Budget boxx"
                  onMouseEnter={() => {
                    handleenter("budget");
                  }}
                  onMouseLeave={() => {
                    handleleave("budget");
                  }}>   <Typography variant="h3"  style={{ whiteSpace:"nowrap",textOverflow:'ellipsis',overflow:'hidden'}} sx={{ p: 2 }}>{budget}</Typography>
                  <Typography>


                    Budget{" "}
                    <IconButton
                      id="budget"
                      sx={{ visibility: "hidden", m: "auto" }}
                      onClick={() => {
                        handleclick("budget");
                      }}
                    >
                      +
                    </IconButton>
                  </Typography>
                  </Box></Tooltip>
            
          
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Tooltip title={'Expense '+ expense}>   <Box className="Expense boxx"
                  onMouseEnter={() => {
                    handleenter("expense");
                  }}
                  onMouseLeave={() => {
                    handleleave("expense");
                  }}>   <Typography variant="h3"  style={{ whiteSpace:"nowrap",textOverflow:'ellipsis',overflow:'hidden'}}  sx={{  p: 2, pb: 4}}>
                    {expense ? expense : 0}
                  </Typography>
                  <Typography sx={{ mb: 1, pb: 1 }}>Expense </Typography></Box></Tooltip>
             
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
             <Tooltip title={'Balance '+(income-expense)}>    <Box className="boxx"> 
                   <Typography variant="h3" style={{ whiteSpace:"nowrap",textOverflow:'ellipsis',overflow:'hidden'}} sx={{ p: 2, pb: 4 }}>
                    {income-expense}
                  </Typography>
                  <Typography sx={{ mb: 1, pb: 1 }} >Balance </Typography></Box></Tooltip>
            
              </Grid>
            </Grid>
          </Box>
          <Dialog open={open}>
            <Box container sx={{backgroundColor:`rgb(234, 233, 247)`,p:2}}> 
             <Box sx={{ textAlign: "end"}}>
              {" "}
              <CloseRoundedIcon
                onClick={() => {
                  setopen(false);
                }}
                sx={{backgroundColor:grey[800],color:'white',border:1,borderRadius:1}}
               
              ></CloseRoundedIcon>
            </Box>
            <Box container sx={{mt:1}} >
              {" "}
              {label === "income" && (
                <>
                  <Typography sx={{fontWeight:'bold'}}>Enetr {label} details</Typography>{" "}
                  <FormControl>
                    <TextField
                      type="text"
                      label="SourceOfIncome"
                      name="SourceOfIncome"
                      id="SourceOfIncome"
                      onChange={(e) => {
                        setSourceofIncome(e.target.value);
                      }}
                      fullWidth
                      sx={{ mt: 2 }}
                    ></TextField>
                    <TextField
                      type="date"
                      name="Date"
                      id="Date"
                      onChange={(e) => {
                        setDate(e.target.value);
                      }}
                      fullWidth
                      sx={{ mt: 2 }}
                    ></TextField>
                    <TextField
                      type="number"
                      label="Amount"
                      name="Amount"
                      id="Amount"
                      onChange={(e) => {
                        setAmount(e.target.value);
                      }}
                      fullWidth
                      sx={{ mt: 2 }}
                    ></TextField>
                    <Button
                      variant="contained"
                      onClick={handleincomedata}
                      sx={{ mt: 2 }}
                    >
                     ADD INCOME
                    </Button>
                  </FormControl>
                </>
              )}
              {label !== "income" && (
                <>
                  {" "}
                  <Typography>Enetr {label}</Typography>{" "}
                  <TextField
                    type="number"
                    label={label}
                    name={label}
                    id={label}
                    defaultValue={val}
                    onChange={(e) => {
                      setval(e.target.value);
                    }}
                    sx={{ mt: 2 }}
                  ></TextField>
                  <br></br>
                  <Box container sx={{ textAlign: "center", mt: 2 }}>
                    {" "}
                    <Button
                      type="submit"
                      variant="contained"
                      onClick={() => {
                        handlesubmit();
                      }}
                    >
                      CONTINUE
                    </Button>
                  </Box>{" "}
                </>
              )}
            </Box>
            </Box>
         
          </Dialog>
        </Box>
        <Box
         
          container
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "cenetr",
          }}
        >
          <Grid container spacing={2}>
            <Grid item xs={12} sm={12} md={6}>
              <Box
                container
                sx={{
                  m:3,
                  p:2,
                  backgroundColor: "white",
                  border: 1,
                  borderColor: grey[50],
                  borderRadius: 5,
                 overflow: 'auto',
                 width:'100%',
                 height:'90%'

                }}
              >
              
                {JSON.parse(localStorage.getItem("dashboardchart")) && (
                  <LineChart
                    xAxis={[
                      {
                        data: JSON.parse(
                          localStorage.getItem("dashboardchart")
                        ).map((i) => i._id),
                        label: "Date",
                        min:0,
                        max:new Date(new Date().getFullYear(),new Date().getMonth()+1,0).getDate()
                      },
                    ]}
                    series={[
                      {
                        data: JSON.parse(
                          localStorage.getItem("dashboardchart")
                        ).map((i) => i.TotalExpense),
                        label: "expense",
                        connectNulls: true,
                      },
                      {
                        data: JSON.parse(
                          localStorage.getItem("dashboardchart")
                        ).map((i) => i.TotalIncome),
                        label: "income",
                        connectNulls: true,
                      },
                    ]}
                    yAxis={[
                      {
                        min: 0,
                      },
                    ]}
                    width={460}
                    height={300}
                    
                    
                  ></LineChart>
                )}
              </Box>
            </Grid>
            <Grid item xs={12} sm={12} md={6}>
              <Box container sx={{ m: 4 }}>
                <Typography sx={{fontWeight:'bold',fontSize:18}}>Latest Income</Typography>
                <Box
                  container
                  sx={{
                    border: 1,
                    borderColor: grey[300],
                    borderRadius: 5,
                    backgroundColor: green[50],
                    backgroundImage:`radial-gradient(rgb(255, 255, 255), rgb(206, 250, 206))`,
                    padding: 2,
                    mt: 2,
                  }}
                  
                >
                  <Grid container>
                    {JSON.parse(localStorage.getItem("latestIncome")) && (
                      <>
                        <Grid item xs={6} sm={10} md={9}>
                          <Typography sx={{overflowWrap:'break-word',fontWeight:"bold"}}>
                            {
                              JSON.parse(localStorage.getItem("latestIncome"))
                                .SourceOfIncome
                            }
                          </Typography>
                          <Typography sx={{overflowWrap:'break-word'}}>
                            Date :{" "}
                            {JSON.parse(
                              localStorage.getItem("latestIncome")
                            ).Date?.substr(0, 10)}
                          </Typography>
                        </Grid>
                        <Grid item xs={6} sm={2} md={3}>
                          <Typography sx={{overflowWrap:'break-word'}}>
                            {symbol}{" "}
                            {
                              JSON.parse(localStorage.getItem("latestIncome"))
                                .Amount.toFixed(2)
                            }
                          </Typography>
                        </Grid>
                      </>
                    )}
                  </Grid>
                </Box>
              </Box>
              <Box container sx={{ m: 4 }}>
                <Typography sx={{fontWeight:'bold',fontSize:18}} >Latest Expense</Typography>
                <Box
                  container
                  sx={{
                    border: 1,
                    borderColor: grey[300],
                    borderRadius: 5,
                    backgroundColor: red[50],
                    backgroundImage:`radial-gradient(rgb(255, 255, 255), rgb(250, 206, 206))`,
                    padding: 2,
                    mt: 2,
                  }}
                >
                  <Grid container>
                    {JSON.parse(localStorage.getItem("latestExpense")) && (
                      <>
                        <Grid item xs={6} sm={10} md={9}>
                          <Typography sx={{overflowWrap:'break-word',fontWeight:"bold"}}>
                            {
                              JSON.parse(localStorage.getItem("latestExpense"))
                                .Category
                            }
                          </Typography>
                          <Typography sx={{overflowWrap:'break-word'}}>
                            {
                              JSON.parse(localStorage.getItem("latestExpense"))
                                .SubCategory
                            }
                          </Typography>
                          <Typography sx={{overflowWrap:'break-word'}}>
                            Date :{" "}
                            {JSON.parse(
                              localStorage.getItem("latestExpense")
                            ).Date?.substr(0, 10)}
                          </Typography>
                        </Grid>
                        <Grid item xs={6} sm={2} md={3}>
                          <Typography sx={{overflowWrap:'break-word'}}  >
                            {symbol}
                            {
                              JSON.parse(localStorage.getItem("latestExpense"))
                                .Amount.toFixed(2)
                            }
                          </Typography>
                        </Grid>
                      </>
                    )}
                  </Grid>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Box>
  );
}
