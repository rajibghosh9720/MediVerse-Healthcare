import React, { useState, useEffect } from "react";

const DoctorUpdate = (state) => {
  const doctorId = state.doctorId;

  const [DoctorName, setDoctorName] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [DoctorAddress, setDoctorAddress] = useState("");
  const [DoctorSpecialization, setDoctorSpecialization] = useState("");

  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [popupColor, setPopupColor] = useState("");
  const [isLoading, setIsLoading] = useState(false);

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
    if (!contract) {
      setPopupMessage("Account Not Connected");
      setPopupColor("red");
      setShowPopup(true);
      setIsLoading(false);
      return;
    }

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
          clearForm();
          setPopupMessage("Doctor Details Update Successful");
          setPopupColor("blue");
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

  const clearForm = () => {
    setDoctorName("");
    setContactNumber("");
    setDoctorAddress("");
    setDoctorSpecialization("");
  };

  return (
    <div style={{ marginLeft: "20rem" }}>
      <div className="pt-8">
        <div className="flex bg-white rounded-lg shadow-lg overflow-hidden mx-auto max-w-sm lg:max-w-4xl border border-gray-300">
          <div
            className="hidden lg:block lg:w-1/2 bg-cover"
            style={{
              backgroundImage:
                'url("https://images.unsplash.com/photo-1566889035559-b14ef9d4c365?q=80&w=1923&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D")',
            }}
          />
          <div className="w-full p-2 lg:w-1/2">
            <div className="mt-4 flex items-center justify-between">
              <span className="border-b w-1/5 lg:w-1/6" />
              <p className="text-xl font-semibold text-center text-gray-700 uppercase">
                UPDATE DOCTOR DETAILS
              </p>
              <span className="border-b w-1/5 lg:w-1/6" />
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
        </div>
      </div>
      {showPopup && (
        <div className="fixed top-0 left-0 z-50 flex items-center justify-center w-full h-full bg-gray-800 bg-opacity-50">
          <div className="relative top-5 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
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
  );
};

export default DoctorUpdate;
