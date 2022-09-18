// a 10 digit random number used for tracking orders
export const trackingIdGen = (): string => {
  let id = Math.floor(Math.random() * 10000000000).toString()
  const idLen = id.length
  if (idLen != 10) {
    let diff = 10 - idLen
    for (let i = 0; i < diff; i++) {
      id = '0' + id    
    } 
  }
  return id
}
