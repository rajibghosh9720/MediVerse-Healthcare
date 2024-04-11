import React, { useState, useEffect } from "react";
import Doctor from "../../../../public/DoctorLogo.png";
import Patient from "../../../../public/PatientLogo.png";
import { Link } from "react-router-dom";

const HospitalDashboard = (state) => {
  const hospitalId = state.hospitalId;
  const { contract, account } = state.state;

  const [hospitalDetails, setHospitalDetails] = useState({});
  const [totalDoctors, setTotalDoctors] = useState(0);
  const [totalPatients, setTotalPatients] = useState(0);
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch hospital details
        const fetchHospitalDetails = await fetch(
          "https://mediverse-api.vercel.app/retreiveHospitalDetails",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ hospital_Id: hospitalId }),
          }
        );
        const hospitalData = await fetchHospitalDetails.json();
        setHospitalDetails(hospitalData.HospitalDetails);

        // Fetch total doctors
        const fetchTotalDoctors = await fetch(
          "https://mediverse-api.vercel.app/totalDoctorsUnderHospital",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ hospitalId }),
          }
        );
        const doctorData = await fetchTotalDoctors.json();
        setTotalDoctors(doctorData.totalDoctors);

        // Fetch total patients
        const fetchTotalPatients = await fetch(
          "https://mediverse-api.vercel.app/totalPatientsUnderHospital",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ hospitalId }),
          }
        );
        const patientData = await fetchTotalPatients.json();
        setTotalPatients(patientData.totalPatients);

        // Fetch doctors by hospital ID
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

        // Fetch patients by hospital ID
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

  return (
    <div className="main--content">
      <div className="overview">
        <div className="title">
          <h2 className="section--title">Overview</h2>
        </div>

        <div className="cards">
          <div className="w-full bg-white overflow-hidden shadow-lg rounded-md border">
            <div className="px-4 py-5 sm:px-6 bg-violet-400">
              <h3 className="text-xl leading-6 font-medium text-white text-center">
                {hospitalDetails.hospitalName}
              </h3>
            </div>
            <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
              <dl className="sm:divide-y sm:divide-gray-200 ">
                <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 hover:bg-gray-50">
                  <dt className="text-sm font-medium text-gray-500">
                    Hospital Id
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {hospitalDetails.hospitalId}
                  </dd>
                </div>
                <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 hover:bg-gray-50">
                  <dt className="text-sm font-medium text-gray-500">
                    Hospital Specialization
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {hospitalDetails.hospitalSpec}
                  </dd>
                </div>
                <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 hover:bg-gray-50">
                  <dt className="text-sm font-medium text-gray-500">
                    Contact Number
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {hospitalDetails.numcontactNumber}
                  </dd>
                </div>
                <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 hover:bg-gray-50">
                  <dt className="text-sm font-medium text-gray-500">Address</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {hospitalDetails.hospitalAddress}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
          <div className="shadow card card-1">
            <div className="card--data">
              <div className="card--content">
                <h5 className="card--title">Total Doctors</h5>
                <h1>{totalDoctors}</h1>
              </div>
              <i className="ri-user-2-line card--icon--lg"></i>
            </div>
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

      <div className="doctors">
        <div className="title">
          <h2 className="section--title">All Doctors</h2>
          <div className="pr-5">
            <Link to="/admin/doctor-reg">
              <button
                id="openModalBtn"
                className="flex items-center bg-gradient-to-r from-violet-500 to-indigo-300  border border-fuchsia-00  text-white font-semibold py-2 px-4 rounded-md transition-colors duration-300 hover:border-indigo-500 "
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
        </div>
        {totalDoctors === 0 ? (
          <div className="p-4 text-center text-lg text-red-600">
            No Doctor Registered
          </div>
        ) : (
          <div className="overflow-hidden rounded-lg border border-gray-200 shadow-md m-5">
            <table className="w-full border-collapse bg-white text-center text-sm text-gray-500">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-4 font-medium text-gray-900"
                  >
                    Doctor Name
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-4 font-medium text-gray-900"
                  >
                    Doctor License Id
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-4 font-medium text-gray-900"
                  >
                    Doctor Specialization
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-4 font-medium text-gray-900"
                  >
                    Doctor Phone
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 border-t border-gray-100 ">
                {doctors.map((doctor, index) => (
                  <tr className="hover:bg-gray-50">
                    <th className="flex gap-3 px-6 py-4 font-normal text-gray-900">
                      <div className="relative h-10 w-10">
                        <img
                          className="h-full w-full rounded-full object-cover object-center"
                          src={Doctor}
                          alt=""
                        />
                      </div>
                      <span className="inline-flex items-center text-sm font-semibold">
                        {doctor.doctorName}
                      </span>
                    </th>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2 py-1 text-xs font-semibold text-green-600">
                        {doctor.doctorLicenseId}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-1 text-xs font-semibold text-blue-600">
                        {doctor.doctorSpecialization}
                      </span>
                    </td>
                    <td className="px-6 py-4">{doctor.doctorPhone}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="patients">
        <div className="title">
          <h2 className="section--title">All Patients</h2>
          <div className="pr-5">
            <Link to="/admin/patient-reg">
              <button
                id="openModalBtn"
                className="flex items-center bg-gradient-to-r from-violet-500 to-indigo-300  border border-fuchsia-00  text-white font-semibold py-2 px-4 rounded-md transition-colors duration-300 hover:border-indigo-500 "
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

                <p className="text-white">Add Patient</p>
              </button>
            </Link>
          </div>
        </div>
        {totalPatients === 0 ? (
          <div className="p-4 text-center text-lg text-red-600 ">
            No Patients Registered
          </div>
        ) : (
          <div className="overflow-hidden rounded-lg border border-gray-200 shadow-md m-5">
            <table className="w-full border-collapse bg-white text-center text-sm text-gray-500">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-4 font-medium text-gray-900"
                  >
                    Patient Name
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-4 font-medium text-gray-900"
                  >
                    Patient Id
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-4 font-medium text-gray-900"
                  >
                    Under Doctor License Id
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-4 font-medium text-gray-900"
                  >
                    Patient Phone
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-4 font-medium text-gray-900"
                  >
                    Age
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-4 font-medium text-gray-900"
                  >
                    Gender
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 border-t border-gray-100">
                {patients.map((patient, index) => (
                  <tr className="hover:bg-gray-50" key={index}>
                    <th className="flex gap-3 px-6 py-4 font-normal text-gray-900">
                      <div className="relative h-10 w-10">
                        <img
                          className="h-full w-full rounded-full object-cover object-center"
                          src={Patient}
                          alt=""
                        />
                      </div>
                      <span className="inline-flex items-center text-sm font-semibold">
                        {patient.patientName}
                      </span>
                    </th>

                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1 rounded-full bg-fuchsia-50 px-2 py-1 text-xs font-semibold text-fuchsia-600">
                        {patient.patientId}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2 py-1 text-xs font-semibold text-green-600">
                        {patient.doctorLicenseId}
                      </span>
                    </td>

                    <td className="px-6 py-4">{patient.patientPhone}</td>
                    <td className="px-6 py-4">{patient.age}</td>
                    <td className="px-6 py-4">{patient.gender}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default HospitalDashboard;
