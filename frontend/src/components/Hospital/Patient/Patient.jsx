import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faEye,
  faEdit,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link } from "react-router-dom";

const Patient = (state) => {
  console.log(state);
  const hospitalId = state.hospitalId;
  const { contract, account } = state.state;
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [showPatientPopup, setshowPatientPopup] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [showDoctorPopUp, setShowDoctorPopUp] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [filteredPatients, setFilteredPatients] = useState([]);

  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("Patient Information");
  const [body, setBody] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchPatientsByHospitalId = await fetch(
          "https://mediverse-api.vercel.app/retrievePatientsByHospitalId",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ hospitalId }),
          }
        );
        const patientsData = await fetchPatientsByHospitalId.json();
        setPatients(patientsData.patients);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [hospitalId]);

  const fetchPatientDetails = async (patientId) => {
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
      const patientDetails = await fetchPatientDetails.json();
      setSelectedPatient(patientDetails.patientDetails);

      const formattedDetails = `
      Patient ID: ${patientDetails.patientDetails.patientId}
      Patient Name: ${patientDetails.patientDetails.patientName}
      Age: ${patientDetails.patientDetails.age}
      Gender: ${patientDetails.patientDetails.gender}
      Phone No: ${patientDetails.patientDetails.patientPhone}
      Address: ${patientDetails.patientDetails.patientAddress}
      Medical Data: ${patientDetails.patientDetails.medicalData}
    `;

      setBody(formattedDetails);
      setshowPatientPopup(true);
    } catch (error) {
      console.error("Error fetching patient details:", error);
    }
  };

  const fetchDoctorDetails = async (doctorLicenseId) => {
    try {
      const fetchDoctorDetails = await fetch(
        "https://mediverse-api.vercel.app/retrieveDoctorDetails",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ doctorLicenseId }),
        }
      );
      const doctorDetails = await fetchDoctorDetails.json();
      setSelectedDoctor(doctorDetails.doctorDetails);
      setShowDoctorPopUp(true);
    } catch (error) {
      console.error("Error fetching doctor details:", error);
    }
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  useEffect(() => {
    const filtered = patients.filter((patient) =>
      patient.patientName.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredPatients(filtered);
  }, [searchQuery, patients]);

  const handleSendEmail = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    try {
      const res = await fetch("https://mediverse-api.vercel.app/send-mail", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, subject, body }),
      });
      const data = await res.json();

      if (data.status === 200) {
        toast.success("Email sent Successfully");
        setEmail("");
      } else if (data.status === 400) {
        toast.error("Email not sent. Please check your email address.");
      } else {
        toast.error("Error sending email. Please try again later.");
      }
    } catch (error) {
      toast.error("Error sending email. Please try again later.");
      console.error("Error sending email:", error);
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
          class="text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
        >
          <FontAwesomeIcon icon={faEye} className="mr-2" />
          {buttonLabel}
        </a>
      );
    });
  };

  const [showUploadPopup, setShowUploadPopup] = useState(false);
  const [UploadLoading, setUploadLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState();

  const changeHandler = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUploadClick = () => {
    setShowUploadPopup(true);
  };

  const handleCloseUploadPopup = () => {
    setShowUploadPopup(false);
    setUploadLoading(false);
    setSelectedFile();
  };

  const handleUploadFile = async (patientId) => {
    const { contract, account } = state.state;
    if (!contract) {
      toast.warning("Account Not Connected");
      setUploadLoading(false);
      return;
    }
    if (!selectedFile) {
      toast.warning("Please Upload Medical Report");
      setUploadLoading(false);
      return;
    }

    setUploadLoading(true);
    setShowUploadPopup(true);

    try {
      const res = await fetch(
        "https://mediverse-api.vercel.app/isPatientExistsByPatientId",
        {
          method: "POST",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify({ patientId }),
        }
      );

      const data = await res.json();

      if (data.status === 400) {
        try {
          const formData = new FormData();
          formData.append("file", selectedFile);
          const metadata = JSON.stringify({
            name: selectedFile.name,
          });
          formData.append("pinataMetadata", metadata);

          const options = JSON.stringify({
            cidVersion: 0,
          });
          formData.append("pinataOptions", options);

          const res = await fetch(
            "https://api.pinata.cloud/pinning/pinFileToIPFS",
            {
              method: "POST",
              headers: {
                Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiI1ZmJlMDUzNy01N2Q2LTRkNjgtOGYwNi04YTQ1MDhiZTk3NTMiLCJlbWFpbCI6InJhamliZ2hvc2g5NzIwQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJwaW5fcG9saWN5Ijp7InJlZ2lvbnMiOlt7ImlkIjoiRlJBMSIsImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxfSx7ImlkIjoiTllDMSIsImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxfV0sInZlcnNpb24iOjF9LCJtZmFfZW5hYmxlZCI6ZmFsc2UsInN0YXR1cyI6IkFDVElWRSJ9LCJhdXRoZW50aWNhdGlvblR5cGUiOiJzY29wZWRLZXkiLCJzY29wZWRLZXlLZXkiOiIyNDhmNjcyODFjMGI5ZmM3YjVkMSIsInNjb3BlZEtleVNlY3JldCI6ImUxY2QwMzU0ZDBjOTllZjYyZThkMmU3YzlkYjFhMzExOTc3YmMxNmU1ZjM5NzgzMzAzMGY2YjJlM2Q0OGVkZWUiLCJpYXQiOjE3MTIyMTU0NTl9.wkaVB8Kb1Y_jW3jaAw6W2sQM1MgHr-u008NAamYUsHI`,
              },
              body: formData,
            }
          );
          const resData = await res.json();

          if (resData && contract && contract.methods) {
            await contract.methods
              .medicalReportAddedPatient(patientId, resData.IpfsHash)
              .send({ from: account });
            handleCloseUploadPopup();
            toast.success("File Upload Successfully");
          }
        } catch (error) {
          console.log(error);
        }
      } else if (data.status === 200) {
        setUploadLoading(false);
        toast.error("Patient Id Not Found");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setUploadLoading(false);
    }
  };

  const [ShowUpdatePatient, setShowUpdatePatient] = useState(false);
  const [PatientId, setPatientId] = useState("");
  const [PatientName, setPatientName] = useState("");
  const [Age, setAge] = useState("");
  const [Gender, setGender] = useState("");
  const [PatientAddress, setPatientAddress] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [MedicalData, setMedicalData] = useState("");

  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [popupColor, setPopupColor] = useState("");
  const [UpdateDetailsLoading, setUpdateDetailsLoading] = useState(false);

  const handleUpdateClick = async (patientId) => {
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
      const patientDetails = await fetchPatientDetails.json();
      setPatientId(patientDetails.patientDetails.patientId);
      setPatientName(patientDetails.patientDetails.patientName);
      setAge(patientDetails.patientDetails.age);
      setGender(patientDetails.patientDetails.gender);
      setPatientAddress(patientDetails.patientDetails.patientAddress);
      setContactNumber(patientDetails.patientDetails.patientPhone);
      setMedicalData(patientDetails.patientDetails.medicalData);
      setShowUpdatePatient(true);
    } catch (error) {
      console.error("Error fetching patient details:", error);
    }
  };

  const handleUpdatePatient = async (event) => {
    event.preventDefault();
    const { contract, account } = state.state;
    if (!contract) {
      setPopupMessage("Account Not Connected");
      setPopupColor("red");
      setShowPopup(true);
      setUpdateDetailsLoading(false);
      return;
    }

    try {
      setUpdateDetailsLoading(true);

      const res = await fetch(
        "https://mediverse-api.vercel.app/isPatientExistsByPatientId",
        {
          method: "POST",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify({ patientId: PatientId }),
        }
      );

      const data = await res.json();
      console.log(data);
      if (data.status === 400) {
        if (contract && contract.methods) {
          await contract.methods
            .updatePatientDetails(
              PatientId,
              PatientName,
              Age,
              Gender,
              PatientAddress,
              contactNumber,
              MedicalData
            )
            .send({ from: account });
          setPopupMessage("Patient Details Update Successful");
          setPopupColor("blue");
          setShowPopup(true);
          setUpdateDetailsLoading(false);
        }
      } else {
        setPopupMessage("Patient Details cannot be Update");
        setPopupColor("red");
        setShowPopup(true);
        setUpdateDetailsLoading(false);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setUpdateDetailsLoading(false);
    }
  };

  return (
    <div className="main--content py-3 px-4 h-full">
      <form
        className="mt-10 mx-auto max-w-xl py-2 px-3 rounded-full bg-gray-50 border flex focus-within:border-gray-300"
        onSubmit={handleSubmit}
      >
        <label className="bg-transparent focus:outline-none pr-1 font-semibold border-r-2 border-gray-300 focus:ring-0 px-0 py-0 mt-1">
          Name
        </label>
        <input
          type="text"
          placeholder="Search"
          className="bg-transparent w-full focus:outline-none pr-4 font-semibold border-0 focus:ring-0 px-0 py-0 ml-2"
          value={searchQuery}
          onChange={handleSearchChange}
        />
        <button className="flex items-center justify-center p-2 rounded-full bg-blue-500 hover:bg-blue-600 text-white w-16">
          <FontAwesomeIcon icon={faSearch} />
        </button>
      </form>

      <div className="p-4 flex justify-between items-center">
        <h2 className="text-xl font-semibold">Patient List</h2>
        <Link to="/admin/patient-reg">
          <button className="flex items-center justify-center p-2 rounded-full bg-blue-500 hover:bg-blue-600 text-white w-36">
            <FontAwesomeIcon icon={faPlus} className="mr-2" />
            Add Patient
          </button>
        </Link>
      </div>

      <div className="relative  flex flex-col items-center w-full">
        {filteredPatients.length > 0 ? (
          <div className="grid mt-2 gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
            {filteredPatients.map((patient) => (
              <div
                key={patient.patientId}
                className="flex flex-col w-80 md:w-full lg:w-80 xl:w-80 mx-auto mt-1"
              >
                <div className="bg-white border border-l-4 border-fuchsia-300 shadow-xl rounded-lg p-4">
                  <div className="flex-none lg:flex">
                    <div className="flex-auto ml-1 justify-evenly py-1">
                      <div className="flex flex-wrap">
                        <h2 className="flex-auto text-lg font-medium">
                          {patient.patientName}
                        </h2>
                      </div>
                      <div className="py-4 text-sm text-gray-500">
                        <div className="flex mb-2">
                          <p className="font-semibold">Patient ID :</p>
                          <p className="ml-2">{patient.patientId}</p>
                        </div>
                        <div className="flex">
                          <FontAwesomeIcon
                            icon={faEye}
                            className="mr-2 mt-0.5 cursor-pointer"
                            onClick={() =>
                              fetchDoctorDetails(patient.doctorLicenseId)
                            }
                          />
                          <p className="font-semibold">Doctor License ID :</p>
                          <p className="ml-2">{patient.doctorLicenseId}</p>
                        </div>
                      </div>

                      <div className="flex p-4 mt-1 pb-2 border-t border-gray-200" />
                      <div className="flex space-x-3 text-sm font-medium">
                        <div className="flex-auto flex space-x-3">
                          <button
                            className="mb-2 md:mb-0 bg-white px-4 py-2 shadow-sm tracking-wider border text-gray-600 rounded-full hover:bg-gray-100 inline-flex items-center space-x-2 "
                            onClick={() =>
                              fetchPatientDetails(patient.patientId)
                            }
                          >
                            View Details
                          </button>
                        </div>
                        <button
                          className="mb-2 md:mb-0 bg-purple-500 px-5 py-2 shadow-sm tracking-wider text-white rounded-full hover:bg-purple-600"
                          type="button"
                          onClick={() => handleUpdateClick(patient.patientId)}
                        >
                          <FontAwesomeIcon icon={faEdit} className="mr-2" />
                          Update
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-red-600 mt-8 text-2xl">
            No Patient Found
          </div>
        )}
      </div>

      {showPatientPopup && (
        <div className="fixed top-0 left-0 z-50 flex items-center justify-center w-full h-full bg-gray-800 bg-opacity-50">
          <div className="relative top-5 mx-auto p-5 border w-98 shadow-lg rounded-md bg-white">
            <div className="flex justify-end">
              <button
                type="button"
                className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center"
                onClick={() => setshowPatientPopup(false)}
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
            <div className="max-w-xl mx-auto">
              <div className="flex items-center mt-1">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-10 px-3 text-sm text-gray-700 border border-r-0 rounded-r-none border-blue-500 focus:outline-none rounded shadow-sm"
                  placeholder="Enter Email Address"
                />
                <button
                  onClick={handleSendEmail}
                  af
                  className="h-10 px-4 text-sm bg-blue-500 border border-l-0 border-blue-500 rounded-r shadow-sm text-blue-50 hover:text-white hover:bg-blue-400 hover:border-blue-400 focus:outline-none"
                >
                  Send
                </button>
              </div>
              <ToastContainer position="bottom-right" />
            </div>

            <div
              className="bg-white max-w-lg shadow overflow-hidden sm:rounded-lg mt-4"
              style={{ maxHeight: "80vh", overflowY: "auto" }}
            >
              <div className="border-t border-gray-200">
                <dl>
                  <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">Name</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {selectedPatient.patientName}
                    </dd>
                  </div>
                  <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">
                      Patient Id
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {selectedPatient.patientId}
                    </dd>
                  </div>
                  <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">
                      Doctor License Id
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {selectedPatient.doctorLicenseId}
                    </dd>
                  </div>
                  <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">Age</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {selectedPatient.age}
                    </dd>
                  </div>
                  <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">
                      Gender
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {selectedPatient.gender}
                    </dd>
                  </div>
                  <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">
                      Phone No
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {selectedPatient.patientPhone}
                    </dd>
                  </div>
                  <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">
                      Address
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {selectedPatient.patientAddress}
                    </dd>
                  </div>
                  <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">
                      Medical Data
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {selectedPatient.medicalData}
                    </dd>
                  </div>

                  <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">
                      Medical Report
                      <button
                        type="button"
                        class=" py-2 mt-2 px-2 flex justify-center items-center   transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:ring-2 focus:ring-offset-2  rounded-lg bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 focus:outline-none text-white "
                        onClick={handleUploadClick}
                      >
                        <svg
                          width="20"
                          height="20"
                          fill="currentColor"
                          class="mr-2"
                          viewBox="0 0 1792 1792"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M1344 1472q0-26-19-45t-45-19-45 19-19 45 19 45 45 19 45-19 19-45zm256 0q0-26-19-45t-45-19-45 19-19 45 19 45 45 19 45-19 19-45zm128-224v320q0 40-28 68t-68 28h-1472q-40 0-68-28t-28-68v-320q0-40 28-68t68-28h427q21 56 70.5 92t110.5 36h256q61 0 110.5-36t70.5-92h427q40 0 68 28t28 68zm-325-648q-17 40-59 40h-256v448q0 26-19 45t-45 19h-256q-26 0-45-19t-19-45v-448h-256q-42 0-59-40-17-39 14-69l448-448q18-19 45-19t45 19l448 448q31 30 14 69z"></path>
                        </svg>
                        Upload
                      </button>
                    </dt>
                    <dd className="text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      <div key={selectedPatient.patientId}>
                        {selectedPatient.medicalReport.length > 0 && (
                          <div className="flex flex-wrap">
                            {renderMedicalReportButtons(
                              selectedPatient.medicalReport
                            )}
                          </div>
                        )}
                      </div>
                    </dd>
                  </div>

                  <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">
                      Password
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {selectedPatient.password}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>

          {showUploadPopup && (
            <div className="fixed top-0 left-0 z-50 flex items-center justify-center w-full h-full bg-gray-800 bg-opacity-50">
              <div className="relative top-5 mx-auto p-5 border w-98 shadow-lg rounded-md bg-white">
                <div className="flex justify-end">
                  <button
                    type="button"
                    className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center"
                    onClick={handleCloseUploadPopup}
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
                <div className="relative">
                  <label
                    title="Click to upload"
                    htmlFor="button2"
                    className="cursor-pointer flex items-center gap-4 px-6 py-4 before:border-gray-400/60 hover:before:border-gray-300 group before:bg-gray-100 before:absolute before:inset-0 before:rounded-3xl before:border before:border-dashed before:transition-transform before:duration-300 hover:before:scale-105 active:duration-75 active:before:scale-95"
                  >
                    <div className="w-max relative">
                      <img
                        className="w-12"
                        src="https://www.svgrepo.com/show/485545/upload-cicle.svg"
                        alt="file upload icon"
                        width={512}
                        height={512}
                      />
                    </div>
                    <div className="relative w-36 overflow-hidden">
                      <span className="block text-base font-semibold relative text-blue-900 group-hover:text-blue-500 truncate">
                        {selectedFile ? selectedFile.name : "Upload a file"}
                      </span>
                    </div>
                  </label>
                  <input
                    hidden="true"
                    type="file"
                    name="button2"
                    id="button2"
                    onChange={changeHandler}
                  />
                </div>

                <div className="mt-2 flex items-center justify-center gap-x-6">
                  <button
                    className="mt-2 tracking-wide font-semibold bg-indigo-500 text-gray-100 w-full py-4 rounded-lg hover:bg-indigo-700 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none"
                    type="submit"
                    disabled={UploadLoading}
                    onClick={() => handleUploadFile(selectedPatient.patientId)}
                  >
                    {UploadLoading ? (
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
                        <span className="ml-3">Upload</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {showDoctorPopUp && (
        <div className="fixed top-0 left-0 z-50 flex items-center justify-center w-full h-full bg-gray-800 bg-opacity-50">
          <div className="relative top-5 mx-auto p-5 border w-98 shadow-lg rounded-md bg-white">
            <div className="flex justify-end">
              <button
                type="button"
                className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center"
                onClick={() => setShowDoctorPopUp(false)}
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
            <div
              className="bg-white max-w-lg shadow overflow-hidden sm:rounded-lg"
              style={{ maxHeight: "80vh", overflowY: "auto" }}
            >
              <div className="border-t border-gray-200">
                <dl>
                  <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">
                      Doctor Name
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {selectedDoctor.doctorName}
                    </dd>
                  </div>
                  <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">
                      Doctor License Id
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {selectedDoctor.doctorLicenseId}
                    </dd>
                  </div>
                  <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">
                      Hospital Id
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {selectedDoctor.hospitalId}
                    </dd>
                  </div>
                  <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">
                      Phone No
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {selectedDoctor.doctorPhone}
                    </dd>
                  </div>
                  <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">
                      Address
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {selectedDoctor.doctorAddress}
                    </dd>
                  </div>
                  <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">
                      Specialization
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {selectedDoctor.doctorSpecialization}
                    </dd>
                  </div>
                  <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">
                      Password
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {selectedDoctor.password}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        </div>
      )}

      {ShowUpdatePatient && (
        <div className="fixed top-0 left-0 z-50 flex items-center justify-center w-full h-full bg-gray-800 bg-opacity-50 overflow-y-auto">
          <div className="relative top-5 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="flex justify-end">
              <button
                type="button"
                className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center"
                onClick={() => setShowUpdatePatient(false)}
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
            <div
              className="p-6 space-y-4 md:space-y-6 sm:p-8"
              style={{ maxHeight: "80vh", overflowY: "auto" }}
            >
              <form
                className="space-y-4 md:space-y-6"
                onSubmit={handleUpdatePatient}
              >
                <div className="col-span-1">
                  <label className="block mb-2 text-sm text-gray-600">
                    Patient Name
                  </label>
                  <input
                    type="text"
                    className="block w-full px-5 py-3 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-lg focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40"
                    id="PatientName"
                    value={PatientName}
                    onChange={(e) => setPatientName(e.target.value)}
                  />
                </div>
                <div className="col-span-1">
                  <label className="block mb-2 text-sm text-gray-600">
                    Age
                  </label>
                  <input
                    type="text"
                    className="block w-full px-5 py-3 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-lg focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40"
                    id="Age"
                    value={Age}
                    onChange={(e) => setAge(e.target.value)}
                  />
                </div>
                <div className="col-span-1">
                  <label className="block mb-2 text-sm text-gray-600">
                    Gender
                  </label>
                  <select
                    className="block w-full px-5 py-3 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-lg focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40"
                    id="Gender"
                    value={Gender}
                    onChange={(e) => setGender(e.target.value)}
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="col-span-1">
                  <label className="block mb-2 text-sm text-gray-600">
                    Phone number
                  </label>
                  <input
                    type="text"
                    placeholder="XXX-XX-XX-XXX"
                    className="block w-full px-5 py-3 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-lg focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40"
                    id="contactNumber"
                    value={contactNumber}
                    onChange={(e) => setContactNumber(e.target.value)}
                  />
                </div>
                <div className="col-span-2">
                  <label className="block mb-2 text-sm text-gray-600">
                    Patient Address
                  </label>
                  <textarea
                    className="block w-full px-5 py-3 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-lg focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40 resize-none"
                    id="PatientAddress"
                    value={PatientAddress}
                    onChange={(e) => setPatientAddress(e.target.value)}
                    rows={2}
                  />
                </div>
                <div className="col-span-2">
                  <label className="block mb-2 text-sm text-gray-600">
                    Medical Data
                  </label>
                  <textarea
                    className="block w-full px-5 py-3 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-lg focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40 resize-none"
                    id="MedicalData"
                    value={MedicalData}
                    onChange={(e) => setMedicalData(e.target.value)}
                    rows={2}
                  />
                </div>

                <button
                  className="mt-5 tracking-wide font-semibold bg-indigo-500 text-gray-100 w-full py-4 rounded-lg hover:bg-indigo-700 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none"
                  type="submit"
                  disabled={UpdateDetailsLoading}
                  style={{ height: "3.5rem" }}
                >
                  {UpdateDetailsLoading ? (
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
                      <i className=" icon-9 ri-refresh-line"></i>
                      <span className="ml-3">Update Details</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
          {showPopup && (
            <div className="fixed top-0 left-0 z-50 flex items-center justify-center w-full h-full bg-gray-800 bg-opacity-50">
              <div className="relative top-5 mx-auto p-5 border w-80 shadow-lg rounded-md bg-white">
                <div class="flex justify-end">
                  <button
                    type="button"
                    class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center"
                    onClick={() => setShowPopup(false)}
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

export default Patient;
