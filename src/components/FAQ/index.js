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
          The case data used here comes from the{" "}
          <a
            href="https://www.mass.gov/info-details/covid-19-response-reporting"
            target="_blank"
            rel="noreferrer"
          >
            Massachusetts Department of Health COVID-19 Dashboard
          </a>
          . Town-by-town aggregate case counts are released each Thursday. Those
          figures are processed into the data you see here.
          <br />
          <br />
          School data comes from the{" "}
          <a href="https://www.doe.mass.edu/covid19/positive-cases/">
            Massachusetts Department of Elementary and Secondary Education
          </a>
          . During the 2020-2021 school year, it was also released each
          Thursday.
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
          Why does your chart show a negative number for a particular week?
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Typography>
          This might happen when a net decrease is made to the total number of
          cases in a town for a particular week, likely due to an error or
          revision to the state's data. To put it plainly, if there are no new
          cases reported in a town for a particuar week, and the state also
          discovers that one of the previously reported cases actually belongs
          in another town, a net decrease would appear for that week.
        </Typography>
      </AccordionDetails>
    </Accordion>
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography variant="h6">About student and staff cases</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Typography>
          School student and staff cases are only available if the name of the
          district matches the name of the town. Therefore, it would not include
          most private schools, regional schools and other districts whose
          students come from multiple municipalities.
          <br />
          <br />
          The figures represent positive covid cases among students who were in
          a school building within the previous 7 days of testing positive.
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
            href="https://github.com/ryanbagwell/mass-covid-cases-by-town/"
            target="_blank"
            rel="noreferrer"
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
