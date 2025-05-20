import React from 'react';
import { StatisticsCard } from "@/widgets/cards/index.js";
import {
    Typography,
    Button
} from "@material-tailwind/react";
import { FaTicket, FaCar } from "react-icons/fa6";
import {usePopup} from "@/context/PopupContext.jsx";
import {AddVehicleForm} from "@/widgets/cards/AddVehicle.jsx";
import {ClientVehiclesList} from "@/pages/standard/ClientVehiclesList.jsx";

export function StdHome() {
    const { showPopup } = usePopup();

    const handleClick = () => {
        showPopup(
            <AddVehicleForm/>
        );
    };
    return (
        <div className="mt-12 min-h-[75vh]">
            {/*<div className="mb-12 grid gap-y-10 gap-x-6 md:grid-cols-2 xl:grid-cols-4">*/}
            {/*    <StatisticsCard*/}
            {/*        value={50}*/}
            {/*        title={"Total Tickets"}*/}
            {/*        color={"gray"}*/}
            {/*        icon={<FaTicket />}*/}
            {/*        footer={*/}
            {/*            <Typography className="font-normal text-blue-gray-600">*/}
            {/*                <strong className={"text-black"}>30</strong>*/}
            {/*                &nbsp;Paid Tickets*/}
            {/*            </Typography>*/}
            {/*        }*/}
            {/*    />*/}
            {/*    <StatisticsCard*/}
            {/*        value={50}*/}
            {/*        title={"Total Vehicles"}*/}
            {/*        color={"gray"}*/}
            {/*        icon={<FaCar />}*/}
            {/*        footer={*/}
            {/*            <Typography className="font-normal text-blue-gray-600">*/}
            {/*                <strong className={"text-black"}>30</strong>*/}
            {/*                &nbsp;Paid Tickets*/}
            {/*            </Typography>*/}
            {/*        }*/}
            {/*    />*/}
            {/*</div>*/}

            {/* Add Vehicle Button */}
            <div className="flex justify-start pr-6">
                <Button
                    color="gray"
                    className="rounded-full"
                    onClick={handleClick}
                >
                    Add Vehicle
                </Button>
            </div>
            <ClientVehiclesList title="My Assets" />
        </div>
    );
}

export default StdHome;
