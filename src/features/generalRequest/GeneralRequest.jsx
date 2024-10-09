
import React, { useState, useEffect } from "react";
import {
  Card,
  Tab,
  TabsHeader,
  Tabs,
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
import RequestCard from "./RequestCard";
import {
  getAllFloor,
  getAllRooms,
  getAllTaskData,
  getAllGeneralRequest,
  raiseRequestAPI,
} from "../../services/generalRequestServices";

const TABS = [
  {
    label: "All",
    value: "all",
    icon: <GiHamburgerMenu />,
  },
  {
    label: "InProgress",
    value: "inprogress",
    icon: <GrInProgress />,
  },
  {
    label: "Completed",
    value: "completed",
    icon: <GrCompliance />,
  },
  {
    label: "Cancelled",
    value: "cancelled",
    icon: <AiOutlineStop />,
  },
];
const GeneralRequest = () => {
    // State for tab control
    const [activeTab, setActiveTab] = useState("all");
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen((cur) => !cur);
  
    // State for form inputs
    const [floorName, setFloorName] = useState("");
    const [roomName, setRoomName] = useState("");
    const [name, setName] = useState("");
    const [category, setCategory] = useState("");
    const [note, setNote] = useState("");
    const [allGeneralRequest, setAllGeneralRequest] = useState([]);
  
    // State for dropdown options
    const [floors, setFloors] = useState([]);
    const [rooms, setRooms] = useState([]);
    const [tasks, setTasks] = useState([]);
  
    // Fetch floors, rooms, tasks, and general requests on component mount
    useEffect(() => {
      const fetchData = async () => {
        try {
          const fetchedFloors = await getAllFloor();
          const fetchedRooms = await getAllRooms();
          const fetchTasks = await getAllTaskData();
          setFloors(fetchedFloors); // Assuming fetchedFloors is an array of floor objects
          setRooms(fetchedRooms);
          setTasks(fetchTasks); // Assuming fetchedRooms is an array of room objects
        } catch (error) {
          console.error("Error fetching data", error);
        }
      };
  
      fetchData();
    }, []);

    const fetchGeneralRequests = async () => {
        try {
          const fetchAllGeneralRequest = await getAllGeneralRequest();
          setAllGeneralRequest(fetchAllGeneralRequest);
        } catch (error) {
          console.error("Error fetching general requests", error);
        }
      };
  
  
    // Fetch general requests every 2 minutes
    useEffect(() => {
      
      // Initial fetch
      fetchGeneralRequests();
  
      // Set interval to fetch every 2 minutes (120000 milliseconds)
      const interval = setInterval(fetchGeneralRequests, 120000);
  
      // Clear the interval when the component is unmounted
      return () => clearInterval(interval);
    }, []);
  
    // Filter the requests based on the active tab
    const filteredRequests = allGeneralRequest.filter((req) => {
      if (activeTab === "all") return true;
      if (activeTab === "inprogress") return req.InProgessStatus === true && req.doorChecking === false && req.CustomerFeedback === false && req.CompletedStatus === false;
      if (activeTab === "completed") return req.CompletedStatus === true;
      if (activeTab === "cancelled") return req.cancellationStatus === true;
      return false;
    });
  
    // Handler for creating a request
    const handleCreateRequest = async () => {
      const details = {
        floorId: floorName,
        taskId: category,
        roomDataId: roomName,
        rname: name,
        description: note,
        requestType: "General Request",
        requestDataCreatedBy: parseInt(localStorage.getItem("userId")), // mandatory because In get have Assigner name --->without use in front assigner name don't take
      };
      console.log("details", details);
      const response = await raiseRequestAPI(details);
      if (response.status === 200) {
        alert("Request Raised Sucessfully");
        fetchGeneralRequests();
      } else {
        alert("Request Raised failed");
      }
      setFloorName("");
      setRoomName("");
      setName("");
      setCategory("");
      setNote("");
      setOpen(false);
    };
  
    return (
      <Card className="h-full w-full bg-primaryBg p-8">
        <div className="flex h-full w-full flex-col gap-4">
          <div className="h-[15%]">
            <div className="flex items-center justify-between w-full">
              <Typography variant="h5" color="blue-gray" className="font-semibold">
                General Request
              </Typography>
              <Button onClick={handleOpen} className="bg-greenbtnColor">
                Raise Request
              </Button>
  
              {/* Dialog for Raise Request */}
              {/* Dialog for Raise Request */}
            <Dialog
              size="xs"
              open={open}
              handler={handleOpen}
              className="bg-transparent shadow-none"
            >
              <Card className="mx-auto w-full max-w-[24rem] shadow-lg relative">
                <Button
                  variant="text"
                  color="blue-gray"
                  onClick={handleOpen}
                  className="!absolute top-2 right-2 p-2"
                >
                  <MdClose className="h-6 w-6" />
                </Button>

                <CardBody className="flex flex-col gap-6">
                  <Typography
                    variant="h4"
                    color="blue-gray"
                    className="font-semibold"
                  >
                    Create Trip
                  </Typography>

                  {/* Floor Name */}
                  <div>
                    <Typography variant="h6" className="mb-2">
                      Floor Name
                    </Typography>
                    <Select
                      label="Select Floor"
                      value={floorName}
                      onChange={(e) => setFloorName(e)}
                    >
                      {floors.map((floor) => (
                        <Option key={floor.floorId} value={floor.floorId}>
                          {floor.floorName}
                        </Option>
                      ))}
                    </Select>
                  </div>

                  {/* Room Name */}
                  <div>
                    <Typography variant="h6" className="mb-2">
                      Room Name
                    </Typography>
                    <Select
                      label="Select Room"
                      value={roomName}
                      onChange={(e) => setRoomName(e)}
                    >
                      {rooms.map((room) => (
                        <Option key={room.roomDataId} value={room.roomDataId}>
                          {room.roomName}
                        </Option>
                      ))}
                    </Select>
                  </div>

                  {/* Name */}
                  <div>
                    <Typography variant="h6" className="mb-2">
                      Name
                    </Typography>
                    <Input
                      label="Enter Name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>

                  {/* General Category */}
                  <div>
                    <Typography variant="h6" className="mb-2">
                      General Category
                    </Typography>
                    <Select
                      label="Select Category"
                      value={category}
                      onChange={(e) => setCategory(e)}
                    >
                      {tasks.map((task) => (
                        <Option key={task.taskDataId} value={task.taskDataId}>
                          {task.taskName}
                        </Option>
                      ))}
                    </Select>
                  </div>

                  {/* Note */}
                  <div>
                    <Typography variant="h6" className="mb-2">
                      Note
                    </Typography>
                    <Input
                      label="Enter Note"
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                    />
                  </div>
                </CardBody>

                <CardFooter className="pt-0 flex justify-end">
                  <Button
                    onClick={handleCreateRequest}
                    className="bg-greenbtnColor"
                  >
                    Submit Request
                  </Button>
                </CardFooter>
              </Card>
            </Dialog>
            </div>
  
            {/* Row for Tabs */}
            <div className="w-[50%]">
              <Tabs value={activeTab} className="w-full">
                <TabsHeader className="bg-white rounded-lg">
                  {TABS.map(({ label, value, icon }) => (
                    <Tab
                      key={value}
                      value={value}
                      onClick={() => setActiveTab(value)}
                      className={`flex items-center px-4 py-2 rounded-lg transition-all ${
                        activeTab === value ? "text-green-700" : "bg-white text-black"
                      }`}
                    >
                      <span className="flex items-center">
                        {icon} &nbsp;&nbsp;{label}&nbsp;&nbsp;
                      </span>
                    </Tab>
                  ))}
                </TabsHeader>
              </Tabs>
            </div>
          </div>
  
          {/* Display filtered requests */}
          <div className=" h-[85%] overflow-y-auto flex flex-col items-start justify-start">
            {filteredRequests?.map((req) => (
              <RequestCard
                key={req.requestDataId} 
                reqestId ={req.requestDataId}// Assuming there's a unique identifier
                name={req.name}
                servicePersonName={req.seviceName}
                location={req.roomName}
                assignerName={req.assignerName}
                generalTask={req.taskName}
                requestAccepted={req.acceptanceStatus}
                inProgress={req.InProgessStatus}
                doorChecking={req.doorChecking}
                feedback={req.CustomerFeedback}
                completed={req.CompletedStatus}
                cancelled = {req.cancellationStatus}
                fetchGeneralRequests={fetchGeneralRequests}
              />
            ))}
          </div>
        </div>
      </Card>
    );
  };
  
  export default GeneralRequest;
  