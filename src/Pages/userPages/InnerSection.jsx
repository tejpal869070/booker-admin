import React from "react";
import { useLocation } from "react-router-dom"; 
import Home from "../Home";
import Desposit from "../../Componentes/Desposit";

export default function InnerSection() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  // get path and query to display content in inner section
  const paramsData = {};
  for (const [key, value] of queryParams.entries()) {
    paramsData[key] = value;
  }

  if (paramsData && paramsData.admin === "deposit") {
    return <div>{<Desposit />}</div>;
  }   
}

 