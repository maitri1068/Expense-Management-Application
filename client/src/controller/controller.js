import React from "react";
import { setdata } from "../store/store";
import Masterview from "../view/masterviewtemp";
import { useDispatch, useSelector } from "react-redux";
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
        localStorage.clear()
        localStorage.setItem('form',JSON.stringify(1))
        
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
            "http://localhost:1011/incomedetail",
            { userid: id },
            {
              headers: {
                authorization: `Bearer ${item.value}`,
              },
            }
          ));
        dispatch(setdata({ info: expense.data }));
      } else if (reduxStore.pageRights.formName === "expense") {
       
        const expense =
          item.value &&
          (await axios.post(
            "http://localhost:1011/expensedetail",
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
      let i;
      if (reduxStore.pageRights.formName === "income") {
        i = await axios.post("http://localhost:1011/income", {
          ...form,
          userid: id,
        },  {
          headers: {
            authorization: `Bearer ${item.value}`,
          },
        });
      } else if (reduxStore.pageRights.formName === "expense") {
      
         i = await axios.post("http://localhost:1011/expense", {
          ...form,
          userid: id,
        },  {
          headers: {
            authorization: `Bearer ${item.value}`,
          },
        });
       
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
      if(reduxStore.pageRights.formName === 'expense'){
        const i=await axios.post('http://localhost:1011/expensepreview',{id:id},  {
          headers: {
            authorization: `Bearer ${item.value}`,
          },
        })
   
        dispatch(setdata({preview:i.data}))
        handleModal('preview',true)
      }
      else if(reduxStore.pageRights.formName === 'income'){
        const i=await axios.post('http://localhost:1011/incomepreview',{id:id},  {
          headers: {
            authorization: `Bearer ${item.value}`,
          },
        })
     
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
   
    let data;
    if(reduxStore.pageRights.formName === 'expense'){
      try {
        data = await axios.post("http://localhost:1011/expenseupdate", {
          id: idx,
        },  {
          headers: {
            authorization: `Bearer ${item.value}`,
          },
        });
       
       
      } catch (err) {
        console.log("error:", err);
      }
    }
    else if(reduxStore.pageRights.formName === 'income'){
      try {
        data = await axios.post("http://localhost:1011/incomeupdate", {
          id: idx,
        },  {
          headers: {
            authorization: `Bearer ${item.value}`,
          },
        });
      
     
      } catch (err) {
        console.log("error:", err);
      }
    }
   
    data = data.data[0];
    let date = data.Date?.substr(0, 10);
   
    data = { ...data, Date: date };
    await dispatch(setdata({ FormData: [data] }));
  
    handleModal("update", true);
  };

  const handledeletemodal = async (idx) => {
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
    
    if(reduxStore.pageRights.formName === 'expense'){
    
      try {
        const i = await axios.delete("http://localhost:1011/deleteexpense", {
          data: { id: idx },
          headers: {
            authorization: `Bearer ${item.value}`,
          },
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
        const i = await axios.delete("http://localhost:1011/deleteincome", {
          data: { id: idx },
          headers: {
            authorization: `Bearer ${item.value}`,
          },
        },
        );
        if (i.status !== 400 || i.status !== 404) {
          getdata();
        }
      } catch (err) {
        console.log("error:", err);
      }
    }

  };
  const handleupdateform = async (form) => {
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
    if(reduxStore.pageRights.formName === 'expense'){
      try {
        const i = await axios.patch("http://localhost:1011/expense", form,  {
          headers: {
            authorization: `Bearer ${item.value}`,
          },
        });
        if (i.status !== 400 || i.status !== 404) {
          getdata();
        }
      } catch (err) {
        console.log(err);
      }
    }
    else if(reduxStore.pageRights.formName === 'income'){
      try {
        const i = await axios.patch("http://localhost:1011/income", form,  {
          headers: {
            authorization: `Bearer ${item.value}`,
          },
        });
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
