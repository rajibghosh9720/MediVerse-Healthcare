import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

const HospitalChangePassword = (state) => {
  const hospitalId = state.hospitalId;
  const [oldpassword, setoldpassword] = useState("");
  const [newPassword, setnewPassword] = useState("");
  const [passwordVisible, setoldPasswordVisible] = useState(false);
  const [newPasswordVisible, setnewPasswordVisible] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [popupColor, setPopupColor] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const toggleoldPasswordVisibility = () => {
    setoldPasswordVisible(!passwordVisible);
  };

  const togglenewPasswordVisibility = () => {
    setnewPasswordVisible(!newPasswordVisible);
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    const { contract, account } = state.state;
    if (!contract) {
      setPopupMessage("Account Not Connected");
      setPopupColor("red");
      setShowPopup(true);
      setIsLoading(false);
      return;
    }

    const filter = {
      hospitalId: state.hospitalId,
      password: oldpassword,
    };
    try {
      setIsLoading(true);

      const response = await fetch(
        "https://mediverse-api.vercel.app/authenticateHospital",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(filter),
        }
      );

      const data = await response.json();
      console.log(data);
      if (data.status === 200) {
        await contract.methods
          .updateHospitalPassword(hospitalId, oldpassword, newPassword)
          .send({ from: account });

        clearForm();
        setPopupMessage("Password Update Successful");
        setPopupColor("blue");
        setShowPopup(true);
        setIsLoading(false);
      } else {
        setPopupMessage("Invalid username or old password");
        setPopupColor("red");
        setShowPopup(true);
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error updating password:", error);
      setIsLoading(false);
    }
  };

  const clearForm = () => {
    setoldpassword("");
    setnewPassword("");
  };

  return (
    <div style={{ marginLeft: "20rem" }}>
      <div className="pt-24">
        <div className="flex bg-white rounded-lg shadow-lg overflow-hidden mx-auto max-w-sm lg:max-w-4xl border border-gray-300">
          <div
            className="hidden lg:block lg:w-1/2 bg-cover"
            style={{
              backgroundImage:
                'url("https://images.unsplash.com/photo-1600091474842-83bb9c05a723?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D")',
            }}
          />
          <div className="w-full p-8 lg:w-1/2">
            <div className="mt-4 flex items-center justify-between">
              <span className="border-b w-1/5 lg:w-1/5" />
              <p className="text-xl font-semibold text-center text-gray-700 uppercase">
                HOSPITAL CHANGE PASSWORD
              </p>
              <span className="border-b w-1/5 lg:w-1/5" />
            </div>

            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <form
                className="space-y-4 md:space-y-6"
                onSubmit={handleUpdatePassword}
              >
                <div className="col-span-1">
                  <label className="block mb-2 text-sm font-medium text-gray-900">
                    Old Password
                  </label>
                  <div className="relative">
                    <input
                      type={passwordVisible ? "text" : "password"}
                      placeholder="Enter your password"
                      className="block w-full px-5 py-3 pr-10 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-lg focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40"
                      id="hospitalPassword"
                      value={oldpassword}
                      onChange={(e) => setoldpassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-400 hover:text-gray-600"
                      onClick={toggleoldPasswordVisibility}
                    >
                      <FontAwesomeIcon
                        icon={passwordVisible ? faEyeSlash : faEye}
                      />
                    </button>
                  </div>
                </div>
                <div className="col-span-1">
                  <label className="block mb-2 text-sm font-medium text-gray-900">
                    New password
                  </label>
                  <div className="relative">
                    <input
                      type={newPasswordVisible ? "text" : "password"}
                      placeholder="Re-Enter your password"
                      className="block w-full px-5 py-3 pr-10 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-lg focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40"
                      id="newPassword"
                      value={newPassword}
                      onChange={(e) => setnewPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-400 hover:text-gray-600"
                      onClick={togglenewPasswordVisibility}
                    >
                      <FontAwesomeIcon
                        icon={newPasswordVisible ? faEyeSlash : faEye}
                      />
                    </button>
                  </div>
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
                      <span className="ml-3">Change Password</span>
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

export default HospitalChangePassword;
