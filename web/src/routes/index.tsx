import React from "react";
import { createBrowserRouter } from "react-router-dom";
import { Authentication, Home } from "pages";
import CheckAuthHandler from "./CheckAuthHandler";

export const routers = createBrowserRouter([
  {
    path: "/",
    element: (
      <CheckAuthHandler>
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
]);
