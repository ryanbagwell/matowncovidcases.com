import React, { useMemo, useState } from "react"
import Table from "@material-ui/core/Table"
import TableBody from "@material-ui/core/TableBody"
import TableCell from "@material-ui/core/TableCell"
import TableContainer from "@material-ui/core/TableContainer"
import TableHead from "@material-ui/core/TableHead"
import TableRow from "@material-ui/core/TableRow"
import IconButton from '@material-ui/core/IconButton';
import Paper from "@material-ui/core/Paper"
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import { observer } from "mobx-react"
import { useStore } from "../../stores/global"


const TownRows = (props) => {
  const {townVaccinations} = props;
  const [open, setOpen] = useState(false);

  const vaccinations = townVaccinations.sort((a, b) => {
    if (a.ageGroup === 'Total') {
      return -1;
    }
    if (b.ageGroup === 'Total') {
      return 1;
    }
    return 0
  })

  const color = 'black'

  return (
    <React.Fragment>
    {vaccinations.map(({
      town,
      ageGroup,
      fullyVaccinatedPerCapita,
      oneDosePerCapita
    }) => {
      if (!open && ageGroup !== 'Total') return null;
      return (
        <TableRow key={`${town}-${ageGroup}`} style={{ color }}>
          <TableCell>
            {ageGroup === 'Total' && (
              <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
                {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
              </IconButton>
            )}
          </TableCell>
            <TableCell scope="row" style={{ color: "inherit" }}>
              {ageGroup === 'Total' ? town : ageGroup}
            </TableCell>
            <TableCell scope="row" align="center" style={{ color }}>
              {fullyVaccinatedPerCapita}
            </TableCell>
            <TableCell align="center" style={{ color }}>
              {oneDosePerCapita}
            </TableCell>
        </TableRow>
      )
    })}
  </React.Fragment>)
}



export default observer(props => {
  const { selectedTowns, vaccinations } = useStore()

  const selectedTownsStr = JSON.stringify(selectedTowns)

  const towns = useMemo(() => {
    return selectedTowns.map((st) => {
      return vaccinations[st.town];
    })

  }, [selectedTownsStr, vaccinations, selectedTowns])

  console.log(towns)
  const color = 'black'
  //return null

  return (
    <TableContainer component={Paper}>
      <Table aria-label="simple table">
        <caption>Percentage of eligible residents who are vaccinated</caption>
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell>Town</TableCell>
            <TableCell align="center">Fully Vaccinated</TableCell>
            <TableCell align="center">Partially Vaccinated</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {towns.map(
            (townVaccinations) => (
              <TownRows townVaccinations={townVaccinations} key={townVaccinations[0].town} />
            )
          )}
        </TableBody>
      </Table>
    </TableContainer>
  )
})
