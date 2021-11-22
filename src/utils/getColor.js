
const COLORS = ['#008FFB', '#00E396', '#FEB019', '#FF4560', '#775DD0', '#00D9E9', '#FF66C3'];

export default (i) => {
  if (i < COLORS.length) {
    return COLORS[i]
  }
  return COLORS[(i % 7) - 1]
}