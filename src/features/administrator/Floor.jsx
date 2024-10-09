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
} from "@material-tailwind/react";
import { MdClose } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllFloorDetails,
  selectFloorDetails,
  createFloorName,
  deleteFloorName,
} from "../../redux/slices/floorSlice";

const TABLE_HEAD = ["Floor Name", "Action"];

const Floor = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen((cur) => !cur);
  const [floorName, setFloorName] = useState("");
  const [data, setData] = useState([]);

  const dispatch = useDispatch();
  const floorNames = useSelector(selectFloorDetails);

  const {
    floorDetails = [],
    floorDetailsLoading,
    floorDetailsError,
  } = useSelector((state) => state.floor || {});

  const pageNo = 1; // Set the page number you want to fetch
  const pageSize = 50; // Set the desired page size

  useEffect(() => {
    const fetchFloorDetails = async () => {
      const data = await dispatch(getAllFloorDetails({ pageNo, pageSize }));
      setData(data);
    };
    fetchFloorDetails();
  }, [dispatch, pageNo, pageSize]);

  const filteredAndSortedRows = useMemo(() => {
    let result = floorNames?.filter((row) =>
      row.floorName?.toLowerCase().includes(searchQuery.trim().toLowerCase())
    );

    result.sort((a, b) => {
      return sortOrder === "asc"
        ? a.floorName.localeCompare(b.floorName)
        : b.floorName.localeCompare(a.floorName);
    });

    return result;
  }, [searchQuery, sortOrder, floorDetails]);

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  const handleCreateFloor = async () => {
    await dispatch(createFloorName(floorName));
    alert("Floor successfully added!");
    const data = await dispatch(getAllFloorDetails({ pageNo, pageSize }));
    setData(data);
    setFloorName("");
    handleOpen();
  };

  const handleDeleteFloorName = async (floorId) => {
    await dispatch(deleteFloorName(floorId)); // Ensure you await the delete action
    const data = await dispatch(getAllFloorDetails({ pageNo, pageSize }));
    setData(data);
    alert("Floor successfully deleted!"); // Show success message
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
              Create Floor
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
              <Typography variant="h4" color="blue-gray" className="font-semibold">
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
                const classes = isLast ? "p-4" : "p-4 border-b border-blue-gray-50";

                return (
                  <tr key={index} className="even:bg-blue-gray-50/50">
                    <td className={classes}>
                      <Typography variant="small" color="blue-gray" className="font-normal">
                        {floorName}
                      </Typography>
                    </td>
                    <td className={classes}>
                      <Button
                        variant="text"
                        color="red"
                        className="flex items-center gap-1"
                        onClick={() => handleDeleteFloorName(floorId)} // Updated function name
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
          Page 1 of 10
        </Typography>
        <div className="flex gap-2">
          <Button variant="outlined" size="sm">
            Previous
          </Button>
          <Button variant="outlined" size="sm">
            Next
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default Floor;
