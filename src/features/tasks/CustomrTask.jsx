import React, { useEffect, useState, useMemo } from "react";
import {
  MagnifyingGlassIcon,
  ChevronUpDownIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
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
import { useDispatch, useSelector } from "react-redux";
import {
  getAllCustomerTask,
  createTask,
  deleteTask,
} from "../../redux/slices/taskSlice";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const TABLE_HEAD = ["Customer Task", "Action"];

const CustomerTask = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("asc"); // Add sort order state
  const [open, setOpen] = useState(false);
  const handleOpen = () => {
    setCustomerTask("");
    setOpen((cur) => !cur);
  };
  const [customerTask, setCustomerTask] = useState("");
  const [allCustomerTask, setAllCustomerTask] = useState([]);

  const [totalRecords, setTotalRecords] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectKey, setSelectKey] = useState(0);
  const [formError, setFormError] = useState("");

  const dispatch = useDispatch();

  const { customerTaskListError, postTaskDetailsError, deleteTaskError } =
    useSelector((state) => state.task);

  const handleCreateTask = async () => {
    if (!customerTask.trim()) {
      setFormError("Please enter a task name");
      return;
    }
    setFormError("");
    const taskDetails = {
      taskName: customerTask,
      taskType: "CUSTOMER TASK",
    };

    try {
      const resultAction = await dispatch(createTask(taskDetails));
      if (createTask.fulfilled.match(resultAction)) {
        toast.success("Task created successfully");
        setCustomerTask("");
        handleOpen();
        await fetchAllCustomerTask(currentPage, pageSize);
      } else {
        toast.error("Failed to create task. Please try again.");
      }
    } catch (error) {
      console.error("Error creating task:", error);
      setFormError(postTaskDetailsError);
    }
  };

  const fetchAllCustomerTask = async (currentPage, pageSize) => {
    const pageDetails = {
      pageNo: currentPage,
      pageSize,
    };
    try {
      const response = await dispatch(getAllCustomerTask(pageDetails));
      console.log("response :", response.payload);
      setAllCustomerTask(response?.payload?.taskDataList);
      setTotalRecords(response?.payload?.totalRecords);
      setTotalPages(Math.ceil(response?.payload?.totalRecords / pageSize));
    } catch (error) {
      console.log("error in fetching general task list", error);
      toast.error(customerTaskListError);
    }
  };

  const handleDeleteTask = async (taskDataId) => {
    try {
      const resultAction = await dispatch(deleteTask(taskDataId));
      if (deleteTask.fulfilled.match(resultAction)) {
        toast.success("Task Deleted Successfully!");
        fetchAllCustomerTask(currentPage, pageSize); 
      } else {
        allCustomerTask && toast.error(deleteTaskError);
      }
    } catch (error) {
      allCustomerTask &&
        toast.error(
          deleteTaskError 
        );
    }
  };

  console.log("customer component", deleteTaskError);
  useEffect(() => {
    fetchAllCustomerTask(currentPage, pageSize);
  }, [currentPage, pageSize]);

  const filteredTasks = useMemo(() => {
    let tasks = allCustomerTask?.filter((task) =>
      task.taskName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    tasks.sort((a, b) => {
      return sortOrder === "asc"
        ? a.taskName.localeCompare(b.taskName)
        : b.taskName.localeCompare(a.taskName);
    });

    return tasks;
  }, [searchQuery, sortOrder, allCustomerTask]);

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
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
    <Card className="h-full w-full">
      <div className="p-4 flex justify-between items-center">
        <div className="flex items-center justify-between w-full ">
          <Typography
            variant="h5"
            color="blue-gray"
            className="font-semibold w-[20%]"
          >
            Customer Task
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
              Create Customer Task
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
                Add Customer Request
              </Typography>
              <div>
                <Typography variant="h6" className="mb-2">
                  Enter Customer Task
                </Typography>
                <input
                  required
                  type="text"
                  value={customerTask}
                  onChange={(e) => setCustomerTask(e.target.value)}
                  placeholder="Enter Task Name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-700 focus:border-transparent"
                />
                {formError && (
                  <Typography color="red" className="text-center">
                    {formError}
                  </Typography>
                )}
              </div>
            </CardBody>

            <CardFooter className="pt-0 flex justify-end">
              <Button onClick={handleCreateTask} className="bg-greenbtnColor">
                Request Task
              </Button>
            </CardFooter>
          </Card>
        </Dialog>
      </div>
      <CardBody className="overflow-scroll px-0">
        <table className="mt-4 w-full min-w-max table-auto text-left">
          <thead>
            <tr>
              {TABLE_HEAD.map((head, index) => (
                <th
                  key={head}
                  className="cursor-pointer border-y border-blue-gray-100 bg-blue-gray-50/50 p-4 transition-colors hover:bg-blue-gray-50"
                >
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="flex items-center justify-between gap-2 font-normal leading-none opacity-70"
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

export default CustomerTask;
