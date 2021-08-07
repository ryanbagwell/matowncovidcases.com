import React, { useMemo } from "react"
import Table from "@material-ui/core/Table"
import TableBody from "@material-ui/core/TableBody"
import TableCell from "@material-ui/core/TableCell"
import TableContainer from "@material-ui/core/TableContainer"
import TableHead from "@material-ui/core/TableHead"
import TableRow from "@material-ui/core/TableRow"
import Paper from "@material-ui/core/Paper"
import { observer } from "mobx-react"
import { useStore } from "../../stores/global"

export default observer(props => {
  const { selectedTowns, vaccinations } = useStore()

  const selectedTownsStr = JSON.stringify(selectedTowns)

  const towns = useMemo(() => {
    const selectedTownNames = selectedTowns.map(st => st.town)
    return Object.values(vaccinations).filter(({ townName }) => {
      return selectedTownNames.indexOf(townName) > -1
    })
  }, [selectedTownsStr, vaccinations, selectedTowns])

  return (
    <TableContainer component={Paper}>
      <Table aria-label="simple table">
        <caption>Percentage of eligible residents who are vaccinated</caption>
        <TableHead>
          <TableRow>
            <TableCell>Town</TableCell>
            <TableCell align="center">Fully Vaccinated</TableCell>
            <TableCell align="center">Fully & Partially Vaccinated</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {towns.map(
            ({
              townName,
              color,
              totalEligible,
              totalFullyVaccinated,
              totalPartiallyVaccinated,
            }) => (
              <TableRow key={townName} style={{ color }}>
                <TableCell scope="row" style={{ color: "inherit" }}>
                  {townName}
                </TableCell>
                <TableCell scope="row" align="center" style={{ color }}>
                  {Math.round((totalFullyVaccinated / totalEligible) * 100)}%
                </TableCell>
                <TableCell align="center" style={{ color }}>
                  {Math.round(
                    ((totalFullyVaccinated + totalPartiallyVaccinated) /
                      totalEligible) *
                      100
                  )}
                  %
                </TableCell>
              </TableRow>
            )
          )}
        </TableBody>
      </Table>
    </TableContainer>
  )
})
