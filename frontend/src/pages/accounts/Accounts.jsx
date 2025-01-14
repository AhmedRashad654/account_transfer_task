import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../../axios/axios";
import ButtonPagination from "../../componants/ButtonPagination";
import { Link, useNavigate } from "react-router-dom";
import ImportExcelFile from "./ImportExcelFile";

export default function Accounts() {
  const [page, setPage] = useState(1);
  const navigate = useNavigate();
  function getAccounts() {
    return axiosInstance.get(`/api/accounts/?page=${page}`);
  }
  let { data, refetch } = useQuery({
    queryKey: ["getAccounts", page],
    queryFn: () => getAccounts(page),
    keepPreviousData: true,
  });

  return (
    <div className="mt-5">
      <div className="flex md:flex-row flex-col gap-3 md:items-center justify-between">
        <div className="flex items-center gap-2">
          <Link
            to={"/createAccount"}
            className=" rounded-md py-2 px-5 bg-gray-600 text-white font-bold w-fit"
          >
            Create Account
          </Link>
          <h4>
            Total Accouts:{" "}
            <span className="text-blue-600">{data?.data?.count}</span>{" "}
          </h4>
        </div>
        <ImportExcelFile refetch={refetch} />
      </div>
      {data?.data?.results?.length > 0 ? (
        <div>
          <div className="containerTable scrollbar mt-5">
            <table>
              <thead>
                <tr>
                  <th className="thTable"> Name</th>
                  <th className="thTable"> Balance</th>
                  <th className="thTable"> Transfer from here</th>
                  <th className="thTable"> Details</th>
                </tr>
              </thead>
              <tbody>
                {data?.data?.results?.map((account) => (
                  <tr key={account?.id} className="cursor-pointer">
                    <td> {account?.name}</td>
                    <td> {account?.balance}</td>
                    <td
                      onClick={() => navigate(`createTransfer/${account?.id}`)}
                    >
                      <button className="h-fit bg-blue-400 rounded-md w-fit px-3 text-center py-1">
                        Transfer
                      </button>
                    </td>
                    <td onClick={() => navigate(`account/${account?.id}`)}>
                      <button className="h-fit bg-green-300 rounded-md w-fit px-3 text-center py-1">
                        Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <ButtonPagination
            page={page}
            setPage={setPage}
            next={data?.data?.next}
            previous={data?.data?.previous}
          />
        </div>
      ) : (
        <div className="flex items-center justify-center h-[60vh]">
          <h1 className="font-bold text-[1.5rem]">Not Found Account Yet</h1>
        </div>
      )}
    </div>
  );
}
