/* eslint-disable no-restricted-globals */
import React from "react"
import { observable, action, decorate } from "mobx"
import { useLocalStore } from "mobx-react"
import memoize from "memoize-one"

const updateUrlHash = (towns = []) => {
  history.pushState(null, null, `/#${towns.map(t => t.town).join(",")}`)
}

const DATA_TYPES = [
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
    title: "New cases",
    verboseTitle: "Weekly new case count",
    name: "changeSinceLastCount",
    lineStyle: {
      width: 2,
      dashArray: 2,
    },
  },
  {
    title: "Two-week average",
    verboseTitle: "Two-week average of new reported cases",
    name: "twoCountAverageChange",
    lineStyle: {
      width: 2,
      dashArray: 4,
    },
  },
  {
    title: "School student cases",
    verboseTitle: "Cases reported by school students",
    name: "newStudentCases",
    lineStyle: {
      width: 2,
      dashArray: 6,
    },
  },
  {
    title: "School staff cases",
    verboseTitle: "Cases reported by school staff",
    name: "newStaffCases",
    lineStyle: {
      width: 2,
      dashArray: 8,
    },
  },
  {
    title: "School student cases per 100k enrolled",
    verboseTitle: "New student cases reported per 100k enrolled",
    name: "newStudentCasesPerHundredThousand",
    lineStyle: {
      width: 2,
      dashArray: 10,
    },
  },
  {
    title: "School staff cases per 100k enrolled",
    verboseTitle: "New staff cases reported per 100k enrolled",
    name: "newStaffCasesPerHundredThousand",
    lineStyle: {
      width: 2,
      dashArray: 12,
    },
  },
]

class GlobalStore {
  townCounts = {}

  selectedDataTypes = [DATA_TYPES[0]]

  selectedTowns = []

  availableTowns = []

  dataTypes = DATA_TYPES

  vaccinations = {}

  setTownCounts = (counts = []) => {
    this.townCounts = counts.reduce((final, current) => {
      final[current.town] = current
      return final
    }, {})
  }

  setAvailableTowns = (towns = []) => {
    this.availableTowns = towns
  }

  addSelectedTown = (name, updateRoute = true) => {
    const townToAdd = this.getTownByName(name)

    const isSelected = this.selectedTowns.find(({ town }) => town === name)

    if (!isSelected) this.selectedTowns.push(townToAdd)

    if (typeof window !== "undefined" && updateRoute) {
      updateUrlHash(this.selectedTowns)
    }
  }

  getTownByName = memoize(townName => {
    return this.availableTowns.find(({ town: name }) => name === townName)
  })

  removeSelectedTown = name => {
    this.selectedTowns = this.selectedTowns.filter(({ town }) => town !== name)
    updateUrlHash(this.selectedTowns)
  }

  getTownData = townName => {
    return this.townCounts[townName]
  }

  addSelectedDataType = typeName => {
    const dt = this.getDataTypeByName(typeName)
    this.selectedDataTypes.push(dt)
  }

  removeSelectedDataType = typeName => {
    this.selectedDataTypes = this.selectedDataTypes.filter(
      dt => dt.name !== typeName
    )
  }

  getDataTypeByName = memoize(typeName => {
    return this.dataTypes.find(({ name }) => name === typeName)
  })
}

decorate(GlobalStore, {
  townCounts: observable,
  selectedTowns: observable,
  availableTowns: observable,
  selectedDataTypes: observable,
  setAvailableTowns: action,
  addSelectedTown: action,
  removeSelectedTown: action,
  setTownCounts: action,
  getTownData: action,
  addSelectedDataTypes: action,
  removeSelectedDataType: action,
})

const initializedGlobalStore = new GlobalStore()

const storeContext = React.createContext(initializedGlobalStore)

export const GlobalStoreProvider = ({
  initialTown,
  townCounts,
  vaccinations,
  children,
}) => {
  initializedGlobalStore.availableTowns = Object.values(townCounts)
  initializedGlobalStore.townCounts = townCounts
  initializedGlobalStore.vaccinations = vaccinations

  if (initialTown) {
    initializedGlobalStore.selectedTowns = [
      initializedGlobalStore.getTownByName(initialTown),
    ]
  }

  if (typeof window !== "undefined" && window.location.hash) {
    const selectedTownNames = window.location.hash.replace("#", "").split(",")
    initializedGlobalStore.selectedTowns = selectedTownNames.map(n =>
      initializedGlobalStore.getTownByName(n)
    )
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
