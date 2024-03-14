import React, { useState, useEffect } from "react";
import "./tableview.css";
import axios from "axios";
import {
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  Table,
  TableBody,
  Button,
  Box,
  Typography,
  Grid,
} from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { setdata } from "../store/store";
import { DataGrid } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { grey, lightGreen, purple, yellow } from "@mui/material/colors";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useNavigate } from "react-router-dom";
export default function Tableview({ handleupdatemodal, handledeletemodal }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const reduxStore = useSelector((state) => state.stud);

  async function getdata() {
    const data = JSON.parse(localStorage.getItem("user"));

    const itemString = localStorage.getItem("token");

    const item = JSON.parse(itemString);
    const now = new Date();
    try {
      if (now.getTime() > item.expiry) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.setItem("isloggedin", JSON.stringify(false));
        navigate("/login", { replace: true });
      }
    } catch (error) {
      console.log(error);
    }

    if (reduxStore.pageRights.formName === "income") {
      try {
        const id = data[0] && data[0]._id;
        const expense = await axios.post(
          "http://localhost:1010/incomedetail",
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
        const id = data[0] && data[0]._id;
        const expense = await axios.post(
          "http://localhost:1010/expensedetail",
          { userid: id },
          {
            headers: {
              authorization: `Bearer ${item.value}`,
            },
          }
        );
        console.log(expense.data);
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

  data = data.map((key, ind) => ({ ...key, id: ind + 1 }));
  // console.log(data)
  const getrowid = (row) => row.id;
  let columns;
  if (reduxStore.pageRights.formName === "income") {
    columns = [
      { field: "id", headerName: "id", width: 150 },
      { field: "SourceOfIncome", headerName: "SourceOfIncome", width: 150 },
      {
        field: "Date",
        headerName: "Date",
        width: 150,
        renderCell: (params) => {
          const formattedDate = params.row.Date?.substr(0, 10);
          return <span>{formattedDate}</span>;
        },
      },
      { field: "Amount", headerName: "Amount", width: 150 },
      {
        field: "Option",
        headerName: "",
        width: 200,
        renderCell: (params) => (
          <>
            <VisibilityIcon
              sx={{
                m: 2,
                p: 1,
                borderRadius: "50%",
                width: 40,
                height: 40,
                backgroundColor: grey[100],
              }}
              color="secondary"
            ></VisibilityIcon>
            <EditIcon
              sx={{
                mr: 2,
                p: 1,
                borderRadius: "50%",
                width: 40,
                height: 40,
                backgroundColor: grey[100],
              }}
              color="primary"
              onClick={() => handleupdatemodal(params.row._id)}
            ></EditIcon>
            <DeleteIcon
              sx={{
                p: 1,
                borderRadius: "50%",
                width: 40,
                height: 40,
                backgroundColor: grey[100],
              }}
              color="error"
              onClick={() => handledeletemodal(params.row._id)}
            ></DeleteIcon>
          </>
        ),
      },
    ];
  } else if (reduxStore.pageRights.formName === "expense") {
    columns = [
      { field: "id", headerName: "id", width: 100 },
      { field: "Category", headerName: "Category", width: 150 },
      {
        field: "Date",
        headerName: "Date",
        width: 150,
        renderCell: (params) => {
          const formattedDate = params.row.Date?.substr(0, 10);
          return <span>{formattedDate}</span>;
        },
      },
      { field: "Merchant", headerName: "Merchant", width: 200 },
      { field: "Amount", headerName: "Amount", width: 150 },
      { field: "PaidBy", headerName: "PaidBy", width: 150 },
      { field: "PaymentMode", headerName: "PaymentMode", width: 150 },
      {
        field: "Option",
        headerName: "",
        width: 200,
        renderCell: (params) => (
          <>
            <VisibilityIcon
              sx={{
                m: 2,
                p: 1,
                borderRadius: "50%",
                width: 40,
                height: 40,
                backgroundColor: grey[100],
              }}
              color="secondary"
            ></VisibilityIcon>
            <EditIcon
              sx={{
                mr: 2,
                p: 1,
                borderRadius: "50%",
                width: 40,
                height: 40,
                backgroundColor: grey[100],
              }}
              color="primary"
              onClick={() => handleupdatemodal(params.row._id)}
            ></EditIcon>
            <DeleteIcon
              sx={{
                p: 1,
                borderRadius: "50%",
                width: 40,
                height: 40,
                backgroundColor: grey[100],
              }}
              color="error"
              onClick={() => handledeletemodal(params.row._id)}
            ></DeleteIcon>
          </>
        ),
      },
    ];
  }

  return (
    <Box
      container
      className="item"
      sx={{
        m: 4,
        display: "flex-row",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <DataGrid
        rows={data}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: { pageSize: 5, page: 0 },
          },
        }}
        getRowId={getrowid}
        pageSizeOptions={[5, 10, 25]}
        sx={{ fontWeight: "bold" }}
      />

      {/* {
         data.map((s)=>{
          return(
            <Box container className='item' >
              <Grid container>
                <Grid item xs={12} md={9}>
                <Typography>{s.Category}</Typography>
                </Grid>
                <Grid item  xs={12} md={2}>
                <Typography>{s.Amount}</Typography>
                </Grid>
                <Grid item  xs={12} md={1}>
                <VisibilityIcon sx={{borderRadius:'50%',width:20,height:20}} color='secondary' ></VisibilityIcon>
                </Grid>
              </Grid>
              <Grid container>
                <Grid item xs={12} md={11}>
                <Typography>{s.Date.substr(0,10)}</Typography>
                </Grid>
                <Grid item  xs={12} md={1}>
                <EditIcon sx={{borderRadius:'50%',width:20,height:20}} color='primary' onClick={() => handleupdatemodal(s._id)}></EditIcon>
                </Grid>
              </Grid>
              <Grid container>
                <Grid item xs={12} md={11}>
                </Grid>
                <Grid item  xs={12} md={1}>
                <DeleteIcon sx={{borderRadius:'50%',width:20,height:20}} color='error' onClick={() => handledeletemodal(s._id)}></DeleteIcon>
                </Grid>
              </Grid>
          </Box>
          )
         })
        } */}
    </Box>
  );
}
