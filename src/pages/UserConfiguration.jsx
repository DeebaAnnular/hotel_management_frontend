import React, { useState } from "react";
import {
  MagnifyingGlassIcon,
  ChevronUpDownIcon,
} from "@heroicons/react/24/outline";
import { PencilIcon, UserPlusIcon } from "@heroicons/react/24/solid";
import {
  Card,
  CardHeader,
  Input,
  Typography,
  Button,
  CardBody,
  Chip,
  CardFooter,
  Tabs,
  TabsHeader,
  Tab,
  Avatar,
  IconButton,
  Tooltip,
} from "@material-tailwind/react";
import CreateCustomer from "../features/userConfig/CreateCustomer";
import Receptionist from "../features/userConfig/Receptionist";
import ServicePerson from "../features/userConfig/ServicePerson";

const TABS = [
  {
    label: "Create Customer",
    value: "create_customer",
  },
  {
    label: "Service Person",
    value: "service_person",
  },
  {
    label: "Receptionist",
    value: "receptionist",
  },
];

const UserConfiguration = () => {
  const [activeTab, setActiveTab] = useState("create_customer");

  return (
    <Card className="h-full w-full bg-primaryBg p-8">
      <div className="flex flex-col items-center justify-between gap-4 md:flex-row ">
        <Tabs value={activeTab} className="w-full md:w-[45%] mb-2 ">
          <TabsHeader>
            {TABS.map(({ label, value }) => (
              <Tab
                key={value}
                value={value}
                onClick={() => setActiveTab(value)}
              >
                &nbsp;&nbsp;{label}&nbsp;&nbsp;
              </Tab>
            ))}
          </TabsHeader>
        </Tabs>
      </div>

      {/* Content for each tab */}
      {activeTab === "create_customer" && <CreateCustomer />}
      {activeTab === "service_person" && <ServicePerson />}
      {activeTab === "receptionist" && <Receptionist />}
    </Card>
  );
};

export default UserConfiguration;
