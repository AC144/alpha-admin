// Info Dock Data Models

export interface GDS {
  id: string
  type: string        // e.g. "Standard", "Alternative"
  name: string        // e.g. "Sabre"
  description: string
}

export interface PCC {
  id: string
  gdsId: string
  code: string        // 4 chars, uppercase alphanumeric
  description: string
}

export interface PTC {
  id: string
  gdsId: string
  adult: string       // e.g. ADT
  child: string       // e.g. CNN
  infant: string      // e.g. INF
  infantWithSeat: string // e.g. INS
}

export interface CorpID {
  id: string
  gdsId: string
  code: string
  description: string
}

export interface FareType {
  id: string
  name: string
  code: string
  description: string
}

export interface Cabin {
  id: string
  name: string
  code: string        // single letter: Y, C, F, W
  description: string
}

export interface Project {
  id: string
  name: string
  uiCode: string      // short code used in UI
  description: string
}

export interface Airline {
  id: string
  name: string
  iataCode: string    // 2 chars
  country: string
  active: boolean
}

export interface Airport {
  id: string             // IATA code — "JFK"
  displayname: string    // "John F Kennedy Intl, New York, United States, (JFK)"
  airportname: string    // "John F Kennedy Intl"
  cityonly: string       // "New York"
  country: string        // "United States"
  cc: string             // "US" (ISO 2-letter)
  region: string         // "New York" (state/province)
  rc: string             // "NY" (region code)
  lat: number            // 40.63983
  lng: number            // -73.77874
  timezone: string       // "America/New_York" (IANA)
  utc: string            // "-04:00"
  loctype: string        // "ap" (airport, metro, etc.)
  isMetroOnly: boolean   // false
}

export interface BackupRecord {
  id: string
  date: string
  size: string
  createdBy: string
  filename: string
}

// Import diff types
export interface ImportDiff<T> {
  newRecords: T[]
  updatedRecords: T[]
  unchangedRecords: T[]
  errorRecords: { row: number; data: Record<string, unknown>; error: string }[]
}
