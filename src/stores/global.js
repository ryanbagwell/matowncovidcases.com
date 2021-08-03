/* eslint-disable no-restricted-globals */
import React from "react"
import { observable, action, decorate } from "mobx"
import { useLocalStore } from "mobx-react"

const updateUrlHash = (towns = []) => {
  history.pushState(null, null, `/#${towns.join(",")}`)
}

const DATA_TYPES = [
  {
    title: "New cases",
    verboseTitle: "Weekly new case count",
    name: "changeSinceLastCount",
    lineStyle: {
      width: 2,
      dashArray: 0,
    },
  },
  {
    title: "New Cases per 100k residents",
    verboseTitle: "Weekly new cases per 100k residents",
    name: "changePer100k",
    lineStyle: {
      width: 2,
      dashArray: 0,
    },
  },
  {
    title: "Two-week average",
    verboseTitle: "Two-week average of new reported cases",
    name: "twoCountAverageChange",
    lineStyle: {
      width: 2,
      dashArray: 0,
    },
  },
  {
    title: "School student cases",
    verboseTitle: "Cases reported by school students",
    name: "newStudentCases",
    lineStyle: {
      width: 2,
      dashArray: 0,
    },
  },
  {
    title: "School staff cases",
    verboseTitle: "Cases reported by school staff",
    name: "newStaffCases",
    lineStyle: {
      width: 2,
      dashArray: 0,
    },
  },
]

class GlobalStore {
  townCounts = {}

  selectedDataType = "changeSinceLastCount"

  selectedTowns = []

  townNames = []

  dataTypes = DATA_TYPES

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

export const GlobalStoreProvider = ({ initialTown, townCounts, children }) => {
  if (initialTown) {
    initializedGlobalStore.selectedTowns = [initialTown]
  }

  initializedGlobalStore.townNames = Object.keys(townCounts)
  initializedGlobalStore.townCounts = townCounts

  if (typeof window !== "undefined" && window.location.hash) {
    initializedGlobalStore.selectedTowns = window.location.hash
      .replace("#", "")
      .split(",")
  }

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
