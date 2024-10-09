import React from "react";
import {
  Card,
  Typography,
  List,
  ListItem,
  ListItemPrefix,
  Accordion,
  AccordionHeader,
  AccordionBody,
} from "@material-tailwind/react";
import { ChevronRightIcon, ChevronDownIcon } from "@heroicons/react/24/outline";
import { GrUserManager } from "react-icons/gr";
import { FiCoffee } from "react-icons/fi";
import {
  MdOutlineAdminPanelSettings,
  MdOutlineShoppingCartCheckout,
} from "react-icons/md";
import hotelLogo from "../assets/hotelLogo.png";
import { Link } from "react-router-dom";

const Sidebar = () => {
  const [open, setOpen] = React.useState(0);

  const handleOpen = (value) => {
    setOpen(open === value ? 0 : value);
  };

  return (
    <Card className="h-[calc(100vh)] w-full max-w-[17rem] p-4 shadow-xl shadow-blue-gray-900/5 border-l-2 border-[#228b22]">
      <div className="mb-2 p-4 w-full flex items-center justify-center">
        <img src={hotelLogo} className="w-24" />
      </div>
      <List>
        <Accordion
          open={open === 1}
          icon={
            <ChevronDownIcon
              strokeWidth={2.5}
              className={`mx-auto h-4 w-4 transition-transform ${
                open === 1 ? "rotate-180" : ""
              }`}
            />
          }
        >
          <ListItem className="p-0" selected={open === 1}>
            <AccordionHeader
              onClick={() => handleOpen(1)}
              className="border-b-0 p-3"
            >
              <ListItemPrefix>
                <MdOutlineAdminPanelSettings className="h-5 w-5" />
              </ListItemPrefix>
              <Typography color="blue-gray" className="mr-auto font-normal">
                Adminstrator
              </Typography>
            </AccordionHeader>
          </ListItem>
          <AccordionBody className="py-1">
            <List className="p-0">
              <Link to="/layout/floorandroom">
                <ListItem>
                  <ListItemPrefix>
                    <ChevronRightIcon strokeWidth={3} className="h-3 w-5" />
                  </ListItemPrefix>
                  Config Floor & Room
                </ListItem>
              </Link>
              <Link to="/layout/taskmanagement">
                <ListItem>
                  <ListItemPrefix>
                    <ChevronRightIcon strokeWidth={3} className="h-3 w-5" />
                  </ListItemPrefix>
                  Task Management
                </ListItem>
              </Link>
              <Link to="/layout/user_management">
                <ListItem>
                  <ListItemPrefix>
                    <ChevronRightIcon strokeWidth={3} className="h-3 w-5" />
                  </ListItemPrefix>
                  User Config
                </ListItem>
              </Link>
            </List>
          </AccordionBody>
        </Accordion>
        <Link to="/layout/break_management">
          <ListItem className="border-b-0 p-3" selected={open === 1}>
            <ListItemPrefix>
              <FiCoffee className="h-5 w-5" />
            </ListItemPrefix>
            <Typography color="blue-gray" className="mr-auto font-normal">
              Break Managemaent
            </Typography>
          </ListItem>
        </Link>
        <Link to="/layout/general_request">
          <ListItem className="border-b-0 p-3" selected={open === 1}>
            <ListItemPrefix>
              <MdOutlineShoppingCartCheckout className="h-5 w-5" />
            </ListItemPrefix>
            <Typography color="blue-gray" className="mr-auto font-normal">
              General Request
            </Typography>
          </ListItem>
        </Link>
        <Link to="/layout/customer_request">
          <ListItem className="border-b-0 p-3" selected={open === 1}>
            <ListItemPrefix>
              <MdOutlineShoppingCartCheckout className="h-5 w-5" />
            </ListItemPrefix>
            <Typography color="blue-gray" className="mr-auto font-normal">
              Customer Request
            </Typography>
          </ListItem>
        </Link>
      </List>
    </Card>
  );
};

export default Sidebar;
