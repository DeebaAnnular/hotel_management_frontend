import React, { useState, useMemo, useEffect } from "react";
import {
  ChevronUpDownIcon,
  TrashIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import {
  Button,
  Dialog,
  Card,
  CardBody,
  CardFooter,
  Typography,
  Input,
  Select,
  Option,
} from "@material-tailwind/react";
import { MdClose } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllRoomDetails,
  createRoom,
  deleteRoom,
} from "../../redux/slices/roomSlice";
import { getAllFloorDetails } from "../../redux/slices/floorSlice";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const TABLE_HEAD = ["Floor Name", "Room Name / Number", "Action"];

const Room = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [open, setOpen] = useState(false);
  const [roomName, setRoomName] = useState("");
  const [floorID, setFloorID] = useState("");
  const [floorData, setFloorData] = useState([]);
  const [allRoomDetails, setAllRoomDetails] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectKey, setSelectKey] = useState(0);
  const dispatch = useDispatch();
  const [formError, setFormError] = useState("");

  const { roomDetailsError, postRoomNameError, deleteRoomNameError } =
    useSelector((state) => state.room);
  const { floorDetailsError } = useSelector((state) => state.floor);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const floorData = await dispatch(
          getAllFloorDetails({ pageNo: currentPage, pageSize })
        );
        // console.log("jdsfgjskdf", floorData.payload.floors);
        setFloorData(floorData.payload.floors);

        const roomData = await dispatch(
          getAllRoomDetails({ pageNo: currentPage, pageSize })
        );
        const allRoomDetails = roomData.payload.roomResponseList;
        console.log("room detailssss", allRoomDetails);
        setTotalRecords(roomData.payload.totalRecords);
        setAllRoomDetails(allRoomDetails);
        setTotalPages(
          Math.ceil(roomData.payload.totalRecords / parseInt(pageSize))
        );
      } catch (error) {
        // console.error("Error fetching data:", error);
        if (roomDetailsError !== null) toast.error(roomDetailsError);
        if (floorDetailsError !== null) toast.error(floorDetailsError);
      }
    };

    fetchData();
  }, [dispatch, currentPage, pageSize]);

  const filteredAndSortedRows = useMemo(() => {
    console.log("all room details: ",allRoomDetails);
    let result = allRoomDetails?.filter(
      (row) =>
        row.floorName
          .toLowerCase()
          .includes(searchQuery.trim().toLowerCase()) ||
        String(row.roomName)
          .toLowerCase()
          .includes(searchQuery.trim().toLowerCase())
    );
    console.log("check result", result);

    result?.sort((a, b) => {
      const compareFloors = a.floorName.localeCompare(b.floorName);
      if (compareFloors !== 0)
        return sortOrder === "asc" ? compareFloors : -compareFloors;

      // Compare room names as numbers
      const roomNameA = Number(a.roomName);
      const roomNameB = Number(b.roomName);

      if (roomNameA < roomNameB) return sortOrder === "asc" ? -1 : 1;
      if (roomNameA > roomNameB) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

    return result;
  }, [allRoomDetails, searchQuery, sortOrder]);

  console.log("room details error", roomDetailsError);

  console.log("floor details error", floorDetailsError);

  const toggleSortOrder = () => {
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  const handleCreateRoom = async () => {
    setFormError(""); // Clear previous errors
    if (!floorID || !roomName) {
      setFormError("Please fill in all fields");
      return;
    }
    const roomDetails = {
      floorId: floorID,
      roomName: roomName,
    };
    try {
      const resultAction = await dispatch(createRoom(roomDetails));
      if (createRoom.fulfilled.match(resultAction)) {
        setRoomName("");
        setFloorID("");
        handleOpen();
        toast.success("Room Added successfully");
        // Refresh room data
        const roomData = await dispatch(
          getAllRoomDetails({ pageNo: currentPage, pageSize })
        );
        setAllRoomDetails(roomData.payload.roomResponseList);
      } else {
        setFormError(
          postRoomNameError || "An error occurred while creating the room"
        );
        throw new Error(resultAction.error.message || "Failed to create room");
      }
    } catch (error) {
      console.log("post room name", postRoomNameError);
      setFormError(
        postRoomNameError || "An error occurred while creating the room"
      );
    }
  };

  const handleDeleteRoom = async (roomId) => {
    try {
      const resultAction = await dispatch(deleteRoom(roomId));
      if (deleteRoom.fulfilled.match(resultAction)) {
        toast.success("Room deleted successfully");
      } else {
        toast.error(
          resultAction.payload || "Error occurred while deleting the room"
        );
        console.error("Error deleting floor:", resultAction.payload);
      }

      // Refresh room data
      const roomData = await dispatch(
        getAllRoomDetails({ pageNo: currentPage, pageSize })
      );
      if (roomData.payload && roomData.payload.roomResponseList) {
        setAllRoomDetails(roomData.payload.roomResponseList);
        setTotalRecords(roomData.payload.totalRecords || 0);
        setTotalPages(
          Math.ceil((roomData.payload.totalRecords || 0) / pageSize)
        );
      }
    } catch (error) {
      setAllRoomDetails([])
      toast.error(deleteRoomNameError||error);
    }
  };

  const handleOpen = () => {
    setRoomName("");
    setFloorID("");
    setOpen((cur) => !cur);
    setFormError("")
  };

  const handlePageSizeChange = (newSize) => {
    const parsedSize = parseInt(newSize, 10);
    setPageSize(parsedSize);
    setCurrentPage(1);
    setSelectKey((prevKey) => prevKey + 1); // Force re-render of Select
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const generateOptions = () => {
    const options = [];
    console.log("total records at get generateOption", totalRecords);
    for (let i = 1; i <= Math.min(totalRecords, 50); i++) {
      options.push(i);
    }
    console.log("optionnn", options);
    return options;
  };

  console.log("delete error", deleteRoomNameError);

  return (
    <Card className="h-full w-full shadow-lg">
      <div className="p-4 flex justify-between items-center">
        <div className="flex items-center justify-between w-full ">
          <Typography
            variant="h5"
            color="blue-gray"
            className="font-semibold w-[20%]"
          >
            Room Management
          </Typography>
          <div className="flex w-[80%] gap-2 items-center justify-end">
            <div className="relative flex w-full max-w-[24rem]">
              <Input
                type="text"
                label="Search by Room no or floor name"
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
            <Button onClick={handleOpen} className="bg-greenbtnColor">
              Create Room
            </Button>
          </div>
        </div>

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
                Add Room
              </Typography>

              <div>
                <Typography variant="h6" className="mb-2">
                  Floor Name
                </Typography>
                <select
                  required
                  value={floorID}
                  onChange={(e) => setFloorID(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-700 focus:border-transparent"
                >
                  <option value="" disabled>
                    Select Floor Name
                  </option>
                  {floorData?.map((floor) => (
                    <option key={floor.floorId} value={floor.floorId}>
                      {floor.floorName}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <Typography variant="h6" className="mb-2">
                  Room Name / Number
                </Typography>
                <input
                  required
                  type="text"
                  value={roomName}
                  onChange={(e) => setRoomName(e.target.value)}
                  placeholder="Enter Room Name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-700 focus:border-transparent"
                />
                {formError && (
                  <Typography color="red" className="text-center text-xs my-1">
                    * {formError}
                  </Typography>
                )}
              </div>
            </CardBody>

            <CardFooter className="pt-0 flex justify-end">
              <Button onClick={handleCreateRoom} className="bg-greenbtnColor">
                Create Room
              </Button>
            </CardFooter>
          </Card>
        </Dialog>
      </div>
      <CardBody className="overflow-scroll px-0">
        <table className="w-full min-w-max table-auto text-left">
          <thead className="sticky top-0 bg-blue-gray-50/50 z-10" >
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
                    {index < 2 && (
                      <ChevronUpDownIcon
                        strokeWidth={2}
                        className="h-4 w-4 cursor-pointer"
                        onClick={toggleSortOrder}
                      />
                    )}
                  </Typography>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredAndSortedRows.length > 0 ? (
              filteredAndSortedRows.map(
                ({ roomDataId, floorName, roomName }, index) => {
                  const isLast = index === filteredAndSortedRows.length - 1;
                  const classes = isLast
                    ? "p-4"
                    : "p-4 border-b border-blue-gray-50";

                  return (
                    <tr key={roomDataId} className="even:bg-blue-gray-50/50">
                      <td className={classes}>
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal"
                        >
                          {floorName}
                        </Typography>
                      </td>
                      <td className={classes}>
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal"
                        >
                          {roomName}
                        </Typography>
                      </td>
                      <td className={classes}>
                        <Button
                          variant="text"
                          color="red"
                          className="flex items-center gap-1"
                          onClick={() => handleDeleteRoom(roomDataId)}
                        >
                          <TrashIcon className="h-4 w-4" />
                          Delete
                        </Button>
                      </td>
                    </tr>
                  );
                }
              )
            ) : (
              <tr>
                <td
                  colSpan={5}
                  className="text-center border-b border-blue-gray-100 p-4"
                >
                  No records found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </CardBody>
      <CardFooter className="flex justify-between items-center border-t border-blue-gray-50 p-4 mt-1">
        <Typography variant="small" color="blue-gray" className="font-normal">
          Showing page {currentPage} of {totalPages}
        </Typography>

        <div className="flex items-center gap-2">
          <div className="w-16 h-8 flex items-center justify-center">
            <Select
              key={selectKey}
              value={pageSize.toString()}
              onChange={handlePageSizeChange}
              containerProps={{
                className: "min-w-[64px] h-full border",
              }}
              className="w-full h-full text-sm"
              labelProps={{
                className: "hidden",
              }}
            >
              {generateOptions().map((size) => (
                <Option
                  key={size}
                  value={size.toString()}
                  className="py-1 text-sm "
                >
                  {size}
                </Option>
              ))}
            </Select>
          </div>

          <Button
            size="sm"
            variant="outlined"
            disabled={currentPage === 1}
            onClick={handlePreviousPage}
          >
            Previous
          </Button>

          <Button
            size="sm"
            variant="outlined"
            disabled={currentPage === totalPages}
            onClick={handleNextPage}
          >
            Next
          </Button>
        </div>
      </CardFooter>
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

export default Room;
