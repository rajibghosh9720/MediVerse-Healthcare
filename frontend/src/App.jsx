import { useState} from "react";
import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar.jsx";
import HomePage from "./components/HomePage/HomePage.jsx";
import AdminPage from "./components/AdminPage/AdminPage.jsx";
import TeamPage from "./components/TeamPage/TeamPage.jsx";
import AboutPage from "./components/AboutPage/AboutPage.jsx";
import NotFoundPage from "./components/NotFoundPage/NotFoundPage.jsx";

import HospitalLogin from "./components/Hospital/HospitalLogin/HospitalLogin.jsx";
import HospitalReg from "./components/Hospital/HospitalReg/HospitalReg.jsx";
import HospitalView from "./components/Hospital/HospitalView/HospitalView.jsx";

import DoctorLogin from "./components/Doctor/DoctorLogin/DoctorLogin.jsx";
import DoctorView from "./components/Doctor/DoctorView/DoctorView.jsx";
import DoctorReg from "./components/Doctor/DoctorReg/DoctorReg.jsx";

import PatientLogin from "./components/Patient/PatientLogin/PatientLogin.jsx";
import PatientReg from "./components/Patient/PatientReg/PatientReg.jsx";
import PatientView from "./components/Patient/PatientView/PatientView.jsx";

function App() {
  const [state, setState] = useState({
    web3: null,
    contract: null,
    account: null,
  });
  const saveState = ({ web3, contract, account }) => {
    setState({ web3: web3, contract: contract, account: account });
  };

  const router = createBrowserRouter([
    { path: "/", element: <HomePage saveState={saveState} /> },
    { path: "/admin", element: <AdminPage state={state} /> },
    { path: "/team", element: <TeamPage /> },
    { path: "/about", element: <AboutPage /> },
    {
      path: "/admin/hospital-login",
      element: <HospitalLogin state={state} />,
    },
    { path: "/admin/hospital-reg", element: <HospitalReg state={state} /> },
    {
      path: "/admin/hospital-view/:hospitalId",
      element: <HospitalView state={state} />,
    },
    {
      path: "/admin/doctor-login",
      element: <DoctorLogin />,
    },
    { path: "/admin/doctor-reg", element: <DoctorReg state={state} /> },
    {
      path: "/admin/doctor-view/:doctorId",
      element: <DoctorView state={state} />,
    },
    {
      path: "/admin/patient-login",
      element: <PatientLogin />,
    },
    {
      path: "/admin/patient-reg",
      element: <PatientReg state={state} />,
    },
    {
      path: "/admin/patient-view/:patientId",
      element: <PatientView state={state} />,
    },
    { path: "*", element: <NotFoundPage /> },
  ]);

  return (
    <>
      <Navbar state={state} />
      <RouterProvider router={router} />
    </>
  );
}

export default App;
