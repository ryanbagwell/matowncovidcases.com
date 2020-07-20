/* eslint-disable no-restricted-globals */
import React from "react"
import { observable, action, decorate } from "mobx"
import { useLocalStore } from "mobx-react"

const updateUrlHash = (towns = []) => {
  history.pushState(null, null, `/#${towns.join(",")}`)
}

class GlobalStore {
  townCounts = []

  selectedTowns = (() => {
    if (typeof window !== "undefined" && window.location.hash) {
      return window.location.hash.replace("#", "").split(",")
    }

    return []
  })()

  townNames = []

  setTownCounts = (counts = []) => {
    this.townCounts = counts
  }

  setTownNames = (names = []) => {
    this.townNames = names
  }

  addSelectedTown = name => {
    if (this.selectedTowns.indexOf(name) === -1) {
      this.selectedTowns.push(name)
    }

    if (typeof window !== "undefined") {
      updateUrlHash(this.selectedTowns)
    }
  }

  removeSelectedTown = name => {
    this.selectedTowns = this.selectedTowns.filter(n => n !== name)
    updateUrlHash(this.selectedTowns)
  }
}

decorate(GlobalStore, {
  townCounts: observable,
  selectedTowns: observable,
  townNames: observable,
  setTownNames: action,
  addSelectedTown: action,
  removeSelectedTown: action,
  setTownCounts: action,
})

const initializedGlobalStore = new GlobalStore()

const storeContext = React.createContext(initializedGlobalStore)

export const GlobalStoreProvider = ({ children }) => {
  const store = useLocalStore(() => initializedGlobalStore)
  return <storeContext.Provider value={store}>{children}</storeContext.Provider>
}

export const useStore = () => {
  const store = React.useContext(storeContext)
  if (!store) {
    throw new Error("useStore must be used within a StoreProvider.")
  }
  return store
}
