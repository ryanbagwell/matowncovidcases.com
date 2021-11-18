#!/usr/bin/env node
const fs = require(`fs`)
const path = require(`path`)
const axios = require("axios")
const format = require("date-fns/format")
const sub = require("date-fns/sub")

let suppliedUrl = process.argv[2]

let offset = 0

const getCasesDownloadUrl = (offset = 0) => {
  if (suppliedUrl) return suppliedUrl

  const offsetDate = sub(new Date(), { days: offset })

  const month = format(offsetDate, "MMMM").toLowerCase()
  const day = format(offsetDate, "d")
  const year = format(offsetDate, "yyyy")

  url = `https://www.mass.gov/doc/covid-19-raw-data-${month}-${day}-${year}/download`

  return url
}

const getVaccineDownloadUrl = (offset = 0) => {
  if (suppliedUrl) return suppliedUrl

  const offsetDate = sub(new Date(), { days: offset })

  const month = format(offsetDate, "MMMM").toLowerCase()
  const day = format(offsetDate, "d")
  const year = format(offsetDate, "yyyy")

  url = `https://www.mass.gov/doc/weekly-covid-19-municipality-vaccination-report-${month}-${day}-${year}/download`

  return url
}

const saveIt = (data, filename) => {
  process.stdout.write(`Saving file ...`)
  fs.writeFileSync(path.join(__dirname, filename), data, "binary")
}

const doItUntilSuccess = async (urlFunction, filename) => {
  try {
    const url = urlFunction(offset)
    process.stdout.write(`Trying to download from ${url}\n`)
    const response = await axios
      .get(url, {
        responseType: "arraybuffer",
      });
    saveIt(response.data, filename)
    process.stdout.write("Done!\n")
  } catch (err) {
    offset++
    if (err.response) {
      process.stdout.write(`${err.toString()} Going back a day ...\n`)
    } else {
      process.stdout.write(err.toString())
    }
    await doItUntilSuccess(urlFunction, filename)
  }
}


;(async function runIt() {

  await doItUntilSuccess(
    getCasesDownloadUrl,
    path.join("src", "data", "towns", `latest.xlsx`)
  )

  await doItUntilSuccess(
    getVaccineDownloadUrl,
    path.join("src", "data", "vaccinations", `vaccinations.xlsx`)
  )

  process.exit(0)
})()
