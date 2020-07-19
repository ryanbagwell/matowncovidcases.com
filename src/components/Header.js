import React from "react"
import Box from "@material-ui/core/Box"
import Typography from "@material-ui/core/Typography"

export default () => {
  return (
    <Box>
      <Typography
        component="h1"
        variant="h3"
        style={{
          marginBottom: 10,
        }}
      >
        Massachusetts COVID-19 Cases by Town
      </Typography>
      <Typography component="h2" variant="h5">
        New cases reported each week
      </Typography>
    </Box>
  )
}
