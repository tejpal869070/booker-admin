import React, { useEffect, useState } from "react";
import {
  approveDepositRequest,
  getAllDepositRequest,
} from "../Controllers/Admin/AdminController";

export default function Desposit() {
  const [data, setData] = useState([]);
  const [approving, setApproving] = useState(false);

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

  const fetchData = async () => {
    try {
      const response = await getAllDepositRequest();
      setData(response);
    } catch (error) {
      setData([]);
      window.alert("Data Not Found");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
  return (
    <div>
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 deposit-table">
          <thead className="text-xs text-gray-200 uppercase bg-gray-700  ">
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
                  className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700 border-gray-200"
                >
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                  >
                    {item.transection_id}
                  </th>
                  <td className="px-6 py-4">${item.amount}</td>
                  <td className="px-6 py-4">{item.user_id}</td>
                  <td className="px-6 py-4">
                    {item.status === "P"
                      ? "Pending"
                      : item.status === "C"
                      ? "Cancelled"
                      : item.status === "S"
                      ? "Success"
                      : "Failed"}
                  </td>
                  <td className="px-6 py-4">
                    {item.created_at.split("T")[0]}{" "}
                    {item.created_at.split("T")[1].split(".")[0]}
                  </td>
                  <td className="px-6 py-4">
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
                    <button>Cancel</button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
