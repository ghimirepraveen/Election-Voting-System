import { useState } from "react";

function ToggleSwitch() {
  const [selectedOption, setSelectedOption] = useState("voter");

  const handleOptionChange = (option) => {
    setSelectedOption(option);
  };

  return (
    <div className="flex items-center justify-center">
      <div
        className={`toggle-option ${
          selectedOption === "voter"
            ? "bg-blue-500 text-white"
            : "bg-gray-200 text-gray-700"
        } rounded-l-lg px-4 py-2 cursor-pointer w-1/3`}
        onClick={() => handleOptionChange("voter")}
      >
        Voter
      </div>
      <div
        className={`toggle-option ${
          selectedOption === "candidate"
            ? "bg-blue-500 text-white"
            : "bg-gray-200 text-gray-700"
        } rounded-r-lg px-4 py-2 cursor-pointer`}
        onClick={() => handleOptionChange("candidate")}
      >
        Candidate
      </div>
    </div>
  );
}

export default ToggleSwitch;
