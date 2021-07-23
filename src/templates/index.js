import "fontsource-roboto"
import React from "react"
import SEO from "../components/SEO"
import App from "../components/App"

const getPageDescription = town => {
  if (town) {
    return `Track and compare COVID-19 cases in ${town} and towns throughout Massachusetts.`
  } else {
    return `Track and compare COVID-19 cases towns throughout Massachusetts.`
  }
}

const IndexPage = props => {
  return (
    <>
      <SEO
        title={`${
          props.pageContext.townName || "Home"
        } | Track COVID-19 cases in every Massachusetts town.`}
        description={getPageDescription(props.pageContext.townName)}
      />
      <App {...props} />
    </>
  )
}

export default IndexPage
