import React from "react";
import { useLocation } from "react-router-dom"; 
import Desposit from "../../Componentes/Desposit";
import Withdrawals from "../../Componentes/Withdrawals"; 
import Games from "../../Componentes/Games";

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
  } else if (paramsData && paramsData.admin === "withdrawal") {
    return <div>{<Withdrawals />}</div>;
  } else if (paramsData && paramsData.admin === "games-control") {
    return <div>{<Games />}</div>;
  }
}
