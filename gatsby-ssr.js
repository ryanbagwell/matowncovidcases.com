import React from "react"
import { GlobalStoreProvider } from "./src/stores/global"

export const wrapPageElement = ({ element, props }) => {
  return (
    <GlobalStoreProvider
      initialTown={props.pageContext.townName || ""}
      townCounts={props.pageContext.townCounts || []}
    >
      {element}
    </GlobalStoreProvider>
  )
}
