import React, { useMemo } from "react"
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

  const series = selectedTowns.map(name => {
    const townData = getTownData(name)

    if (!townData) return []

    const counts = townData.counts.map(x => {
      switch (selectedDataType) {
        case "raw":
          return x.changeSinceLastCount
        case "normalized":
          return x.changePer100k
        case "two-week-average":
          return x.twoCountAverageChange
        default:
          return x.changeSinceLastCount
      }
    })

    return {
      name,
      data: counts.slice(1),
    }
  })

  const xAxisLabels = useMemo(() => {
    const items = Object.values(townCounts)[0].counts.map(c => {
      return c.shortDateStr
    })
    return items
  }, [townCounts])

  const yAxisLabel = useMemo(() => {
    switch (selectedDataType) {
      case "raw":
        return "Weekly new case count"
        break
      case "normalized":
        return "Weekly new cases per 100k residents"
        break
      case "two-week-average":
        return "Two-week average of weekly new cases"
        break
      default:
        return "Weekly new case count"
    }
  }, [selectedDataType])

  const options = {
    annotations: {
      xaxis: [
        {
          x: "5/6/20",
          strokeDashArray: 0,
          label: {
            text: "Masks required inside",
            borderColor: "#775DD0",
            style: {
              color: "#fff",
              background: "#775DD0",
            },
          },
        },
        {
          x: "11/6/20",
          strokeDashArray: 0,
          label: {
            text: "Masks required outside",
            borderColor: "#775DD0",
            style: {
              color: "#fff",
              background: "#775DD0",
            },
          },
        },
        {
          x: "6/3/21",
          strokeDashArray: 0,
          label: {
            text: "Mask mandate lifted",
            borderColor: "#775DD0",
            style: {
              color: "#fff",
              background: "#775DD0",
            },
          },
        },
      ],
    },
    xaxis: {
      categories: xAxisLabels,
      labels: {
        hideOverlappingLabels: true,
        rotateAlways: false,
      },
    },
    yaxis: {
      title: {
        text: yAxisLabel,
        trim: true,
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
