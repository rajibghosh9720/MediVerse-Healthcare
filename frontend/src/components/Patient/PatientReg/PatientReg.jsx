import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

const PatientReg = ({ state }) => {
  console.log(state);

  const [selectedFile, setSelectedFile] = useState();
  const changeHandler = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const [patientId, setPatientId] = useState("");
  const [hospitalId, setHospitalId] = useState("");
  const [doctorLicenseId, setDoctorLicenseId] = useState("");
  const [patientName, setPatientName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [patientAddress, setPatientAddress] = useState("");
  const [patientPhone, setPatientPhone] = useState("");
  const [medicalData, setMedicalData] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    const { contract, account } = state;

    if (
      !patientId ||
      !hospitalId ||
      !doctorLicenseId ||
      !patientName ||
      !age ||
      !gender ||
      !patientAddress ||
      !patientPhone ||
      !medicalData ||
      !password ||
      !confirmPassword
    ) {
      setToastMessage("Please fill in all fields");
      setShowToast(true);
      setLoading(false);
      return;
    }

    if (!selectedFile) {
      setToastMessage("Please select a medical report file");
      setShowToast(true);
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setToastMessage("Password and confirm password do not match");
      setShowToast(true);
      setLoading(false);
      return;
    }

    if (!contract) {
      setToastMessage("Account Not Connected");
      setShowToast(true);
      setLoading(false);
      return;
    }

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
      console.log(data);
      if (data.status === 200) {
        try {
          const res = await fetch(
            "https://mediverse-api.vercel.app/isHospitalDoctorMatch",
            {
              method: "POST",
              headers: {
                "content-type": "application/json",
              },
              body: JSON.stringify({ hospitalId, doctorLicenseId }),
            }
          );

          const data = await res.json();
          console.log(data);
          if (data.status === 200) {
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
                  .reg_patient(
                    patientId,
                    hospitalId,
                    doctorLicenseId,
                    patientName,
                    age,
                    gender,
                    patientAddress,
                    patientPhone,
                    medicalData,
                    [resData.IpfsHash],
                    password
                  )
                  .send({ from: account });
                console.log("Patient added");
                clearForm();
                setLoading(false);
                setShowPopup(true);
              }
            } catch (error) {
              console.log(error);
            }
          } else if (data.status === 400) {
            setLoading(false);
            setToastMessage("Hospital and Doctor are not matched.");
            setShowToast(true);
          } else {
            console.log("Patient cannot be added");
          }
        } catch (error) {
          console.log(error);
        }
      } else if (data.status === 400) {
        setLoading(false);
        setToastMessage("Patient Id already exists");
        setShowToast(true);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  const clearForm = () => {
    setPatientId("");
    setHospitalId("");
    setDoctorLicenseId("");
    setPatientName("");
    setAge("");
    setGender("");
    setPatientAddress("");
    setPatientPhone("");
    setMedicalData("");
    setPassword("");
    setConfirmPassword("");
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const toggleConfirmPasswordVisibility = () => {
    setConfirmPasswordVisible(!confirmPasswordVisible);
  };

  useEffect(() => {
    let timeoutId;
    if (showToast) {
      timeoutId = setTimeout(() => {
        setShowToast(false);
      }, 3000);
    }
    return () => clearTimeout(timeoutId);
  }, [showToast]);

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 flex justify-center">
      <div className="max-w-screen-xl m-0 sm:m-10 bg-white shadow sm:rounded-lg flex justify-center flex-1 border border-gray-300">
        <div
          className="hidden bg-cover lg:block lg:w-2/5 rounded-l-lg"
          style={{
            backgroundImage:
              'url("https://images.unsplash.com/photo-1666214276372-24e331683e78?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D")',
          }}
        ></div>
        <div className="flex items-center w-full max-w-3xl p-8 mx-auto lg:px-12 lg:w-3/5">
          <div className="w-full">
            <h1 className="text-2xl font-semibold tracking-wider text-gray-800 capitalize">
              Create Patient Account
            </h1>
            <p className="mt-4 text-gray-500">
              Let's get you all set up so you can verify your Patient account
              and start managing your Patient profile.
            </p>
            <form
              className="grid grid-cols-1 gap-6 mt-8 md:grid-cols-2"
              onSubmit={handleSubmit}
            >
              <div className="col-span-1">
                <label className="block mb-2 text-sm text-gray-600">
                  Patient ID
                </label>
                <input
                  type="text"
                  className="block w-full px-5 py-3 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-lg focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40"
                  value={patientId}
                  onChange={(e) => setPatientId(e.target.value)}
                />
              </div>
              <div className="col-span-1">
                <label className="block mb-2 text-sm text-gray-600">
                  Hospital ID
                </label>
                <input
                  type="text"
                  className="block w-full px-5 py-3 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-lg focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40"
                  value={hospitalId}
                  onChange={(e) => setHospitalId(e.target.value)}
                />
              </div>
              <div className="col-span-1">
                <label className="block mb-2 text-sm text-gray-600">
                  Doctor License ID
                </label>
                <input
                  type="text"
                  className="block w-full px-5 py-3 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-lg focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40"
                  value={doctorLicenseId}
                  onChange={(e) => setDoctorLicenseId(e.target.value)}
                />
              </div>
              <div className="col-span-1">
                <label className="block mb-2 text-sm text-gray-600">
                  Patient Name
                </label>
                <input
                  type="text"
                  className="block w-full px-5 py-3 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-lg focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                />
              </div>
              <div className="col-span-1">
                <label className="block mb-2 text-sm text-gray-600">Age</label>
                <input
                  type="number"
                  className="block w-full px-5 py-3 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-lg focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                />
              </div>
              <div className="col-span-1">
                <label className="block mb-2 text-sm text-gray-600">
                  Gender
                </label>
                <select
                  className="block w-full px-5 py-3 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-lg focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40"
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="col-span-1">
                <label className="block mb-2 text-sm text-gray-600">
                  Patient Address
                </label>
                <textarea
                  className="block w-full px-5 py-3 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-lg focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40 resize-none"
                  value={patientAddress}
                  onChange={(e) => setPatientAddress(e.target.value)}
                  rows={3}
                ></textarea>
              </div>
              <div className="col-span-1 mt-8">
                <label className="block mb-2 text-sm text-gray-600">
                  Patient Phone
                </label>
                <input
                  type="text"
                  className="block w-full px-5 py-3 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-lg focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40"
                  value={patientPhone}
                  onChange={(e) => setPatientPhone(e.target.value)}
                />
              </div>
              <div className="col-span-1">
                <label className="block mb-2 text-sm text-gray-600">
                  Medical Data
                </label>
                <input
                  type="text"
                  className="block w-full px-5 py-3 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-lg focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40"
                  value={medicalData}
                  onChange={(e) => setMedicalData(e.target.value)}
                />
              </div>
              <div className="col-span-1">
                <label className="block mb-2 text-sm text-gray-600">
                  Medical Report
                </label>
                <input
                  type="file"
                  className="block w-full px-5 py-3 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-lg focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40"
                  onChange={changeHandler}
                />
              </div>
              <div className="col-span-1">
                <label className="block mb-2 text-sm text-gray-600">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={passwordVisible ? "text" : "password"}
                    placeholder="Enter your password"
                    className="block w-full px-5 py-3 pr-10 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-lg focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40"
                    id="hospitalPassword"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-400 hover:text-gray-600"
                    onClick={togglePasswordVisibility}
                  >
                    <FontAwesomeIcon
                      icon={passwordVisible ? faEyeSlash : faEye}
                    />
                  </button>
                </div>
              </div>
              <div className="col-span-1">
                <label className="block mb-2 text-sm text-gray-600">
                  Confirm password
                </label>
                <div className="relative">
                  <input
                    type={confirmPasswordVisible ? "text" : "password"}
                    placeholder="Re-Enter your password"
                    className="block w-full px-5 py-3 pr-10 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-lg focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40"
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-400 hover:text-gray-600"
                    onClick={toggleConfirmPasswordVisibility}
                  >
                    <FontAwesomeIcon
                      icon={confirmPasswordVisible ? faEyeSlash : faEye}
                    />
                  </button>
                </div>
              </div>

              <button
                className="mt-5 tracking-wide font-semibold bg-indigo-500 text-gray-100 w-full py-4 rounded-lg hover:bg-indigo-700 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none"
                type="submit"
                disabled={loading}
                style={{ height: "3.5rem" }}
              >
                {loading ? (
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
                    <svg
                      className="w-6 h-6 -ml-2"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                      <circle cx="8.5" cy={7} r={4} />
                      <path d="M20 8v6M23 11h-6" />
                    </svg>
                    <span className="ml-3">Sign Up</span>
                  </>
                )}
              </button>

              {showToast && (
                <div
                  id="toast-simple"
                  className="mt-5 flex items-center justify-between w-full max-w-xs p-4 space-x-4 rtl:space-x-reverse text-gray-500 bg-white divide-x rtl:divide-x-reverse divide-red-300 rounded-lg shadow space-x border border-red-400"
                  role="alert"
                  style={{ height: "3.5rem" }}
                >
                  <svg
                    className="w-5 h-5 text-red-500 rotate-45"
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
                  <div className="text-red-400 ps-4 text-sm font-normal">
                    {toastMessage}
                  </div>
                  <div className="flex items-center ms-auto space-x-2 rtl:space-x-reverse">
                    <button
                      type="button"
                      className="ms-auto -mx-1.5 -my-1.5 bg-white text-red-400 hover:text-red-600 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex items-center justify-center h-8 w-8"
                      data-dismiss-target="#toast-undo"
                      aria-label="Close"
                      onClick={() => setShowToast(false)}
                    >
                      <span className="sr-only">Close</span>
                      <svg
                        className="w-3 h-3"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 14 14"
                      >
                        <path
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>

      {showPopup && (
        <div className="fixed top-0 left-0 z-50 flex items-center justify-center w-full h-full bg-gray-800 bg-opacity-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
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
                  className="w-5 h-5 text-indigo-600 rotate-45"
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
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Successful
              </h3>
              <div className="mt-2 px-7 py-3">
                <p className="text-sm text-gray-500">
                  Account has been Successfully Registered
                </p>
              </div>
              <div className="items-center px-4 py-3">
                <Link to="/admin/patient-login">
                  <button
                    id="ok-btn"
                    className="px-4 py-2 bg-indigo-500 text-white
                      text-base font-medium rounded-md w-full
                      shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
                    onClick={() => setShowPopup(false)}
                  >
                    Login
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientReg;
