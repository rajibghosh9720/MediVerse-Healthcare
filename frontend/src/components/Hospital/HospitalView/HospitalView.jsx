import React, { useState, useEffect } from "react";
import "./HospitalView.css";
import { Link, useParams, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import NoAccess from "../../NoAccess/NoAccess.jsx";
import HospitalDashboard from "../HospitalDashboard/HospitalDashboard";
import HospitalChangePassword from "../HospitalChangePassword/HospitalChangePassword";
import HospitalUpdate from "../HospitalUpdate/HospitalUpdate";
import Doctor from "../Doctor/Doctor";
import Patient from "../Patient/Patient";
import Search from "../Search/Search";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faHome,
  faUserMd,
  faUserInjured,
  faKey,
  faEdit,
  faSignOutAlt,
} from "@fortawesome/free-solid-svg-icons";

const HospitalView = ({ state }) => {
  const navigate = useNavigate();

  const { hospitalId: urlHospitalId } = useParams();

  let hospitalId = Cookies.get("hospitalId") || false;

  useEffect(() => {
    if (hospitalId === false) {
      return;
    } else if (urlHospitalId !== hospitalId) {
      navigate(`/404`);
    }
  }, [urlHospitalId, hospitalId]);

  const handleLogout = () => {
    Cookies.remove("hospitalId");
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
      {hospitalId ? (
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
                        "doctor"
                      )}`}
                      onClick={() => handleComponentChange("doctor")}
                    >
                      <span className="inline-flex justify-center items-center ml-4">
                        <FontAwesomeIcon icon={faUserMd} />
                      </span>
                      <span className="ml-2 text-base tracking-wide truncate">
                        Doctor
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
                    <Link to="/admin/hospital-login" onClick={handleLogout}>
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
            <HospitalDashboard hospitalId={hospitalId} state={state} />
          )}
          {selectedComponent === "password" && (
            <HospitalChangePassword hospitalId={hospitalId} state={state} />
          )}
          {selectedComponent === "hospitalUpdate" && (
            <HospitalUpdate hospitalId={hospitalId} state={state} />
          )}
          {selectedComponent === "doctor" && (
            <Doctor hospitalId={hospitalId} state={state} />
          )}
          {selectedComponent === "patient" && (
            <Patient hospitalId={hospitalId} state={state} />
          )}
          {selectedComponent === "search" && <Search />}
        </section>
      ) : (
        <NoAccess link={"/admin/hospital-login"} />
      )}
    </>
  );
};

export default HospitalView;
