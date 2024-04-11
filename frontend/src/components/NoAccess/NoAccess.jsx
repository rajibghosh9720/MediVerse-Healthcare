import React from "react";
import { Link } from "react-router-dom";
import Not from "../../../public/Not.svg";

const NoAccess = (state) => {
  return (
    <div className="w-full h-screen flex flex-col items-center justify-center">
      <img className="h-1/2 w-1/2" src={Not} alt="" />
      <div className="flex flex-col items-center justify-center">
        <p className="text-3xl md:text-4xl lg:text-5xl text-gray-800 mt-2">
          Not Access
        </p>
        <p className="md:text-lg lg:text-xl text-gray-600 mt-4">
          Sorry, you are not Login.
        </p>
        <Link to={state.link}>
          <a
            className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-gray-100 px-4 py-2 mt-12 rounded transition duration-150"
            title="Return Home"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z"
                clipRule="evenodd"
              />
            </svg>
            <span>Go Back</span>
          </a>
        </Link>
      </div>
    </div>
  );
};

export default NoAccess;
