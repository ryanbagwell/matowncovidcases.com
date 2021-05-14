#!/usr/bin/env node
const fs = require(`fs`)
const path = require(`path`)
const axios = require("axios")

const url = process.argv[2]

if (!url) {
  process.stdout.write(
    "Please supply a url to an excel file as the first argument\n"
  )
  process.exit(1)
}

;(async function runIt() {
  const response = await axios.get(url, {
    responseType: "arraybuffer",
  })

  fs.writeFileSync(
    path.join(__dirname, "src", "data", `latest.xlsx`),
    response.data,
    "binary"
  )

  process.stdout.write("Done!\n")
  process.exit(0)
})()
