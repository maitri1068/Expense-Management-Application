import React from "react";
import "./expense.css";
import Controller from "../controller/controller";
import { string, number, date } from "yup";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { setdata } from "../store/store";
import { Box, Dialog, TextField } from "@mui/material";
// import Dashboardnav from "./dashboardnav";
import { green, purple } from "@mui/material/colors";
import { Window } from "@mui/icons-material";

export default function Expense() {
  const dispatch = useDispatch();
  const formfield = [
    { name: "Category", label: "Category", type: "dropdown", list: ["g"] },
    { name: "AddCategory", label: "Add New Category", type: "button" },
    { name: "Description", label: "Description", type: "text" },
    { name: "Date", label: "Date", type: "date" },
    { name: "Amount", label: "Amount", type: "number" },
    { name: "Merchant", label: "Merchant", type: "text" },
    { name: "PaidBy", label: "PaidBy", type: "text" },
    {
      name: "PaymentMode",
      label: "Payment Mode",
      type: "dropdown",
      list: ["Cash", "Cheque", "UPI"],
    },
    // { name: "AttachReceipt", label: "AttachReceipt", type: "file" },
  ];
  const MAX_FILE_SIZE = 1024 * 4; //100KB

  const validFileExtensions = {
    image: ["jpg", "gif", "png", "jpeg", "svg", "webp"],
  };

  function isValidFileType(fileName, fileType) {
    return (
      fileName &&
      validFileExtensions[fileType].indexOf(fileName.split(".").pop()) > -1
    );
  }
  const formValidation = {
    Category: string().required("Category required"),
    Description: string(),
    Date: date().required("Date required"),
    Amount: number().required("Amount required").min(0),
    Merchant: string().required("Merchant required"),
    PaidBy: string().required("PaidBy required"),
    PaymentMode: string().required("Payment mode required"),
    // AttachReceipt: Yup.mixed()
    //   .required("Required")
    //   .test("is-valid-type", "Not a valid image type", (value) => {
    //     value = value.substr(12);
    //     isValidFileType(value && value?.toLowerCase(), "image");
    //   })
    //   .test(
    //     "is-valid-size",
    //     "Max allowed size is 100KB",
    //     (value) => value && value.size <= MAX_FILE_SIZE
    //   ),
  };

  const tableviewfield = [
    { id: "Category", name: "Category", label: "Category", type: "text" },
    { id: "Date", name: "Date", label: "Date", type: "text" },
    { id: "Merchant", name: "Merchant", label: "Merchant", type: "text" },
    { id: "Amount", name: "Amount", label: "Amount", type: "text" },
    { id: "PaidBy", name: "PaidBy", label: "PaidBy", type: "text" },
    {
      id: "PaymentMode",
      name: "PaymentMode",
      label: "PaymentMode",
      type: "text",
    },
  ];

  const pageRights = {
    pageName: "My Expense",
    formName: "expense",
    addForm: true,
    isviewupdate: true,
    update: true,
    delete: true,
  };

  dispatch(setdata({ formfield, formValidation, tableviewfield, pageRights }));

  return (
    <Box 
    // className="bg"
    >
      {/* <Dashboardnav></Dashboardnav> */}

      <Controller />
    </Box>
  );
}
