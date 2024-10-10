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
} from "@material-tailwind/react";
import { MdClose } from "react-icons/md";
import { useDispatch } from "react-redux";
import {
  getAllRoomDetails,
  createRoom,
  deleteRoom,
} from "../../redux/slices/roomSlice";
import { getAllFloorDetails } from "../../redux/slices/floorSlice";

const TABLE_HEAD = ["Floor Name", "Room Name", "Action"];

const Room = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [open, setOpen] = useState(false);
  const [roomName, setRoomName] = useState("");
  const [floorID, setFloorID] = useState("");
  const [floorData, setFloorData] = useState([]);
  const [allRoomDetails, setAllRoomDetails] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 50;

  const dispatch = useDispatch();

  useEffect(() => {
    const fetchData = async () => {
      const floorData = await dispatch(
        getAllFloorDetails({ pageNo: currentPage, pageSize })
      );
      setFloorData(floorData.payload);

      const roomData = await dispatch(
        getAllRoomDetails({ pageNo: currentPage, pageSize })
      );
      setAllRoomDetails(roomData.payload);
    };
    fetchData();
  }, [dispatch, currentPage, pageSize]);

  const filteredAndSortedRows = useMemo(() => {
    let result = allRoomDetails?.filter(
      (row) =>
        row.floorName
          .toLowerCase()
          .includes(searchQuery.trim().toLowerCase()) ||
        row.roomName.toLowerCase().includes(searchQuery.trim().toLowerCase())
    );

    result?.sort((a, b) => {
      if (sortOrder === "asc") {
        return (
          a.floorName.localeCompare(b.floorName) ||
          a.roomName.localeCompare(b.roomName)
        );
      } else {
        return (
          b.floorName.localeCompare(a.floorName) ||
          b.roomName.localeCompare(a.roomName)
        );
      }
    });

    return result;
  }, [allRoomDetails, searchQuery, sortOrder]);

  const toggleSortOrder = () => {
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  const handleCreateRoom = async () => {
    if (!floorID || !roomName) {
      alert("Please fill in all fields");
      return;
    }
    const roomDetails = {
      floorId: floorID,
      roomName: roomName,
    };
    try {
      await dispatch(createRoom(roomDetails));
      alert("Room Added Successfully");
      setRoomName("");
      setFloorID("");
      handleOpen()
      // Refresh room data
      const roomData = await dispatch(
        getAllRoomDetails({ pageNo: currentPage, pageSize })
      );
      setAllRoomDetails(roomData.payload);
    } catch (error) {
      alert("Error creating room: " + error.message);
    }
  };

  const handleDeleteRoom = async (roomId) => {
    try {
      await dispatch(deleteRoom(roomId));
      alert("Room deleted successfully");
      // Refresh room data
      const roomData = await dispatch(
        getAllRoomDetails({ pageNo: currentPage, pageSize })
      );
      setAllRoomDetails(roomData.payload);
    } catch (error) {
      alert("Error deleting room: " + error.message);
    }
  };
  const handleOpen = () => setOpen((cur) => !cur);

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
                label="Search Task"
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
          handler={{handleOpen}}
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
                  Room Name
                </Typography>
                <input
                  required
                  type="text"
                  value={roomName}
                  onChange={(e) => setRoomName(e.target.value)}
                  placeholder="Enter Room Name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-700 focus:border-transparent"
                />
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
            {filteredAndSortedRows?.length > 0 ? (
              filteredAndSortedRows?.map(
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

      <CardFooter className="flex items-center justify-between border-t border-blue-gray-50 p-4">
        <Typography variant="small" color="blue-gray" className="font-normal">
          Page {currentPage} of {Math.ceil(allRoomDetails.length / pageSize)}
        </Typography>
        <div className="flex gap-2">
          <Button
            variant="outlined"
            size="sm"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <Button
            variant="outlined"
            size="sm"
            onClick={() => setCurrentPage((prev) => prev + 1)}
            disabled={
              currentPage === Math.ceil(allRoomDetails.length / pageSize)
            }
          >
            Next
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default Room;
