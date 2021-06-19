import React from "react"
import SearchBox from "../SearchBox"
import { observer } from "mobx-react"
import Header from "../Header"
import Grid from "@material-ui/core/Grid"
import FAQ from "../FAQ"
import loadable from "@loadable/component"

const Chart = loadable(() => import("../Chart"))

export default observer(() => {
  return (
    <>
      <Grid container spacing={2} style={{ padding: 20 }}>
        <Grid item xs={12}>
          <Header />
        </Grid>
        <Grid item xs={12}>
          <SearchBox />
        </Grid>
        <Grid item xs={12}>
          {typeof window !== "undefined" ? (
            <Chart />
          ) : (
            <div style={{ height: "75vh" }} />
          )}
        </Grid>
        <Grid
          item
          xs={12}
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
