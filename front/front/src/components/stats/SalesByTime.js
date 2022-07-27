import React from "react";
import { useRef, useEffect, useState } from "react";
import { pastXDaySales } from "../../api/api";
import CanvasJSReact from "../../canvasjs.react";
import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";
import "../../css/SalesByTime.css";

var CanvasJSChart = CanvasJSReact.CanvasJSChart;
var CanvasJS = CanvasJSReact.CanvasJS;

const SalesByTime = () => {
  const [statisticsData, setStatisticsData] = useState(null); // all data we getting from backend server
  const [amountOfDays, setAmountOfDays] = useState(5); // amount of days going back to watch Sales
  const [dataPointStatistic, setDataPointStatistic] = useState(); // the time and totalAmount that going to the graph

  const Sales = async () => {
    const data = await pastXDaySales(amountOfDays);
    setStatisticsData(data.data.data);
  };

  useEffect(() => {
    Sales();
  }, [amountOfDays]);

  useEffect(() => {
    dataPointsBuilder();
  }, [statisticsData]);

  const dataPointsBuilder = () => {
    if (!statisticsData) return;

    const pie = statisticsData.map((sold) => {
      return { x: new Date(sold.date), y: sold.totalSum };
    });
    setDataPointStatistic(pie);
  };

  function preventHorizontalKeyboardNavigation(event) {
    if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
      event.preventDefault();
    }
  }

  return (
    <div className="float-container offset-3">
      <div className="float-child row mt-5">
        <Box sx={{ height: 300 }}>
          <Slider
            sx={{
              '& input[type="range"]': {
                WebkitAppearance: "slider-vertical",
              },
            }}
            orientation="vertical"
            defaultValue={5}
            aria-label="Amount of days"
            valueLabelDisplay="auto"
            onKeyDown={preventHorizontalKeyboardNavigation}
            onChange={(e) => setAmountOfDays(e.target.value)}
          />
        </Box>
      </div>
      <div className="row mt-3 col-7 float-child">
        <CanvasJSChart options={options(dataPointStatistic)} />
      </div>
    </div>
  );
};

const options = (dataPointStatistic) => ({
  animationEnabled: true,
  theme: "light2",
  title: {
    text: "Sales on a daily basis for the past X days",
  },
  axisY: {
    title: "Capacity",
    logarithmic: true,
  },
  data: [
    {
      type: "spline",
      showInLegend: true,
      legendText: "Date",
      dataPoints: dataPointStatistic,
    },
  ],
});

export default SalesByTime;
