import {
  MagnifyingGlassIcon,
  ChevronUpDownIcon,
} from "@heroicons/react/24/outline";
import { MdClose } from "react-icons/md"; // Close icon
import {
  Card,
  Input,
  Typography,
  Button,
  CardBody,
  CardFooter,
  Dialog,
} from "@material-tailwind/react";
import { useState, useEffect, useMemo } from "react";
import {
  createUser,
  getAllServicePersonDetail,
  deleteUserDetail,
} from "../../redux/slices/userConfigSlice";
import { useSelector, useDispatch } from "react-redux";

const TABLE_HEAD = ["Employee ID", "Name", "Number", "Status", "Action"];

const ServicePerson = () => {
  const [open, setOpen] = useState(false);
  const [servicePersonName, setServicePersonName] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [gender, setGender] = useState("");
  const [servicePersonList, setServicePersonList] = useState([]);
  const [sortOrder, setSortOrder] = useState("asc");
  const [searchQuery, setSearchQuery] = useState("");
  const [pageNo, setPageNo] = useState(1);
  const pageSize = 50;
  const dispatch = useDispatch();

  const fetchData = async () => {
    try {
      const action = await dispatch(
        getAllServicePersonDetail({ pageNo, pageSize })
      );
      if (getAllServicePersonDetail.fulfilled.match(action)) {
        setServicePersonList(action.payload);
      }
    } catch (error) {
      console.error("Error fetching service person data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [dispatch]);

  const filteredAndSortedServicePerson = useMemo(() => {
    let result = servicePersonList.filter((customer) => {
      const lowerCaseSearchQuery = searchQuery.trim().toLowerCase();
      return (
        customer.name?.toLowerCase().includes(lowerCaseSearchQuery) ||
        customer.employeeId?.toLowerCase().includes(lowerCaseSearchQuery)
      );
    });

    result.sort((a, b) => {
      return sortOrder === "asc"
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name);
    });

    return result;
  }, [searchQuery, sortOrder, servicePersonList]);

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  const handleCreateServicePerson = async () => {
    const newServicePerson = {
      name: servicePersonName,
      employeeId: employeeId,
      userType: "SERVICE",
      userMobileNo: phoneNumber,
      userName: username,
      userPassword: password,
      userGender: gender,
    };
    try {
      await dispatch(createUser(newServicePerson)).unwrap();
      alert("Service Person Created Successfully");
      fetchData();
      resetForm();
      handleOpen();
    } catch (error) {
      console.error("Error creating service person:", error);
      alert("Error Occurred While Creating User");
    } finally {
      handleClose();
    }
  };

  const resetForm = () => {
    setServicePersonName("");
    setEmployeeId("");
    setPhoneNumber("");
    setUsername("");
    setPassword("");
    setGender("");
  };

  const handleOpen = () => setOpen(!open);

  const handleDeleteServicePerson = async (userId) => {
    try {
      await dispatch(deleteUserDetail(userId)).unwrap();
      await fetchData();
      alert("Service Person Deleted Successfully");
    } catch (error) {
      alert("Error Occurred While Deleting User");
      console.error(error);
    }
  };

  const handleNextPage = () => setPageNo((prev) => prev + 1);
  const handlePreviousPage = () => setPageNo((prev) => Math.max(prev - 1, 1));

  return (
    <Card className="h-full w-full">
      <div className="p-4 w-full flex items-center justify-center">
        <div className="  w-full flex justify-between items-center">
          <Typography variant="h5" color="blue-gray" className="font-semibold">
            Service Person Details
          </Typography>
          <div className="flex gap-2 items-center justify-center">
            <div className="relative flex w-full max-w-[24rem]">
              <Input
                type="text"
                label="Search Service Person"
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
                Add Service Person
              </Typography>

              {/* Form Fields */}
              {[
                {
                  label: "Name",
                  value: servicePersonName,
                  setValue: setServicePersonName,
                },
                {
                  label: "Employee ID",
                  value: employeeId,
                  setValue: setEmployeeId,
                },
                {
                  label: "Phone Number",
                  value: phoneNumber,
                  setValue: setPhoneNumber,
                  type: "tel",
                },
                { label: "Username", value: username, setValue: setUsername },
                {
                  label: "Password",
                  value: password,
                  setValue: setPassword,
                  type: "password",
                },
              ].map(({ label, value, setValue, type = "text" }) => (
                <div className="flex flex-col gap-2" key={label}>
                  <Typography variant="h6">{label}</Typography>
                  <input
                    required
                    type={type}
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    placeholder={`Enter ${label}`}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-700 focus:border-transparent"
                  />
                </div>
              ))}

              {/* Gender Selection */}
              <div className="flex flex-col gap-2">
                <Typography variant="h6">Gender</Typography>
                <div className="flex items-center gap-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="male"
                      checked={gender === "male"}
                      onChange={(e) => setGender(e.target.value)}
                      className="mr-2"
                    />
                    Male
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="female"
                      checked={gender === "female"}
                      onChange={(e) => setGender(e.target.value)}
                      className="mr-2"
                    />
                    Female
                  </label>
                </div>
              </div>
            </CardBody>
            <CardFooter className="pt-4 flex justify-center">
              <Button
                onClick={handleCreateServicePerson}
                className="bg-greenbtnColor px-6"
              >
                Submit
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
                  className="cursor-pointer border-y border-blue-gray-100 bg-blue-gray-50/50 p-4 transition-colors hover:bg-blue-gray-50"
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
            {filteredAndSortedServicePerson.length > 0 ? (
              filteredAndSortedServicePerson.map((customer, index) => {
                const isLast =
                  index === filteredAndSortedServicePerson.length - 1;
                const classes = isLast
                  ? "p-4"
                  : "p-4 border-b border-blue-gray-50";

                return (
                  <tr key={customer.id}>
                    <td className="border-b border-blue-gray-100 p-4">
                      {customer.employeeId}
                    </td>
                    <td className="border-b border-blue-gray-100 p-4">
                      {customer.name}
                    </td>
                    <td className="border-b border-blue-gray-100 p-4">
                      {customer.userMobileNo}
                    </td>
                    <td className="border-b border-blue-gray-100 p-4">
                      {customer.userActive ? "Active" : "Inactive"}
                    </td>
                    <td className={classes}>
                      <Button
                        variant="text"
                        color="red"
                        onClick={() =>
                          handleDeleteServicePerson(customer.userId)
                        }
                      >
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

export default ServicePerson;
