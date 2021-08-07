import React from "react"
import SearchBox from "../SearchBox"
import { observer } from "mobx-react"
import { useStore } from "../../stores/global"
import Header from "../Header"
import Grid from "@material-ui/core/Grid"
import FAQ from "../FAQ"
import loadable from "@loadable/component"
import VaccinationTable from "../VaccinationTable"
import Box from "@material-ui/core/Box"
import Typography from "@material-ui/core/Typography"

const Chart = loadable(() => import("../Chart"))

export default observer(props => {
  const { selectedTowns } = useStore()

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
          <div style={{ minHeight: "65vh" }}>
            {typeof window !== "undefined" && <Chart />}
          </div>
        </Grid>
        {selectedTowns.length !== 0 && (
          <Grid item xs={12}>
            <Box>
              <Typography
                component="h3"
                variant="h4"
                style={{ marginBottom: "10px" }}
              >
                Vaccinations
              </Typography>
              <VaccinationTable />
            </Box>
          </Grid>
        )}
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
