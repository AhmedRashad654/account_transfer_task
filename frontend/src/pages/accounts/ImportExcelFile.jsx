import React, { useState } from "react";
import { toast } from "react-toastify";
import { axiosInstance } from "../../axios/axios";
export default function ImportExcelFile({ refetch }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleUploadCSV() {
    if (!file) return toast.error("you must upload file csv");
    const formDate = new FormData();
    formDate.append("file", file);
    setLoading(true);
    await axiosInstance
      .post("/api/accounts/uploadCSV", formDate)
      .then((result) => {
        if (result.status === 201) {
          toast.success("upload file csc successfully");
          setFile(null);
          refetch();
        }
      })
      .catch((error) => toast.error(error?.response?.data?.error))
      .finally(() => {
        setLoading(false);
      });
  }
  return (
    <div className="flex md:flex-row flex-col md:items-center gap-3">
      <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      <button
        className=" rounded-md py-2 px-5 bg-gray-500 w-fit text-white font-bold"
        onClick={handleUploadCSV}
      >
        {loading ? "Loading" : "Import CSV"}
      </button>
    </div>
  );
}
