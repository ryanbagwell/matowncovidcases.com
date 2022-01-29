import React from "react"
import FormControlLabel from "@material-ui/core/FormControlLabel"
import Checkbox from "@material-ui/core/Checkbox"
import Paper from "@material-ui/core/Paper"
import Typography from "@material-ui/core/Typography"

import { useStore } from "../../stores/global"
import { observer } from "mobx-react"

export default observer(props => {
  const {
    selectedDataTypes,
    dataTypes,
    addSelectedDataType,
    removeSelectedDataType,
    setShowMilestones,
    showMilestones
  } = useStore()

  return (
    <Paper
      variant="outlined"
      style={{
        padding: "10px",
      }}
    >
      <Typography
        style={{
          fontSize: 14,
        }}
        color="textSecondary"
        gutterBottom
      >
        Data to show
      </Typography>
      {dataTypes.map(({ title, name }) => {
        const isSelected = selectedDataTypes.find(dt => dt.name === name)
        return (
          <FormControlLabel
            key={name}
            control={
              <Checkbox
                checked={isSelected ? true : false}
                onChange={e => {
                  if (e.currentTarget.checked) {
                    addSelectedDataType(name)
                  } else {
                    removeSelectedDataType(name)
                  }
                }}
                name={name}
                color="primary"
              />
            }
            label={title}
          />
        )
      })}
      <FormControlLabel
        key="milestones-key"
        control={
          <Checkbox
            checked={showMilestones}
            onChange={e => {
              if (e.currentTarget.checked) {
                setShowMilestones(true)
              } else {
                setShowMilestones(false)
              }
            }}
            name="milestones"
            color="primary"
          />
        }
        label="Show Milestones"
      />
    </Paper>
  )
})
