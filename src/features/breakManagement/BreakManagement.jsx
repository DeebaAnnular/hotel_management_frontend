import React, { useState, useEffect } from "react";
import {
  ChevronUpDownIcon,
  TrashIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import {
  Button,
  Dialog,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
  Input,
} from "@material-tailwind/react";
import { MdClose } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllBreakRequest,
  updateBreakRequest,
} from "../../redux/slices/breakManagementSlice";
import {
  getCrewCountAPI,
  getTotalActiveAPI,
  getTotalBreakAPI,
  getTotalAvailableAPI,
  getTotalServiceAPI,
} from "../../services/breakManagement";

const TABLE_HEAD = [
  "Service Person",
  "Approved By",
  "Start Time",
  "End Time",
  "Status",
  "Action",
];

const BreakManagement = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [openUpdate, setOpenUpdate] = useState(false);
  const [openModal, setOpenModal] = useState(false); // New state for modal
  const [breakRequests, setBreakRequest] = useState([]);
  const [totalCrewCount, setTotalCrewCount] = useState(null);
  const [totalCrewPerson, setTotalCrewPerson] = useState([]);
  const [totalBreakPerson, setTotalBreakPerson] = useState([]);
  const [totalAvilablePerson, setTotalAvilablePerson] = useState([]);
  const [totalActivePerson, setTotalActivePerson] = useState([]);

  // State for updating form fields
  const [selectedBreakId, setSelectedBreakId] = useState(null);
  const [status, setStatus] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  // State for modal
  const [modalTitle, setModalTitle] = useState("");
  const [personNames, setPersonNames] = useState([]);

  const dispatch = useDispatch();

  const fetchBreakRequest = async () => {
    const data = await dispatch(getAllBreakRequest());
    setBreakRequest(data.payload);
  };

  const getCrewCount = async () => {
    const data = await getCrewCountAPI();
    setTotalCrewCount(data);
  };

  const getTotalServicePerson = async () => {
    const data = await getTotalServiceAPI();
    console.log("getTotalServicePerson", data);
    setTotalCrewPerson(data);
    setModalTitle("Total Service Persons");
    setPersonNames(data); // Assuming data is an array of names
    setOpenModal(true);
  };

  const getTotalBreakPerson = async () => {
    const data = await getTotalBreakAPI();
    console.log("getTotalBreakAPI", data);
    setTotalBreakPerson(data);
    setModalTitle("On Break Persons");
    setPersonNames(data); // Assuming data is an array of names
    setOpenModal(true);
  };

  const getTotalActivePerson = async () => {
    const data = await getTotalActiveAPI();
    console.log("getTotalActivePerson ", data);
    setTotalActivePerson(data);
    setModalTitle("Available Persons");
    setPersonNames(data); // Assuming data is an array of names
    setOpenModal(true);
  };

  const getTotalAvailablePerson = async () => {
    const data = await getTotalAvailableAPI();
    console.log("getTotalAvailableAPI ", data);
    setTotalAvilablePerson(data);
    setModalTitle("Active Persons");
    setPersonNames(data); // Assuming data is an array of names
    setOpenModal(true);
  };

  useEffect(() => {
    fetchBreakRequest();
    getCrewCount();
  }, [dispatch]);

  // Open update form with pre-filled details
  const handleOpenUpdateForm = (breakDetails) => {
    setSelectedBreakId(breakDetails.breakDetailsId);
    setStatus(breakDetails.status || ""); // Set current status
    setStartTime(breakDetails.startTime || ""); // Set current start time
    setEndTime(breakDetails.endTime || ""); // Set current end time
    setOpenUpdate(true);
  };

  const handleUpdateRequest = async () => {
    const details = {
      breakDetailsId: selectedBreakId,
      status,
      startTime,
      endTime,
      approvalName: localStorage.getItem("username"),
    };

    await dispatch(updateBreakRequest(details));
    alert("Break Request Updated Successfully!");
    fetchBreakRequest();
    setOpenUpdate(false);
  };

  return (
    <Card className="h-full w-full bg-primaryBg p-8">
      <div className="w-full h-[15%] flex items-center justify-evenly">
        <Card
          onClick={getTotalServicePerson}
          className="w-[20%] h-[75%] flex items-center justify-center border-l-4 border-[#639d82] cursor-pointer"
        >
          <p className=" text-[#639d82]">Total</p>
          <p className="text-xl">{totalCrewCount?.totalServiceCount}</p>
        </Card>
        <Card
          onClick={getTotalBreakPerson}
          className="w-[20%] h-[75%] flex items-center justify-center border-l-4 border-[#DD3E3ED4] cursor-pointer"
        >
          <p className=" text-[#DD3E3ED4]">On break</p>
          <p className="text-xl">
            {totalCrewCount?.serviceWithBreakStatusCount}
          </p>
        </Card>
        <Card
          onClick={getTotalActivePerson}
          className="w-[20%] h-[75%] flex items-center justify-center border-l-4 border-[#008000] cursor-pointer"
        >
          <p className=" text-[#008000]">Available</p>
          <p className="text-xl">
            {totalCrewCount?.serviceWithoutJobSatusCount}
          </p>
        </Card>
        <Card
          onClick={getTotalAvailablePerson}
          className="w-[20%] h-[75%] flex items-center justify-center border-l-4 border-[#EE80EE] cursor-pointer"
        >
          <p className=" text-[#EE80EE]">Active</p>
          <p className="text-xl">{totalCrewCount?.serviceWithJobStatusCount}</p>
        </Card>
      </div>

      <Card className="h-[75%] w-full shadow-lg">
        <div className="p-4 flex justify-between items-center">
          <div className="flex items-center justify-between w-full ">
            <Typography
              variant="h5"
              color="blue-gray"
              className="font-semibold w-[20%]"
            >
              Break Management
            </Typography>
            <div className="flex w-[80%] gap-2 items-center justify-end">
              <div className="relative flex w-full max-w-[24rem]">
                <Input
                  type="text"
                  label="Search Service Person Name"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pr-20"
                  containerProps={{
                    className: "min-w-0",
                  }}
                />
                <Button
                  size="sm"
                  color={searchQuery ? "gray" : "blue-gray"}
                  disabled={!searchQuery}
                  className="!absolute right-1 top-1 rounded"
                >
                  <MagnifyingGlassIcon className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        <CardBody className="overflow-y-scroll px-0 mx-3">
          <table className="w-full min-w-max table-auto text-left">
            <thead>
              <tr>
                {TABLE_HEAD.map((head, index) => (
                  <th
                    key={head}
                    className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4"
                  >
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="flex items-center justify-between gap-2 font-semibold leading-none opacity-70"
                    >
                      {head}{" "}
                      {index === 0 && (
                        <ChevronUpDownIcon
                          strokeWidth={2}
                          className="h-4 w-4 cursor-pointer"
                          onClick={() =>
                            setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                          }
                        />
                      )}
                    </Typography>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {breakRequests?.length > 0 ? (
                breakRequests?.map((breakDetails, index) => {
                  const isLast = index === breakRequests.length - 1;
                  const classes = isLast
                    ? "p-4"
                    : "p-4 border-b border-blue-gray-50";

                  return (
                    <tr key={breakDetails.breakDetailsId}>
                      <td className={classes}>
                        <Typography variant="small" color="blue-gray">
                          {breakDetails.servicePersonName}
                        </Typography>
                      </td>
                      <td className={classes}>
                        <Typography variant="small" color="blue-gray">
                          {breakDetails.approvalName}
                        </Typography>
                      </td>
                      <td className={classes}>
                        <Typography variant="small" color="blue-gray">
                          {breakDetails.startTime}
                        </Typography>
                      </td>
                      <td className={classes}>
                        <Typography variant="small" color="blue-gray">
                          {breakDetails.endTime}
                        </Typography>
                      </td>
                      <td className={classes}>
                        <Typography
                          variant="small"
                          color={
                            breakDetails.status === "approved" ? "green" : "red"
                          }
                        >
                          {breakDetails.status}
                        </Typography>
                      </td>
                      <td className={classes}>
                        <Button
                          onClick={() => handleOpenUpdateForm(breakDetails)}
                          size="sm"
                          variant="text"
                          color="green"
                        >
                          Edit
                        </Button>
                        <Button
                          onClick={() =>
                            alert("Delete Functionality Not Implemented")
                          }
                          size="sm"
                          variant="text"
                          color="red"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="text-center py-4">
                    <Typography variant="small" color="blue-gray">
                      No data available
                    </Typography>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </CardBody>
      </Card>

      {/* Update Modal */}
      <Dialog
        open={openUpdate}
        handler={() => setOpenUpdate(false)}
        className="w-[15rem] h-[35rem] overflow-y-auto"
      >
        <Dialog.Header>Update Break Request</Dialog.Header>
        <Dialog.Body>
          <div>
            <label htmlFor="status">Status</label>
            <Input
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="mt-1"
            />
            <label htmlFor="startTime">Start Time</label>
            <Input
              id="startTime"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="mt-1"
            />
            <label htmlFor="endTime">End Time</label>
            <Input
              id="endTime"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="mt-1"
            />
          </div>
        </Dialog.Body>
        <Dialog.Footer>
          <Button
            variant="text"
            color="red"
            onClick={() => setOpenUpdate(false)}
          >
            <span>Cancel</span>
          </Button>
          <Button
            onClick={handleUpdateRequest}
            variant="gradient"
            color="green"
          >
            <span>Update</span>
          </Button>
        </Dialog.Footer>
      </Dialog>

      {/* Names Modal */}
      <Dialog
        open={openModal}
        handler={() => setOpenModal(false)}
        className="w-[25rem] h-[35rem] overflow-y-auto"
      >
        <Dialog.Header className="text-center font-semibold text-lg">
          {modalTitle}
        </Dialog.Header>
        <Dialog.Body className="w-full h-[70%] flex flex-col items-center">
          {personNames.length > 0 ? (
            <ul className="w-full flex flex-col items-start justify-center">
              {personNames.map((name, index) => (
                <li
                  key={index}
                  className="w-full p-2 border-b border-gray-200 hover:bg-gray-100 transition-colors"
                >
                  <span className="text-gray-700">{name.userName}</span>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-gray-500 mt-4">No one available</div>
          )}
        </Dialog.Body>
        <Dialog.Footer>
          <Button
            variant="text"
            color="red"
            onClick={() => setOpenModal(false)}
          >
            <span>Close</span>
          </Button>
        </Dialog.Footer>
      </Dialog>
    </Card>
  );
};

export default BreakManagement;
