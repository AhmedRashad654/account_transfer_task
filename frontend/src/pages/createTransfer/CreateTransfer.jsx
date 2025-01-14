import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { axiosInstance } from "../../axios/axios";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
export default function CreateTransfer() {
  const navigate = useNavigate();
  const { senderId } = useParams();
  // get All account
  function getAccountsForSelect() {
    return axiosInstance.get(`/api/accounts/select`);
  }
  let { data } = useQuery({
    queryKey: ["getAccountsForSelect"],
    queryFn: getAccountsForSelect,
  });
  // create transfer
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm();

  async function onSubmit(data) {
    try {
      const result = await axiosInstance.post("/api/accounts/creareTranfer", {
        sender: senderId,
        receiver: data.receiver,
        amount: data.amount,
      });
      console.log(result);
      if (result.status === 201) {
        toast.success("transfer successfully");
        navigate(`/`);
      }
    } catch (error) {
      toast.error(error?.response?.data?.error);
    }
  }
  return (
    <div className="flex justify-center items-center">
      <form
        className=" bg-gray-200 w-[350px] rounded-lg p-5 flex flex-col items-center gap-5 mt-5"
        onSubmit={handleSubmit(onSubmit)}
      >
        <h4 className="text-[1.2rem] font-bold">Create Transfer</h4>
        <div className="flex flex-col gap-2 w-full">
          <label htmlFor="">Receiver</label>
          <select
            className="p-2 border-none outline-none rounded-md"
            {...register("receiver", {
              required: `receiver is required`,
            })}
          >
            <option value="">Select receiver</option>
            {data?.data?.results?.map((account) => (
              <option value={account?.id} key={account?.id}>
                {account?.name}
              </option>
            ))}
          </select>
          {errors["receiver"] && (
            <p className="text-red-500 text-sm -mt-1">
              {errors["receiver"].message}
            </p>
          )}
        </div>
        <div className="flex flex-col gap-2 w-full">
          <label htmlFor="">Amount</label>
          <input
            type="number"
            step="0.01"
            className="p-2 border-none outline-none rounded-md"
            {...register("amount", {
              required: "amount is required",
              maxLength: {
                value: 10,
                message: "amount max length 10 numbers",
              },
            })}
          />
          {errors["amount"] && (
            <p className="text-red-500 text-sm -mt-1">
              {errors["amount"].message}
            </p>
          )}
        </div>
        <button className="bg-blue-500 rounded-md text-white p-2 w-full">
          {isSubmitting ? "Loading" : "save"}
        </button>
      </form>
    </div>
  );
}
