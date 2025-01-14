import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../../axios/axios";
import ButtonPagination from "../../componants/ButtonPagination";

export default function Transfers() {
  const [page, setPage] = useState(1);
  function getTransfers() {
    return axiosInstance.get(`/api/accounts/viewTransfer?page=${page}`);
  }
  let { data } = useQuery({
    queryKey: ["getTransfers", page],
    queryFn: () => getTransfers(page),
    keepPreviousData: true,
  });

  return (
    <div className="mt-5">
      <div className="flex items-center gap-2">
        <div className="text-[1.2rem] rounded-md font-bold">Transfers,</div>
        <h4>
          Total Transfers:{" "}
          <span className="text-blue-600">{data?.data?.count}</span>{" "}
        </h4>
      </div>

      {data?.data?.results?.length > 0 ? (
        <div>
          <div className="containerTable scrollbar mt-5">
            <table>
              <thead>
                <tr>
                  <th className="thTable"> From</th>
                  <th className="thTable"> To</th>
                  <th className="thTable"> Amount</th>
                  <th className="thTable"> Date</th>
                </tr>
              </thead>
              <tbody>
                {data?.data?.results?.map((account) => (
                  <tr key={account?.id} className="cursor-pointer">
                    <td> {account?.sender_name}</td>
                    <td> {account?.receiver_name}</td>
                    <td>{account?.amount}</td>
                    <td> {account?.timestamp?.slice(0, 10)}</td>
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
          <h1 className="font-bold text-[1.5rem]">Not Found Transfers Yet</h1>
        </div>
      )}
    </div>
  );
}
