import React from "react";
import { Route, Routes } from "react-router-dom";
import Dashboard from "./dashboard";
import Expense from "./expense";
import Income from "./income";
import Expensecategory from "./expensecategory";
import Expensereport from "./report";
import Calender from "./Calender";
import Settings from "./Settings";
import Reimbursement from "./reimbursement";
import Budget from "./budget";

export default function Menuroute() {
  return (
    <div className="menuroute">
      <Routes>
        <Route path="/dashboard" element={<Dashboard></Dashboard>}></Route>
        <Route path="/expense" element={<Expense></Expense>}></Route>
        <Route path="/income" element={<Income></Income>}></Route>
        <Route path="/budget" element={<Budget></Budget>}></Route>
        <Route path="/reports" element={<Expensereport></Expensereport>} ></Route>
        <Route path="/categorization" element={<Expensecategory></Expensecategory>} ></Route>
        <Route path="/calender" element={<Calender></Calender>}></Route>
        <Route path="/reimbursement" element={<Reimbursement></Reimbursement>}></Route>
        <Route path="/setting" element={<Settings></Settings>}></Route>
      </Routes>
    </div>
  );
}
