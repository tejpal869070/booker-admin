import React, { useState } from "react";
import { updateMatchResult, winLossMatch } from "../Controllers/Admin/AdminController";
import { toast, ToastContainer } from "react-toastify";
import Swal from "sweetalert2";

const MatchResultPopup = ({ options, onClose }) => { 
  const [selectedOption, setSelectedOption] = useState("");
  const [inputValue, setInputValue] = useState(""); 

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (inputValue < 0 || isNaN(inputValue)) {
      toast.warn("Enter correct RUNS");
      return;
    }
  
    const match_id = options.id;
    const section_id = selectedOption;
    const result = inputValue;
  
    const confirmation = await Swal.fire({
      title: "Confirm Update",
      text: `Are you sure you want to update the result to ${result}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, update it!"
    });
  
    if (!confirmation.isConfirmed) {
      return; // Exit if user cancels
    }
  
    try {
      await updateMatchResult(match_id, section_id, result);
      await winLossMatch(match_id, section_id)
      toast.success("Updated");
      setTimeout(() => {
        onClose();
      }, 500);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Internal Server Error");
    }
  };
 console.log(options?.sections?.filter(i=> !i?.result))

  return (
    <div className="fixed inset-0 z-[999] bg-black bg-opacity-50 flex items-center justify-center">
      <ToastContainer />
      <div className="bg-white p-6 rounded shadow-lg w-96">
        <div className="flex justify-between mb-4">
          <h2 className="text-xl font-semibold">Select and Enter RUNS</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800"
          >
            ✖
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <label className="block mb-2 text-sm font-medium">
            Select Option:
          </label>
          <select
            className="w-full p-2 border rounded mb-4"
            value={selectedOption}
            onChange={(e) => setSelectedOption(e.target.value)}
          >
            <option value="">-- Select --</option>
            {options?.sections?.filter(i=> !i?.result)?.map((opt, idx) => (
              <option key={idx} value={opt.id}>
                {opt.after_over} Over
              </option>
            ))} 
          </select>

          {selectedOption && (
            <>
              <label className="block mb-2 text-sm font-medium">
                Enter Value:
              </label>
              <input
                type="text"
                className="w-full p-2 border rounded mb-4"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
              />
            </>
          )}

          <div className=" ">
            {" "}
            <button
              type="submit"
              className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MatchResultPopup;
