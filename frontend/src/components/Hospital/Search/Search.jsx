import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faEye } from "@fortawesome/free-solid-svg-icons";

const Search = () => {
  const [searchType, setSearchType] = useState("patient");
  const [searchTerm, setSearchTerm] = useState("");
  const [patientData, setPatientData] = useState(null);
  const [doctorData, setDoctorData] = useState(null);
  const [showWarning, setShowWarning] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");

  useEffect(() => {
    let timer;
    if (showPopup) {
      timer = setTimeout(() => {
        setShowPopup(false);
      }, 5000);
    }
    return () => clearTimeout(timer);
  }, [showPopup]);

  const handleSearch = async (e) => {
    e.preventDefault();

    if (!searchTerm.trim()) {
      setShowPopup(false);
      setShowWarning(true);
      setTimeout(() => setShowWarning(false), 3000);
      return;
    }

    try {
      let url;
      const requestBody = {};

      if (searchType === "patient") {
        url = "https://mediverse-api.vercel.app/retrievePatientDetails";
        requestBody.patientId = searchTerm;
      } else if (searchType === "doctor") {
        url = "https://mediverse-api.vercel.app/retrieveDoctorDetails";
        requestBody.doctorLicenseId = searchTerm;
      }

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }

      const data = await response.json();

      if (searchType === "patient") {
        setShowPopup(false);
        setPatientData(data.patientDetails);
        setDoctorData(null);
        if (data.patientDetails.age === 0) {
          setShowWarning(false);
          setShowPopup(true);
          setPopupMessage("Patient");
        }
      } else if (searchType === "doctor") {
        setShowPopup(false);
        setDoctorData(data.doctorDetails);
        setPatientData(null);
        if (data.doctorDetails.doctorPhone === 0) {
          setShowWarning(false);
          setShowPopup(true);
          setPopupMessage("Doctor");
        }
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const renderMedicalReportButtons = (medicalReport) => {
    return medicalReport.map((hash, index) => {
      const url = `https://silver-worrying-raccoon-291.mypinata.cloud/ipfs/${hash}`;
      const buttonLabel = `Report ${index + 1}`;
      return (
        <a
          key={index}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
        >
          <FontAwesomeIcon icon={faEye} className="mr-2" />
          {buttonLabel}
        </a>
      );
    });
  };

  return (
    <div className="main--content py-3 px-4 h-full">
      <div className="container mx-auto  rounded-lg p-14 ">
        <form
          className="mx-auto max-w-xl py-2 px-3 rounded-full bg-gray-50 border flex focus-within:border-gray-300"
          onSubmit={handleSearch}
        >
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search"
            className="bg-transparent w-full focus:outline-none pr-4 text-base border-0 focus:ring-0 px-0 py-0 ml-2"
          />

          <select
            className="text-base text-gray-800 outline-none  px-4 py-2  mr-2 border-l-2 bg-gray-50"
            value={searchType}
            onChange={(e) => setSearchType(e.target.value)}
          >
            <option value="patient">Patient ID</option>
            <option value="doctor">Doctor ID</option>
          </select>
          <button className="bg-indigo-500 text-white text-base rounded-full px-4 py-2 font-thin">
            <FontAwesomeIcon icon={faSearch} />
          </button>
        </form>
      </div>

      {patientData ? (
        patientData.age === 0 ? (
          <></>
        ) : (
          <div className="flex justify-center">
            <div className="bg-white w-1/2 shadow overflow-hidden sm:rounded-lg">
              <div className="alert flex flex-row items-center bg-green-200 p-5 rounded border-b-2 border-green-300">
                <div className="alert-icon flex items-center bg-green-100 border-2 border-green-500 justify-center h-10 w-10 flex-shrink-0 rounded-full">
                  <span className="text-green-500">
                    <svg
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      className="h-6 w-6"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </span>
                </div>
                <div className="alert-content ml-4">
                  <div className="alert-title font-semibold text-lg text-green-800">
                    Patient Found
                  </div>
                  <div className="alert-description text-sm text-green-600">
                    The Patient matching your search criteria has been found.
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200">
                <dl>
                  <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">Name</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {patientData.patientName}
                    </dd>
                  </div>
                  <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">
                      Patient ID
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {patientData.patientId}
                    </dd>
                  </div>
                  <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">
                      Hospital ID
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {patientData.hospitalId}
                    </dd>
                  </div>
                  <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">
                      Doctor License ID
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {patientData.doctorLicenseId}
                    </dd>
                  </div>
                  <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">Age</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {patientData.age}
                    </dd>
                  </div>
                  <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">
                      Gender
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {patientData.gender}
                    </dd>
                  </div>
                  <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">
                      Phone No
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {patientData.patientPhone}
                    </dd>
                  </div>
                  <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">
                      Address
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {patientData.patientAddress}
                    </dd>
                  </div>
                  <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">
                      Medical Data
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {patientData.medicalData}
                    </dd>
                  </div>
                  <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">
                      Medical Report
                    </dt>
                    <dd className="text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      <div key={patientData.patientId}>
                        {patientData.medicalReport.length > 0 && (
                          <div className="flex flex-wrap">
                            {renderMedicalReportButtons(
                              patientData.medicalReport
                            )}
                          </div>
                        )}
                      </div>
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        )
      ) : null}

      {doctorData ? (
        doctorData.doctorPhone === 0 ? (
          <></>
        ) : (
          <div className="flex justify-center">
            <div className="bg-white w-1/2 shadow overflow-hidden sm:rounded-lg">
              <div className="alert flex flex-row items-center bg-green-200 p-5 rounded border-b-2 border-green-300">
                <div className="alert-icon flex items-center bg-green-100 border-2 border-green-500 justify-center h-10 w-10 flex-shrink-0 rounded-full">
                  <span className="text-green-500">
                    <svg
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      className="h-6 w-6"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </span>
                </div>
                <div className="alert-content ml-4">
                  <div className="alert-title font-semibold text-lg text-green-800">
                    Doctor Found
                  </div>
                  <div className="alert-description text-sm text-green-600">
                    The Doctor matching your search criteria has been found.
                  </div>
                </div>
              </div>
              <div className="border-t border-gray-200">
                <dl>
                  <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">
                      Doctor Name
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {doctorData.doctorName}
                    </dd>
                  </div>
                  <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">
                      Doctor License Id
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {doctorData.doctorLicenseId}
                    </dd>
                  </div>
                  <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">
                      Hospital Id
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {doctorData.hospitalId}
                    </dd>
                  </div>
                  <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">
                      Phone No
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {doctorData.doctorPhone}
                    </dd>
                  </div>
                  <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">
                      Address
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {doctorData.doctorAddress}
                    </dd>
                  </div>
                  <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">
                      Specialization
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {doctorData.doctorSpecialization}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        )
      ) : null}

      {showWarning && (
        <div className="flex justify-center">
          <div className="px-8 py-6 bg-yellow-400 text-white flex justify-between rounded">
            <div className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-7 w-7 mr-6"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
              </svg>
              <p> Please Search Patient ID or Doctor ID</p>
            </div>
            <button
              className="text-yellow-100 hover:text-white ml-4"
              onClick={() => setShowWarning(false)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      )}

      {showPopup && (
        <div className="flex justify-center">
          <div className="alert flex flex-row items-center bg-red-200 p-5 rounded border-b-2 border-red-300">
            <div className="alert-icon flex items-center bg-red-100 border-2 border-red-500 justify-center h-10 w-10 flex-shrink-0 rounded-full">
              <span className="text-red-500">
                <svg
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  className="h-6 w-6"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </span>
            </div>
            <div className="alert-content ml-4">
              <div className="alert-title font-semibold text-lg text-red-800">
                {popupMessage} ID not found
              </div>
              <div className="alert-description text-sm text-red-600">
                We couldn't find any {popupMessage} matching your search
                criteria.
                <br />
                Please review your searching {popupMessage} ID and try again.
              </div>
            </div>
            <button
              className="text-red-600 hover:text-red-700 ml-4"
              onClick={() => setShowPopup(false)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Search;
