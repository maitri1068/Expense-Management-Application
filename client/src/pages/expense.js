import React, { useEffect } from "react";
import "../cssfiles/expense.css";
import Controller from "../controller/controller";
import { string, number, date } from "yup";
import { useDispatch} from "react-redux";
import { setdata } from "../store/store";
import { Box } from "@mui/material";
import jsonData from "../assets/currencies.json";

const data=jsonData.map((obj)=>obj.name)
const user=JSON.parse(localStorage.getItem('user'))

export default function Expense() {

  useEffect(()=>{
    const list=[{name:'Essential Expenses',subCategory:['Housing','Education','Taxes','Transportation']},{name:'Discreationary Spending',subCategory:['Personal Care','Food','Clothing','Entertainment']},{name:'Saving & Investment',subCategory:['stock','SIP']},{name:'Dept Payment',subCategory:['loan']},{name:'Insurance',subCategory:['Medical','Car']},{name:'Emergency',subCategory:['medical']}]
    console.log("user",user)
    const key='Category'+ ( user && user[0]._id)
    localStorage.setItem(key,JSON.stringify(list))
  },[])
  const dispatch = useDispatch();
  const formfield = [
    {name:'Category',label:'Category',type:'dropdown',list:['Essential Expenses','Discreationary Spending','Saving And Investment','Emergency','Dept Payment','Insurance']},
    { name: "SubCategory", label: "SubCategory", type: "dropdown", list: ["g"] },
    { name: "AddCategory", label: "Add New Category", type: "button" },
    { name: "Description", label: "Description", type: "text" },
    { name: "Date", label: "Date", type: "date" },
    { name: "Amount", label: "Amount", type: "number" },
    { name: "Currancy", label: "Currancy", type: "dropdown",list:data },
    { name: "Merchant", label: "Merchant", type: "text" },
    { name: "PaidBy", label: "PaidBy", type: "text" },
    {
      name: "PaymentMode",
      label: "Payment Mode",
      type: "dropdown",
      list: ["Cash", "Cheque", "UPI"],
    },
    { id: "transaction", name: "transaction", label: "transaction", type: "radio", options:['mytransaction','othertransaction']},

  ];
  const formValidation = {
    Category:string().required('Category required'),
    SubCategory: string().required("sub Category required"),
    Description: string(),
    Date: date().required("Date required"),
    Amount: number().required("Amount required").min(0),
    Currancy:string().required("Currancy required"),
    Merchant: string().required("Merchant required"),
    PaidBy: string().required("PaidBy required"),
    PaymentMode: string().required("Payment mode required"),
    transaction:string().required('transaction type required')
  };

  const tableviewfield = [
    { id: "Category", name: "Category", label: "Category", type: "text" },
    { id: "Date", name: "Date", label: "Date", type: "text" },
    { id: "Merchant", name: "Merchant", label: "Merchant", type: "text" },
    { id: "Amount", name: "Amount", label: "Amount", type: "text" },
    { id: "PaidBy", name: "PaidBy", label: "PaidBy", type: "text" },
    { id: "PaymentMode",name: "PaymentMode",label: "PaymentMode",type: "text"},
    
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
    <Box>
      <Controller />
    </Box>
  );
}
