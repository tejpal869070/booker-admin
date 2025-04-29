import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import {
  approveWithdrawalRequest,
  getAllWithdrawalRequests,
  inprocessWithdrawalRequest,
  rejectWithdrawalRequest,
} from "../Controllers/Admin/AdminController";
import Swal from "sweetalert2";

export default function Withdrawals() {
  const [data, setData] = useState([]);
  const [isProcessing, setProcessing] = useState(false);

  //   inprocess
  const inProcessFuntion = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Make this withdrawal request Inprocess ?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes",
    });

    if (!result.isConfirmed) return;

    setProcessing(true);

    try {
      await inprocessWithdrawalRequest(id);
      await Swal.fire(
        "Approved!",
        "The withdrawal request now is in process.",
        "success"
      );
    } catch (error) {
      console.error(error);
      await Swal.fire(
        "Error!",
        "There was a problem approving the request.",
        "error"
      );
    } finally {
      setProcessing(false);
      fetchData();
    }
  };

  //   reject
  const rejectRequest = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Are you sure to reject this request",
      icon: "warning",
      input: "text",
      inputLabel: "Reason for rejection",
      inputPlaceholder: "Enter your reason here...",
      inputValidator: (value) => {
        if (!value) {
          return "You must provide a reason!";
        }
      },
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes",
    });

    if (!result.isConfirmed) return;

    const reason = result.value;

    try {
      await rejectWithdrawalRequest(id, reason);
      await Swal.fire("Approved!", "The withdrawal Rejected", "success");
      fetchData();
    } catch (error) {
      await Swal.fire(
        "Error!",
        "There was a problem approving the request.",
        "error"
      );
    }
  };

  //   approve
  const approveFunction = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Approve This withdrawal request ?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes",
    });

    if (!result.isConfirmed) return;
    try {
      await approveWithdrawalRequest(id);
      await Swal.fire(
        "Approved!",
        "The withdrawal request now is in process.",
        "success"
      );
      fetchData()
    } catch (error) {
      await Swal.fire(
        "Error!",
        "There was a problem approving the request.",
        "error"
      );
    }
  };

  const fetchData = async () => {
    try {
      const response = await getAllWithdrawalRequests();
      setData(response.reverse());
    } catch (error) {
      setData([]);
      window.alert("Data Not Found");
    }
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      fetchData();
    }, 5000);

    fetchData();

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  return (
    <div className="relative max-w-7xl m-auto">
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
                Email
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
                  <td className="px-6 py-1 text-xs">{item.email}</td>
                  <td className="px-6 py-1 text-xs">
                    {item.status === "P"
                      ? "Pending"
                      : item.status === "I"
                      ? "Inprocess"
                      : item.status === "R"
                      ? "Rejected"
                      : item.status === "C"
                      ? "Cancelled"
                      : item.status === "S"
                      ? "SUCCESS"
                      : "ERROR"}
                  </td>
                  <td className="px-6 py-1 text-xs">
                    {item.created_at.split("T")[0]}{" "}
                    {item.created_at.split("T")[1].split(".")[0]}
                  </td>
                  <td className="px-6 py-1 text-xs">
                    <button className="bg-yellow-300 text-gray-900">
                      View
                    </button>

                    {item.status === "P" ? (
                      <button
                        onClick={() => inProcessFuntion(item.id)}
                        disabled={item.status === "C" || item.status === "R"}
                        className="bg-indigo-500 text-gray-200"
                      >
                        {isProcessing ? "Processing" : "Inprocess"}
                      </button>
                    ) : item.status === "C" ? (
                      <button className="bg-red-400 text-gray-900">
                        Cancelled
                      </button>
                    ) : item.status === "R" ? (
                      <button className="bg-red-400 text-gray-900">
                        Rejected
                      </button>
                    ) : item.status === "I" ? (
                      <button
                        onClick={() => approveFunction(item.id)}
                        className="bg-green-400"
                      >
                        Approve
                      </button>
                    ) : (
                      ""
                    )}

                    {(item.status === "P" || item.status === "I") && (
                      <button
                        disabled={item.status === "C" || item.status === "R"}
                        className="bg-gray-800 text-gray-200"
                        onClick={() => rejectRequest(item.id)}
                      >
                        Reject
                      </button>
                    )}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
