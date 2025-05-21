import {
  HomeIcon,
  UserCircleIcon,
  TableCellsIcon,
  InformationCircleIcon,
  ServerStackIcon,
  RectangleStackIcon,
} from "@heroicons/react/24/solid";
import { Home, Profile, Tables, Notifications } from "@/pages/dashboard";
import {Otp, SignIn, SignUp} from "@/pages/auth";
import ResetPassword from "@/pages/auth/ResetPassword.jsx";
import{ StdHome,Booking,Stations} from "@/pages/standard";
import {ClientVehiclesList} from "@/pages/standard/ClientVehiclesList.jsx";
import StationList from "@/pages/standard/StationList.jsx";
import AvailableSlotsTable from "@/pages/standard/AvailableSlotsTable.jsx";
import BookingRequests from "@/pages/dashboard/BookingRequests.jsx";
import {LuCircleParking, LuTicketsPlane} from "react-icons/lu";
import {IoCarSportSharp} from "react-icons/io5";
import {RxSpaceEvenlyVertically} from "react-icons/rx";
import {FaRegBookmark} from "react-icons/fa";
import TicketList from "@/pages/standard/TicketList.jsx";
import Tickets from "@/pages/dashboard/Tickets.jsx";
import {FaCar} from "react-icons/fa6";

const icon = {
  className: "w-5 h-5 text-inherit",
};

export const routes = [
  {
    title: "ADMIN",
    layout: "ADMIN",
    pages: [
      {
        icon: <HomeIcon {...icon} />,
        name: "dashboard",
        path: "/",
        element: <Home />,
      },
      {
        icon: <UserCircleIcon {...icon} />,
        name: "profile",
        path: "/profile",
        element: <Profile />,
      },
      {
        icon: <RxSpaceEvenlyVertically {...icon} />,
        name: "Parking Spots",
        path: "/slots",
        element: <AvailableSlotsTable/>,
      },
      {
        icon: <LuCircleParking  {...icon}/>,
        name: "Stations",
        path: "/stations",
        element: <StationList />,
      },
      {
        icon: <IoCarSportSharp {...icon} />,
        name: "Vehicles",
        path: "/vehicles",
        element: <ClientVehiclesList/>,
      },
      {
        icon: <FaRegBookmark {...icon} />,
        name: "Booking Requests",
        path: "/bookings",
        element: <BookingRequests/>,
      },
      {
        icon: <LuTicketsPlane  {...icon} />,
        name: "All Tickets",
        path: "/all",
        element: <Tickets/>,
      },
      {
        icon: <LuTicketsPlane  {...icon} />,
        name: "My Tickets",
        path: "/tickets",
        element: <TicketList/>,
      },
    ],
  },
  {
    title: "Home",
    layout: "STANDARD",
    pages: [
      {
        icon: <HomeIcon {...icon} />,
        name: "Home",
        path: "/",
        element: <StdHome />,
      },
      {
        icon: <UserCircleIcon {...icon} />,
        name: "profile",
        path: "/profile",
        element: <Profile />,
      },
      {
        icon: <FaCar  {...icon} />,
        name: "Vehicles",
        path: "/vehicles",
        element: <ClientVehiclesList/>,
      },
      {
        icon: <RxSpaceEvenlyVertically {...icon} />,
        name: "Parking Spots",
        path: "/slots",
        element: <AvailableSlotsTable/>,
      },
      {
        icon: <TableCellsIcon {...icon} />,
        name: "Booking",
        path: "/bookings",
        element: <Booking/>,
      },
      {
        icon: <LuTicketsPlane  {...icon} />,
        name: "My Tickets",
        path: "/tickets",
        element: <TicketList/>,
      },
    ],
  },
  {
    title: "auth pages",
    layout: "auth",
    pages: [
      {
        icon: <ServerStackIcon {...icon} />,
        name: "sign in",
        path: "/sign-in",
        element: <SignIn />,
      },
      {
        icon: <ServerStackIcon {...icon} />,
        name: "OTP",
        path: "/otp/:email",
        element: <Otp />,
      },
      {
        icon: <ServerStackIcon {...icon} />,
        name: "Reset password",
        path: "/reset-password",
        element: <ResetPassword />,
      },
      {
        icon: <RectangleStackIcon {...icon} />,
        name: "sign up",
        path: "/sign-up",
        element: <SignUp />,
      },
    ],
  },
];

export default routes;
