import React from "react"
import { observer } from "mobx-react"
import { useStore } from "../../stores/global"

export default observer(() => {
  const store = useStore()

  const sorted = store.townCounts
    .filter(tc => {
      const ma = tc.newCaseChangeMovingAverage
      return !isNaN(ma) && tc.name !== "State" && tc.name !== "Unknown"
    })
    .sort((a, b) => {
      return a.newCaseChangeMovingAverage - b.newCaseChangeMovingAverage
    })

  return (
    <table>
      {sorted.slice(0, 5).map(town => (
        <tr>
          <td>{town.name}</td>
          <td>{town.newCaseChangeMovingAverage}</td>
        </tr>
      ))}
    </table>
  )
})
