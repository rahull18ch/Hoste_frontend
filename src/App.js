import { Route,Routes} from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


import Login from "./pages/Login";
import Register from "./pages/Register";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import { LoginContext } from "./contex/LoginContext";
import { useState,useEffect } from "react";
import StudentDashboard from "./pages/StudentDashbord";
import AdminDashboard from "./pages/AdminDashbord";
import RegisterComplain from "./components/RegisterComplain";
import ViewComplain from "./pages/ViewComplain";
import AllComplain from "./pages/AllComplain";
import AllstudentDetail from "./pages/AllstudentDetail";
import AddAnnoucement from "./components/AddAnnoucement";
import ShowNotice from "./components/ShowNotice";
import VerifyOtp from "./pages/VerifyOtp";
import ChatBot from "./components/ChatBot";





function App() {
    const [userlogin, setuserlogin] = useState(false);
  const [adminlogin, setadminlogin] = useState(false);

  // ✅ Restore login from token on refresh
  useEffect(() => {
    const token = localStorage.getItem("jwt");
    const user = JSON.parse(localStorage.getItem("user"));

    if (token && user) {
      if (user.role === "admin") {
        setadminlogin(true);
      } else {
        setuserlogin(true);
      }
    } else {
      setuserlogin(false);
      setadminlogin(false);
    }
    
  }, []);

  return (
    <LoginContext.Provider value={{ setuserlogin, setadminlogin}}>
      <Navbar userlogin={userlogin} adminlogin={adminlogin} />

      <div className="pt-20 min-h-screen bg-gray-100">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/student-dashboard" element={<StudentDashboard />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/register-complain" element={<RegisterComplain />} />
          <Route path="/view-complain" element={<ViewComplain />} />
          <Route path="/alldata_complain" element={<AllComplain/>} />
          <Route path="/allstudent_details" element={<AllstudentDetail/>} />
          <Route path="/addannoucement" element={<AddAnnoucement/>} />
          <Route path="/allnotice" element={<ShowNotice/>} />
          <Route path="/verify-otp" element={<VerifyOtp/>} />
          <Route path="/assistant" element={<ChatBot />} />
         </Routes>
      </div>

      <ToastContainer theme="dark" />
     
    </LoginContext.Provider>
  );
}

export default App;

