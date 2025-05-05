import React, { useEffect, useState } from "react";
import { FaWallet } from "react-icons/fa";
import { IoIosWallet } from "react-icons/io";
import { IoGameController } from "react-icons/io5";
import { BiSolidCricketBall } from "react-icons/bi";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { getAdminData } from "../Controllers/Admin/AdminController";

export default function Dashboard() {
  const [adminData, setadminData] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getAdminData();
        setadminData(response.data);
      } catch (error) {
        toast.error("Something went wrong");
      }
    };

    fetchData();
  }, []);
  return (
    <div>
      <div className="grid grid-cols-2 lg:grid-cols-4 grid-rows-2 gap-4 mt-6">
        <Link
          to={"/dashboard?admin=deposit"}
          className="border-2 border-gray-400 p-2 rounded text-center font-semibold text-gray-300 flex flex-col justify-center items-center gap-2"
        >
          <FaWallet size={20} />
          Desposit
          <div className="border-t w-full pt-1">
            <p className="flex justify-between">
              Total : <span></span>
              {adminData?.depositCount}
            </p>
          </div>
        </Link>
        <Link
          to={"/dashboard?admin=withdrawal"}
          className="border-2 border-gray-400 p-2 rounded text-center font-semibold text-gray-300 flex flex-col justify-center items-center gap-2"
        >
          <IoIosWallet size={20} />
          Withdrawal
          <div className="border-t w-full pt-1">
            <p className="flex justify-between">
              Total : <span></span>
              {adminData?.withdrawalCount}
            </p>
          </div>
        </Link>
        <Link
          to={"/dashboard?admin=games-control"}
          className="border-2 border-gray-400 p-2 rounded text-center font-semibold text-gray-300 flex flex-col justify-center items-center gap-2"
        >
          <IoGameController size={20} />
          Games
        </Link>
        <Link
          to={"/dashboard?admin=matches"}
          className="border-2 border-gray-400 p-2 rounded text-center font-semibold text-gray-300 flex flex-col justify-center items-center gap-2"
        >
          <BiSolidCricketBall size={20} />
          Match
        </Link>
      </div>
    </div>
  );
}
