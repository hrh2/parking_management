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
        icon: <TableCellsIcon {...icon} />,
        name: "tables",
        path: "/tables",
        element: <Tables />,
      },
      // {
      //   icon: <InformationCircleIcon {...icon} />,
      //   name: "notifications",
      //   path: "/notifications",
      //   element: <Notifications />,
      // },
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
        icon: <TableCellsIcon {...icon} />,
        name: "Stations",
        path: "/stations",
        element: <Stations/>,
      },
      {
        icon: <TableCellsIcon {...icon} />,
        name: "Booking",
        path: "/bookings",
        element: <Booking/>,
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
