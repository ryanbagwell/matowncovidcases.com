import React, { useEffect, useState } from "react"
import { useStaticQuery, graphql } from "gatsby"
import SearchBox from "../SearchBox"
import { useStore } from "../../stores/global"
import { observer } from "mobx-react"
import moment from "moment"
import Header from "../Header"
import Grid from "@material-ui/core/Grid"
import FAQ from "../FAQ"
import { ma } from "moving-averages"
//import ShrinkingAndGrowing from "../ShrinkingAndGrowing"

export default observer(props => {
  const store = useStore()
  const [Chart, setChart] = useState(null)

  let data = useStaticQuery(graphql`
    query {
      allTownDataCsv {
        edges {
          node {
            City_Town
            _6_10_2020
            _6_17_2020
            _6_24_2020
            _6_3_2020
            _7_15_2020
            _7_1_2020
            _7_8_2020
            _5_6_2020
            _5_27_2020
            _5_20_2020
            _5_13_2020
            id
          }
        }
      }
    }
  `)

  data = data.allTownDataCsv.edges.map(({ node }) => {
    let counts = { ...node }
    delete counts.City_Town
    delete counts.id

    counts = Object.entries(counts)
      .map(([date, count]) => {
        return {
          date: moment(date.slice(1).replace(/_/g, "-"), "MM-DD-YYYY").format(
            "M/D"
          ),
          value: parseInt(count),
        }
      })
      .sort((a, b) => {
        const format = "MM/DD/YYYY"
        return moment(a.date, format).unix() - moment(b.date, format).unix()
      })

    const weeklyNewCases = counts.reduce((final, current, i, src) => {
      if (i === 0) return final
      return [
        ...final,
        {
          date: current.date,
          value: src[i].value - src[i - 1].value,
        },
      ]
    }, [])

    const weeklyNewCaseChange = weeklyNewCases.reduce(
      (final, current, i, src) => {
        if (i === 0) return final
        return [
          ...final,
          {
            date: current.date,
            value: src[i].value - src[i - 1].value,
          },
        ]
      },
      []
    )

    return {
      name: node.City_Town,
      id: node.id,
      counts: counts,
      weeklyNewCases,
      weeklyNewCaseChange,
      newCaseChangeMovingAverage: ma(
        weeklyNewCaseChange.map(c => c.value),
        3
      )
        .slice(-1)
        .pop(),
    }
  })

  useEffect(() => {
    store.setTownCounts([...data])
    const names = data.map(t => t.name)
    store.setTownNames(names)
  }, [])

  useEffect(() => {
    if (typeof window !== undefined) {
      import("../Chart").then(mod => {
        setChart(mod.default)
      })
    }
  }, [])

  return (
    <>
      <Grid container spacing="2" style={{ padding: 20 }}>
        <Grid item xs="12">
          <Header />
        </Grid>
        <Grid item xs="12">
          <SearchBox />
        </Grid>
        <Grid item xs="12">
          {Chart ? <Chart /> : <div style={{ height: "75vh" }} />}
        </Grid>
        {/* <Grid item sx="12">
          <ShrinkingAndGrowing />
        </Grid> */}
        <Grid
          item
          xs="12"
          style={{
            marginTop: 50,
          }}
        >
          <FAQ />
        </Grid>
      </Grid>
    </>
  )
})
