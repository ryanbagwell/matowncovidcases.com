#!/usr/bin/env node
const fs = require(`fs`)
const path = require(`path`)
const axios = require("axios")
const format = require('date-fns/format')

let url = process.argv[2]

if (!url) {

  const month = format(new Date(), "MMMM").toLowerCase();
  const day = format(new Date(), 'd')
  const year = format(new Date(), 'yyyy')

  url = `https://www.mass.gov/doc/covid-19-raw-data-${month}-${day}-${year}/download`

  process.stdout.write(
    `No url supplied. Trying to download from ${url}\n`
  )

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
