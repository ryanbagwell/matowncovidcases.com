import "fontsource-roboto"
import React from "react"
import SEO from "../components/SEO"
import App from "../components/App"
import { GlobalStoreProvider } from "../stores/global"

const IndexPage = props => {
  return (
    <GlobalStoreProvider>
      <SEO
        title={`${
          props.pageContext.townName || "Home"
        } | Track COVID-19 cases in every Massachusetts town.`}
        description={`Track and compare COVID-19 cases in ${props.pageContext.townName} and towns throughout Massachusetts.`}
      />
      <App {...props} />
    </GlobalStoreProvider>
  )
}

export default IndexPage
