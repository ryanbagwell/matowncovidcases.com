import React from "react"
import { observer } from "mobx-react"
import { useStore } from "../../stores/global"
import Table from "@material-ui/core/Table"
import TableBody from "@material-ui/core/TableBody"
import TableCell from "@material-ui/core/TableCell"
import TableContainer from "@material-ui/core/TableContainer"
import TableHead from "@material-ui/core/TableHead"
import TableRow from "@material-ui/core/TableRow"
import Paper from "@material-ui/core/Paper"
import Grid from "@material-ui/core/Grid"

export default observer(() => {
  const store = useStore()

  const sorted = store.townCounts
    .filter(tc => {
      const ma = tc.newCaseChangeMovingAverage
      return !isNaN(ma) && tc.name !== "State" && tc.name !== "Unknown"
    })
    .sort((a, b) => {
      return a.newCaseChangeMovingAverage - b.newCaseChangeMovingAverage
    })

  return (
    <Grid container item xs="12" spacing="3">
      <Grid item xs="12" sm="6">
        <TableContainer component={Paper}>
          <Table aria-label="table" size="small">
            <TableHead>
              <TableRow>
                <TableCell component="th">Town</TableCell>
                <TableCell align="right">Three-week moving average</TableCell>
              </TableRow>
            </TableHead>
          </Table>
          <TableBody>
            {sorted.slice(0, 5).map(town => (
              <TableRow key={town.name} component="tr">
                <TableCell>{town.name}</TableCell>
                <TableCell>
                  {Math.round(town.newCaseChangeMovingAverage)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </TableContainer>
      </Grid>
      <Grid item xs="12" sm="6">
        <TableContainer component={Paper}>
          <Table aria-label="table" size="small">
            <TableHead>
              <TableRow>
                <TableCell component="th">Town</TableCell>
                <TableCell align="right">Three-week moving average</TableCell>
              </TableRow>
            </TableHead>
          </Table>
          <TableBody>
            {sorted
              .reverse()
              .slice(0, 5)
              .map(town => (
                <TableRow key={town.name} component="tr">
                  <TableCell>{town.name}</TableCell>
                  <TableCell>
                    {Math.round(town.newCaseChangeMovingAverage)}
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </TableContainer>
      </Grid>
    </Grid>
  )
})
