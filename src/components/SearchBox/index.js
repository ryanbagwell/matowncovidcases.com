import React, { useRef, useMemo } from "react"
import TextField from "@material-ui/core/TextField"
import Autocomplete from "@material-ui/lab/Autocomplete"
import Chip from "@material-ui/core/Chip"
import { useStore } from "../../stores/global"
import { observer } from "mobx-react"
import Grid from "@material-ui/core/Grid"
import DataTypeSelector from "../DataTypeSelector"

export default observer(props => {
  const {
    availableTowns,
    addSelectedTown,
    selectedTowns,
    removeSelectedTown,
  } = useStore()

  const input = useRef(null)

  const options = useMemo(() => {
    return availableTowns.reduce((final, { town: name }) => {
      const isSelected = selectedTowns.find(town => town.name === name)
      if (isSelected) return final
      return [...final, name]
    }, [])
  }, [availableTowns, selectedTowns])

  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={5} md={3}>
          <Autocomplete
            autoHighlight={true}
            options={options}
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
          xs={12}
          sm={7}
          md={9}
          style={{
            display: "flex",
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          {selectedTowns.map(({ town: name }) => {
            return (
              <Chip
                key={name}
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
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <DataTypeSelector />
        </Grid>
      </Grid>
    </>
  )
})
