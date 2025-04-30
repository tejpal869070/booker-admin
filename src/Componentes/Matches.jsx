import React, { useEffect, useState } from "react";
import { getAllMatch } from "../Controllers/Admin/AdminController";
import { toast, ToastContainer } from "react-toastify";
import { Loading4 } from "./Loading1";
import { API } from "../Controllers/Api";

export default function Matches() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getAllMatch();
        setData(response?.data);
        setLoading(false);
      } catch (error) {
        toast.error("Something Went Wrong !");
      }
    };

    fetchData();
  }, []);


  const FormatDate = ({ date }) => {
    // Function to format the date
    const formatDate = (dateStr) => {
      const dateObj = new Date(dateStr);
      return dateObj
        .toLocaleString("en-US", {
          month: "long",
          day: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        })
        .replace(",", "")
        .replace(":", ".");
    };

    return <p>{formatDate(date)}</p>;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center ">
        <Loading4 />
      </div>
    );
  }
  return (
    <div>
      <ToastContainer />
      <div class="mt-2">
        <table class="max-w-5xl mx-auto table-auto">
          <thead class="justify-between">
            <tr class="bg-green-600">
              <th class="px-16 py-2">
                <span class="text-gray-100 font-semibold">S.No.</span>
              </th>
              <th class="px-16 py-2">
                <span class="text-gray-100 font-semibold">Name</span>
              </th>

              <th class="px-16 py-2">
                <span class="text-gray-100 font-semibold">Match Date</span>
              </th>
 

              <th class="px-16 py-2">
                <span class="text-gray-100 font-semibold">Setting</span>
              </th>
            </tr>
          </thead>
          <tbody class="bg-gray-200">
            {data?.map((item, index) => (
              <tr class="bg-white border-b-2 border-gray-200 py-4 mb-4">
                <td class="px-16 py-2 flex gap-2 flex-row items-center">
                  <img
                    class="h-8 w-8 rounded-full object-cover "
                    src={`${API.url}/assets/${item.teams[0].image}`}
                    alt=""
                  />
                  <img
                    class="h-8 w-8 rounded-full object-cover "
                    src={`${API.url}/assets/${item.teams[1].image}`}
                    alt=""
                  />
                </td>
                <td>
                  <p class="text-center ml-2 font-semibold">{item.teams[0].team_name}</p>
                  <p class="text-center ml-2 font-semibold">{item.teams[1].team_name}</p>
                </td>

                <td class="px-16 py-2">
                  <span><FormatDate date={item.match_time} /></span>
                </td>
                

                <td class="px-16 py-2">
                  <span class="text-yellow-500 flex">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-5 w-5 text-green-700 mx-2"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
                      <path
                        fill-rule="evenodd"
                        d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"
                        clip-rule="evenodd"
                      />
                    </svg>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-5 w-5 text-red-700"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                        clip-rule="evenodd"
                      />
                    </svg>
                  </span>
                </td>
              </tr>
            ))}
            {data?.map((item, index) => (
              <tr class="bg-white border-b-2 border-gray-200 py-4 mb-4">
                <td class="px-16 py-2 flex gap-2 flex-row items-center">
                  <img
                    class="h-8 w-8 rounded-full object-cover "
                    src={`${API.url}/assets/${item.teams[0].image}`}
                    alt=""
                  />
                  <img
                    class="h-8 w-8 rounded-full object-cover "
                    src={`${API.url}/assets/${item.teams[1].image}`}
                    alt=""
                  />
                </td>
                <td>
                  <p class="text-center ml-2 font-semibold">{item.teams[0].team_name}</p>
                  <p class="text-center ml-2 font-semibold">{item.teams[1].team_name}</p>
                </td>

                <td class="px-16 py-2">
                  <span><FormatDate date={item.match_time} /></span>
                </td>
                

                <td class="px-16 py-2">
                  <span class="text-yellow-500 flex">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-5 w-5 text-green-700 mx-2"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
                      <path
                        fill-rule="evenodd"
                        d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"
                        clip-rule="evenodd"
                      />
                    </svg>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-5 w-5 text-red-700"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                        clip-rule="evenodd"
                      />
                    </svg>
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
