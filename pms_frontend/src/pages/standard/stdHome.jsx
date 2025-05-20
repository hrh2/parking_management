import React from 'react';
import { StatisticsCard } from "@/widgets/cards/index.js";
import {
    Typography,
    Button
} from "@material-tailwind/react";
import { FaTicket, FaCar } from "react-icons/fa6";

export function StdHome(props) {
    return (
        <div className="mt-12 min-h-[75vh]">
            <div className="mb-12 grid gap-y-10 gap-x-6 md:grid-cols-2 xl:grid-cols-4">
                <StatisticsCard
                    value={50}
                    title={"Total Tickets"}
                    color={"gray"}
                    icon={<FaTicket />}
                    footer={
                        <Typography className="font-normal text-blue-gray-600">
                            <strong className={"text-black"}>30</strong>
                            &nbsp;Paid Tickets
                        </Typography>
                    }
                />
                <StatisticsCard
                    value={50}
                    title={"Total Vehicles"}
                    color={"gray"}
                    icon={<FaCar />}
                    footer={
                        <Typography className="font-normal text-blue-gray-600">
                            <strong className={"text-black"}>30</strong>
                            &nbsp;Paid Tickets
                        </Typography>
                    }
                />
            </div>

            {/* Add Vehicle Button */}
            <div className="flex justify-start pr-6">
                <Button
                    color="gray"
                    className="rounded-full"
                    onClick={() => {
                        // You can trigger a modal or navigate
                        console.log("Add Vehicle Clicked");
                    }}
                >
                    Add Vehicle
                </Button>
            </div>
        </div>
    );
}

export default StdHome;
