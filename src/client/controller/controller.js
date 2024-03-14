import React from "react";
import { setdata } from "../store/store";
import Masterview from "../view/masterviewtemp";
import { useDispatch, useSelector } from "react-redux";
import store from "../store/store";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Controller() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const reduxStore = useSelector((s) => s.stud);
  const data = JSON.parse(localStorage.getItem("user"));
  const id = data[0]._id;

  async function getdata() {
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

    try {
      if (reduxStore.pageRights.formName === "income") {
        const expense =
          item.value &&
          (await axios.post(
            "http://localhost:1010/incomedetail",
            { userid: id },
            {
              headers: {
                authorization: `Bearer ${item.value}`,
              },
            }
          ));
        dispatch(setdata({ info: expense.data }));
      } else if (reduxStore.pageRights.formName === "expense") {
        console.log(item.value);
        const expense =
          item.value &&
          (await axios.post(
            "http://localhost:1010/expensedetail",
            { userid: id },
            {
              headers: {
                authorization: `Bearer ${item.value}`,
              },
            }
          ));
        dispatch(setdata({ info: expense.data }));
      }
    } catch (e) {
      console.log(e);
    }
  }
  const handlesubmitform = async (form) => {
    try {
      let i;
      if (reduxStore.pageRights.formName === "income") {
        i = await axios.post("http://localhost:1010/income", {
          ...form,
          userid: id,
        });
      } else if (reduxStore.pageRights.formName === "expense") {
        console.log("f", form);
         i = await axios.post("http://localhost:1010/expense", {
          ...form,
          userid: id,
        });
        console.log("i", i);
      }
      if(i.status === 201){
        handleModal("submission",true)
      }
      
    } catch (err) {
      console.log("e");
    }
    getdata();
  };

  
  async function handlepreview(id){
   
    console.log(id)
    try{
      if(reduxStore.pageRights.formName === 'expense'){
        const i=await axios.post('http://localhost:1010/expensepreview',{id:id})
        console.log("expense : ",i.data)
        dispatch(setdata({preview:i.data}))
        handleModal('preview',true)
      }
      else if(reduxStore.pageRights.formName === 'income'){
        const i=await axios.post('http://localhost:1010/incomepreview',{id:id})
        console.log("income : ",i.data)
        dispatch(setdata({preview:i.data}))
        handleModal('preview',true)
      }
   

    }
    catch(error){
      console.log(error)
    }
  }


  const handleModal = async (key, value) => {
    await dispatch(setdata({ modal: { [key]: value } }));
  };

  const handleopenform = (val) => {
    handleModal("form", true);
  };

  const handlecloseform = () => {
    handleModal("form", false);
    handleModal("update", false);
  };

  const handleupdatemodal = async (idx) => {
    console.log("updateid:",idx)
    let data;
    if(reduxStore.pageRights.formName === 'expense'){
      try {
        data = await axios.post("http://localhost:1010/expenseupdate", {
          id: idx,
        });
        console.log("dataaa",data)
        // data=data[0]
        // console.log('dataa : ',data)
      } catch (err) {
        console.log("error:", err);
      }
    }
    else if(reduxStore.pageRights.formName === 'income'){
      try {
        data = await axios.post("http://localhost:1010/incomeupdate", {
          id: idx,
        });
        console.log("dataaa",data)
        // data=data[0]
        // console.log('dataa : ',data)
      } catch (err) {
        console.log("error:", err);
      }
    }
   
    data = data.data[0];
    let date = data.Date?.substr(0, 10);
    console.log("dtaattt",date)
    data = { ...data, Date: date };
    await dispatch(setdata({ FormData: [data] }));
    //  console.log("formdat",reduxStore.FormData)
    handleModal("update", true);
  };

  const handledeletemodal = async (idx) => {
    if(reduxStore.pageRights.formName === 'expense'){
      try {
        const i = await axios.delete("http://localhost:1010/deleteexpense", {
          data: { id: idx },
        });
        if (i.status !== 400 || i.status !== 404) {
          getdata();
        }
      } catch (err) {
        console.log("error:", err);
      }
    }
    else if(reduxStore.pageRights.formName === 'income'){
      try {
        const i = await axios.delete("http://localhost:1010/deleteincome", {
          data: { id: idx },
        });
        if (i.status !== 400 || i.status !== 404) {
          getdata();
        }
      } catch (err) {
        console.log("error:", err);
      }
    }

  };
  const handleupdateform = async (form) => {
    if(reduxStore.pageRights.formName === 'expense'){
      try {
        const i = await axios.patch("http://localhost:1010/expense", form);
        if (i.status !== 400 || i.status !== 404) {
          getdata();
        }
      } catch (err) {
        console.log(err);
      }
    }
    else if(reduxStore.pageRights.formName === 'income'){
      try {
        const i = await axios.patch("http://localhost:1010/income", form);
        if (i.status !== 400 || i.status !== 404) {
          getdata();
        }
      } catch (err) {
        console.log(err);
      }
    }
    
  };

  return (
    <>
      <Masterview
        handleopenform={handleopenform}
        handlecloseform={handlecloseform}
        handlesubmitform={handlesubmitform}
        handleupdateform={handleupdateform}
        handledeletemodal={handledeletemodal}
        handleupdatemodal={handleupdatemodal}
        handlepreview={handlepreview}
      ></Masterview>
    </>
  );
}
