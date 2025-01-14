import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { axiosInstance } from "../../axios/axios";
import { toast } from "react-toastify";

export default function CreateAccount() {
  const navigate = useNavigate();
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm();

  async function onSubmit(data) {
    try {
      const result = await axiosInstance.post("/api/accounts/add", data);
      if (result.status === 201) {
        navigate(`/`);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  }
  return (
    <div className="flex justify-center items-center">
      <form
        className=" bg-gray-200 w-[350px] rounded-lg p-5 flex flex-col items-center gap-5 mt-5"
        onSubmit={handleSubmit(onSubmit)}
      >
        <h4 className="text-[1.2rem] font-bold">Create Account</h4>
        <div className="flex flex-col gap-2 w-full">
          <label htmlFor="">Name</label>
          <input
            type="text"
            className="p-2 border-none outline-none rounded-md"
            {...register("name", {
              required: "name is required",
              maxLength: {
                value: 150,
                message: " max length 150 character",
              },
            })}
          />
          {errors["name"] && (
            <p className="text-red-500 text-sm -mt-1">
              {errors["name"].message}
            </p>
          )}
        </div>
        <div className="flex flex-col gap-2 w-full">
          <label htmlFor="">Balance</label>
          <input
            type="number"
            step="0.01"
            className="p-2 border-none outline-none rounded-md"
            {...register("balance", {
              required: "balance is required",
              maxLength: {
                value: 10,
                message: "balance max length 10 numbers",
              },
            })}
          />
          {errors["balance"] && (
            <p className="text-red-500 text-sm -mt-1">
              {errors["balance"].message}
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
