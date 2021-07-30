#!/usr/bin/env node
const fs = require(`fs`)
const path = require(`path`)
const axios = require("axios")
const format = require('date-fns/format')
const sub = require('date-fns/sub');

let suppliedUrl = process.argv[2];


const getDownloadUrl = (offset = 0) => {

  if (suppliedUrl) return suppliedUrl;

  const offsetDate = sub(new Date(), {days: offset})

  const month = format(offsetDate, "MMMM").toLowerCase();
  const day = format(offsetDate, 'd')
  const year = format(offsetDate, 'yyyy')

  url = `https://www.mass.gov/doc/covid-19-raw-data-${month}-${day}-${year}/download`

  return url;

}

; (async function runIt() {

  let offset = 0;

  const saveIt = (data) => {
    fs.writeFileSync(
      path.join(__dirname, "src", "data", "towns", `latest.xlsx`),
      data,
      "binary"
    )
  }

  const getIt = async (url) => {

    process.stdout.write(
      `Trying to download from ${url}\n`
    )

    return await axios.get((url), {
      responseType: "arraybuffer",
    }).catch(err => { throw err });
  }

  const doItUntilSuccess = async () => {
    try {
      const response = await getIt(getDownloadUrl(offset));
      saveIt(response.data);
      process.stdout.write("Done!\n")
      process.exit(0)
    } catch (err) {
      offset++;
      process.stdout.write('Error. Going back a day ...\n');
      doItUntilSuccess();
    }
  }

  doItUntilSuccess()
})()
