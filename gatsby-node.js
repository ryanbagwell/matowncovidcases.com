const fs = require(`fs`)
const path = require(`path`)
const axios = require("axios")
const parse = require("date-fns/parse")
const getUnixTime = require("date-fns/getUnixTime")
const formatDate = require("date-fns/format")
const populations = require("./src/utils/populations")

exports.onPreBootstrap = async ({ store, cache }, pluginOptions) => {
  /*
   *  Get the CSV data
   */
  const response = await axios.get(
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vRoy5GcZgrVdoW3LWTyiyD0uB4DqY_DYxUJgE3asRWZCuM4ld4iozNEATa6NafejLO7CJhL4NFGtU5O/pub?output=csv"
  )

  /*
   *  Write the csv data to file
   */
  fs.writeFileSync(
    path.join(__dirname, "src", "data", `town-data.csv`),
    response.data
  )
}

async function onCreateNode({
  node,
  actions,
  createNodeId,
  createContentDigest,
}) {
  const { createNode, createParentChildLink } = actions

  function transformObject(nodeObj) {
    const ignoreKeys = ["id", "City/Town", "children", "parent", "internal"]

    // Create an array of objects, each object representing a single data point
    let counts = Object.entries(nodeObj)
      .reduce((final, [key, value]) => {
        if (ignoreKeys.includes(key)) return final
        const d = parse(key, "M/d/yyyy", new Date())
        const ts = getUnixTime(d)

        const totalCount = parseInt(value)

        return [
          ...final,
          {
            dateStr: key,
            shortDateStr: formatDate(d, "M/d"),
            timestamp: ts,
            totalCount: isNaN(totalCount) ? 0 : totalCount,
          },
        ]
      }, [])
      .sort((a, b) => {
        return a.timestamp - b.timestamp
      })

    const townName = nodeObj["City/Town"]

    /*
     *  Add the count over count change and other data
     */
    counts.map((count, i) => {
      if (i === 0) {
        count.changeSinceLastCount = 0
        return
      }

      const change = count.totalCount - counts[i - 1].totalCount

      counts[i] = {
        ...count,
        changeSinceLastCount: change,
        changePer100k: Math.round((change * 100000) / populations[townName]),
        twoCountAverageChange: Math.round(
          (change + counts[i - 1].changeSinceLastCount) / 2
        ),
      }
    })

    const data = {
      town: townName,
      counts,
    }

    const newNode = {
      ...data,
      id: createNodeId(`${node.id}-counts`),
      children: [],
      parent: node.id,
      internal: {
        contentDigest: createContentDigest(data),
        type: "Stats",
      },
    }

    createNode(newNode)
    createParentChildLink({ parent: node, child: newNode })
  }

  if (node.internal.type === "TownDataCsv") {
    transformObject(node)
  }
}

exports.onCreateNode = onCreateNode
