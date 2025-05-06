import React, { useEffect, useState } from "react";
import {
  deleteMatch,
  getAllBets,
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
import { FaEye } from "react-icons/fa";
import MatchDataPopup from "./MatchDataPopup";

export default function Matches() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPopup, setShowPopup] = useState(false);
  const [dropdownOptions, setDropDownOptions] = useState({});

  const [isView, setView] = useState(false);
  const [viewData, setViewData] = useState({});
  const [showBets, setShowBets] = useState(false);

  const [betData, setBetData] = useState([]);

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

  const handleRemoveMatch = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you really want to delete this match?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await deleteMatch(id);
        Swal.fire("Deleted!", "The match has been deleted.", "success");
      } catch (error) {
        Swal.fire("Error", `${error?.response?.data?.message}`, "failed");
      } finally {
        fetchData();
      }
    }
  };

  const betsShowFunction = async (id) => {
    try {
      const response = await getAllBets(id);
      setBetData(response.data);
      setShowBets(true);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Internal Server Error");
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
      <Link
        to={{ pathname: "/dashboard", search: "?admin=add-new-match" }}
        className="px-4 mt-6 inline-block py-2 rounded bg-green-700 font-semibold text-gray-200 mb-4"
      >
        Add New Match
      </Link>
      <div class="mt-2 max-w-9xl overflow-x-auto mt-4">
        <table class=" mx-auto table-auto ">
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
                      <button
                        onClick={() => changeMatchStatus(item.id, "UC", "N")}
                        className="ml-2 px-2 py-1 bg-red-600 font-semibold text-gray-200 text-xs rounded"
                      >
                        Stop Betting
                      </button>
                    )
                  ) : (
                    "Match Completed Or Live"
                  )}
                </td>

                <td class="px-16 py-4 flex justify-center items-center">
                  {/* <Link
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
                  </Link> */}
                  <FaEye
                    onClick={() => {
                      setView(true);
                      setViewData(item);
                    }}
                    className="mr-2 cursor-pointer text-indigo-900"
                    size={18}
                  />
                  <ImBin
                    className="cursor-pointer text-red-700"
                    onClick={() => handleRemoveMatch(item.id)}
                  />
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
                  <button
                    onClick={() => betsShowFunction(item.id)}
                    className="ml-2 px-2 py-1 bg-green-600 font-semibold text-gray-200 text-xs rounded"
                  >
                    BETS
                  </button>
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
            fetchData();
          }}
        />
      )}

      {isView && (
        <MatchDataPopup
          matchData={viewData}
          onClose={() => {
            setView(false);
            setViewData({});
            fetchData();
          }}
        />
      )}

      {showBets && (
        <div className="fixed inset-0 bg-black backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-[90%] max-w-5xl max-h-[80vh] overflow-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Betting Table</h2>
              <button
                onClick={() => setShowBets(false)}
                className="text-red-500 hover:text-red-700 text-lg font-bold"
              >
                ✕
              </button>
            </div>
            <table className="min-w-full border border-gray-300 text-sm">
              <thead className="bg-gray-200">
                <tr>
                  <th className="border px-2 py-1">ID</th>
                  <th className="border px-2 py-1">Match ID</th>
                  <th className="border px-2 py-1">User ID</th>
                  <th className="border px-2 py-1">Bet Type</th>
                  <th className="border px-2 py-1">Bet Team</th>
                  <th className="border px-2 py-1">Bet Value</th>
                  <th className="border px-2 py-1">Amount</th>
                  <th className="border px-2 py-1">Win Amount</th>
                  <th className="border px-2 py-1">Section </th>
                  <th className="border px-2 py-1">Mobile</th>
                </tr>
              </thead>
              <tbody>
                {betData &&
                  betData?.map((entry) => (
                    <tr key={entry.id} className="hover:bg-gray-100">
                      <td className="border px-2 py-1">{entry.id}</td>
                      <td className="border px-2 py-1">{entry.match_id}</td>
                      <td className="border px-2 py-1">{entry.user_id}</td>
                      <td className="border px-2 py-1">
                        {entry.bet_type === "L" ? "Last Digit" : "Exect RUNs"}
                      </td>
                      <td className="border px-2 py-1">
                        {entry.team_name}
                      </td>
                      <td className="border px-2 py-1">{entry.bet_value}</td>
                      <td className="border px-2 py-1">{entry.amount}</td>
                      <td className="border px-2 py-1">
                        {entry.win_amount || "-"}
                      </td>
                      <td className="border px-2 py-1">{entry.section} OVER</td>
                      <td className="border px-2 py-1">{entry.mobile}</td>
                    </tr>
                  ))}
              </tbody>
              <tfoot className="bg-gray-100 font-semibold">
                <tr>
                  <td colSpan="5" className="border px-2 py-1 text-right">
                    Total:
                  </td>
                  <td className="border px-2 py-1">
                    {betData?.reduce(
                      (acc, curr) => acc + Number(curr.amount || 0),
                      0
                    )}
                  </td>
                  <td className="border px-2 py-1 text-green-700">
                    {betData?.reduce(
                      (acc, curr) => acc + Number(curr.win_amount || 0),
                      0
                    )}
                  </td>
                  <td colSpan="2" className="border px-2 py-1"></td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
