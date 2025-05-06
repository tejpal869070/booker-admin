import React, { useState } from "react";
import { addNewMatch } from "../Controllers/Admin/AdminController";
import { toast, ToastContainer } from "react-toastify";
import { API } from "../Controllers/Api";

const MatchAdd = () => {
  const [saving, setSaving] = useState(false);
  // State variables to store form data
  const [matchTime, setMatchTime] = useState("");
  const [title, setTitle] = useState("");
  const [sectionData, setSectionData] = useState([{ id: 1, after_over: "" }]);
  const [teams, setTeams] = useState([
    { team_name: '', team_image: null, team_members: [{ name: '' }] },
    { team_name: '', team_image: null, team_members: [{ name: '' }] },
  ]);

  // Handle section input change
  const handleSectionChange = (index, event) => {
    const values = [...sectionData];
    values[index][event.target.name] = event.target.value;
    setSectionData(values);
  };

  // Handle team input change
  const handleTeamChange = (index, event) => {
    const values = [...teams];
    const { name, files, value } = event.target;

    if (name === "team_image" && files[0]) {
      const file = files[0];
      const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
      const maxSize = 5 * 1024 * 1024; // 5MB

      if (!allowedTypes.includes(file.type)) {
        toast.error("Only JPG, PNG, or WEBP files are allowed.");
        return;
      }

      if (file.size > maxSize) {
        toast.error("File size exceeds 5MB limit.");
        return;
      }

      values[index][name] = file; // Store File object
    } else {
      values[index][name] = value; // Handle other inputs
    }

    setTeams(values);
  };

  // Handle team member input change
  const handleMemberChange = (teamIndex, memberIndex, event) => {
    const values = [...teams];
    values[teamIndex].team_members[memberIndex][event.target.name] =
      event.target.value;
    setTeams(values);
  };

  // Add a new team member
  const addTeamMember = (teamIndex) => {
    const values = [...teams];
    values[teamIndex].team_members.push({ name: "" });
    setTeams(values);
  };

  // Remove a team member
  const removeTeamMember = (teamIndex, memberIndex) => {
    const values = [...teams];
    values[teamIndex].team_members.splice(memberIndex, 1);
    setTeams(values);
  };

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);

    const formData = new FormData();
    formData.append("match_time", matchTime);
    formData.append("title", title);
    formData.append("sections", JSON.stringify(sectionData));

    // Append teams and their images
    teams.forEach((team, index) => {
        formData.append(`teams[${index}][team_name]`, team.team_name);
        if (team.team_image && team.team_image instanceof File) {
          formData.append('team_image', team.team_image, team.team_image.name);
        }
        team.team_members.forEach((member, memberIndex) => {
          formData.append(
            `teams[${index}][team_members][${memberIndex}][name]`,
            member.name
          );
        });
      });

    try {
      const response = await fetch(`${API.url}/admin/add-new-match`, {
        method: "POST",
        body: formData,
      });

      const result = await response.json();
      if (response.ok) {
        toast.success("Match Added Successfully!");
        // Optional: Reload or reset form
        setTimeout(() => window.location.reload(), 500);
      } else {
        throw new Error(result?.message || "Error adding match");
      }
    } catch (error) {
      console.error("Error submitting match:", error);
      toast.error("Error adding match");
    } finally {
      setSaving(false);
    }
  };

  // Add a new section
  const addSection = () => {
    setSectionData([
      ...sectionData,
      { id: sectionData.length + 1, after_over: "" },
    ]);
  };

  // Format match_time to a Date object
  const formatMatchTime = (timeString) => {
    const matchDate = new Date(timeString);
    if (isNaN(matchDate.getTime())) {
      return ""; // If the time is invalid, return an empty string
    }
    return matchDate.toLocaleString("en-US", {
      weekday: "long", // Day of the week (e.g., Monday)
      year: "numeric",
      month: "long", // Full month name (e.g., May)
      day: "numeric", // Day of the month
      hour: "2-digit", // Hour in 12-hour format
      minute: "2-digit", // Minute
      second: "2-digit", // Second
      hour12: true, // Use 12-hour time format (AM/PM)
    });
  };

  return (
    <div className="max-w-4xl mx-auto bg-gray-400 p-6 rounded-lg shadow-lg">
      <ToastContainer />
      <h1 className="text-2xl font-semibold text-center mb-6 text-gray-800">
        Match Details Form
      </h1>
      <form onSubmit={handleSubmit}>
        {/* Match Time */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium">Match Time:</label>
          <input
            type="datetime-local"
            value={matchTime}
            onChange={(e) => setMatchTime(e.target.value)}
            placeholder="Enter Match Time (e.g. 26 May, 2025T07:30PM)"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none bg-gray-400 focus:ring-2 focus:ring-indigo-600"
            required
          />
        </div>

        {/* Display the formatted date and time */}
        {matchTime && (
          <div className="mb-4">
            <label className="block text-gray-700 font-medium">
              Formatted Match Time:
            </label>
            <p className="text-gray-700">
              {formatMatchTime(matchTime) || "Invalid Date"}
            </p>
          </div>
        )}

        <div className="mb-4">
          <label className="block text-gray-700">Match Title:</label>
          <input
            type="text"
            name="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter Match Title"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none bg-gray-400 focus:ring-2 focus:ring-indigo-600"
            required
          />
        </div>

        {/* Sections */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Sections</h3>
          {sectionData.map((section, index) => (
            <div key={section.id} className="mb-4">
              <label className="block text-gray-700">After Over:</label>
              <input
                type="number"
                name="after_over"
                value={section.after_over}
                onChange={(e) => handleSectionChange(index, e)}
                placeholder="Enter After Over"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none bg-gray-400 focus:ring-2 focus:ring-indigo-600"
                required
              />
            </div>
          ))}
          <button
            type="button"
            onClick={addSection}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            Add Section
          </button>
        </div>

        {/* Teams */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Teams</h3>
          {teams.map((team, teamIndex) => (
            <div
              key={teamIndex}
              className="mb-6 bg-gradient-to-l from-gray-600 to-gray-700 rounded "
            >
              <label className="block text-gray-200 font-medium">
                Team Name:
              </label>
              <input
                type="text"
                name="team_name"
                value={team.team_name}
                onChange={(e) => handleTeamChange(teamIndex, e)}
                placeholder="Enter Team Name"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none bg-gray-400 focus:ring-2 focus:ring-indigo-600"
                required
              />
              {/* Team Image URL */}
              <div className="mt-4">
                <label className="block text-gray-200 font-medium">
                  Team Logo:
                </label>
                <input
                  type="file"
                  name="team_image"
                  onChange={(e) => handleTeamChange(teamIndex, e)}
                  placeholder="Enter Team Image URL"
                  className="w-[40%] px-4 border border-gray-300 rounded-md focus:outline-none bg-gray-400 focus:ring-2 focus:ring-indigo-600"
                  required
                  accept=".jpg, .jpeg, .png, .webp" // Restrict file types
                  alt="imageee"
                />
              </div>
              <div className="mt-4">
                <h4 className="text-md font-semibold text-gray-200">
                  ----------------------------Team
                  Players-------------------------------
                </h4>
                {team.team_members.map((member, memberIndex) => (
                  <div key={memberIndex} className="mb-4">
                    <label className="block text-gray-300">Member Name:</label>
                    <input
                      type="text"
                      name="name"
                      value={member.name}
                      onChange={(e) =>
                        handleMemberChange(teamIndex, memberIndex, e)
                      }
                      placeholder="Enter Player Name"
                      className="w-[40%] px-4 py-2 border border-gray-300 rounded-md focus:outline-none bg-gray-400 focus:ring-2 focus:ring-indigo-600"
                      required
                    />

                    {/* Remove Member Button */}
                    {team.team_members.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeTeamMember(teamIndex, memberIndex)}
                        className="mt-2 ml-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                      >
                        Remove Player
                      </button>
                    )}
                  </div>
                ))}
                {/* Add Member Button */}
                <button
                  type="button"
                  onClick={() => addTeamMember(teamIndex)}
                  className="mt-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  Add Member
                </button>
              </div>
            </div>
          ))}
        </div>

        <button
          type="submit"
          disabled={saving}
          className="w-full px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          {saving ? "Saving" : "SAVE"}
        </button>
      </form>
    </div>
  );
};

export default MatchAdd;
