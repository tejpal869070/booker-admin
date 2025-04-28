import React, { useEffect, useState } from "react";
import {
  approveDepositRequest,
  getAllDepositRequest,
  rejectDepostRequest,
} from "../Controllers/Admin/AdminController";
import { toast, ToastContainer } from "react-toastify";
import { MdCancel } from "react-icons/md";

export default function Desposit() {
  const [data, setData] = useState([]);
  const [approving, setApproving] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [isCancelOpen, setCancelOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState("");

  const approveRequest = async (id) => {
    setApproving(true);
    try {
      const response = await approveDepositRequest(id);
      console.log(response);
    } catch (error) {
    } finally {
      setApproving(false);
      fetchData();
    }
  };

  // reject

  const openCancelPopup = (id) => {
    setCancelOpen(true);
  };

  const rejectDepost = async () => {
    setCancelling(true);
    try {
      const response = await rejectDepostRequest();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Internal Server Error !");
    } finally {
      setCancelling(false);
      fetchData();
    }
  };

  const fetchData = async () => {
    try {
      const response = await getAllDepositRequest();
      setData(response.reverse());
    } catch (error) {
      setData([]);
      window.alert("Data Not Found");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
  return (
    <div className="relative">
      <ToastContainer />
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 deposit-table">
          <thead className="text-xs text-gray-200 uppercase bg-indigo-700  ">
            <tr>
              <th scope="col" className="px-6 py-3">
                Transection Id
              </th>
              <th scope="col" className="px-6 py-3">
                Amount
              </th>
              <th scope="col" className="px-6 py-3">
                UID
              </th>
              <th scope="col" className="px-6 py-3">
                Status
              </th>
              <th scope="col" className="px-6 py-3">
                Date
              </th>
              <th scope="col" className="px-6 py-3">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {data &&
              data.map((item, index) => (
                <tr
                  key={index}
                  className="odd:bg-gray-400 odd:dark:bg-gray-900 even:bg-gray-500 even:dark:bg-gray-800 border-b dark:border-gray-700 border-gray-200 text-xs text-gray-900 font-semibold"
                >
                  <th
                    scope="row"
                    className="px-6 py-1 text-xs font-medium text-gray-900 whitespace-nowrap dark:text-white"
                  >
                    {item.transection_id}
                  </th>
                  <td className="px-6 py-1 ">$ {item.amount}</td>
                  <td className="px-6 py-1 text-xs">{item.user_id}</td>
                  <td className="px-6 py-1 text-xs">
                    {item.status === "P"
                      ? "Pending"
                      : item.status === "C"
                      ? "Cancelled"
                      : item.status === "S"
                      ? "Success"
                      : "Failed"}
                  </td>
                  <td className="px-6 py-1 text-xs">
                    {item.created_at.split("T")[0]}{" "}
                    {item.created_at.split("T")[1].split(".")[0]}
                  </td>
                  <td className="px-6 py-1 text-xs">
                    <button>View</button>
                    {item.status === "P" ? (
                      <button
                        disabled={approving}
                        onClick={() => approveRequest(item.id)}
                      >
                        {approving ? "Loading..." : "Approve"}
                      </button>
                    ) : item.status === "R" ? (
                      <button>Rejected</button>
                    ) : item.status === "S" ? (
                      <button style={{ backgroundColor: "green" }}>
                        Success
                      </button>
                    ) : (
                      <button>Failed</button>
                    )}
                    <button onClick={() => openCancelPopup(item.id)}>
                      Cancel
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {isCancelOpen && (
        <div className="fixed z-[999] top-0 left-0 w-screen h-screen flex justify-center pt-20 backdrop-blur-md bg-black/30">
          <MdCancel
            onClick={() => setCancelOpen(false)}
            className="cursor-pointer absolute top-4 right-4"
            size={20}
          />

          <div className="  border-2 border-gray-200 rounded-md h-auto p-6 max-h-[40vh]">
            <p className="text-gray-100">Reason</p>
            <textarea
              className="h-24 w-80 rounded"
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              minLength={4}
            />
            <div className="flex justify-around mt-6">
              <button onClick={rejectDepost} className="bg-green-500 rounded py-2 w-[45%] font-semibold text-gray-100">
                SUBMIT
              </button>
              <button className="bg-red-500 rounded py-2 w-[45%] font-semibold text-gray-100">
                CENCEL
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
