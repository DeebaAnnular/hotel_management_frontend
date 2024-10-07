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
} from "@material-tailwind/react";
import { MdClose } from "react-icons/md";
import { useDispatch } from "react-redux";
import {
  getAllCustomerTask,
  createTask,
  deleteTask,
} from "../../redux/slices/taskSlice";

const TABLE_HEAD = ["Customer Task", "Action"];

const CustomerTask = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("asc"); // Add sort order state
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen((cur) => !cur);
  const [customerTask, setCustomerTask] = useState("");
  const [allCustomerTask, setAllCustomerTask] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 50;
  const dispatch = useDispatch();

  const handleCreateTask = async () => {
    if (customerTask.trim()) {
      const taskDetails = {
        taskName: customerTask,
        taskType: "CUSTOMER TASK",
      };
      await dispatch(createTask(taskDetails));
      alert("Task created successfully");
      setCustomerTask("");
      handleOpen();
      fetchAllCustomerTask(); // Refresh the task list after creation
    }
  };

  const fetchAllCustomerTask = async () => {
    const pageDetails = {
      pageNo: currentPage,
      pageSize,
    };
    const response = await dispatch(getAllCustomerTask(pageDetails));
    setAllCustomerTask(response.payload || []); // Store the fetched tasks
  };

  const handleDeleteTask = async (taskDataId) => {
    await dispatch(deleteTask(taskDataId));
    alert("Task deleted successfully");
    fetchAllCustomerTask(); // Refresh the task list after deletion
  };

  useEffect(() => {
    fetchAllCustomerTask();
  }, [currentPage]);

  // Filtering and sorting tasks based on search query and sort order
  const filteredTasks = useMemo(() => {
    let tasks = allCustomerTask.filter((task) =>
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
      <CardFooter className="flex items-center justify-between border-t border-blue-gray-50 p-4">
        <Typography variant="small" color="blue-gray" className="font-normal">
          Page {currentPage}
        </Typography>
        <div className="flex gap-2">
          <Button
            variant="outlined"
            size="sm"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          >
            Previous
          </Button>
          <Button
            variant="outlined"
            size="sm"
            onClick={() => setCurrentPage((prev) => prev + 1)}
          >
            Next
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default CustomerTask;
