import React from "react";
import CanvasJSReact from "../../canvasjs.react";
import { top5Unique } from "../../api/api.js";
import { useEffect } from "react";
import { useState } from "react";
import { useRef } from "react";

const Top5UniqueC = () => {
  var CanvasJS = CanvasJSReact.CanvasJS;
  var CanvasJSChart = CanvasJSReact.CanvasJSChart;

  const [statisticsData, setStatisticsData] = useState(null); // all data we getting from backend server
  const [pieData, setPieData] = useState([]); // array of jsons for dataPoints filed in options

  const ref = useRef(null);

  const getStatistics = async () => {
    const dataTop5Unique = await top5Unique();
    setStatisticsData({ Top5Unique: dataTop5Unique.data.data });
  };

  useEffect(() => {
    getStatistics();
  }, []);

  useEffect(() => {
    dataPointsBuilder();
  }, [statisticsData]);

  const dataPointsBuilder = () => {
    if (!statisticsData) return;

    const pie = statisticsData.Top5Unique.map((sold) => {
      return { y: sold.count, label: sold.productTitle };
    });

    setPieData(pie);
  };

  return (
    <div>
      <CanvasJSChart options={options(pieData)} ref={ref} />
    </div>
  );
};

const options = (pieData) => ({
  animationEnabled: true,
  theme: "light2", // "light1", "light2", "dark1", "dark2"
  title: {
    text: "Top 5 sold Unique",
  },
  axisY: {
    title: "Amount of Downloads",
    // scaleBreaks: {
    //   autoCalculate: true,
    // },
  },
  axisX: {
    title: "Products",
    labelAngle: 0,
  },
  data: [
    {
      type: "column",
      dataPoints: pieData,
    },
  ],
});

export default Top5UniqueC;
