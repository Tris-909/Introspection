import React from "react";
import { createBrowserRouter } from "react-router-dom";
import { Authentication, Home, NotFound } from "pages";
import { CustomAppBar } from "organisms";
import CheckAuthHandler from "./CheckAuthHandler";

export const routers = createBrowserRouter([
  {
    path: "/",
    element: (
      <CheckAuthHandler>
        <CustomAppBar />
        <Home />
      </CheckAuthHandler>
    ),
  },
  {
    path: "/authenticate",
    element: (
      <CheckAuthHandler>
        <Authentication />
      </CheckAuthHandler>
    ),
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);
