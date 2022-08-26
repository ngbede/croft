export const createStockID = (farmName: string): string[] => {
    const parseName = farmName.toLowerCase().replaceAll(' ', '-')
    const parseDate = new Date().toJSON() // get only YYYY-MM-DD from full timestamp
    return ['stock-count:'.concat(parseName.concat(':').concat(parseDate)), parseDate]
}
