// import React, { useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { BrowserRouter as Router, Routes, Route , Navigate } from 'react-router-dom';
// import Login from './components/Pages/Login';
// import AdminLogin from './components/Pages/AdminLogin';
// import ServiceDetails from './components/Pages/ServiceDetails';
// import Header from './components/Pages/Header';
// import AdminDashboard from './components/Pages/AdminDashboard';
// import Settings from './components/Pages/Settings';
// import PersonalInformation from './components/Pages/PersonalInformation';
// import Appointment from './components/Pages/Appointment';
// import GenerateInvoice from './components/Pages/GenerateInvoice';
// import Invoice from './components/Pages/Invoice';
// import ForgetPassword from './components/Pages/ForgetPassword';
// import Cookies from 'js-cookie';
// import PrivateRoute from './utils/PrivateRoute';
// import ViewInvoice from './components/Pages/ViewInvoice';
// import OwnerLogin from './components/Pages/OwnerLogin';
// import Branch from './components/Pages/Branch';
// import OwnerDashboard from './components/Pages/OwnerDashboard';

// function App() {
//   const isLoggedIn = Cookies.get('loggedIn');
//   return (
//     <div>
//       <Router>   
//         <Routes>
//           <Route path="/staff" element={<Login />} />
//           {/* <Route path="/admin" element={<AdminLogin />} /> */}  
//           <Route path="/" element={isLoggedIn ? <Navigate to= "/dashboard" /> : <AdminLogin />} />
         

//           <Route element={<PrivateRoute />}>
//             <Route path="/dashboard" element={<AdminDashboard />} />
//             <Route path="/service" element={<ServiceDetails />} />
//             <Route path="/settings" element={<Settings />} />
//             <Route path="/settings/personalInformation" element={<PersonalInformation />} />
//             <Route path="/appointment" element={<Appointment />} />
//             <Route path="/generatebill" element={<GenerateInvoice />} />
//             <Route path="/invoice" element={<Invoice />} />
//             <Route path="/viewinvoice/:id" element={<ViewInvoice />} />
//           </Route>
//           <Route path="/forgetpassword" element={<ForgetPassword />} />
//         </Routes>
//       </Router>
//     </div>
//   );
// }

// export default App;

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import OwnerLogin from './components/Pages/OwnerLogin';
import ServiceDetails from './components/Pages/ServiceDetails';
import AdminDashboard from './components/Pages/AdminDashboard';
import Settings from './components/Pages/Settings';
import PersonalInformation from './components/Pages/PersonalInformation';
import Appointment from './components/Pages/Appointment';
import GenerateInvoice from './components/Pages/GenerateInvoice';
import Invoice from './components/Pages/Invoice';
import ForgetPassword from './components/Pages/ForgetPassword';
import ViewInvoice from './components/Pages/ViewInvoice';
import Branch from './components/Pages/Branch';
import PrivateRoute from './utils/PrivateRoute';
import OwnerDashboard from './components/Pages/OwnerDashboard';
import ErrorPage from './components/Pages/ErrorPage';
import GlobalErrorPage from './components/Pages/GlobalErrorPage';
import BusinessAnalysis from './components/Pages/BusinessAnalysis';
import Help from './components/Pages/Help';
import AppointAsInv from './components/Pages/AppointAsInv';
import Inventory from './components/Pages/Inventory';
import CLP_Setting from './components/Pages/CLP_Setting';
import CustomerL from './components/Pages/CustomerL';

function App() {


  return (
    <div>
      <Router>
        <Routes>
          {/* <Route path="/" element={isLoggedIn ? <Navigate to={`/${sname}`} /> : <OwnerLogin />} /> */}
          <Route path="/" element={<OwnerLogin />} />
          {/* <Route path="/staff" element={<Login />} />
          <Route path="/admin" element={<AdminLogin />} /> */}
          <Route path="/forgetpassword" element={<ForgetPassword />} />

          {/* <Route path="/:salon_name/:admin_url/admin" element={<AdminLogin />} />
          <Route path="/:salon_name/:admin_url/staff" element={<Login />} /> */}
          
          
          <Route element={<PrivateRoute />}>
          {/* {sname && <Route path={`/${sname}`} element={<Branch />} />} */}
            <Route path="/:salon_name" element={<Branch />} />
            <Route path="/:salon_name/owner" element={<OwnerDashboard />} />
            <Route path="/:salon_name/:branchName/dashboard" element={<AdminDashboard />} />
            <Route path="/:salon_name/:branchName/service" element={<ServiceDetails />} />
            <Route path="/:salon_name/:branchName/settings" element={<Settings />} />
            <Route path="/:salon_name/:branchName/appointment" element={<Appointment />} />
            <Route path="/:salon_name/:branchName/settings/personalInformation" element={<PersonalInformation />} />
            <Route path="/:salon_name/:branchName/generatebill" element={<GenerateInvoice />} />
            <Route path="/:salon_name/:branchName/:slno/invoice" element={<Invoice />} />
            <Route path="/:salon_name/:branchName/viewinvoice/:id" element={<ViewInvoice />} />
            <Route path="/:salon_name/:branchName/analysis" element={<BusinessAnalysis />} />
            <Route path="/:salon_name/:branchName/help" element={<Help />} />
            <Route path="/:salon_name/:branchName/generatebil" element={<AppointAsInv />} />
            <Route path="/:salon_name/:branchName/inventory" element={<Inventory />} />
            <Route path="/:salon_name/:branchName/settings/clpsetting" element={<CLP_Setting />} />
            <Route path="/:salon_name/:branchName/clp" element={<CustomerL />} />
          </Route>
          <Route path="*" element={<ErrorPage/>} />
          <Route path="/error" element={<GlobalErrorPage/>} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
