import React from "react"
import SEO from "../components/SEO"
import "fontsource-roboto"
import App from "../components/App"
import { GlobalStoreProvider } from "../stores/global"

const IndexPage = () => (
  <GlobalStoreProvider>
    <SEO title="Home" />
    <App />
  </GlobalStoreProvider>
)

export default IndexPage
