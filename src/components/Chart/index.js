import React from "react"
import { useStore } from "../../stores/global"
import { observer } from "mobx-react"
import Chart from "react-apexcharts"
import Box from "@material-ui/core/Box"

export default observer(props => {
  const {
    townCounts,
    selectedDataType,
    selectedTowns,
    getTownData,
  } = useStore()

  if (Object.keys(townCounts).length === 0) return null

  let headerValues = Object.values(townCounts)[0].counts.map(c => {
    return c.shortDateStr
  })

  const series = selectedTowns.map(name => {
    const townData = getTownData(name)

    return {
      name,
      data: townData.counts.map(x => {
        switch (selectedDataType) {
          case "raw":
            return x.changeSinceLastCount
            break
          case "normalized":
            return x.changePer100k
            break
          case "two-week-average":
            return x.twoCountAverageChange
            break
          default:
            return x.changeSinceLastCount
        }
      }),
    }
  })

  const options = {
    xaxis: {
      categories: headerValues.slice(1),
    },
    yaxis: {
      title: {
        text:
          selectedDataType === "raw"
            ? "Weekly new case count"
            : "Weekly new cases per 100k residents",
      },
    },
    stroke: {
      curve: "smooth",
      width: 2,
    },
    height: "75vh",
    legend: {
      fontSize: "20px",
      itemMargin: {
        horizontal: 10,
      },
    },
  }

  return (
    <Box
      style={{
        height: "65vh",
      }}
    >
      <Chart options={options} series={series} type="line" height="100%" />
    </Box>
  )
})
