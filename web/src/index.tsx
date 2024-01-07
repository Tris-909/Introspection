import React from "react";
import ReactDOM from "react-dom/client";
import CssBaseline from "@mui/material/CssBaseline";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <React.StrictMode>
    <CssBaseline />
    <h1> The very start of Introspection Web App </h1>
    {process.env.REACT_APP_ENV}
  </React.StrictMode>
);
