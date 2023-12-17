import Papa from 'papaparse'
import fs from 'fs'

export const parseZipCodes = (csvFilePath: string): string[] => {
  const zipCodes: string[] = []
  const csvData = fs.readFileSync(csvFilePath, 'utf8')

  Papa.parse(csvData, {
    header: true,
    skipEmptyLines: true,
    complete: (results) => {
      zipCodes.push(
        ...results.data.map((row: { zipCode: string }) => row.zip)
      )
    }
  })

  return zipCodes
}
