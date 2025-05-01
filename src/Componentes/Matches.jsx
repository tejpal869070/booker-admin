import React, { useEffect, useState } from "react";
import {
  getAllMatch,
  makeMatchLive,
} from "../Controllers/Admin/AdminController";
import { toast, ToastContainer } from "react-toastify";
import { Loading4 } from "./Loading1";
import { API } from "../Controllers/Api";
import { Link } from "react-router-dom";
import { ImBin } from "react-icons/im";
import Swal from "sweetalert2";
import MatchResultPopup from "./MactResultPopup";

export default function Matches() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPopup, setShowPopup] = useState(false);
  const [dropdownOptions, setDropDownOptions] = useState({});

  // handle match live
  const changeMatchStatus = async (id, status, betting) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: `Do you want to make this change?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes!",
    });

    if (result.isConfirmed) {
      try {
        await makeMatchLive(id, status, betting);
        await Swal.fire("LIVE!", `Match status changed`, "success");
      } catch (error) {
        toast.error(error?.response?.data?.message || "Internal Server Error!");
      } finally {
        fetchData();
      }
    }
  };

  const fetchData = async () => {
    try {
      const response = await getAllMatch();
      setData(response?.data);
      console.log(response);
      setLoading(false);
    } catch (error) {
      toast.error("Something Went Wrong !");
    }
  };

  useEffect(() => {
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
        <table class="max-w-7xl mx-auto table-auto">
          <thead class="justify-between">
            <tr class="bg-gray-800">
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
                <span class="text-gray-100 font-semibold">Status</span>
              </th>

              <th class="px-16 py-2">
                <span class="text-gray-100 font-semibold">Betting</span>
              </th>

              <th class="px-16 py-2">
                <span class="text-gray-100 font-semibold">Setting</span>
              </th>
            </tr>
          </thead>
          <tbody class="bg-gray-200">
            {data?.map((item, index) => (
              <tr class="bg-gray-400 border-b-2 border-gray-200 py-4 mb-4">
                <td class="px-16 py-4 flex gap-2 flex-row items-center">
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
                <td className="text-left">
                  <p class="text-center ml-2 font-semibold">
                    {item.teams[0].team_name}
                  </p>
                  <p class="text-center ml-2 font-semibold">
                    {item.teams[1].team_name}
                  </p>
                </td>

                <td class="px-16 py-4">
                  <span>
                    <FormatDate date={item.match_time} />
                  </span>
                </td>
                <td class="px-16 py-4">
                  <span>
                    {item.status === "UC"
                      ? "Upcoming"
                      : item.status === "LIVE"
                      ? "LIVE"
                      : item.status === "C"
                      ? "Completed"
                      : ""}
                  </span>
                </td>

                <td class="px-16 py-4 ">
                  {item.status === "UC" ? (
                    item.can_place_bet === "N" ? (
                      <button
                        onClick={() => changeMatchStatus(item.id, "UC", "Y")}
                        className="ml-2 px-2 py-1 bg-green-600 font-semibold text-gray-200 text-xs rounded"
                      >
                        Start Betting
                      </button>
                    ) : (
                      <button className="ml-2 px-2 py-1 bg-red-600 font-semibold text-gray-200 text-xs rounded">
                        Stop Betting
                      </button>
                    )
                  ) : (
                    "Match Completed Or Live"
                  )}
                </td>

                <td class="px-16 py-4 flex justify-center items-center">
                  <Link
                    to={{
                      pathname: "/dashboard",
                      search: `?admin=edit-match&match-id=${item.id}`,
                    }}
                    class="text-yellow-500 flex cursor-pointer"
                  >
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
                  </Link>
                  <ImBin className="cursor-pointer text-red-700" />
                  {item.status === "LIVE" ? (
                    <button
                      onClick={() => changeMatchStatus(item.id, "C", "N")}
                      className="ml-2 px-2 py-1 bg-red-600 font-semibold text-gray-200 text-xs rounded"
                    >
                      COMPLETE MATCH
                    </button>
                  ) : item.status === "UC" ? (
                    <button
                      onClick={() => changeMatchStatus(item.id, "LIVE", "N")}
                      className="ml-2 px-2 py-1 bg-green-600 font-semibold text-gray-200 text-xs rounded"
                    >
                      MAKE LIVE
                    </button>
                  ) : (
                    ""
                  )}

                  {item.status === "LIVE" && (
                    <button
                      onClick={() => {
                        setShowPopup(true);
                        setDropDownOptions(item);
                      }}
                      className="ml-2 px-2 py-1 bg-green-600 font-semibold text-gray-200 text-xs rounded"
                    >
                      UPLOAD RESULTS
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showPopup && (
        <MatchResultPopup
          options={dropdownOptions}
          onClose={() => {
            setShowPopup(false);
            setDropDownOptions([]);
          }}
        />
      )}
    </div>
  );
}
