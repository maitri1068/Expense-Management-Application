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
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import Masterform from "./masterform";
import Tableview from "./tableview";
import { useDispatch, useSelector } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import { green, lightGreen } from "@mui/material/colors";
import { Label } from "@mui/icons-material";
import axios from "axios";
import { UseDispatch } from "react-redux";
import { setdata } from "../store/store";

export default function Masterview({
  handleopenform,
  handlecloseform,
  handlesubmitform,
  handleupdatemodal,
  handledeletemodal,
  handleupdateform,
}) {
  const dispatch = useDispatch();
  const reduxStore = useSelector((store) => store.stud);

  const handleClick = () => {
    const searchInput = document.getElementById('search');
  if (searchInput) {
    searchInput.value = "";
    setShowClearIcon("none");
    console.log("Search text cleared...");
  }
  };

  const handleChange = async (event) => {
    const data = JSON.parse(localStorage.getItem("user"));
    const id = data[0]._id;
    let val = event.target.value;
    let v = { value: val, userid: id };
    try {
      let i = await axios.post("http://localhost:1010/search", { value: v });
      console.log("search", i.data);
      dispatch(setdata({ info: i.data }));
    } catch (error) {
      console.log("hello");
    }
    setShowClearIcon(event.target.value === "" ? "none" : "flex");
  };
  const [showClearIcon, setShowClearIcon] = useState("none");
  return (
    <Box container>
          
      {reduxStore.pageRights.addForm && (
        <>
          <Grid
            container
            spacing={2}
            alignItems="center"
            sx={{m:2,p:2}}
          >
            <Grid item xs={12} md={9}>
              <TextField
              id="search"
                sx={{
                  minWidth: 300,
                  width: "100%",
                  maxWidth: 600,
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
            </Grid>
            <Grid item xs={12} md={3}>
              <Button
                variant="contained"
                color="inherit"
                onClick={handleopenform}
              >
                Add {reduxStore.pageRights.formName}
              </Button>
            </Grid>
          </Grid>
        </>
      )}
      <Dialog open={reduxStore.modal.update || reduxStore.modal.form}>
        <IconButton
          aria-label="close"
          onClick={handlecloseform}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
        <Masterform
          handleopenform={handleopenform}
          handlesubmitform={handlesubmitform}
          handlecloseform={handlecloseform}
          handleupdateform={handleupdateform}
        />
      </Dialog>

      <Tableview
        handleupdatemodal={handleupdatemodal}
        handledeletemodal={handledeletemodal}
      />
    </Box>
  );
}
