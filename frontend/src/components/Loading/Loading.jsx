import React from "react";
import Logo from "../../../public/Loading.png";

const Loading = () => {
  return (
    <>
      <div className="flex justify-center items-center h-screen">
        <div className="absolute animate-spin rounded-full h-32 w-32 border-t-4 border-b-4 border-purple-500" />
        <img src={Logo} className="rounded-full h-28 w-28" />
      </div>
    </>
  );
};

export default Loading;
