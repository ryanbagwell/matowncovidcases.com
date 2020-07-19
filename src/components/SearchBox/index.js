import React, { useRef } from "react"
import TextField from "@material-ui/core/TextField"
import Autocomplete from "@material-ui/lab/Autocomplete"
import Chip from "@material-ui/core/Chip"
import { useStore } from "../../stores/global"
import { observer } from "mobx-react"
import Grid from "@material-ui/core/Grid"

export default observer(props => {
  const {
    townNames,
    addSelectedTown,
    selectedTowns,
    removeSelectedTown,
  } = useStore()

  const input = useRef(null)

  return (
    <Grid container spacing="2">
      <Grid item xs="12" sm="5" md="3">
        <Autocomplete
          autoHighlight={true}
          options={townNames.filter(n => selectedTowns.indexOf(n) === -1)}
          onChange={(e, townName) => {
            townName && addSelectedTown(townName)
          }}
          renderInput={params => {
            return (
              <TextField
                {...params}
                label="Start typing a town name"
                margin="normal"
                variant="outlined"
                ref={input}
              />
            )
          }}
        />
      </Grid>
      <Grid
        item
        xs="12"
        sm="7"
        md="9"
        style={{
          display: "flex",
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        {selectedTowns.map(name => {
          return (
            <Chip
              label={name}
              onDelete={e => {
                removeSelectedTown(name)
              }}
              style={{
                marginRight: 10,
                marginTop: 2,
                marginBottom: 2,
              }}
            />
          )
        })}
      </Grid>
    </Grid>
  )
})
