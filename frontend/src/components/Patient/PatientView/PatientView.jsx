import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import PatientDashboard from "../PatientDashboard/PatientDashboard";
import NoAccess from "../../NoAccess/NoAccess.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome, faSignOutAlt } from "@fortawesome/free-solid-svg-icons";

const PatientView = ({ state }) => {
  const navigate = useNavigate();
  const { patientId: urlPatientId } = useParams();

  let patientId = Cookies.get("patientId") || false;

  useEffect(() => {
    if (patientId === false) {
      return;
    } else if (urlPatientId !== patientId) {
      navigate(`/404`);
    }
  }, [urlPatientId, patientId]);

  const handleLogout = () => {
    Cookies.remove("patientId");
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
      {patientId ? (
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
                    <Link to="/admin/patient-login" onClick={handleLogout}>
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
            <PatientDashboard patientId={patientId} state={state} />
          )}
        </section>
      ) : (
        <NoAccess link={"/admin/patient-login"} />
      )}
    </>
  );
};

export default PatientView;
