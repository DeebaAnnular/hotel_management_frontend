import React, { useState } from "react";
import { Card, Typography } from "@material-tailwind/react";
import TaskProgressLine from "./TaskProgressLine";
import { FcCancel } from "react-icons/fc";
import { FaCheck } from "react-icons/fa6";
import { cancelGeneralRequest,completeRequestByAdmin } from "../../services/generalRequestServices";

const RequestCard = ({
  reqestId,
  name,
  servicePersonName,
  location,
  assignerName,
  generalTask,
  requestAccepted,
  inProgress,
  doorChecking,
  feedback,
  completed,
  cancelled,
  fetchGeneralRequests
}) => {
  //   const [currentStep, setCurrentStep] = useState(0);
  const handelCancelRequest = async (id) => {
    const response = await cancelGeneralRequest(id);
    fetchGeneralRequests()
    console.log("delete response", response);
  };

  const handelCompleteRequestByAdmin = async(id)=>{
     const response = await completeRequestByAdmin(id);
     fetchGeneralRequests();
     console.log("response",response)
  }

  let cardClassName = "w-full h-[18rem] shadow-lg rounded-lg mb-4";
  let borderColorClass = "border-l-4 ";

  if (cancelled) {
    cardClassName += " bg-red-50";
    borderColorClass += "border-red-600";
  } else if (completed) {
    cardClassName += " bg-green-50";
    borderColorClass += "border-green-600";
  }  else if (inProgress) {
    cardClassName += " bg-blue-50";
    borderColorClass += "border-blue-600";
  } else {
    cardClassName += " bg-white";
    borderColorClass += "border-gray-300";
  }
  return (
    <Card className={`${cardClassName} ${borderColorClass}`}>
      {/* Top Section: Information and Icons */}
      <div className="w-full h-[8rem]  py-4 px-6 rounded-md flex justify-between items-center">
        <div className="flex flex-col text-center justify-between font-poppins">
          <Typography
            variant="small"
            color="blue-gray"
            className=" py-4 text-lg font-semibold"
          >
            Name
          </Typography>
          <Typography
            variant="paragraph"
            className=" text-[#15048d] font-semibold"
          >
            {name?name:"-"}
          </Typography>
        </div>

        <div className="flex flex-col text-center font-poppins">
          <Typography
            variant="small"
            color="blue-gray"
            className=" py-4 text-lg font-semibold"
          >
            Service Person Name
          </Typography>
          <Typography
            variant="paragraph"
            color="#15048d"
            className=" text-green-900 font-semibold"
          >
            {servicePersonName?servicePersonName: "-"}
          </Typography>
        </div>

        <div className="flex flex-col text-center font-poppins">
          <Typography
            variant="small"
            color="blue-gray"
            className=" py-4 text-lg font-semibold"
          >
            Location
          </Typography>
          <Typography
            variant="paragraph"
            className=" text-[#e30011] font-semibold"
          >
            {location?location:"-"}
          </Typography>
        </div>

        <div className="flex flex-col text-center font-poppins">
          <Typography
            variant="small"
            color="blue-gray"
            className=" py-4 text-lg font-semibold"
          >
            Assigner Name
          </Typography>
          <Typography
            variant="paragraph"
            color="#15048d"
            className=" text-[#15048d] font-semibold"
          >
            Admin
          </Typography>
        </div>

        <div className="flex flex-col text-center font-poppins">
          <Typography
            variant="small"
            color="blue-gray"
            className=" py-4 text-lg font-semibold"
          >
            General Task
          </Typography>
          <Typography
            variant="paragraph"
            className=" text-green-900 font-semibold"
          >
            {generalTask?generalTask:"-"}
          </Typography>
        </div>

        <div className="flex  items-center justify-between">
          <FcCancel
            className="text-3xl mr-4 cursor-pointer"
            onClick={() => {
              handelCancelRequest(reqestId);
            }}
          />
          <FaCheck 
          onClick = {()=>{
            handelCompleteRequestByAdmin(reqestId);
          }}
          className="text-green-500 text-2xl cursor-pointer" />
        </div>
      </div>

      {/* Bottom Section: Task Progress */}
      <div className="w-full h-[10rem] flex justify-center">
        <TaskProgressLine
          requestAccepted={requestAccepted}
          inProgress={inProgress}
          doorChecking={doorChecking}
          feedback={feedback}
          completed={completed}
        />
      </div>
    </Card>
  );
};

export default RequestCard;
