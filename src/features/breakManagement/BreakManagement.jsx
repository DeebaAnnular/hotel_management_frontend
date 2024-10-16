import React, { useState, useEffect } from "react";
import {
  ChevronUpDownIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import {
  Button,
  Dialog,
  Card,
  CardBody,
  Typography,
  Input,
} from "@material-tailwind/react";
import { useDispatch } from "react-redux";
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
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
  const [openModal, setOpenModal] = useState(false);
  const [breakRequests, setBreakRequest] = useState([]);
  const [totalCrewCount, setTotalCrewCount] = useState(null);
  const [modalTitle, setModalTitle] = useState("");
  const [personNames, setPersonNames] = useState([]);
  const [error, setError] = useState(null);

  const [selectedBreak, setSelectedBreak] = useState({
    breakDetailsId: null,
    status: "",
    startTime: "",
    endTime: "",
    approvalName: "",
  });

  const dispatch = useDispatch();

  const fetchBreakRequest = async () => {
    try {
      const data = await dispatch(getAllBreakRequest());
      setBreakRequest(data.payload);
    } catch (error) {
      console.error("Error fetching break requests:", error);
      setError("Failed to fetch break requests. Please try again later.");
    }
  };

  const getCrewCount = async () => {
    try {
      const data = await getCrewCountAPI();
      console.log("count", data.data);
      setTotalCrewCount(data.data);
    } catch (error) {
      console.error("Error fetching crew count:", error);
      setError("Failed to fetch crew count. Please try again later.");
      toast.error(
        error || "Failed to fetch crew count. Please try again later"
      );
    }
  };

  const getTotalServicePerson = async () => {
    try {
      const data = await getTotalServiceAPI();
      console.log("getTotalServicePerson", data);
      setPersonNames(data);
      setModalTitle("Total Service Persons");
      setOpenModal(true);
    } catch (error) {
      console.error("Error fetching total service persons:", error);
      setError(
        "Failed to fetch total service persons. Please try again later."
      );
      toast.error(
        "Failed to fetch total service persons. Please try again later."
      );
    }
  };

  const getTotalBreakPerson = async () => {
    try {
      const data = await getTotalBreakAPI();
      setPersonNames(data);
      setModalTitle("On Break Persons");
      setOpenModal(true);
    } catch (error) {
      console.error("Error fetching persons on break:", error);
      setError("Failed to fetch persons on break. Please try again later.");
      toast.error("Failed to fetch person on break. Please try again later.");
    }
  };

  const getTotalActivePerson = async () => {
    try {
      const data = await getTotalActiveAPI();
      setPersonNames(data);
      setModalTitle("Available Persons");
      setOpenModal(true);
    } catch (error) {
      console.error("Error fetching active persons:", error);
      setError("Failed to fetch active persons. Please try again later.");
      toast.error("Failed to fetch active persons. Please try again later.");
    }
  };

  const getTotalAvailablePerson = async () => {
    try {
      const data = await getTotalAvailableAPI();
      setPersonNames(data);
      setModalTitle("Active Persons");
      setOpenModal(true);
    } catch (error) {
      console.error("Error fetching available persons:", error);
      setError("Failed to fetch available persons. Please try again later.");
      toast.error("Failed to fetch available persons. Please try again later.");
    }
  };

  useEffect(() => {
    fetchBreakRequest();
    getCrewCount();
  }, [dispatch]);

  const handleOpenUpdateForm = (breakDetails) => {
    try {
      setSelectedBreak({
        breakDetailsId: breakDetails.breakDetailsId,
        status: breakDetails.status || "",
        startTime: formatToISO(breakDetails.startTime) || "",
        endTime: formatToISO(breakDetails.endTime) || "",
        approvalName:
          breakDetails.approvalName || localStorage.getItem("username"),
      });
      setOpenUpdate(true);
    } catch (error) {
      console.error("Error opening update form:", error);
      setError("Failed to open update form. Please try again.");
    }
  };

  const handleUpdateRequest = async () => {
    try {
      const resultAction = await dispatch(updateBreakRequest(selectedBreak));

      if (updateBreakRequest.fulfilled.match(resultAction)) {
        toast.success("Break request successfully updated!");
        await fetchBreakRequest();
        setOpenUpdate(false);
      } else {
        // If rejected, handle the error
        toast.error(
          resultAction.payload ||
            "Error occurred while updating the break request"
        );
        console.error("Error updating break request:", resultAction.payload);
      }
    } catch (error) {
      console.error("Unexpected error:", error.message);
      toast.error(error || "Failed to update break request. Please try again.");
    }
  };

  function formatToISO(dateString) {
    try {
      return new Date(dateString).toISOString().slice(0, 16);
    } catch (error) {
      console.error("Error formatting date to ISO:", error);
      return "";
    }
  }

  function formatToIST(dateString) {
    try {
      return new Date(dateString).toLocaleString("en-IN", {
        timeZone: "Asia/Kolkata",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });
    } catch (error) {
      console.error("Error formatting date to IST:", error);
      return "Invalid Date";
    }
  }
  return (
    <Card className="h-full w-full bg-primaryBg p-8">
      <div className="w-full h-[15%] flex items-center justify-evenly">
        <Card
          onClick={
            totalCrewCount?.totalServiceCount > 0 ? getTotalServicePerson : null
          }
          className={`w-[20%] h-[75%] flex items-center justify-center border-l-4 border-[#639d82] cursor-pointer ${
            totalCrewCount?.totalServiceCount === 0
              ? "pointer-events-none opacity-50"
              : ""
          }`}
        >
          <p className="text-[#639d82]">Total</p>
          <p className="text-xl">{totalCrewCount?.totalServiceCount}</p>
        </Card>

        <Card
          onClick={
            totalCrewCount?.serviceWithBreakStatusCount > 0
              ? getTotalBreakPerson
              : null
          }
          className={`w-[20%] h-[75%] flex items-center justify-center border-l-4 border-[#DD3E3ED4] cursor-pointer ${
            totalCrewCount?.serviceWithBreakStatusCount === 0
              ? "pointer-events-none opacity-50"
              : ""
          }`}
        >
          <p className="text-[#DD3E3ED4]">On break</p>
          <p className="text-xl">
            {totalCrewCount?.serviceWithBreakStatusCount}
          </p>
        </Card>

        <Card
          onClick={
            totalCrewCount?.serviceWithoutJobSatusCount > 0
              ? getTotalActivePerson
              : null
          }
          className={`w-[20%] h-[75%] flex items-center justify-center border-l-4 border-[#008000] cursor-pointer ${
            totalCrewCount?.serviceWithoutJobSatusCount === 0
              ? "pointer-events-none opacity-50"
              : ""
          }`}
        >
          <p className="text-[#008000]">Available</p>
          <p className="text-xl">
            {totalCrewCount?.serviceWithoutJobSatusCount}
          </p>
        </Card>

        <Card
          onClick={
            totalCrewCount?.serviceWithJobStatusCount > 0
              ? getTotalAvailablePerson
              : null
          }
          className={`w-[20%] h-[75%] flex items-center justify-center border-l-4 border-[#EE80EE] cursor-pointer ${
            totalCrewCount?.serviceWithJobStatusCount === 0
              ? "pointer-events-none opacity-50"
              : ""
          }`}
        >
          <p className="text-[#EE80EE]">Active</p>
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
            <thead className="sticky top-0 bg-blue-gray-50/50 z-10">
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
                          {breakDetails.userName}
                        </Typography>
                      </td>
                      <td className={classes}>
                        <Typography variant="small" color="blue-gray">
                          {breakDetails.approvalName}
                        </Typography>
                      </td>
                      <td className={classes}>
                        <Typography variant="small" color="blue-gray">
                          {formatToIST(breakDetails.startTime)}
                        </Typography>
                      </td>
                      <td className={classes}>
                        <Typography variant="small" color="blue-gray">
                          {formatToIST(breakDetails.endTime)}
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
                        {/* <Button
                          onClick={() =>
                            alert("Delete Functionality Not Implemented")
                          }
                          size="sm"
                          variant="text"
                          color="red"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </Button> */}
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
        className=" w-[5rem] h-[25rem] overflow-y-auto"
      >
        <Dialog.Header>Update Break Request</Dialog.Header>
        <Dialog.Body>
          <div>
            <label htmlFor="status">Status</label>
            <Input
              id="status"
              value={selectedBreak.status}
              onChange={(e) =>
                setSelectedBreak({ ...selectedBreak, status: e.target.value })
              }
              className="mt-1"
            />
            <label htmlFor="startTime">Start Time</label>
            <Input
              id="startTime"
              type="datetime-local"
              value={selectedBreak.startTime}
              onChange={(e) =>
                setSelectedBreak({
                  ...selectedBreak,
                  startTime: e.target.value,
                })
              }
              className="mt-1"
            />
            <label htmlFor="endTime">End Time</label>
            <Input
              id="endTime"
              type="datetime-local"
              value={selectedBreak.endTime}
              onChange={(e) =>
                setSelectedBreak({ ...selectedBreak, endTime: e.target.value })
              }
              className="mt-1"
            />
            {/* <label htmlFor="approvalName">Approval Name</label>
            <Input
              id="approvalName"
              value={selectedBreak.approvalName}
              onChange={(e) => setSelectedBreak({...selectedBreak, approvalName: e.target.value})}
              className="mt-1"
            /> */}
          </div>
        </Dialog.Body>
        <Dialog.Footer>
          <Button
            variant="text"
            color="red"
            className=" mr-3"
            onClick={() => setOpenUpdate(false)}
          >
            <span>Cancel</span>
          </Button>
          <Button
            onClick={handleUpdateRequest}
            className=" bg-transparent text-[#557c55] hover:bg-[#557c55] hover:text-white"
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
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        draggable
        pauseOnFocusLoss
      />
    </Card>
  );
};

export default BreakManagement;
