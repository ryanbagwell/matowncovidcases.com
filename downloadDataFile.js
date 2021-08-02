#!/usr/bin/env node
const fs = require(`fs`)
const path = require(`path`)
const axios = require("axios")
const format = require("date-fns/format")
const sub = require("date-fns/sub")

let suppliedUrl = process.argv[2]

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

;(async function runIt() {
  let offset = 0

  const saveIt = (data, filename) => {
    fs.writeFileSync(path.join(__dirname, filename), data, "binary")
  }

  const getIt = async url => {
    process.stdout.write(`Trying to download from ${url}\n`)

    return await axios
      .get(url, {
        responseType: "arraybuffer",
      })
      .catch(err => {
        throw err
      })
  }

  const doItUntilSuccess = async (urlFunction, filename) => {
    try {
      const url = urlFunction(offset)
      const response = await getIt(url)
      saveIt(response.data, filename)
      process.stdout.write("Done!\n")
      process.exit(0)
    } catch (err) {
      offset++
      process.stdout.write("Error. Going back a day ...\n")
      doItUntilSuccess(urlFunction, filename)
    }
  }

  doItUntilSuccess(
    getCasesDownloadUrl,
    path.join("src", "data", "towns", `latest.xlsx`)
  )

  doItUntilSuccess(
    getVaccineDownloadUrl,
    path.join("src", "data", "vaccinations", `latest.xlsx`)
  )
})()
