import React from "react";
import CanvasJSReact from "../../canvasjs.react";
import { top5Sold, top5Unique } from "../../api/api.js";
import { useEffect } from "react";
import { useState } from "react";
import { useRef } from "react";

const Top5SoldC = () => {
  var CanvasJS = CanvasJSReact.CanvasJS;
  var CanvasJSChart = CanvasJSReact.CanvasJSChart;

  const [statisticsData, setStatisticsData] = useState(null); // all data we getting from backend server
  const [pieData, setPieData] = useState([]); // array of jsons for dataPoints filed in options

  const ref = useRef(null);

  const getStatistics = async () => {
    const dataTop5Sold = await top5Sold();
    setStatisticsData({ Top5Sold: dataTop5Sold.data.data });
  };

  useEffect(() => {
    getStatistics();
  }, []);

  useEffect(() => {
    dataPointsBuilder();
  }, [statisticsData]);

  const dataPointsBuilder = () => {
    if (!statisticsData) return;

    const pie = statisticsData.Top5Sold.map((sold) => {
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
  exportEnabled: true,
  animationEnabled: true,
  title: {
    text: "Top 5 sold products",
  },
  data: [
    {
      type: "pie",
      startAngle: 75,
      toolTipContent: "<b>{label}</b>: {y}%",
      showInLegend: "true",
      legendText: "{label}",
      indexLabelFontSize: 16,
      indexLabel: "{label} - {y}%",
      dataPoints: pieData,
    },
  ],
});

export default Top5SoldC;
