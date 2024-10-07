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
import CustomrTask from "../features/tasks/CustomrTask";
import GeneralTask from "../features/tasks/GeneralTask";

const TABS = [
  {
    label: "General Task",
    value: "general",
  },
  {
    label: "Customer Task",
    value: "customer",
  },
];

const FloorAndRoom = () => {
  const [activeTab, setActiveTab] = useState("general");

  return (
    <Card className="h-full w-full bg-primaryBg p-8">
      <div className="flex flex-col items-center justify-between gap-4 md:flex-row ">
        <Tabs value={activeTab} className="w-full md:w-[30%] mb-2 ">
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
      {activeTab === "general" && (
        <div className="flex items-center justify-center h-[90%] w-full">
          <GeneralTask />
        </div>
      )}
      {activeTab === "customer" && (
        <div className="flex items-center justify-center h-[90%] w-full">
          <CustomrTask />
        </div>
      )}
    </Card>
  );
};

export default FloorAndRoom;
