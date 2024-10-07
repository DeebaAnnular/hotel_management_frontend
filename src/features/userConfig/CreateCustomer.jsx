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
import { useEffect, useState, useMemo } from "react";
import {
  createUser,
  getAllCustomerDetail,
  deleteUserDetail,
  selectCustomerList,
} from "../../redux/slices/userConfigSlice";
import { useSelector, useDispatch } from "react-redux";

const TABLE_HEAD = [
  "Customer Name",
  "Number",
  "Room Number",
  "Username",
  "Status",
  "Action",
];

const CreateCustomer = () => {
  const [open, setOpen] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [roomNumber, setRoomNumber] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [pageNo, setPageNo] = useState(1);
  const [customerData, setCustomerData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const pageSize = 50;
  const dispatch = useDispatch();

  const handleOpen = () => setOpen(!open);

  const fetchData = async () => {
    try {
      const action = await dispatch(getAllCustomerDetail({ pageNo, pageSize }));
      if (getAllCustomerDetail.fulfilled.match(action)) {
        setCustomerData(action.payload);
      }
    } catch (error) {
      console.error("Error fetching customer data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [pageNo, dispatch]);

  const filteredAndSortedCustomers = useMemo(() => {
    let result = customerData?.filter((customer) =>
      customer.name?.toLowerCase().includes(searchQuery.trim().toLowerCase())
    );

    result?.sort((a, b) => {
      return sortOrder === "asc"
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name);
    });

    return result;
  }, [searchQuery, sortOrder, customerData]);

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  const handleCreateCustomer = async () => {
    const newCustomer = {
      name: customerName,
      userType: "CUSTOMER",
      userMobileNo: phoneNumber,
      roomNo: roomNumber,
      userPassword: password,
      userName: username,
    };
    try {
      await dispatch(createUser(newCustomer)).unwrap();
      alert("Customer Created Successfully");
      await fetchData();
      resetForm();
      handleOpen();
    } catch (error) {
      alert("Error Occurred While Creating User");
      console.error(error);
    }
  };

  const resetForm = () => {
    setCustomerName("");
    setPhoneNumber("");
    setRoomNumber("");
    setUsername("");
    setPassword("");
  };

  const handleDeleteCustomer = async (customerId) => {
    try {
      await dispatch(deleteUserDetail(customerId)).unwrap();
      await fetchData();
      alert("Customer Deleted Successfully");
    } catch (error) {
      alert("Error Occurred While Deleting User");
      console.error(error);
    }
  };

  const handleNextPage = () => setPageNo((prev) => prev + 1);
  const handlePreviousPage = () => setPageNo((prev) => Math.max(prev - 1, 1));

  return (
    <Card className="h-full w-full">
      <div className="p-4 flex justify-between items-center">
        <Typography variant="h5" color="blue-gray" className="font-semibold">
          Customer Details
        </Typography>
        <div className="flex gap-2 items-center justify-center">
          <div className="relative flex w-full max-w-[24rem]">
            <Input
              type="text"
              label="Search Customer"
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
            Create Customer
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
              Add Customer
            </Typography>

            <div className="flex flex-col gap-2">
              <Typography variant="h6">Name</Typography>
              <input
                required
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Enter Name"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-700 focus:border-transparent"
              />
            </div>

            <div className="flex flex-col gap-2">
              <Typography variant="h6">Phone Number</Typography>
              <input
                required
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="Enter Phone Number"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-700 focus:border-transparent"
              />
            </div>

            <div className="flex flex-col gap-2">
              <Typography variant="h6">Room Number</Typography>
              <input
                required
                type="text"
                value={roomNumber}
                onChange={(e) => setRoomNumber(e.target.value)}
                placeholder="Enter Room Number"
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
            {filteredAndSortedCustomers?.length > 0 ? (
              filteredAndSortedCustomers.map(
                (
                  {
                    name,
                    userMobileNo,
                    roomNo,
                    userName,
                    userIsActive,
                    userId,
                  },
                  index
                ) => {
                  const isLast =
                    index === filteredAndSortedCustomers.length - 1;
                  const classes = isLast
                    ? "p-4"
                    : "p-4 border-b border-blue-gray-50";

                  return (
                    <tr key={userId}>
                      <td className={classes}>
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal"
                        >
                          {name}
                        </Typography>
                      </td>
                      <td className={classes}>
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal"
                        >
                          {userMobileNo}
                        </Typography>
                      </td>
                      <td className={classes}>
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal"
                        >
                          {roomNo}
                        </Typography>
                      </td>
                      <td className={classes}>
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal"
                        >
                          {userName}
                        </Typography>
                      </td>
                      <td className={classes}>
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal"
                        >
                          {userIsActive ? "Active" : "Inactive"}
                        </Typography>
                      </td>
                      <td className={classes}>
                        <Button
                          variant="text"
                          color="red"
                          onClick={() => handleDeleteCustomer(userId)}
                        >
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

export default CreateCustomer;
