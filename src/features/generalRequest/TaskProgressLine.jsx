import React from "react";
import {
  FaMobileAlt,
  FaRegCalendarCheck,
  FaFlagCheckered,
} from "react-icons/fa";
import { LiaIdCardAltSolid } from "react-icons/lia";
import { GrInProgress } from "react-icons/gr";
import { BuildingLibraryIcon } from "@heroicons/react/24/outline";

const defaultSteps = [
  { icon: <FaMobileAlt />, label: "Requested" },
  { icon: <LiaIdCardAltSolid />, label: "Request Accepted" },
  { icon: <GrInProgress />, label: "In Progress" },
  { icon: <BuildingLibraryIcon />, label: "Door Checking" },
  { icon: <FaRegCalendarCheck />, label: "Feedback" },
  { icon: <FaFlagCheckered />, label: "Completed" },
];

const TaskProgressLine = ({
  steps = defaultSteps,
  requestAccepted = false,
  inProgress = false,
  doorChecking = false,
  feedback = false,
  completed = false,
}) => {
  // Dynamically calculate current step based on the task's status
  const currentStep = completed
    ? 5
    : feedback
    ? 4
    : doorChecking
    ? 3
    : inProgress
    ? 2
    : requestAccepted
    ? 1
    : 0; // Requested

  const stepBgColor = (stepIndex) => {
    if (completed && stepIndex === steps.length - 1) return "bg-green-400"; // Completed
    if (feedback && stepIndex === 4) return "bg-green-300"; // Feedback
    if (doorChecking && stepIndex === 3) return "bg-green-300"; // Door Checking
    if (inProgress && stepIndex === 2) return "bg-green-300"; // In Progress
    if (requestAccepted && stepIndex === 1) return "bg-green-400"; // Request Accepted
    if (stepIndex === 0) return "bg-green-400"; // Requested
    return "bg-gray-300"; // Default inactive color
  };

  const progressLineColor = () => {
    if (completed) return "bg-green-400";
    if (feedback) return "bg-green-300";
    if (doorChecking) return "bg-green-400";
    if (inProgress) return "bg-green-400";
    if (requestAccepted) return "bg-green-400";
    return "bg-gray-300"; // Default color if no steps are active
  };

  const textColor = (stepIndex) => {
    if (completed && stepIndex === steps.length - 1) return "text-green-500";
    if (feedback && stepIndex === 4) return "text-green-400";
    if (doorChecking && stepIndex === 3) return "text-green-400";
    if (inProgress && stepIndex === 2) return "text-green-400";
    if (requestAccepted && stepIndex === 1) return "text-green-500";
    if (stepIndex === 0) return "text-green-500";
    return "text-gray-500"; // Default inactive text color
  };

  return (
    <div className="w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-24 py-8">
      <div className="relative flex items-center justify-between w-full">
        {/* Continuous gray line */}
        <div
          className={`absolute top-1/2 left-0 right-0 h-1 bg-gray-300 -translate-y-1/2`}
        />
        {/* Dynamic progress line */}
        <div
          className={`absolute top-1/2 left-0 h-1 ${progressLineColor()} -translate-y-1/2 transition-all duration-500 ease-in-out`}
          style={{
            width: `${
              (Math.min(currentStep, steps.length - 1) / (steps.length - 1)) *
              100
            }%`,
          }}
        />

        {steps.map((step, index) => (
          <div key={index} className="relative flex flex-col items-center z-10">
            <div
              className={`h-12 w-12 rounded-full flex justify-center items-center ${stepBgColor(
                index
              )} transition-colors duration-300 shadow-md`}
            >
              {React.cloneElement(step.icon, {
                className: "h-6 w-6 text-white",
              })}
            </div>
            <div className="absolute -bottom-8 w-max text-center">
              <p
                className={`text-xs sm:text-sm font-medium ${textColor(
                  index
                )} transition-colors duration-300`}
              >
                {step.label}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TaskProgressLine;
