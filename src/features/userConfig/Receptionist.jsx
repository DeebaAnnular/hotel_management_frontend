import { useEffect, useState, useMemo } from "react";
import {
  MagnifyingGlassIcon,
  ChevronUpDownIcon,
} from "@heroicons/react/24/outline";
import { MdClose } from "react-icons/md";
import {
  Card,
  Input,
  Typography,
  Button,
  CardBody,
  CardFooter,
  Dialog,
} from "@material-tailwind/react";
import {
  createUser,
  getAllSupervisorDetail,
  deleteUserDetail,
} from "../../redux/slices/userConfigSlice";
import { useDispatch } from "react-redux";

const TABLE_HEAD = ["Name", "Employee ID", "UserName", "Action"];

const Receptionist = () => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [pageNo, setPageNo] = useState(1);
  const [supervisorList, setSupervisorList] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [isLoading, setIsLoading] = useState(false); // For handling button loading states
  const pageSize = 50;
  const dispatch = useDispatch();

  const handleOpen = () => setOpen(!open);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const action = await dispatch(
        getAllSupervisorDetail({ pageNo, pageSize })
      );
      if (getAllSupervisorDetail.fulfilled.match(action)) {
        setSupervisorList(action.payload);
      }
    } catch (error) {
      console.error("Error fetching supervisor details:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [pageNo, dispatch]);

  const filteredAndSortedSupervisors = useMemo(() => {
    let result = supervisorList?.filter((customer) => {
      const searchValue = searchQuery.trim().toLowerCase();
      return (
        customer.name?.toLowerCase().includes(searchValue) ||
        customer.userName?.toLowerCase().includes(searchValue) ||
        customer.employeeId?.toLowerCase().includes(searchValue)
      );
    });
  
    result?.sort((a, b) => {
      return sortOrder === "asc"
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name);
    });
  
    return result;
  }, [searchQuery, sortOrder, supervisorList]);

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  const handleCreateCustomer = async () => {
    const newCustomer = {
      name,
      userType: "SUPERVISOR",
      employeeId,
      userName: username,
      userPassword: password,
    };
    try {
      setIsLoading(true);
      await dispatch(createUser(newCustomer)).unwrap();
      alert("Customer Created Successfully");
      await fetchData();
      resetForm();
      handleOpen();
    } catch (error) {
      alert("Error Occurred While Creating User");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setName("");
    setEmployeeId("");
    setUsername("");
    setPassword("");
  };


  const handleNextPage = () => setPageNo((prev) => prev + 1);
  const handlePreviousPage = () => setPageNo((prev) => Math.max(prev - 1, 1));

  const handleDeleteSupervisor = async (customerId) => {
    try {
      setIsLoading(true);
      await dispatch(deleteUserDetail(customerId)).unwrap();
      await fetchData();
      alert("Customer Deleted Successfully");
    } catch (error) {
      alert("Error Occurred While Deleting User");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="h-full w-full">
      <div className="p-4 flex justify-between items-center">
        <Typography variant="h5" color="blue-gray" className="font-semibold">
          Supervisor Details
        </Typography>
        <div className="flex gap-2 items-center justify-center">
          <div className="relative flex w-full max-w-[24rem]">
            <Input
              type="text"
              label="Search Supervisor"
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
              onClick={() => setSearchQuery("")} // Clear search query
            >
              <MagnifyingGlassIcon className="h-4 w-4" />
            </Button>
          </div>
          <Button onClick={handleOpen} className="bg-greenbtnColor">
            Create Supervisor
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

          <CardBody className="flex flex-col gap-4">
            <Typography
              variant="h4"
              color="blue-gray"
              className="font-semibold text-center"
            >
              Add Supervisor
            </Typography>

            <div className="flex flex-col gap-2">
              <Typography variant="h6">Name</Typography>
              <input
                required
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter Name"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-700 focus:border-transparent"
              />
            </div>

            <div className="flex flex-col gap-2">
              <Typography variant="h6">Employee ID</Typography>
              <input
                required
                type="text"
                value={employeeId}
                onChange={(e) => setEmployeeId(e.target.value)}
                placeholder="Enter Employee ID"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-700 focus:border-transparent"
              />
            </div>

            <div className="flex flex-col gap-2">
              <Typography variant="h6">Username</Typography>
              <input
                required
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter Username"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-700 focus:border-transparent"
              />
            </div>

            <div className="flex flex-col gap-2">
              <Typography variant="h6">Password</Typography>
              <input
                required
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter Password"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-700 focus:border-transparent"
              />
            </div>
          </CardBody>

          <CardFooter className="pt-4 flex justify-center">
            <Button
              onClick={handleCreateCustomer}
              className="bg-greenbtnColor px-6"
              disabled={isLoading} // Disable button while loading
            >
              Submit
            </Button>
          </CardFooter>
        </Card>
      </Dialog>

      <CardBody className="overflow-scroll px-0">
        <table className="mt-4 w-full min-w-max table-auto text-left">
          <thead>
            <tr>
              {TABLE_HEAD.map((head, index) => (
                <th
                  key={head}
                  className="cursor-pointer border-y border-blue-gray-100 bg-blue-gray-50/50 p-4 transition-colors hover:bg-blue-gray-50"
                  onClick={toggleSortOrder} // Toggle sorting when clicking the column header
                >
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="flex items-center justify-between gap-2 font-normal leading-none opacity-70"
                  >
                    {head}{" "}
                    {index !== TABLE_HEAD.length - 1 && (
                      <ChevronUpDownIcon strokeWidth={2} className="h-4 w-4" />
                    )}
                  </Typography>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredAndSortedSupervisors.length>0?(filteredAndSortedSupervisors?.map(
              ({ name, employeeId, userName, userId }, index) => {
                const isLast = index === filteredAndSortedSupervisors.length - 1;
                const classes = isLast
                  ? "p-4"
                  : "p-4 border-b border-blue-gray-50";

                return (
                  <tr key={userId}>
                    <td className={classes}>
                      <Typography variant="small" color="blue-gray" className="font-normal">
                        {name}
                      </Typography>
                    </td>
                    <td className={classes}>
                      <Typography variant="small" color="blue-gray" className="font-normal">
                        {employeeId}
                      </Typography>
                    </td>
                    <td className={classes}>
                      <Typography variant="small" color="blue-gray" className="font-normal">
                        {userName}
                      </Typography>
                    </td>
                    <td className={classes}>
                      <Button
                        variant="text"
                         color="red"
                        className="text-red-500"
                        onClick={() => handleDeleteSupervisor(userId)}
                        disabled={isLoading} 
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                );
              }
            )):( <tr>
              <td
                colSpan={5}
                className="text-center border-b border-blue-gray-100 p-4"
              >
                No records found
              </td>
            </tr>)}
          </tbody>
        </table>
      </CardBody>
      <CardFooter className="flex items-center justify-between border-t border-blue-gray-50 p-4">
        <Typography variant="small" color="blue-gray" className="font-normal">
          Page 1 of 10
        </Typography>
        <div className="flex gap-2">
          <Button
            v
            variant="outlined"
            size="sm"
            onClick={handlePreviousPage}
            disabled={pageNo === 1}
          >
            Previous
          </Button>
          <Button
            variant="outlined"
            size="sm"
            className=""
            onClick={handleNextPage}
          >
            Next
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default Receptionist;
