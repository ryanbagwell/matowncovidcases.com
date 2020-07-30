const fs = require(`fs`)
const path = require(`path`)
const axios = require("axios")

exports.onPreBootstrap = async ({ store, cache }, pluginOptions) => {
  const response = await axios.get(
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vRoy5GcZgrVdoW3LWTyiyD0uB4DqY_DYxUJgE3asRWZCuM4ld4iozNEATa6NafejLO7CJhL4NFGtU5O/pub?output=csv"
  )

  const rows = response.data.split("\r\n")
  const headerRow = rows[0]
  const cells = headerRow.split(",")
  const dates = cells.slice(1).map(d => {
    return `_${d.replace(/\//g, "_")}`
  })

  /*
   *  Write the csv data to file
   */
  fs.writeFileSync(
    path.join(__dirname, "src", "data", `town-data.csv`),
    response.data
  )

  /*
   * Create a queries directory
   */
  const queriesDir = path.join(__dirname, "src", "queries")

  if (!fs.existsSync(queriesDir)) {
    fs.mkdirSync(queriesDir)
  }

  /*
   * Write all available dates to a fragment
   */
  fs.writeFileSync(
    path.join(queriesDir, "datesFragment.js"),
    `
      import { graphql } from 'gatsby'
      export const allDateFields = graphql\`
        fragment allDateFields on TownDataCsv {
          ${dates.join("\r\n")}
        }
      \`
    `
  )
}
