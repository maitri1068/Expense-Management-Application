import "bootstrap/dist/css/bootstrap.min.css";
import {
  Routes,
  Route,
  useNavigate,

} from "react-router-dom";
import "./App.css";
import Home from "./client/pages/Home";
import Login from "./client/pages/login";
import Temp from "./client/pages/temp";
import Dashboard from "./client/pages/dashboard";
import Expense from "./client/pages/expense";
import Income from "./client/pages/income";
import Expensecategory from "./client/pages/expensecategory";
import Expensereport from "./client/pages/report";
import Calender from "./client/pages/Calender";
import Settings from "./client/pages/Settings";

function App() {

  return (
    <>
    {console.log("hello",JSON.parse(localStorage.getItem("token")))}
      <Routes>
        <Route path="/" element={JSON.parse(localStorage.getItem("token")) ? (<Temp></Temp>) :( <Home></Home>)}
          children={
            <>
                <Route path="/dashboard" element={<Dashboard></Dashboard>}></Route>
                <Route path="/expense" element={<Expense></Expense>}></Route>
                <Route path="/income" element={<Income></Income>}></Route>
                <Route path="/reports" element={<Expensereport></Expensereport>} ></Route>
                <Route path="/categorization" element={<Expensecategory></Expensecategory>} ></Route>
                <Route path="/calender" element={<Calender></Calender>}></Route>
                <Route path="/setting" element={<Settings></Settings>}></Route>
            </>
          }
          ></Route>
        <Route path="/login" element={<Login></Login>}></Route>
      </Routes>
    </>
  );
}

export default App;
