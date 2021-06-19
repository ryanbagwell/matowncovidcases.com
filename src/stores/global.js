/* eslint-disable no-restricted-globals */
import React from "react"
import { observable, action, decorate } from "mobx"
import { useLocalStore } from "mobx-react"

const updateUrlHash = (towns = []) => {
  history.pushState(null, null, `/#${towns.join(",")}`)
}

class GlobalStore {
  townCounts = {}

  selectedDataType = "raw"

  selectedTowns = (() => {
    if (typeof window !== "undefined" && window.location.hash) {
      return window.location.hash.replace("#", "").split(",")
    }

    return []
  })()

  townNames = []

  setTownCounts = (counts = []) => {
    this.townCounts = counts.reduce((final, current) => {
      final[current.town] = current
      return final
    }, {})
  }

  setTownNames = (names = []) => {
    this.townNames = names
  }

  addSelectedTown = (name, updateRoute = true) => {
    if (this.selectedTowns.indexOf(name) === -1) {
      this.selectedTowns.push(name)
    }

    if (typeof window !== "undefined" && updateRoute) {
      updateUrlHash(this.selectedTowns)
    }
  }

  removeSelectedTown = name => {
    this.selectedTowns = this.selectedTowns.filter(n => n !== name)
    updateUrlHash(this.selectedTowns)
  }

  getTownData = townName => {
    return this.townCounts[townName]
  }

  setSelectedDataType = typeName => {
    this.selectedDataType = typeName
  }
}

decorate(GlobalStore, {
  townCounts: observable,
  selectedTowns: observable,
  townNames: observable,
  selectedDataType: observable,
  setTownNames: action,
  addSelectedTown: action,
  removeSelectedTown: action,
  setTownCounts: action,
  getTownData: action,
  setSelectedDataType: action,
})

const initializedGlobalStore = new GlobalStore()

const storeContext = React.createContext(initializedGlobalStore)

export const GlobalStoreProvider = ({ children }) => {
  const store = useLocalStore(() => initializedGlobalStore)
  return <storeContext.Provider value={store}>{children}</storeContext.Provider>
}

export const useStore = (initialData = {}) => {
  const store = React.useContext(storeContext)

  if (initialData.townName) {
    store.addSelectedTown(initialData.townName, false)
  }

  if (!store) {
    throw new Error("useStore must be used within a StoreProvider.")
  }
  return store
}
