import React from "react";
import { Navigate } from "react-router-dom";

//Dashboard
// import DashboardAnalytics from "../pages/DashboardAnalytics";
import DashboardCrm from "../pages/DashboardCrm";

//login
import Login from "../pages/Authentication/Login";

// // User Profile
import UserProfile from "../pages/Authentication/user-profile";

import MessageType from "../pages/whatsapp/MessageType";
import MessageSend from "../pages/whatsapp/MessageSend";
import MessageReceive from "../pages/whatsapp/MessageReceive";


const authProtectedRoutes = [

  { path: "/message-type", component: <MessageType /> },
  { path: "/message-send", component: <MessageSend /> },
  { path: "/message-receive", component: <MessageReceive/> },

  // //User Profile
  { path: "/profile", component: <UserProfile /> },

  {
    path: "/",
    exact: true,
    component: <Navigate to="/dashboard" />,
  },
  { path: "*", component: <Navigate to="/dashboard" /> },
];

const publicRoutes = [
  // { path: "/dashboard", component: <DashboardCrm /> },
  { path: "/", component: <Login /> },
];

export { authProtectedRoutes, publicRoutes };
