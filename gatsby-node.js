const path = require(`path`)
const parse = require("date-fns/parse")
const getTime = require("date-fns/getTime")
const formatDate = require("date-fns/format")
const populations = require("./src/utils/populations")
const slugify = require("slugify")

const cleanupTownName = t => {
  let n = t.replace(/[0-9,\*]/gi, "")
  if (n === "Unknown town") return "Unknown"
  return n
}

const formatCaseCountNumber = n => {
  return n.replace(/[,]/gi, "")
}

function getNormalizedCount(City_Town, Report_Date, Total_Case_Count) {
  const d = parse(Report_Date, "MM/dd/yyyy", new Date())
  const ts = getTime(d)

  return {
    dateStr: Report_Date,
    shortDateStr: formatDate(d, "M/d/yy"),
    timestamp: ts,
    totalCount: isNaN(Total_Case_Count) ? 0 : parseInt(Total_Case_Count),
  }
}

function getCountsByTown(nodes = []) {
  nodes = nodes.filter(n => !n.City_Town.includes("State"))

  return nodes.reduce(
    (final, { City_Town, Report_Date, Total_Case_Count, Total_Case_Rate }) => {
      const name = cleanupTownName(City_Town)

      final[name] = final[name] || {
        town: name,
        counts: [],
      }

      final[name].counts.push(
        getNormalizedCount(
          name,
          Report_Date,
          formatCaseCountNumber(Total_Case_Count)
        )
      )

      return final
    },
    {}
  )
}

function combineNormalizedCounts(nodes = []) {
  return nodes.reduce((final, current, i) => {
    let townCounts = getCountsByTown(current)

    if (Object.keys(final).length === 0) return townCounts

    Object.entries(townCounts).map(([key, val]) => {
      const name = cleanupTownName(key)
      final[name] = final[name] || {
        town: name,
        counts: [],
      }

      final[name].counts = [...final[name].counts, ...val.counts]
    })

    return final
  }, {})
}

exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions
  const results = await graphql(`
    query {
      allData4222020Through5202020CsvSheet1 {
        nodes {
          id
          City_Town
          Report_Date
          Total_Case_Count
          Total_Case_Rate
        }
      }
      allData5272020Through07082020CsvSheet1 {
        nodes {
          City_Town
          Report_Date
          Total_Case_Count
          id
          Total_Case_Rate
          TotalTested_Rate
          Total_Persons_Tested
          Percent_Positive__Last_14_days_
        }
      }
      allData7152020Through8052020CsvSheet1 {
        nodes {
          City_Town
          id
          Report_Date
          Total_Case_Count
          Percent_Positivity__Last_14_Days_
          Total_Positive_Tests__Last_14_days_
          Total_Tested
          Total_Tested__Last_14_days_
          Case_Count__Last_14_Days_
        }
      }
      allData08122020Through12Xx2020CsvSheet1 {
        nodes {
          City_Town
          Report_Date
          Percent_Positivity
          Total_Case_Count
          Total_Positive_Tests
          Total_Tests
          Total_Tests_Last_Two_Weeks
          Two_Week_Case_Counts
          Change_Since_Last_Week
          Average_Daily_Rate
        }
      }
      allLatestXlsxWeeklyCityTown {
        nodes {
          City_Town
          id
          Report_Date
          Total_Case_Count: Total_Case_Counts
          Total_Positive_Tests
          Total_Tests
          Total_Tests_Last_Two_Weeks
          Two_Week_Case_Counts
          Testing_Rate
          Average_Daily_Rate
        }
      }
    }
  `)

  let allNormalized = combineNormalizedCounts([
    results.data.allData4222020Through5202020CsvSheet1.nodes,
    results.data.allData5272020Through07082020CsvSheet1.nodes,
    results.data.allData7152020Through8052020CsvSheet1.nodes,
    results.data.allData08122020Through12Xx2020CsvSheet1.nodes,
    results.data.allLatestXlsxWeeklyCityTown.nodes,
  ])

  /* Add in statewide totals */
  const dailyTotals = {}

  Object.values(allNormalized).map(({ town, counts }) => {
    counts.map(c => {
      dailyTotals[c.shortDateStr] = dailyTotals[c.shortDateStr] || 0
      dailyTotals[c.shortDateStr] = dailyTotals[c.shortDateStr] + c.totalCount
    })
  })

  allNormalized["State"] = {
    town: "State",
    counts: Object.entries(dailyTotals).map(
      ([Report_Date, Total_Case_Count]) => {
        return getNormalizedCount("State", Report_Date, Total_Case_Count)
      }
    ),
  }
  /* End statewide totals */

  Object.values(allNormalized).map(({ town, counts }) => {
    counts.sort((a, b) => {
      return a.timestamp - b.timestamp
    })

    counts.map((count, i) => {
      if (i === 0) {
        count.changeSinceLastCount = 0
        return
      }
      const change = count.totalCount - counts[i - 1].totalCount
      counts[i] = {
        ...count,
        changeSinceLastCount: change,
        changePer100k: Math.round((change * 100000) / populations[town]),
        twoCountAverageChange: Math.round(
          (change + counts[i - 1].changeSinceLastCount) / 2
        ),
      }
    })
  })

  const productTemplate = path.resolve(`src/templates/index.js`)

  createPage({
    path: `/`,
    component: productTemplate,
    context: {
      townCounts: allNormalized,
    },
  })

  Object.keys(populations).map(townName => {
    createPage({
      path: `/${slugify(townName, { lower: true })}/`,
      component: productTemplate,
      context: {
        townCounts: allNormalized,
        townName: townName,
      },
    })
  })
}
