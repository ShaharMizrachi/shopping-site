import React from "react";
import { top5Unique } from "../../api/api.js";
import { useRef, useEffect, useState } from "react";
import Top5SoldC from "./Top5SoldC.js";
import Top5UniqueC from "./Top5UniqueC.js";
import SalesByTime from "./SalesByTime.js";

const Stats = () => {
  return (
    <div>
      <div>
        <Top5SoldC />
      </div>
      <div className=" row mt-5 col-6 offset-3">
        <Top5UniqueC />
      </div>
      <div>
        <SalesByTime />
      </div>
    </div>
  );
};

export default Stats;
