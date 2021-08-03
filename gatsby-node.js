const path = require(`path`)
const parse = require("date-fns/parse")
const getTime = require("date-fns/getTime")
const formatDate = require("date-fns/format")
const populations = require("./src/utils/populations")
const slugify = require("slugify")
const randomColor = require("random-color")
const memoize = require("memoize-one")

const cleanupTownName = t => {
  let n = t.replace(/[0-9,\*]/gi, "")
  if (n === "Unknown town") return "Unknown"
  return n
}

const formatCaseCountNumber = n => {
  return n.replace(/[,]/gi, "")
}

const parseReportDate = memoize(dateStr => {
  return parse(dateStr, "M/d/yy", new Date())
})

function getNormalizedCount(City_Town, Report_Date, Total_Case_Count) {
  const d = parseReportDate(Report_Date)
  const ts = getTime(d)

  return {
    dateStr: Report_Date,
    shortDateStr: formatDate(d, "M/d/yy"),
    weekNumber: formatDate(d, "I"),
    year: formatDate(d, "yy"),
    timestamp: ts,
    totalCount: isNaN(Total_Case_Count) ? 0 : parseInt(Total_Case_Count),
  }
}

function getCountsByTown(nodes = []) {
  nodes = nodes.filter(n => {
    return (
      !n.City_Town.includes("State") &&
      !n.City_Town.includes("All of Massachusetts")
    )
  })

  return nodes.reduce(
    (final, { City_Town, Report_Date, Total_Case_Count, Total_Case_Rate }) => {
      const name = cleanupTownName(City_Town)

      final[name] = final[name] || {
        town: name,
        color: randomColor(0.99, 0.99).hexString(),
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
      allSy2021CsvSheet1 {
        nodes {
          Report_Date
          Code
          City_Town: Name
          Students
          Staff
        }
      }
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
      allData08122020Through12172020CsvSheet1 {
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
      allData12242020Through06312021XlsxWeeklyCityTown {
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
    results.data.allData08122020Through12172020CsvSheet1.nodes,
    results.data.allLatestXlsxWeeklyCityTown.nodes,
  ])

  /* Organize the flattened list of school counts by Town and Date
    so it's easier to look up. */
  const schoolCountsByTown = results.data.allSy2021CsvSheet1.nodes.reduce(
    (final, { Report_Date, Code, City_Town, Students, Staff }) => {
      const name = cleanupTownName(City_Town || "Unknown Town")

      const d = parseReportDate(Report_Date)
      const year = formatDate(d, "yy")
      const weekNumber = formatDate(d, "I")

      final[name] = final[name] || {}
      final[name][year] = final[name][year] || {}
      final[name][year] = {
        ...final[name][year],
        [weekNumber]: {
          students: Students,
          staff: Staff,
        },
      }

      return final
    },
    {}
  )

  /* Add in school counts */
  Object.keys(allNormalized).map(townName => {
    allNormalized[townName].counts.map((count, i) => {
      const d = parseReportDate(count.dateStr)
      const year = formatDate(d, "yy")

      try {
        const schoolCount = schoolCountsByTown[townName][year][count.weekNumber]

        allNormalized[townName].counts[i] = {
          ...count,
          newStudentCases: schoolCount.students
            ? parseInt(schoolCount.students)
            : 0,
          newStaffCases: schoolCount.staff ? parseInt(schoolCount.staff) : 0,
        }
      } catch (err) {
        allNormalized[townName].counts[i] = {
          ...count,
          newStudentCases: 0,
          newStaffCases: 0,
        }
      }
    })
  })

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

  if (process.env.NODE_ENV === "production") {
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
}
