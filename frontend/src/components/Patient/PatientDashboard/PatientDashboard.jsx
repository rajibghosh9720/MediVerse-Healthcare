import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEyeSlash, faEye } from "@fortawesome/free-solid-svg-icons";

const PatientDashboard = (state) => {
  const patientId = state.patientId;

  const [PatientDetails, setPatientDetails] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchPatientDetails = await fetch(
          "https://mediverse-api.vercel.app/retrievePatientDetails",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ patientId }),
          }
        );
        const Data = await fetchPatientDetails.json();
        setPatientDetails(Data.patientDetails);
        console.log(Data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [patientId]);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
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
          class="text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
        >
          <FontAwesomeIcon icon={faEye} className="mr-2" />
          {buttonLabel}
        </a>
      );
    });
  };

  return (
    <div className="main--content">
      <div className="p-8 bg-white mt-8">
        <div className="grid grid-cols-1 md:grid-cols-3">
          <div className="grid grid-cols-3 text-center order-last md:order-first  md:mt-0">
            <div>
              <p className="font-bold text-gray-700 text-xl">
                {PatientDetails.patientId}
              </p>
              <p className="text-gray-400">Patient ID</p>
            </div>
            <div>
              <p className="font-bold text-gray-700 text-xl">
                {" "}
                {PatientDetails.hospitalId}
              </p>
              <p className="text-gray-400">Hospital ID</p>
            </div>
            <div>
              <p className="font-bold text-gray-700 text-xl">
                {" "}
                {PatientDetails.doctorLicenseId}
              </p>
              <p className="text-gray-400">Doctor ID</p>
            </div>
          </div>
          <div className="relative">
            <div className=" w-28 h-28 bg-indigo-100 mx-auto rounded-full shadow-xl absolute inset-x-0 top-0 flex items-center justify-center text-indigo-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-14 w-24"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>
          <div className="space-x-8 flex justify-between mt-32 md:mt-0 md:justify-center">
            <button className="text-white py-2 px-4 uppercase rounded bg-blue-600 hover:bg-blue-700 shadow hover:shadow-lg font-medium transition transform hover:-translate-y-0.5">
              Hospital
            </button>
            <button className="text-white py-2 px-4 uppercase rounded bg-purple-600 hover:bg-purple-700 shadow hover:shadow-lg font-medium transition transform hover:-translate-y-0.5">
              Doctor
            </button>
          </div>
        </div>
        <div className="mt-20 text-center border-b pb-12">
          <h1 className="text-4xl font-medium text-gray-700">
            {PatientDetails.patientName}
          </h1>
          <p className="font-light text-gray-600 mt-3">
            {PatientDetails.patientAddress}
          </p>
        </div>

        <div className="my-4 flex flex-col 2xl:flex-row space-y-4 2xl:space-y-0 2xl:space-x-4">
          <div className="w-full h-1/4 flex flex-col 2xl:w-1/3 border border-gray-100 rounded-lg ">
            <div className="flex-1 bg-white rounded-lg shadow-xl p-8">
              <h4 className="text-xl text-gray-700 font-bold">Personal Info</h4>
              <ul className="mt-2 text-gray-600">
                <li className="flex border-b py-2">
                  <span className="font-bold w-24">Age :</span>
                  <span className="text-gray-700">{PatientDetails.age}</span>
                </li>
                <li className="flex border-b py-2">
                  <span className="font-bold w-24">Gender :</span>
                  <span className="text-gray-700">{PatientDetails.gender}</span>
                </li>
                <li className="flex border-b py-2">
                  <span className="font-bold w-24">Mobile :</span>
                  <span className="text-gray-700">
                    {PatientDetails.patientPhone}
                  </span>
                </li>
                <li className="flex border-b py-2">
                  <span className="font-bold w-24">Password :</span>
                  <span className="text-gray-700">
                    {showPassword ? (
                      <span>{PatientDetails.password}</span>
                    ) : (
                      <span>******</span>
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
                  </span>
                </li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col w-full 2xl:w-2/3  rounded-lg ">
            <div>
              <div className="mx-2 grid grid-cols-12 space-x-8 overflow-hidden rounded-lg border py-8 text-gray-700 shadow transition sm:mx-auto">
                <div className="col-span-11 flex flex-col pr-8 text-left sm:pl-4">
                  <p className="mb-3 overflow-hidden pr-7 text-lg font-semibold sm:text-xl">
                    Medical Data :
                  </p>
                  <p className="overflow-hidden text-sm">
                    {PatientDetails.medicalData}
                  </p>
                </div>
              </div>
            </div>

            <div>
              <div className="mx-2 mt-4 grid grid-cols-12 space-x-8 overflow-hidden rounded-lg border py-8 text-gray-700 shadow transition sm:mx-auto">
                <div className="col-span-11 flex flex-col pr-8 text-left sm:pl-4">
                  <p className="mb-6 overflow-hidden pr-7 text-lg font-semibold sm:text-xl">
                    Medical Report :
                  </p>
                  <p className="overflow-hidden  text-sm">
                    {PatientDetails.medicalReport && (
                      <div key={PatientDetails.patientId}>
                        {PatientDetails.medicalReport.length > 0 && (
                          <div className="flex flex-wrap">
                            {renderMedicalReportButtons(
                              PatientDetails.medicalReport
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;
