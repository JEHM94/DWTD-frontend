export function getMinDate() {
  return new Date().toISOString().split('T')[0]
}

export function getNextBusinessDay() {
  const today = new Date()
  if (today.getDay() === 6) today.setDate(today.getDate() + 2)
  if (today.getDay() === 0) today.setDate(today.getDate() + 1)
  return today.toISOString().split('T')[0]
}

export function isWeekend(dateStr) {
  if (!dateStr) return false
  const day = new Date(dateStr + 'T00:00:00').getDay()
  return day === 0 || day === 6
}
