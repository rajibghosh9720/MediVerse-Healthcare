import React from "react";
import { Link } from "react-router-dom";

const AdminPage = ({ state }) => {
  return (
    <div
      className="relative"
      style={{
        background:
          "linear-gradient(143.6deg, rgba(192, 132, 252, 0) 20.79%, rgba(232, 121, 249, 0.26) 40.92%, rgba(204, 171, 238, 0) 70.35%)",
      }}
    >
      <section>
        <div className="max-w-screen-xl mx-auto px-4 py-28 gap-12 text-gray-600 overflow-hidden md:px-8 md:flex">
          <div className="flex-none space-y-5 max-w-xl">
            <a
              href="javascript:void(0)"
              className="inline-flex gap-x-6 items-center rounded-full p-1 pr-6 border text-sm font-medium duration-150 hover:bg-white"
            >
              <span className="inline-block rounded-full px-3 py-1 bg-indigo-600 text-white">
                Hello there !👋
              </span>
              <p className="flex items-center">
                Welcome to our Login page
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    fillRule="evenodd"
                    d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
                    clipRule="evenodd"
                  />
                </svg>
              </p>
            </a>
            <h1 className="text-4xl text-gray-800 font-extrabold sm:text-5xl">
              Lorem ipsum dolor sit amet consectetur
            </h1>
            <p>
              Lorem ipsum dolor sit amet consectetur, adipisicing elit.
              Recusandae hic vero delectus laudantium vitae officiis
              exercitationem, debitis saepe sint.
            </p>
            <div class="flex flex-col">
              <Link to="/admin/hospital-login">
                <a class="flex items-center justify-center w-full md:w-1/3 gap-x-1 py-2 px-4 text-white font-medium bg-gray-800 duration-150 hover:bg-gray-700 active:bg-gray-900 rounded-full md:inline-flex">
                  Hospital Login
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    class="w-5 h-5"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </a>
              </Link>

              <Link to="/admin/doctor-login">
                <a class="mt-6 flex items-center justify-center w-full md:w-1/3 gap-x-1 py-2 px-4 text-white font-medium bg-gray-800 duration-150 hover:bg-gray-700 active:bg-gray-900 rounded-full md:inline-flex">
                  Doctor Login
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    class="w-5 h-5"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </a>
              </Link>
              <Link to="/admin/patient-login">
                <a
                  href="javascript:void(0)"
                  class="mt-6 flex items-center justify-center w-full md:w-1/3 gap-x-1 py-2 px-4 text-white font-medium bg-gray-800 duration-150 hover:bg-gray-700 active:bg-gray-900 rounded-full md:inline-flex"
                >
                  Patient Login
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    class="w-5 h-5"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </a>
              </Link>
            </div>
          </div>
          <div className="w-4/5 xl:w-4/6 mx-auto xl:mx-0 mt-2 xl:mt-0 flex justify-end md:w-5/12  relative py-20">
            <img
              src="https://images.unsplash.com/photo-1538108149393-fbbd81895907?q=80&w=2128&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt
              className="h-full w-full overflow-hidden object-cover relative z-10 xl:-ml-56 lg:-ml-32 sm:-ml-20 -ml-12 md:-ml-20 rounded-lg shadow-xl"
            />

            <div className="absolute bottom-0 right-0 pb-2 pr-2 z-0">
              <svg width={243} height={163} xmlns="http://www.w3.org/2000/svg">
                <g fill="#667EEA" fillRule="evenodd">
                  <rect width={5} height={5} rx="2.5" />
                  <rect x={30} width={5} height={5} rx="2.5" />
                  <rect x={59} width={5} height={5} rx="2.5" />
                  <rect x={89} width={5} height={5} rx="2.5" />
                  <rect x={119} width={5} height={5} rx="2.5" />
                  <rect x={148} width={5} height={5} rx="2.5" />
                  <rect x={178} width={5} height={5} rx="2.5" />
                  <rect x={208} width={5} height={5} rx="2.5" />
                  <rect x={238} width={5} height={5} rx="2.5" />
                  <rect y={20} width={5} height={5} rx="2.5" />
                  <rect x={30} y={20} width={5} height={5} rx="2.5" />
                  <rect x={59} y={20} width={5} height={5} rx="2.5" />
                  <rect x={89} y={20} width={5} height={5} rx="2.5" />
                  <rect x={119} y={20} width={5} height={5} rx="2.5" />
                  <rect x={148} y={20} width={5} height={5} rx="2.5" />
                  <rect x={178} y={20} width={5} height={5} rx="2.5" />
                  <rect x={208} y={20} width={5} height={5} rx="2.5" />
                  <rect x={238} y={20} width={5} height={5} rx="2.5" />
                  <rect y={39} width={5} height={5} rx="2.5" />
                  <rect x={30} y={39} width={5} height={5} rx="2.5" />
                  <rect x={59} y={39} width={5} height={5} rx="2.5" />
                  <rect x={89} y={39} width={5} height={5} rx="2.5" />
                  <rect x={119} y={39} width={5} height={5} rx="2.5" />
                  <rect x={148} y={39} width={5} height={5} rx="2.5" />
                  <rect x={178} y={39} width={5} height={5} rx="2.5" />
                  <rect x={208} y={39} width={5} height={5} rx="2.5" />
                  <rect x={238} y={39} width={5} height={5} rx="2.5" />
                  <rect y={60} width={5} height={5} rx="2.5" />
                  <rect x={30} y={60} width={5} height={5} rx="2.5" />
                  <rect x={59} y={60} width={5} height={5} rx="2.5" />
                  <rect x={89} y={60} width={5} height={5} rx="2.5" />
                  <rect x={119} y={60} width={5} height={5} rx="2.5" />
                  <rect x={148} y={60} width={5} height={5} rx="2.5" />
                  <rect x={178} y={60} width={5} height={5} rx="2.5" />
                  <rect x={208} y={60} width={5} height={5} rx="2.5" />
                  <rect x={238} y={60} width={5} height={5} rx="2.5" />
                  <rect y={79} width={5} height={5} rx="2.5" />
                  <rect x={30} y={79} width={5} height={5} rx="2.5" />
                  <rect x={59} y={79} width={5} height={5} rx="2.5" />
                  <rect x={89} y={79} width={5} height={5} rx="2.5" />
                  <rect x={119} y={79} width={5} height={5} rx="2.5" />
                  <rect x={148} y={79} width={5} height={5} rx="2.5" />
                  <rect x={178} y={79} width={5} height={5} rx="2.5" />
                  <rect x={208} y={79} width={5} height={5} rx="2.5" />
                  <rect x={238} y={79} width={5} height={5} rx="2.5" />
                  <rect y={99} width={5} height={5} rx="2.5" />
                  <rect x={30} y={99} width={5} height={5} rx="2.5" />
                  <rect x={59} y={99} width={5} height={5} rx="2.5" />
                  <rect x={89} y={99} width={5} height={5} rx="2.5" />
                  <rect x={119} y={99} width={5} height={5} rx="2.5" />
                  <rect x={148} y={99} width={5} height={5} rx="2.5" />
                  <rect x={178} y={99} width={5} height={5} rx="2.5" />
                  <rect x={208} y={99} width={5} height={5} rx="2.5" />
                  <rect x={238} y={99} width={5} height={5} rx="2.5" />
                  <rect y={119} width={5} height={5} rx="2.5" />
                  <rect x={30} y={119} width={5} height={5} rx="2.5" />
                  <rect x={59} y={119} width={5} height={5} rx="2.5" />
                  <rect x={89} y={119} width={5} height={5} rx="2.5" />
                  <rect x={119} y={119} width={5} height={5} rx="2.5" />
                  <rect x={148} y={119} width={5} height={5} rx="2.5" />
                  <rect x={178} y={119} width={5} height={5} rx="2.5" />
                  <rect x={208} y={119} width={5} height={5} rx="2.5" />
                  <rect x={238} y={119} width={5} height={5} rx="2.5" />
                  <rect y={139} width={5} height={5} rx="2.5" />
                  <rect x={30} y={139} width={5} height={5} rx="2.5" />
                  <rect x={59} y={139} width={5} height={5} rx="2.5" />
                  <rect x={89} y={139} width={5} height={5} rx="2.5" />
                  <rect x={119} y={139} width={5} height={5} rx="2.5" />
                  <rect x={148} y={139} width={5} height={5} rx="2.5" />
                  <rect x={178} y={139} width={5} height={5} rx="2.5" />
                  <rect x={208} y={139} width={5} height={5} rx="2.5" />
                  <rect x={238} y={139} width={5} height={5} rx="2.5" />
                  <rect y={158} width={5} height={5} rx="2.5" />
                  <rect x={30} y={158} width={5} height={5} rx="2.5" />
                  <rect x={59} y={158} width={5} height={5} rx="2.5" />
                  <rect x={89} y={158} width={5} height={5} rx="2.5" />
                  <rect x={119} y={158} width={5} height={5} rx="2.5" />
                  <rect x={148} y={158} width={5} height={5} rx="2.5" />
                  <rect x={178} y={158} width={5} height={5} rx="2.5" />
                  <rect x={208} y={158} width={5} height={5} rx="2.5" />
                  <rect x={238} y={158} width={5} height={5} rx="2.5" />
                </g>
              </svg>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AdminPage;
