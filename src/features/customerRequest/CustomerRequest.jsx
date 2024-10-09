import React, { useState, useEffect } from "react";
import {
  Card,
  Typography,
  Button,
  Dialog,
  CardBody,
  CardFooter,
  Select,
  Option,
  Input,
} from "@material-tailwind/react";
import { GiHamburgerMenu } from "react-icons/gi";
import { GrInProgress, GrCompliance } from "react-icons/gr";
import { AiOutlineStop } from "react-icons/ai";
import { MdClose } from "react-icons/md";
import CustomerRequestCard from "./CustomerRequestCard";
import { getAllCustomerRequest } from "../../services/generalRequestServices";

const CustomerRequest = () => {
  const [allCustomerRequest, setAllCustomerRequest] = useState([]);
  const fetchGeneralRequests = async () => {
    try {
      const fetchAllCustomerRequest = await getAllCustomerRequest();
      setAllCustomerRequest(fetchAllCustomerRequest);
    } catch (error) {
      console.error("Error fetching general requests", error);
    }
  };

  useEffect(() => {
    fetchGeneralRequests();
    const interval = setInterval(fetchGeneralRequests, 120000);
    return () => clearInterval(interval);
  }, []);
  console.log("all data",allCustomerRequest)
  return (
    <Card className="h-full w-full bg-primaryBg p-8">
      <div className=" h-full flex flex-col gap-4">
        <div className="flex h-[7%] items-center justify-between w-full">
          <Typography variant="h5" color="blue-gray" className="font-semibold">
            Customer Request
          </Typography>
        </div>
        <div className="h-[93%] flex flex-col items-start justify-start overflow-y-auto">
          {allCustomerRequest?.map((req) => (
            <CustomerRequestCard  key={req.id} 
            reqestId ={req.requestDataId}// Assuming there's a unique identifier
            name={req.requestDataId}
            servicePersonName={req.seviceName}
            location={req.roomName}
            assignerName={req.assignerName}
            taskName={req.taskName}
            requestAccepted={req.acceptanceStatus}
            inProgress={req.InProgessStatus}
            doorChecking={req.doorChecking}
            feedback={req.CustomerFeedback}
            completed={req.CompletedStatus}
            cancelled = {req.cancellationStatus}
            fetchGeneralRequests ={fetchGeneralRequests}
             />
            
          ))}
        </div>
      </div>
    </Card>
  );
};

export default CustomerRequest;
