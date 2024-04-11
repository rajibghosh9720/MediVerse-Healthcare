import React, { useState } from "react";
import { Link } from "react-router-dom";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

const HospitalLogin = ({ state }) => {
  const [patientId, setpatientId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [PopupMessage, ShowPopupMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch(
        "https://mediverse-api.vercel.app/authenticatePatient",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ patientId, password }),
        }
      );

      const data = await response.json();

      if (data.status === 200) {
        const existingPatientID = Cookies.get("patientId");
        if (existingPatientID) {
          Cookies.remove("patientId");
        }
        Cookies.set("patientId", patientId);
        navigate(`/admin/patient-view/${patientId}`);
      } else {
        setShowPopup(true);
        ShowPopupMessage("Invalid Patient Id and Password");
      }
    } catch (error) {
      console.error("Login error:", error);
      ShowPopupMessage("An error occurred during login.");
    }
  };

  return (
    <div className="my-20">
      <div className="py-6">
        <div className="flex bg-white rounded-lg shadow-lg overflow-hidden mx-auto max-w-sm lg:max-w-4xl border border-gray-300">
          <div
            className="hidden lg:block lg:w-1/2 bg-cover"
            style={{
              backgroundImage:
                'url("https://images.unsplash.com/photo-1584466990297-7e8ab67a5eb0?q=80&w=1965&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D")',
            }}
          />
          <div className="w-full p-8 lg:w-1/2">
            <div className="mt-4 flex items-center justify-between">
              <span className="border-b w-1/5 lg:w-1/5" />
              <p className="text-2xl font-semibold text-center text-gray-700 uppercase">
                PATIENT LOGIN
              </p>
              <span className="border-b w-1/5 lg:w-1/5" />
            </div>

            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <form className="space-y-4 md:space-y-6" onSubmit={handleLogin}>
                <div>
                  <label
                    htmlFor="patientId"
                    className="block mb-2 text-sm font-medium text-gray-900"
                  >
                    Patient Id
                  </label>
                  <input
                    type="patientId"
                    name="patientId"
                    id="patientId"
                    value={patientId}
                    onChange={(e) => setpatientId(e.target.value)}
                    className="block w-full mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-lg focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40 p-2.5"
                    placeholder=""
                    required
                  />
                </div>
                <div className="relative">
                  <label
                    htmlFor="password"
                    className="block mb-2 text-sm font-medium text-gray-900"
                  >
                    Password
                  </label>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder=""
                    className="block w-full mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-lg focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40 p-2.5 pr-10"
                    required
                  />
                  <button
                    type="button"
                    className="absolute inset-y-8 right-0 px-3 py-2"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    <FontAwesomeIcon
                      icon={showPassword ? faEyeSlash : faEye}
                      className="text-gray-400 hover:text-gray-600"
                    />
                  </button>
                </div>
                <button
                  type="submit"
                  className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                >
                  Sign in
                </button>
                <p className="text-center text-sm font-bold text-gray-500">
                  Don’t have an account ? Contact Hospital
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
      {showPopup && (
        <div className="fixed top-0 left-0 z-50 flex items-center justify-center w-full h-full bg-gray-800 bg-opacity-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="flex justify-end">
              <button
                type="button"
                className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center"
                onClick={() => setShowPopup(false)}
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  ></path>
                </svg>
              </button>
            </div>
            <div className="p-6 pt-0 text-center">
              <svg
                className="w-20 h-20 text-red-600 mx-auto"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h3 className="text-xl font-normal text-gray-500 mt-5 mb-6">
                {PopupMessage}
              </h3>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HospitalLogin;
