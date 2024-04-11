import React, { useState, useEffect } from "react";
import Doctor1 from "../../../../public/Doctor.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPhone,
  faKey,
  faUserShield,
  faIdCard,
  faBriefcase,
  faMapMarkerAlt,
  faEdit,
  faEye,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

const Doctor = (state) => {
  const hospitalId = state.hospitalId;
  const [doctors, setDoctors] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    name: true,
    doctorLicenseId: false,
    doctorSpecialization: false,
  });
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [patients, setPatients] = useState([]);
  const [showPopupPatient, setshowPopupPatient] = useState(false);

  const [showUpdateDoctor, setShowUpdateDoctor] = useState(false);

  const [patientSearchTerm, setPatientSearchTerm] = useState("");
  const [patientFilters, setPatientFilters] = useState({
    patientName: true,
    patientID: false,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchDoctorsByHospitalId = await fetch(
          "https://mediverse-api.vercel.app/retrieveDoctorsByHospitalId",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ hospitalId }),
          }
        );
        const doctorsData = await fetchDoctorsByHospitalId.json();
        setDoctors(doctorsData.doctors);
      } catch (error) {
        console.error("Error fetching doctors data:", error);
      }
    };

    fetchData();
  }, [hospitalId]);

  useEffect(() => {
    const fetchPatientsByDoctorId = async (doctorLicenseId) => {
      try {
        const fetchPatientsByDoctorId = await fetch(
          "https://mediverse-api.vercel.app/retrievePatientsByDoctorId",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ doctorLicenseId }),
          }
        );
        const patientsData = await fetchPatientsByDoctorId.json();
        setPatients(patientsData.patients);
        setshowPopupPatient(true);
      } catch (error) {
        console.error("Error fetching patients data:", error);
      }
    };

    if (selectedDoctor) {
      fetchPatientsByDoctorId(selectedDoctor.doctorLicenseId);
    }
  }, [selectedDoctor]);

  const handleSearchTermChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleCheckboxChange = (event) => {
    const { name, checked } = event.target;
    setFilters({
      name: name === "name" ? checked : false,
      doctorLicenseId: name === "doctorLicenseId" ? checked : false,
      doctorSpecialization: name === "doctorSpecialization" ? checked : false,
    });
  };

  const handlePatientSearchTermChange = (event) => {
    setPatientSearchTerm(event.target.value);
  };

  const handlePatientCheckboxChange = (event) => {
    const { name, checked } = event.target;
    setPatientFilters({
      patientName: name === "patientName" ? checked : false,
      patientID: name === "patientID" ? checked : false,
    });
  };

  const filterDoctors = (doctor) => {
    if (searchTerm.trim() === "") return true;

    let matches = false;

    if (
      filters.name &&
      doctor.doctorName.toLowerCase().includes(searchTerm.toLowerCase())
    ) {
      matches = true;
    }

    if (
      filters.doctorLicenseId &&
      doctor.doctorLicenseId.toLowerCase().includes(searchTerm.toLowerCase())
    ) {
      matches = true;
    }

    if (
      filters.doctorSpecialization &&
      doctor.doctorSpecialization
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    ) {
      matches = true;
    }

    return matches;
  };

  const filterPatients = (patient) => {
    if (patientSearchTerm.trim() === "") return true;

    let matches = false;

    if (
      patientFilters.patientName &&
      patient.patientName
        .toLowerCase()
        .includes(patientSearchTerm.toLowerCase())
    ) {
      matches = true;
    }

    if (
      patientFilters.patientID &&
      patient.patientId.toLowerCase().includes(patientSearchTerm.toLowerCase())
    ) {
      matches = true;
    }

    return matches;
  };

  const filteredDoctors = doctors.filter(filterDoctors);
  const filteredPatients = patients.filter(filterPatients);

  const togglePopup = () => {
    setshowPopupPatient(!showPopupPatient);
  };

  const truncateText = (text, maxLength) => {
    if (text.length > maxLength) {
      return text.slice(0, maxLength) + "...";
    }
    return text;
  };

  const [doctorId, setdoctorId] = useState("");
  const [DoctorName, setDoctorName] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [DoctorAddress, setDoctorAddress] = useState("");
  const [DoctorSpecialization, setDoctorSpecialization] = useState("");

  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [popupColor, setPopupColor] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleUpdateClick = (doctorId) => {
    setdoctorId(doctorId);
    setShowUpdateDoctor(true);
  };

  useEffect(() => {
    const fetchDoctorDetails = async () => {
      try {
        const response = await fetch(
          "https://mediverse-api.vercel.app/retrieveDoctorDetails",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ doctorLicenseId: doctorId }),
          }
        );

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();

        if (data.status === 200) {
          const doctorDetails = data.doctorDetails;
          setDoctorName(doctorDetails.doctorName);
          setContactNumber(doctorDetails.doctorPhone.toString());
          setDoctorAddress(doctorDetails.doctorAddress);
          setDoctorSpecialization(doctorDetails.doctorSpecialization);
        }
      } catch (error) {
        console.error("Error fetching Doctor details:", error);
      }
    };

    fetchDoctorDetails();
  }, [doctorId]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const { contract, account } = state.state;

    try {
      setIsLoading(true);

      const res = await fetch(
        "https://mediverse-api.vercel.app/isDoctorExistsByDoctorLicenseId",
        {
          method: "POST",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify({ doctorLicenseId: doctorId }),
        }
      );

      const data = await res.json();
      console.log(data);
      if (data.status === 400) {
        if (contract && contract.methods) {
          await contract.methods
            .updateDoctorDetails(
              doctorId,
              DoctorName,
              DoctorAddress,
              DoctorSpecialization,
              contactNumber
            )
            .send({ from: account });
          setPopupMessage("Doctor Details Update Successful");
          setPopupColor("blue");
          setShowPopup(true);
          setIsLoading(false);
        } else {
          setPopupMessage("Account Not Connect");
          setPopupColor("red");
          setShowPopup(true);
          setIsLoading(false);
        }
      } else {
        setPopupMessage("Doctor Details cannot be Update");
        setPopupColor("red");
        setShowPopup(true);
        setIsLoading(false);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="py-3 flex items-center justify-center h-full"
      style={{ marginLeft: "18rem" }}
    >
      <div className="w-11/12 sm:w-11/12 md:w-8/12 lg:w-6/12 backdrop-blur-sm bg-white/40 p-6 rounded-lg shadow-sm border-violet-200 border bg-gradient-to-r from-violet-100 to-indigo-100">
        <div className="w-full flex justify-between items-center p-3">
          <h2 className="text-xl font-semibold">Doctor List</h2>
          <Link to="/admin/doctor-reg">
            <button
              id="openModalBtn"
              className="flex items-center bg-gradient-to-r from-violet-500 to-indigo-300  border border-fuchsia-00  text-white font-semibold py-2 px-4 rounded-md transition-colors duration-300 hover:border-indigo-500"
            >
              <svg
                className="w-4 h-4 mr-2 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>

              <p className="text-white">Add Doctor</p>
            </button>
          </Link>
        </div>
        <div className="flex justify-between p-3">
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              className="form-checkbox text-indigo-600"
              name="name"
              checked={filters.name}
              onChange={handleCheckboxChange}
            />
            <span className="ml-2 text-gray-700">Doctor Name</span>
          </label>
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              className="form-checkbox text-indigo-600"
              name="doctorLicenseId"
              checked={filters.doctorLicenseId}
              onChange={handleCheckboxChange}
            />
            <span className="ml-2 text-gray-700">Doctor License Id</span>
          </label>
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              className="form-checkbox text-indigo-600"
              name="doctorSpecialization"
              checked={filters.doctorSpecialization}
              onChange={handleCheckboxChange}
            />
            <span className="ml-2 text-gray-700">Doctor Specialization</span>
          </label>
        </div>

        <div className="w-full flex justify-center p-3">
          <div className="relative w-full">
            <input
              type="text"
              className="w-full backdrop-blur-sm bg-white/20 py-2 pl-10 pr-4 rounded-lg focus:outline-none border-2 border-violet-300 transition-colors duration-300 focus:border-blue-300"
              placeholder="Search"
              value={searchTerm}
              onChange={handleSearchTermChange}
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg
                className="w-4 h-4 text-gray-800"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 20"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="max-h-[55vh] overflow-y-auto">
          {filteredDoctors.length === 0 ? (
            <p className="mt-8 text-xl text-center text-red-600">
              No Doctors Found
            </p>
          ) : (
            filteredDoctors.map((doctor, index) => (
              <div key={index} className="relative flex flex-col">
                <FontAwesomeIcon
                  icon={faEye}
                  className="absolute top-0 right-0 mt-6 mr-6 text-gray-500 cursor-pointer"
                  onClick={() => {
                    setSelectedDoctor(doctor);
                    fetchPatientsByDoctorId(doctor.doctorLicenseId);
                  }}
                />
                <div className="bg-white shadow-lg rounded-xl p-2 m-1.5 overflow-hidden">
                  <div className="flex-none sm:flex">
                    <div className="relative h-32 w-32 sm:mb-0 mb-3">
                      <img
                        src={Doctor1}
                        className="w-30 h-30 object-cover rounded-2xl"
                      />
                    </div>
                    <div className="flex-auto sm:ml-5 justify-evenly">
                      <div className="flex items-center justify-between sm:mt-2">
                        <div className="flex items-center">
                          <div className="flex flex-col">
                            <div className="w-full flex-none text-lg text-gray-600 font-bold leading-none">
                              <FontAwesomeIcon
                                icon={faUserShield}
                                className="mr-2"
                              />
                              Name : {doctor.doctorName}
                            </div>
                            <div className="flex flex-col text-gray-500 my-1">
                              <span className="mr-3">
                                <FontAwesomeIcon
                                  icon={faIdCard}
                                  className="mr-2"
                                />
                                Doctor LicenseId : {doctor.doctorLicenseId}
                              </span>
                              <span className="mr-3">
                                <FontAwesomeIcon
                                  icon={faBriefcase}
                                  className="mr-2"
                                />
                                Doctor Specialization :{" "}
                                {doctor.doctorSpecialization}
                              </span>
                              <span
                                className="mr-3"
                                title={doctor.doctorAddress}
                              >
                                <FontAwesomeIcon
                                  icon={faMapMarkerAlt}
                                  className="mr-2"
                                />
                                Doctor Address :{" "}
                                {truncateText(doctor.doctorAddress, 40)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex pt-2  text-sm text-gray-500">
                        <div className="flex-1 inline-flex items-center">
                          <FontAwesomeIcon icon={faPhone} className="mr-1" />
                          <p>{doctor.doctorPhone}</p>
                        </div>
                        <div className="flex-1 inline-flex items-center">
                          <FontAwesomeIcon icon={faKey} className="mr-1" />
                          <p>{doctor.password}</p>
                        </div>
                        <button
                          className="flex-no-shrink bg-violet-400 hover:bg-violet-500 px-5 ml-4 py-2 text-xs shadow-sm hover:shadow-lg font-medium tracking-wider border-2 border-indigo-300 hover:border-indigo-500 text-white rounded-full transition ease-in duration-300"
                          onClick={() =>
                            handleUpdateClick(doctor.doctorLicenseId)
                          }
                        >
                          <FontAwesomeIcon icon={faEdit} className="mr-2" />
                          Update
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      {showPopupPatient && (
        <div className="fixed top-0 left-0 z-50 flex items-center justify-center w-full h-full bg-gray-800 bg-opacity-50">
          <div className="relative top-5 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="flex justify-end">
              <button
                type="button"
                className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center"
                onClick={() => {
                  setshowPopupPatient(false);
                  setSelectedDoctor(null);
                }}
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
            <div className="overflow-x-auto">
              <div className="py-3">
                <div className="relative max-w-xs mx-auto">
                  <div className="flex justify-center">
                    <input
                      type="text"
                      name="patientSearchTerm"
                      id="patientSearchTerm"
                      className="block p-3 pl-10 text-sm border border-blue-500 rounded-md focus:border-blue-800 w-full"
                      placeholder="Search"
                      value={patientSearchTerm}
                      onChange={handlePatientSearchTermChange}
                    />
                    <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                      <svg
                        className="h-3.5 w-3.5 text-gray-400"
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        viewBox="0 0 16 16"
                      >
                        <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
                      </svg>
                    </div>
                  </div>
                </div>
                <div className="flex justify-center mt-3">
                  <div className="mr-4">
                    <input
                      type="checkbox"
                      id="patientName"
                      name="patientName"
                      checked={patientFilters.patientName}
                      onChange={handlePatientCheckboxChange}
                    />
                    <label htmlFor="patientName" className="ml-1">
                      Patient Name
                    </label>
                  </div>
                  <div>
                    <input
                      type="checkbox"
                      id="patientID"
                      name="patientID"
                      checked={patientFilters.patientID}
                      onChange={handlePatientCheckboxChange}
                    />
                    <label htmlFor="patientID" className="ml-1">
                      Patient ID
                    </label>
                  </div>
                </div>
              </div>
              <div className="relative max-w-xs mx-auto">
                <div className="overflow-hidden border rounded-lg">
                  {filteredPatients.length === 0 ? (
                    <p className="p-4 text-center text-red-600">
                      No Patient Found
                    </p>
                  ) : (
                    <table className="divide-y divide-gray-200 w-full table-auto">
                      <thead className="bg-gray-50">
                        <tr>
                          <th
                            scope="col"
                            className="px-6 py-3 text-xs font-bold text-gray-500 uppercase text-center sticky top-0 bg-gray-50 z-10"
                          >
                            <span>Patient Name</span>
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-xs font-bold text-gray-500 uppercase text-center sticky top-0 bg-gray-50 z-10"
                          >
                            <span>Patient ID</span>
                          </th>
                        </tr>
                      </thead>
                    </table>
                  )}
                  <div className="max-h-[50vh] overflow-y-auto">
                    <table className="w-full table-auto">
                      <tbody className="divide-y divide-gray-200">
                        {filteredPatients.map((patient, index) => (
                          <tr key={index}>
                            <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap text-center">
                              {patient.patientName}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap text-center">
                              {patient.patientId}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {showUpdateDoctor && (
        <div className="fixed top-0 left-0 z-50 flex items-center justify-center w-full h-full bg-gray-800 bg-opacity-50">
          <div className="relative top-5 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="flex justify-end">
              <button
                type="button"
                className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center"
                onClick={() => setShowUpdateDoctor(false)}
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
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
                <div className="col-span-1">
                  <label className="block mb-2 text-sm text-gray-600">
                    Doctor Name
                  </label>
                  <input
                    type="text"
                    className="block w-full px-5 py-3 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-lg focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40"
                    id="DoctorName"
                    value={DoctorName}
                    onChange={(e) => setDoctorName(e.target.value)}
                  />
                </div>

                <div className="col-span-1">
                  <label className="block mb-2 text-sm text-gray-600">
                    Doctor Specialization
                  </label>
                  <input
                    type="text"
                    className="block w-full px-5 py-3 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-lg focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40"
                    id="DoctorSpecialization"
                    value={DoctorSpecialization}
                    onChange={(e) => setDoctorSpecialization(e.target.value)}
                  />
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
                    Doctor Address
                  </label>
                  <textarea
                    className="block w-full px-5 py-3 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-lg focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40 resize-none"
                    id="DoctorAddress"
                    value={DoctorAddress}
                    onChange={(e) => setDoctorAddress(e.target.value)}
                    rows={2}
                  />
                </div>

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

export default Doctor;
