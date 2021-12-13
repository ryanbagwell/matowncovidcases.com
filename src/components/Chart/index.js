import React, { useMemo } from "react"
import { useStore } from "../../stores/global"
import { observer } from "mobx-react"
import Chart from "react-apexcharts/src/react-apexcharts"
import Box from "@material-ui/core/Box"
import getColor from '../../utils/getColor';

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
  const { townCounts, selectedDataTypes, selectedTowns } = useStore()

  const series = selectedTowns.reduce((final, current, i) => {
    const { town: townName, color, counts } = current

    if (!counts || !selectedDataTypes) return final

    selectedDataTypes.map(dt => {
      const finalCounts = counts.map(c => {
        return c[dt.name]
      })

      final.push({
        name: `${townName} - ${dt.title}`,
        data: finalCounts.slice(1),
        townName,
        color: getColor(i),
        config: dt,
      })
    })

    return final
  }, [])

  const xAxisLabels = useMemo(() => {
    const items = Object.values(townCounts)[0].counts.map(c => {
      return c.shortDateStr
    })
    return items.slice(1)
  }, [selectedTowns, townCounts])

  const getYAxis = () => {
    let ret = [];

    if (selectedDataTypes.length >= 1) {
      ret.push({
        title: {
          text: selectedDataTypes[0].verboseTitle,
          trim: true,
        }
      })
    }

    if (selectedDataTypes.length >= 2) {
      ret.push({
        title: {
          text: selectedDataTypes[1].verboseTitle,
          trim: true,

        },
        opposite: true,
        axisTicks: {
          show: true
        },
      })
    }

    return ret;

  }

  const options = {
    annotations: {
      yaxis:
        selectedDataTypes === "changePer100k"
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
    yaxis: getYAxis(),
    legend: {
      customLegendItems: series.reduce((final, current) => {
        final.push(final.indexOf(current.townName) > -1 ? "" : current.townName)

        return final
      }, []),
      labels: {
        useSeriesColors: false,
      },
      fontSize: "20px",
      itemMargin: {
        horizontal: 10,
      },
    },
    stroke: {
      curve: "smooth",
      width: series.map(s => s.config.lineStyle.width),
      dashArray: series.map(s => s.config.lineStyle.dashArray),
    },
    height: "75vh",
    colors: series.map(s => s.color),
    chart: {
      toolbar: {
        show: false,
        tools: {
          zoom: true,
          zoomin: true,
          zoomout: true,
        },
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
