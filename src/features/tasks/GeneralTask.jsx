import React, { useEffect, useState, useMemo } from "react";
import {
  MagnifyingGlassIcon,
  ChevronUpDownIcon,
} from "@heroicons/react/24/outline";
import { TrashIcon } from "@heroicons/react/24/solid";
import {
  Card,
  Input,
  Typography,
  Button,
  CardBody,
  CardFooter,
  Dialog,
  Select,
  Option,
} from "@material-tailwind/react";
import { MdClose } from "react-icons/md";
import {
  getAllGeneralTask,
  createTask,
  deleteTask,
} from "../../redux/slices/taskSlice";
import { useDispatch ,useSelector} from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const TABLE_HEAD = ["General Task", "Action"];

const GeneralTask = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [open, setOpen] = useState(false);
  const handleOpen = () => {
    setGeneralTask("");
    setFormError("");
    setOpen((cur) => !cur);
  };

  const [generalTask, setGeneralTask] = useState("");
  const [allGeneralTask, setAllGeneralTask] = useState([]);
  const [sortOrder, setSortOrder] = useState("asc");
  const [totalRecords, setTotalRecords] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectKey, setSelectKey] = useState(0);
  const [formError, setFormError] = useState("");
  const dispatch = useDispatch();

  const { generalTaskListError, postTaskDetailsError, deleteTaskError } =
    useSelector((state) => state.task);

    const handleCreateTask = async () => {
      // Validate input
      if (!generalTask.trim()) {
        setFormError("Please enter a task name"); // Update error message to be task-related
        return; // Stop execution if the input is invalid
      }
    
      // Clear any previous form error if the input is valid
      setFormError("");
    
      // Prepare task details
      const taskDetails = {
        taskName: generalTask,
        taskType: "GENERAL TASK",
      };
    
      try {
        const resultAction = await dispatch(createTask(taskDetails));
        if (createTask.fulfilled.match(resultAction)) {
          handleOpen();
          toast.success("Task successfully added!");
          await fetchAllGeneralTask(currentPage, pageSize);
        } else {
          setFormError(postTaskDetailsError || "Error happend while creating task");
        }
      } catch (error) {
        console.error("Error creating task:", error);
        setFormError(postTaskDetailsError);
      }
    };
    
  const fetchAllGeneralTask = async (currentPage, pageSize) => {
    const pageDetails = {
      pageNo: currentPage,
      pageSize,
    };
    try {
      const response = await dispatch(getAllGeneralTask(pageDetails));
      console.log("response :", response.payload);
      setAllGeneralTask(response?.payload?.taskDataList);
      setTotalRecords(response?.payload?.totalRecords);
      setTotalPages(Math.ceil(response?.payload?.totalRecords / pageSize));
    } catch (error) {
      console.log("error in fetching general task list", error);
      toast.error(generalTaskListError);
    }
  };

  const handleDeleteTask = async (taskDataId) => {
    try {
      const resultAction = await dispatch(deleteTask(taskDataId));
      if (deleteTask.fulfilled.match(resultAction)) {
        toast.success("Task Deleted Successfully!");
        fetchAllGeneralTask(currentPage, pageSize); // Refresh the task list
      } else {
        // Handle specific rejection if task deletion failed
        toast.error(deleteTaskError);
      }
    } catch (error) {
      console.error("Unexpected error:", error.message);
  
      // Display the error message in toast
      toast.error(deleteTaskError || "An unexpected error occurred while deleting the task.");
    }
  };

  useEffect(() => {
    fetchAllGeneralTask(currentPage, pageSize);
  }, [currentPage, pageSize]);
  console.log("check");

  // Filtering tasks based on search query
  const filteredTasks = useMemo(() => {
    const filtered = allGeneralTask.filter((task) =>
      task.taskName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Sorting tasks based on sortOrder
    return filtered.sort((a, b) => {
      return sortOrder === "asc"
        ? a.taskName.localeCompare(b.taskName)
        : b.taskName.localeCompare(a.taskName);
    });
  }, [allGeneralTask, searchQuery, sortOrder]);

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

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  return (
    <Card className="h-full w-full">
      <div className="p-4 flex justify-between items-center">
        <div className="flex items-center justify-between w-full ">
          <Typography
            variant="h5"
            color="blue-gray"
            className="font-semibold w-[20%]"
          >
            General Task
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
              Create General Task
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
            {/* Close button */}
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
                Add General Task
              </Typography>

              <div>
                <Typography variant="h6" className="mb-2">
                  Enter General Task
                </Typography>
                <input
                  required
                  type="text"
                  value={generalTask}
                  onChange={(e) => setGeneralTask(e.target.value)}
                  placeholder="Enter Task Name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-700 focus:border-transparent"
                />
              </div>
              {formError && (
                <Typography color="red" className="text-center">
                  {formError}
                </Typography>
              )}
            </CardBody>

            <CardFooter className="pt-0 flex justify-end">
              <Button onClick={handleCreateTask} className="bg-greenbtnColor">
                Create Task
              </Button>
            </CardFooter>
          </Card>
        </Dialog>
      </div>

      <CardBody className="overflow-scroll px-0">
        <table className="mt-4 w-full min-w-max table-auto text-left">
          <thead className="sticky top-0 bg-blue-gray-50/50 z-10">
            <tr>
              {TABLE_HEAD.map((head, index) => (
                <th
                  key={head}
                  className="cursor-pointer border-y border-blue-gray-100 bg-blue-gray-50/50 p-4 transition-colors hover:bg-blue-gray-50"
                  onClick={index === 0 ? toggleSortOrder : undefined} // Add onClick for sorting
                >
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="flex items-center justify-between gap-2 font-normal leading-none opacity-70"
                  >
                    {head}
                    {index === 0 && (
                      <ChevronUpDownIcon strokeWidth={2} className="h-4 w-4" />
                    )}
                  </Typography>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredTasks.length > 0 ? (
              filteredTasks.map(({ taskDataId, taskName }, index) => {
                const isLast = index === filteredTasks.length - 1;
                const classes = isLast
                  ? "p-4"
                  : "p-4 border-b border-blue-gray-50";

                return (
                  <tr key={taskDataId}>
                    <td className={classes}>
                      <div className="flex items-center gap-3">
                        <div className="flex flex-col">
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-normal"
                          >
                            {taskName}
                          </Typography>
                        </div>
                      </div>
                    </td>
                    <td className={classes}>
                      <Button
                        variant="text"
                        color="red"
                        className="flex items-center gap-1"
                        onClick={() => handleDeleteTask(taskDataId)}
                      >
                        <TrashIcon className="h-4 w-4" />
                        Delete
                      </Button>
                    </td>
                  </tr>
                );
              })
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

export default GeneralTask;
