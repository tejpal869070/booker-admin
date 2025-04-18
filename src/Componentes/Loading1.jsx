import React from "react";
import loading1img from "../assets/photos/loadinggif.gif";

export function Loading1({ width }) {
  return (
    <div className="flex justify-center items-center ">
      <img alt="loading" src={loading1img} width={width} height={width} />
    </div>
  );
}

export function Loading2() {
  return (
    <div className="flex justify-center items-center">
      <p>Loading...</p>
    </div>
  );
}

export function Loading3({ width }) {
  return (
    <div className="absolute top-0 left-0 w-screen h-screen bg-gradient-to-r from-black via-gray-900 to-black animate-gradient-fast flex justify-center items-center">
      <div class="border-gray-300 h-20 w-20 animate-spin rounded-full border-8 border-t-blue-600" />
    </div>
  );
}


export function Loading4({ width }) {
  return (
    <div className="    flex justify-center items-center">
      <div class="border-gray-300 h-20 w-20 animate-spin rounded-full border-8 border-t-blue-600" />
    </div>
  );
}

