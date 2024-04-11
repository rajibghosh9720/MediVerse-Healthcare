import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash, faEdit } from "@fortawesome/free-solid-svg-icons";
import Doctor from "../../../../public/doctor_1.png";

const DoctorDashboard = (state) => {
  const doctorId = state.doctorId;

  const [doctorDetails, setDoctorDetails] = useState({});
  const [totalPatients, setTotalPatients] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [newHospitalId, setNewHospitalId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [popupColor, setPopupColor] = useState("");

  const togglePopup = () => {
    setShowPopup(!showPopup);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://mediverse-api.vercel.app/retrieveDoctorDetails",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ doctorLicenseId: doctorId }),
          }
        );

        const doctordata = await response.json();
        setDoctorDetails(doctordata.doctorDetails);

        const responsePatients = await fetch(
          "https://mediverse-api.vercel.app/totalPatientsUnderDoctor",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ doctorLicenseId: doctorId }),
          }
        );
        const patientsData = await responsePatients.json();
        setTotalPatients(patientsData.totalPatients);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [doctorId]);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const changeHospitalId = async () => {
    const { contract, account } = state.state;

    try {
      setIsLoading(true);

      const res = await fetch(
        "https://mediverse-api.vercel.app/isHospitalIdExistsByID",
        {
          method: "POST",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify({ hospitalId: newHospitalId }),
        }
      );

      const data = await res.json();

      if (data.status === 400) {
        if (contract && contract.methods) {
          await contract.methods
            .updateDoctorHospitalId(doctorId, newHospitalId)
            .send({ from: account });
          setShowAlert(true);
          setPopupMessage("Hospital Id Update Successful");
          setPopupColor("blue");
          setIsLoading(false);
          clearForm();
        }
      } else {
        setShowAlert(true);
        setPopupMessage("Hospital Id Not Exist");
        setPopupColor("Red");
        setIsLoading(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const clearForm = () => {
    setNewHospitalId("");
  };

  return (
    <div className="main--content">
      <div className="overview">
        <div className="title">
          <h2 className="section--title">Overview</h2>
        </div>

        <div className="cards">
          <div className=" w-4/5">
            <a
              href="#"
              className="relative block overflow-hidden rounded-lg border border-gray-300 p-4 sm:p-6 lg:p-8"
            >
              <span className="absolute inset-x-0 bottom-0 h-2 bg-gradient-to-r from-green-300 via-blue-500 to-purple-600" />
              <dl className="mb-6 flex gap-4 sm:gap-6">
                <div className="flex flex-col">
                  <dt className="text-lg font-medium text-gray-600">
                    License Id
                  </dt>
                  <dd className="text-base text-gray-500">
                    {" "}
                    {doctorDetails.doctorLicenseId}
                  </dd>
                </div>
                <div className="flex flex-col">
                  <dt className="text-lg font-medium text-gray-600">
                    Hospital Id
                  </dt>
                  <dd className="text-base text-gray-500">
                    {doctorDetails.hospitalId}
                    {/* <button
                      className="ml-2 focus:outline-none"
                      onClick={togglePopup}
                    >
                      <FontAwesomeIcon
                        icon={faEdit}
                        className="text-gray-600 hover:text-gray-800 cursor-pointer"
                      />
                    </button> */}
                  </dd>
                </div>
              </dl>

              <div className="sm:flex sm:justify-between sm:gap-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 sm:text-xl">
                    Name : {doctorDetails.doctorName}
                  </h3>
                  <p className="mt-1 text-lg  font-medium text-gray-600">
                    Specialization : {doctorDetails.doctorSpecialization}
                  </p>
                  <p className="mt-1 text-lg font-medium text-gray-600">
                    Phone No : {doctorDetails.doctorPhone}
                  </p>
                </div>
                <div className="hidden sm:block sm:shrink-0">
                  <img
                    alt=""
                    src={Doctor}
                    className="size-20 rounded-lg object-cover shadow-sm"
                  />
                </div>
              </div>
              <div className="mt-4">
                <p className="text-pretty text-lg text-gray-500">
                  Address: {doctorDetails.doctorAddress}
                </p>
              </div>
              <div className="mt-4">
                <p className="text-pretty text-lg text-gray-500">
                  Password:{" "}
                  {showPassword ? (
                    <span>{doctorDetails.password}</span>
                  ) : (
                    <span>********</span>
                  )}
                  <button
                    className="ml-2 focus:outline-none"
                    onClick={togglePasswordVisibility}
                  >
                    <FontAwesomeIcon
                      icon={showPassword ? faEyeSlash : faEye}
                      className="text-gray-600 hover:text-gray-800 cursor-pointer"
                    />
                  </button>
                </p>
              </div>
            </a>
          </div>

          <div className="shadow card card-2">
            <div className="card--data">
              <div className="card--content">
                <h5 className="card--title">Total Patients</h5>
                <h1>{totalPatients}</h1>
              </div>
              <i className="ri-user-line card--icon--lg"></i>
            </div>
          </div>
        </div>
      </div>

      {showPopup && (
        <div className="fixed top-0 left-0 z-50 flex items-center justify-center w-full h-full bg-gray-800 bg-opacity-50">
          <div className="relative top-5 mx-auto p-5 border w-98 shadow-lg rounded-md bg-white">
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

            <div className="max-w-md w-full space-y-8 p-10 bg-white rounded-xl z-10">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-700">
                  CHANGE HOSPITAL ID
                </h2>
              </div>

              <div className="flex items-center justify-center space-x-2">
                <span className="h-px w-16 bg-gray-300" />
              </div>
              <form
                className="mt-8 space-y-6"
                onSubmit={(e) => {
                  e.preventDefault();
                  changeHospitalId();
                }}
              >
                <input type="hidden" />
                <div className="relative">
                  <label className="text-sm font-bold text-gray-600 tracking-wide">
                    New Hospital Id
                  </label>
                  <input
                    className="w-full text-base py-2 border-b border-gray-300 focus:outline-none focus:border-indigo-500"
                    type="text"
                    required
                    value={newHospitalId}
                    onChange={(e) => setNewHospitalId(e.target.value)}
                  />
                </div>

                <div>
                  <button
                    className="mt-5 tracking-wide font-semibold bg-indigo-500 text-gray-100 w-full py-4 rounded-lg hover:bg-indigo-700 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none"
                    type="submit"
                    disabled={isLoading}
                    style={{ height: "3.5rem" }}
                  >
                    {isLoading ? (
                      <>
                        <span className="mr-2">Please wait</span>
                        <svg
                          className="animate-spin h-5 w-5 mr-3"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A8.001 8.001 0 014.707 7.5H2.494A9.503 9.503 0 004 12.599l2-.308zM17.506 4.493A8.003 8.003 0 0120.992 10H23.5a9.503 9.503 0 00-1.995-5.101l-2 .308zM20 12a8 8 0 01-8 8v4c6.627 0 12-5.373 12-12h-4z"
                          ></path>
                        </svg>
                      </>
                    ) : (
                      <>
                        <span className="ml-3">Change</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
          {showAlert && (
            <div className="fixed top-0 left-0 z-1050 flex items-center justify-center w-full h-full bg-gray-800 bg-opacity-50">
              <div className="relative top-5 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                <div class="flex justify-end">
                  <button
                    type="button"
                    class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center"
                    onClick={() => setShowAlert(false)}
                  >
                    <svg
                      class="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clip-rule="evenodd"
                      ></path>
                    </svg>
                  </button>
                </div>
                <div className="mt-3 text-center">
                  <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-gray-200">
                    <svg
                      className="w-5 h-5 rotate-45"
                      style={{ color: popupColor }}
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 18 20"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="m9 17 8 2L9 1 1 19l8-2Zm0 0V9"
                      />
                    </svg>
                  </div>

                  <div className="mt-2 px-7 py-3">
                    <p className="text-sm text-gray-500">{popupMessage}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DoctorDashboard;
