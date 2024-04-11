import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import NoAccess from "../../NoAccess/NoAccess.jsx";
import DoctorDashboard from "../DoctorDashboard/DoctorDashboard";
import Patient from "../Patient/Patient";
import DoctorChangePassword from "../DoctorChangePassword/DoctorChangePassword";
import DoctorUpdate from "../DoctorUpdate/DoctorUpdate";
import Search from "../Search/Search";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faHome,
  faUserInjured,
  faKey,
  faEdit,
  faSignOutAlt,
} from "@fortawesome/free-solid-svg-icons";

const DoctorView = ({ state }) => {
  const navigate = useNavigate();
  const { doctorId: urlDoctorId } = useParams();

  let doctorId = Cookies.get("doctorId") || false;

  useEffect(() => {
    if (doctorId === false) {
      return;
    } else if (urlDoctorId !== doctorId) {
      navigate(`/404`);
    }
  }, [urlDoctorId, doctorId]);

  const handleLogout = () => {
    Cookies.remove("doctorId");
  };

  const [selectedComponent, setSelectedComponent] = useState("dashboard");

  const handleComponentChange = (component) => {
    setSelectedComponent(component);
  };

  const isItemSelected = (component) => {
    return selectedComponent === component
      ? "bg-indigo-500 text-white hover:bg-indigo-500 hover:text-white "
      : "";
  };
  return (
    <>
      {doctorId ? (
        <section className="main">
          <div className="sidebar">
            <div className="mt-4 fixed flex flex-col top-0 left-0 w-64 bg-white h-full ">
              <div className="flex-grow mt-8 border-r">
                <ul className="flex flex-col py-4 space-y-1">
                  <li className="px-5">
                    <div className="flex flex-row items-center h-8">
                      <div className="text-sm font-light tracking-wide text-gray-500">
                        Menu
                      </div>
                    </div>
                  </li>
                  <li>
                    <a
                      className={`relative flex flex-row items-center h-11 focus:outline-none hover:bg-gray-50 text-gray-600 hover:text-gray-800 border-l-4 border-transparent hover:border-indigo-500 pr-6 ${isItemSelected(
                        "dashboard"
                      )}`}
                      onClick={() => handleComponentChange("dashboard")}
                    >
                      <span className="inline-flex justify-center items-center ml-4">
                        <FontAwesomeIcon icon={faHome} />
                      </span>
                      <span className="ml-2 text-base tracking-wide truncate">
                        Dashboard
                      </span>
                    </a>
                  </li>

                  <li>
                    <a
                      className={`relative flex flex-row items-center h-11 focus:outline-none hover:bg-gray-50 text-gray-600 hover:text-gray-800 border-l-4 border-transparent hover:border-indigo-500 pr-6 ${isItemSelected(
                        "patient"
                      )}`}
                      onClick={() => handleComponentChange("patient")}
                    >
                      <span className="inline-flex justify-center items-center ml-4">
                        <FontAwesomeIcon icon={faUserInjured} />
                      </span>
                      <span className="ml-2 text-base tracking-wide truncate">
                        Patient
                      </span>
                    </a>
                  </li>
                  <li>
                    <a
                      className={`relative flex flex-row items-center h-11 focus:outline-none hover:bg-gray-50 text-gray-600 hover:text-gray-800 border-l-4 border-transparent hover:border-indigo-500 pr-6 ${isItemSelected(
                        "search"
                      )}`}
                      onClick={() => handleComponentChange("search")}
                    >
                      <span className="inline-flex justify-center items-center ml-4">
                        <FontAwesomeIcon icon={faSearch} />
                      </span>
                      <span className="ml-2 text-base tracking-wide truncate">
                        Search
                      </span>
                    </a>
                  </li>
                  <li className="px-5">
                    <div className="flex flex-row items-center h-8">
                      <div className="text-sm font-light tracking-wide text-gray-500">
                        Settings
                      </div>
                    </div>
                  </li>
                  <li>
                    <a
                      className={`relative flex flex-row items-center h-11 focus:outline-none hover:bg-gray-50 text-gray-600 hover:text-gray-800 border-l-4 border-transparent hover:border-indigo-500 pr-6 ${isItemSelected(
                        "password"
                      )}`}
                      onClick={() => handleComponentChange("password")}
                    >
                      <span className="inline-flex justify-center items-center ml-4">
                        <FontAwesomeIcon icon={faKey} />
                      </span>
                      <span className="ml-2 text-base tracking-wide truncate">
                        Change Password
                      </span>
                    </a>
                  </li>
                  <li>
                    <a
                      className={`relative flex flex-row items-center h-11 focus:outline-none hover:bg-gray-50 text-gray-600 hover:text-gray-800 border-l-4 border-transparent hover:border-indigo-500 pr-6 ${isItemSelected(
                        "hospitalUpdate"
                      )}`}
                      onClick={() => handleComponentChange("hospitalUpdate")}
                    >
                      <span className="inline-flex justify-center items-center ml-4">
                        <FontAwesomeIcon icon={faEdit} />
                      </span>
                      <span className="ml-2 text-base tracking-wide truncate">
                        Update
                      </span>
                    </a>
                  </li>

                  <li>
                    <Link to="/admin/doctor-login" onClick={handleLogout}>
                      <a
                        className="relative flex flex-row items-center h-11 focus:outline-none hover:bg-gray-50 text-gray-600 hover:text-gray-800
                   border-l-4 border-transparent hover:border-indigo-500 pr-6"
                      >
                        <span className="inline-flex justify-center items-center ml-4">
                          <FontAwesomeIcon icon={faSignOutAlt} />
                        </span>
                        <span className="ml-2 text-base tracking-wide truncate">
                          Logout
                        </span>
                      </a>
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          {selectedComponent === "dashboard" && (
            <DoctorDashboard doctorId={doctorId} state={state} />
          )}
          {selectedComponent === "patient" && (
            <Patient doctorId={doctorId} state={state} />
          )}
          {selectedComponent === "password" && (
            <DoctorChangePassword doctorId={doctorId} state={state} />
          )}
          {selectedComponent === "hospitalUpdate" && (
            <DoctorUpdate doctorId={doctorId} state={state} />
          )}
          {selectedComponent === "search" && <Search />}
        </section>
      ) : (
        <NoAccess link={"/admin/doctor-login"} />
      )}
    </>
  );
};

export default DoctorView;
