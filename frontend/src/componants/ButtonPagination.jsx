import React from "react";
import { FaAngleRight } from "react-icons/fa6";
import { FaAngleLeft } from "react-icons/fa6";
export default function ButtonPagination({ page, setPage, next, previous }) {
  return (
    <div className="mt-5 flex items-center gap-3">
      <div
        onClick={() => (previous ? setPage((e) => e - 1) : "")}
        className={` ${previous ? "cursor-pointer" : ""}`}
      >
        <FaAngleRight size={25} color="gray" />
      </div>
      <div
        className={`p-1 px-4 
                bg-bgButtonPagination
              text-white font-bold rounded-md cursor-pointer`}
      >
        {page}
      </div>
      <div
        onClick={() => (next ? setPage((e) => e + 1) : "")}
        className={` ${next ? "cursor-pointer" : ""}`}
      >
        <FaAngleLeft size={25} color="gray" />
      </div>
    </div>
  );
}
