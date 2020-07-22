export default (rawCounts = []) => {
  return rawCounts
    .map(c => c.count)
    .reduce((final, current, i, src) => {
      if (i === 0) return final
      final.push(src[i] - src[i - 1])
      return final
    }, [])
}
