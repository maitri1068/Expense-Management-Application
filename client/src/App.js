import "bootstrap/dist/css/bootstrap.min.css";
import {
  Routes,
  Route,


} from "react-router-dom";
import "./App.css";
import Home from "./pages/Home";
import Login from "./pages/login";
import Temp from "./pages/temp";
import Dashboard from "./pages/dashboard";
import Expense from "./pages/expense";
import Income from "./pages/income";
import Expensecategory from "./pages/expensecategory";
import Expensereport from "./pages/report";
import Calender from "./pages/Calender";
import Settings from "./pages/Settings";
import Reimbursement from "./pages/reimbursement";
import Budget from "./pages/budget";


function App() {

  return (
    <>
    {console.log("hello",JSON.parse(localStorage.getItem("token")))}
      <Routes>
        <Route path="/" element ={JSON.parse(localStorage.getItem("token")) ? (<Temp></Temp>) : (<Home></Home>)}></Route>
        <Route path="/temp" element={<Temp></Temp>}
          children={
            <>
                <Route path="/temp/dashboard" element={<Dashboard></Dashboard>}></Route>
                <Route path="/temp/expense" element={<Expense></Expense>}></Route>
                <Route path="/temp/income" element={<Income></Income>}></Route>
                <Route path="/temp/budget" element={<Budget></Budget>}></Route>
                <Route path="/temp/reports" element={<Expensereport></Expensereport>} ></Route>
                <Route path="/temp/categorization" element={<Expensecategory></Expensecategory>} ></Route>
                <Route path="/temp/calender" element={<Calender></Calender>}></Route>
                <Route path="/temp/reimbursement" element={<Reimbursement></Reimbursement>}></Route>
                <Route path="/temp/setting" element={<Settings></Settings>}></Route>
            </>
          }
          ></Route>
        <Route path="/login" element={<Login></Login>}></Route>
      </Routes>
    </>
  );
}

export default App;
