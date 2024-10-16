import React, { useState, useMemo, useEffect } from "react";
import {
  ChevronUpDownIcon,
  TrashIcon,
  PlusIcon,
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
  Select,
  Option,
} from "@material-tailwind/react";
import { MdClose } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllFloorDetails,
  selectFloorDetails,
  createFloorName,
  deleteFloorName,
} from "../../redux/slices/floorSlice";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const TABLE_HEAD = ["Floor Name", "Action"];

const Floor = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [open, setOpen] = useState(false);
  const handleOpen = () => {
    setFloorName("");
    setFormError("");
    setOpen((cur) => !cur);
  };
  const [floorName, setFloorName] = useState("");
  const [allFloorData, setAllFloorData] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectKey, setSelectKey] = useState(0);
  const [formError, setFormError] = useState("");

  const dispatch = useDispatch();
  const { floorDetailsError, postFloorNameError, deleteFloorNameError } =
    useSelector((state) => state.floor);
  const fetchFloorDetails = async (pageNo = 1, size = pageSize) => {
    try {
      const response = await dispatch(
        getAllFloorDetails({ pageNo, pageSize: size })
      );
      const allFloorDetails = response.payload;

      const extractedFloorNames = allFloorDetails.floors
        .filter((floor) => floor.floorName)
        .map((floor) => ({
          floorName: floor.floorName,
          floorId: floor.floorId,
        }));

      setAllFloorData(extractedFloorNames);
      setTotalRecords(allFloorDetails.totalRecords);
      setTotalPages(Math.ceil(allFloorDetails.totalRecords / size));
    } catch (error) {
      // toast.error(floorDetailsError);
    }
  };

  useEffect(() => {
    fetchFloorDetails(currentPage, pageSize);
  }, [currentPage, pageSize]);
  const filteredAndSortedRows = useMemo(() => {
    let result = allFloorData.filter((row) =>
      row.floorName.toLowerCase().includes(searchQuery.trim().toLowerCase())
    );

    result.sort((a, b) => {
      return sortOrder === "asc"
        ? a.floorName.localeCompare(b.floorName)
        : b.floorName.localeCompare(a.floorName);
    });

    return result;
  }, [searchQuery, sortOrder, allFloorData]);

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  const handleCreateFloor = async () => {
    if (!floorName.trim()) {
      setFormError("Please enter floor name");
    } else {
      try {
        const resultAction = await dispatch(createFloorName(floorName.trim()));
        if (createFloorName.fulfilled.match(resultAction)) {
          toast.success("Floor successfully added!");
          await fetchFloorDetails(currentPage, pageSize);
          setFloorName("");
          handleOpen();
        } else if (createFloorName.rejected.match(resultAction)) {
          setFormError(
            postFloorNameError || "An error occurred while creating the room"
          );
          throw new Error(resultAction.payload);
        }
      } catch (error) {
        setFormError(
          postFloorNameError || "An error occurred while creating the room"
        );
      }
    }
  };

  const handleDeleteFloorName = async (floorId) => {
    try {
      const resultAction = await dispatch(deleteFloorName(floorId)); // Capture the result
      if (deleteFloorName.fulfilled.match(resultAction)) {
        toast.success("Floor successfully deleted!");
        await fetchFloorDetails(currentPage, pageSize); // Refresh the floor list
      } else {
        // If it rejected, it means there was an error
        toast.error(
          resultAction.payload || "Error occurred while deleting the floor"
        );
        console.error("Error deleting floor:", resultAction.payload); // Log the error
      }
    } catch (error) {
      console.error("Unexpected error:", error.message);
      toast.error(deleteFloorNameError);
    }
  };

  const handlePageSizeChange = (newSize) => {
    const parsedSize = parseInt(newSize, 10);
    setPageSize(parsedSize);

    setCurrentPage(1);
    setSelectKey((prevKey) => prevKey + 1); // Force re-render of Select
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const generateOptions = () => {
    const options = [];
    for (let i = 1; i <= Math.min(totalRecords, 50); i++) {
      options.push(i);
    }
    return options;
  };

  return (
    <Card className="h-full w-full shadow-lg">
      <div className="p-4 flex justify-between items-center">
        <div className="flex items-center justify-between w-full ">
          <Typography
            variant="h5"
            color="blue-gray"
            className="font-semibold w-[20%]"
          >
            Floor Management
          </Typography>
          <div className="flex w-[80%] gap-2 items-center justify-end">
            <div className="relative flex w-full max-w-[24rem]">
              <Input
                type="text"
                label="Search Floor"
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
              Create Floor
            </Button>
          </div>
        </div>
        <Dialog
          size="xs"
          open={open}
          handler={handleOpen}
          className="bg-transparent shadow-none z-[1000]"
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
                Add Floor
              </Typography>

              <div>
                <Typography variant="h6" className="mb-2">
                  Floor Name
                </Typography>
                <input
                  required
                  type="text"
                  value={floorName}
                  onChange={(e) => setFloorName(e.target.value)}
                  placeholder="Enter Floor Name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-700 focus:border-transparent"
                />
              </div>

              {/* Show error message if it exists */}
              {formError && (
                <Typography color="red" className="text-center">
                  {formError}
                </Typography>
              )}
            </CardBody>

            <CardFooter className="pt-0 flex justify-end">
              <Button onClick={handleCreateFloor} className="bg-greenbtnColor">
                Create Floor
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
                    {index === 0 && (
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
              filteredAndSortedRows.map(({ floorName, floorId }, index) => {
                const isLast = index === filteredAndSortedRows.length - 1;
                const classes = isLast
                  ? "p-4"
                  : "p-4 border-b border-blue-gray-50";

                return (
                  <tr key={index}>
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
                      <div className="flex gap-2">
                        <TrashIcon
                          className="h-5 w-5 text-red-500 cursor-pointer"
                          onClick={() => handleDeleteFloorName(floorId)}
                        />
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td className="text-center p-4" colSpan={2}>
                  No records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </CardBody>

      <CardFooter className="flex justify-between items-center border-t border-blue-gray-50 p-4 mt-1">
        <Typography variant="small" color="blue-gray" className="font-normal">
          Showing page {currentPage} of {Math.ceil(totalRecords / pageSize)}
        </Typography>

        <div className="flex items-center gap-2">
          <div className="w-16 h-8 flex items-center justify-center ">
            {" "}
            {/* Reduced width from w-20 to w-16 */}
            <Select
              key={selectKey}
              value={pageSize.toString()}
              onChange={handlePageSizeChange}
              containerProps={{
                className: "min-w-[64px] h-full",
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
                  className="py-1 text-sm"
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

export default Floor;
