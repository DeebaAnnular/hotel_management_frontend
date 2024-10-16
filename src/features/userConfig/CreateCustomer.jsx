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
  Select,
  Option,
} from "@material-tailwind/react";
import { useEffect, useState, useMemo } from "react";
import {
  createUser,
  getAllCustomerDetail,
  deleteUserDetail,
  selectCustomerList,
} from "../../redux/slices/userConfigSlice";
import { useSelector, useDispatch } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
  const [customerData, setCustomerData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [totalRecords, setTotalRecords] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectKey, setSelectKey] = useState(0);
  const [formError, setFormError] = useState("");

  const dispatch = useDispatch();

  const { customerListError, postUserDetailsError,  deleteUserDetailError} =
    useSelector((state) => state.user);

  const handleOpen = () => setOpen(!open);

  const fetchData = async (currentPage, pageSize) => {
    try {
      const action = await dispatch(
        getAllCustomerDetail({pageNo:currentPage, pageSize })
      );
      if (getAllCustomerDetail.fulfilled.match(action)) {
        console.log("customer data", action.payload);
        setCustomerData(action.payload.usersPage);
        setTotalRecords(action.payload.totalRecords);
        setTotalPages(Math.ceil(action.payload.totalRecords / pageSize));
      }
      else{
        setCustomerData([]);
        toast.error(customerListError)
      }
    } catch (error) {
      console.error("Error fetching customer data:", error);
    }
  };

  useEffect(() => {
    fetchData(currentPage, pageSize);
  }, [currentPage, pageSize, dispatch]);

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

  const validateForm = () => {
    const errors = {};

    if (!customerName) errors.customerName = "Customer name is required.";
    if (!phoneNumber) {
      errors.phoneNumber = "Phone number is required.";
    } else if (!/^\d{10}$/.test(phoneNumber)) {
      errors.phoneNumber = "Phone number must be 10 digits.";
    }
    if (!roomNumber) errors.roomNumber = "Room number is required.";
    if (!username) errors.username = "Username is required.";
    if (!password) errors.password = "Password is required.";

    setFormError(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCreateCustomer = async () => {
    if (!validateForm()) return; // Don't proceed if validation fails

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
      toast.success("Customer Created Successfully");
      const action = await dispatch(getAllCustomerDetail({ pageNo:currentPage, pageSize }));
      setCustomerData(action.payload.usersPage);
      resetForm();
      handleOpen();
    } catch (error) {
      console.error(error);
      toast.error(postUserDetailsError || "Error happend while creating user")
      // alert("Error Occurred While Creating User");
      
    }
  };

  const resetForm = () => {
    setCustomerName("");
    setPhoneNumber("");
    setRoomNumber("");
    setUsername("");
    setPassword("");
    setFormError({});
  };

  const handleDeleteCustomer = async (customerId) => {
    try {
      await dispatch(deleteUserDetail(customerId)).unwrap();
      await fetchData(currentPage, pageSize);
      toast.success("Customer Deleted Successfully");
    } catch (error) {
      console.error(error);
      toast.error(deleteUserDetailError ||error)
     
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
                className={`w-full px-4 py-2 border ${
                  formError.customerName ? "border-red-500" : "border-gray-300"
                } rounded-md focus:outline-none focus:ring-2 ${
                  formError.customerName
                    ? "focus:ring-red-500"
                    : "focus:ring-gray-700"
                } focus:border-transparent`}
              />
              {formError.customerName && (
                <p className="text-red-500 text-sm">{formError.customerName}</p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <Typography variant="h6">Phone Number</Typography>
              <input
                required
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="Enter Phone Number"
                className={`w-full px-4 py-2 border ${
                  formError.phoneNumber ? "border-red-500" : "border-gray-300"
                } rounded-md focus:outline-none focus:ring-2 ${
                  formError.phoneNumber
                    ? "focus:ring-red-500"
                    : "focus:ring-gray-700"
                } focus:border-transparent`}
              />
              {formError.phoneNumber && (
                <p className="text-red-500 text-sm">{formError.phoneNumber}</p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <Typography variant="h6">Room Number</Typography>
              <input
                required
                type="text"
                value={roomNumber}
                onChange={(e) => setRoomNumber(e.target.value)}
                placeholder="Enter Room Number"
                className={`w-full px-4 py-2 border ${
                  formError.roomNumber ? "border-red-500" : "border-gray-300"
                } rounded-md focus:outline-none focus:ring-2 ${
                  formError.roomNumber
                    ? "focus:ring-red-500"
                    : "focus:ring-gray-700"
                } focus:border-transparent`}
              />
              {formError.roomNumber && (
                <p className="text-red-500 text-sm">{formError.roomNumber}</p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <Typography variant="h6">Username</Typography>
              <input
                required
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter Username"
                className={`w-full px-4 py-2 border ${
                  formError.username ? "border-red-500" : "border-gray-300"
                } rounded-md focus:outline-none focus:ring-2 ${
                  formError.username
                    ? "focus:ring-red-500"
                    : "focus:ring-gray-700"
                } focus:border-transparent`}
              />
              {formError.username && (
                <p className="text-red-500 text-sm">{formError.username}</p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <Typography variant="h6">Password</Typography>
              <input
                required
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter Password"
                className={`w-full px-4 py-2 border ${
                  formError.password ? "border-red-500" : "border-gray-300"
                } rounded-md focus:outline-none focus:ring-2 ${
                  formError.password
                    ? "focus:ring-red-500"
                    : "focus:ring-gray-700"
                } focus:border-transparent`}
              />
              {formError.password && (
                <p className="text-red-500 text-sm">{formError.password}</p>
              )}
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

export default CreateCustomer;
