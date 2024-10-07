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
import Floor from "../features/administrator/Floor";
import Room from "../features/administrator/Room";

const TABS = [
  {
    label: "Floor",
    value: "floor",
  },
  {
    label: "Room",
    value: "room",
  },
];

const FloorAndRoom = () => {
  const [activeTab, setActiveTab] = useState("floor");

  return (
    <Card className="h-full w-full bg-primaryBg p-8">
      <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
        <Tabs value={activeTab} className="w-full md:w-max mb-2">
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
      {activeTab === "floor" && (
        <div className="flex items-center justify-center h-[90%] w-full">
          <Floor />
        </div>
      )}
      {activeTab === "room" && (
        <div className="flex items-center justify-center h-[90%] w-full">
          <Room />
        </div>
      )}
    </Card>
  );
};

export default FloorAndRoom;
