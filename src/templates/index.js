import "fontsource-roboto"
import React from "react"
import SEO from "../components/SEO"
import App from "../components/App"
import { GlobalStoreProvider } from "../stores/global"

const IndexPage = props => (
  <GlobalStoreProvider>
    <SEO title="Home" />
    <App {...props} />
  </GlobalStoreProvider>
)

export default IndexPage
