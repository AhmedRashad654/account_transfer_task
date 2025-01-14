import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <div className="bg-gray-600 w-full py-5 px-5 flex items-center gap-10">
      <Link to={""} className="font-bold text-[1.3rem] text-white">
        Accounts
      </Link>
      <Link to={"/transfers"} className="font-bold text-[1.3rem] text-white">
        Transfers
      </Link>
    </div>
  );
}
