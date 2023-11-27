import React from "react";
import { Navigate } from "react-router-dom";

//Dashboard
// import DashboardAnalytics from "../pages/DashboardAnalytics";
import DashboardCrm from "../pages/DashboardCrm";

import MessageRecv from "../pages/Messages/MessageRecv";
import MessageSend from "../pages/Messages/MessageSend";
import MessageType from "../pages/Messages/MessageType";
// import CountryN from "../pages/adminZiya/LocationSetUp/Country/CountryN";
// import City from "../pages/adminZiya/LocationSetUp/City/City";
// import State from "../pages/adminZiya/LocationSetUp/State/State";
// import ZiyaLocation from "../pages/adminZiya/LocationSetUp/ZiyaLocation";

// import GoldPrice from "../pages/adminZiya/PriceTag/GoldPrice";
// import SilverPrice from "../pages/adminZiya/PriceTag/SilverPrice";
// import GoldKarat from "../pages/adminZiya/PriceTag/GoldKarat";
import InquiryDetails from "../pages/adminZiya/ContactUs/ContactUs";

// import Test from '../pages/Test'

//login
import Login from "../pages/Authentication/Login";
import TopProducts from "../pages/adminZiya/TopProducts/TopProducts";

// // User Profile
import UserProfile from "../pages/Authentication/user-profile";
import Category from "../pages/adminZiya/Products/Category";
import CategoryProduct from "../pages/adminZiya/Products/ProductCategory";
import ManageMedia from "../pages/adminZiya/Media/ManageMedia";
import MediaPlayList from "../pages/adminZiya/Media/MediaPlayList";

// import FileManager from "../pages/FileManager";
// import ToDoList from "../pages/ToDo";

const authProtectedRoutes = [
  // { path: "/dashboard", component: <DashboardCrm /> },
  // { path: "/country", component: <CountryN /> },
  // { path: "/city", component: <City /> },
  // { path: "/state", component: <State /> },
  // { path: "/ziya-location", component: <ZiyaLocation /> },

  // { path: "/gold-price", component: <GoldPrice /> },
  // { path: "/silver-price", component: <SilverPrice /> },
  // { path: "/gold-karat", component: <GoldKarat /> },
  { path: "/top-products", component: <TopProducts /> },
  { path: "/category-products", component: <CategoryProduct /> },

  { path: "/category", component: <Category /> },
  { path: "/inquiry-details", component: <InquiryDetails /> },

  { path: "/manage-media", component: <ManageMedia /> },
  { path: "/media-playlist", component: <MediaPlayList /> },

  // { path: "/test", component: <Test /> },
  { path: "/message-recv", component: <MessageRecv /> },
  { path: "/message-send", component: <MessageSend /> },
  { path: "/message-type", component: <MessageType /> },

  // //User Profile
  { path: "/profile", component: <UserProfile /> },

  // this route should be at the end of all other routes
  // eslint-disable-next-line react/display-name
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
