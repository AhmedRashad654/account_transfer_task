import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { axiosInstance } from "../../axios/axios";
import { toast } from "react-toastify";

export default function SingleAccount() {
  const { id } = useParams();
  const [user, setUser] = useState({});
  useEffect(() => {
    async function getSingleUser() {
      await axiosInstance
        .get(`/api/accounts/${id}`)
        .then((result) => setUser(result?.data))
        .catch((error) => toast.error(error?.response?.data?.error));
    }
    getSingleUser();
  }, [id]);
  return (
    <div className="flex justify-center items-center">
      <div className=" bg-gray-200 w-[350px] rounded-lg p-5 flex flex-col items-center gap-5 mt-5">
        <h4 className="text-[1.2rem] font-bold">Details Account</h4>
        <div className="flex flex-col gap-2 w-full">
          <label htmlFor="">Name</label>
          <input
            type="text"
            className="p-2 border-none outline-none rounded-md"
            readOnly
            value={user?.name || ""}
          />
        </div>
        <div className="flex flex-col gap-2 w-full">
          <label htmlFor="">Balance</label>
          <input
            type="number"
            className="p-2 border-none outline-none rounded-md"
            readOnly
            value={user?.balance || ""}
          />
        </div>
        <Link
          to={"/"}
          className="bg-blue-500 rounded-md text-white p-2 w-full text-center font-bold"
        >
          back
        </Link>
      </div>
    </div>
  );
}
