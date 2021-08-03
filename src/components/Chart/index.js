import React, { useMemo } from "react"
import { useStore } from "../../stores/global"
import { observer } from "mobx-react"
import Chart from "react-apexcharts"
import Box from "@material-ui/core/Box"

const CDC_INDOOR_MASK_THRESHOLD_ANNOTATION = {
  y: 50,
  stokeDashArray: 5,
  fillColor: "black",
  borderColor: "black",
  label: {
    borderColor: "black",
    position: "left",
    textAnchor: "start",
    style: {
      color: "#fff",
      background: "black",
    },
    text: "CDC indoor mask recomendation",
  },
}

export default observer(props => {
  const {
    townCounts,
    selectedDataType,
    selectedTowns,
    getTownData,
    dataTypes,
  } = useStore()

  const series = selectedTowns.map(name => {
    const townData = getTownData(name)

    if (!townData) return []

    const counts = townData.counts.map(c => {
      return c[selectedDataType]
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
    return items.slice(1)
  }, [townCounts])

  const yAxisLabel = useMemo(() => {
    try {
      return dataTypes.find(dt => selectedDataType === dt.name).verboseTitle
    } catch (err) {
      return ""
    }
  }, [selectedDataType, dataTypes])

  const options = {
    annotations: {
      yaxis:
        selectedDataType === "changePer100k"
          ? [CDC_INDOOR_MASK_THRESHOLD_ANNOTATION]
          : [],
      // xaxis: [
      //   {
      //     x: "5/6/20",
      //     strokeDashArray: 0,
      //     label: {
      //       text: "Masks required inside",
      //       borderColor: "#775DD0",
      //       style: {
      //         color: "#fff",
      //         background: "#775DD0",
      //       },
      //     },
      //   },
      //   {
      //     x: "11/6/20",
      //     strokeDashArray: 0,
      //     label: {
      //       text: "Masks required outside",
      //       borderColor: "#775DD0",
      //       style: {
      //         color: "#fff",
      //         background: "#775DD0",
      //       },
      //     },
      //   },
      //   {
      //     x: "6/3/21",
      //     strokeDashArray: 0,
      //     label: {
      //       text: "Mask mandate lifted",
      //       borderColor: "#775DD0",
      //       style: {
      //         color: "#fff",
      //         background: "#775DD0",
      //       },
      //     },
      //   },
      // ],
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
