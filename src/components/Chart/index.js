import React from "react"
import { useStore } from "../../stores/global"
import { observer } from "mobx-react"
import Chart from "react-apexcharts"
import Box from "@material-ui/core/Box"

export default observer(props => {
  const store = useStore()

  if (store.townCounts.length === 0) return null

  let headerValues = store.townCounts[0].counts.map(c => c.date)

  const series = store.selectedTowns.map(name => {
    const townData = store.townCounts.find(tc => {
      return tc.name === name
    })

    return {
      name,
      data: townData.counts
        .map(c => c.count)
        .reduce((final, current, i, src) => {
          if (i === 0) return final
          final.push(src[i] - src[i - 1])
          return final
        }, []),
    }
  })

  const options = {
    xaxis: {
      categories: headerValues.slice(1),
    },
    yaxis: {
      title: {
        text: "Weekly new case count",
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
