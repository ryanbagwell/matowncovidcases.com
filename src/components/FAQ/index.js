import React from "react"
import Accordion from "@material-ui/core/Accordion"
import AccordionDetails from "@material-ui/core/AccordionDetails"
import AccordionSummary from "@material-ui/core/AccordionSummary"
import Typography from "@material-ui/core/Typography"
import ExpandMoreIcon from "@material-ui/icons/ExpandMore"

export default () => (
  <>
    <Typography component="h3" variant="h4" style={{ marginBottom: 20 }}>
      Frequently asked questions
    </Typography>
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography variant="h6">Where does this data come from?</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Typography>
          The data used here comes from the{" "}
          <a
            href="https://www.mass.gov/info-details/covid-19-response-reporting"
            target="_blank"
          >
            Massachusetts Department of Health COVID-19 Weekly Public Health
            Report
          </a>
          . Town-by-town aggregate case counts are released each Wednesday by 4
          p.m. I export that spreadsheet data and import it into my own
          spreadsheet, which is used to create this chart.
        </Typography>
      </AccordionDetails>
    </Accordion>
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography variant="h6">
          {" "}
          Your chart shows zero cases for my town, but I know we've had some.
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Typography>
          The state only reports data for municipalities that have more than 5
          confirmed cases. If your has less than 5, data for your town will be
          wonky.
        </Typography>
      </AccordionDetails>
    </Accordion>
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography variant="h6">
          Why does your chart show a negative number for my town?
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Typography>
          The total state-reported cases for the previous week was likely
          revised, resulting a number of cases removed from that town's
          aggregate.
        </Typography>
      </AccordionDetails>
    </Accordion>
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography variant="h6"> Can I see your code?</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Typography>
          Absolutely! Click{" "}
          <a
            href="https://github.com/ryanbagwell/mass-covid-cases-by-town/network/alerts"
            target="_blank"
          >
            here
          </a>
          , but don't hold it against me ;).
        </Typography>
      </AccordionDetails>
    </Accordion>
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography variant="h6">More questions?</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Typography>
          <a href="mailto:ryan@ryanbagwell.com">Email me</a>.
        </Typography>
      </AccordionDetails>
    </Accordion>
  </>
)
