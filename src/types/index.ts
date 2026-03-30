/**
 * Strict interface for Point of Interest (POI) in MapaGP.
 * This interface defines the core geographical and metadata properties for each marker.
 */
export interface GeoPoint {
  /** Unique identifier for the point */
  id: string | number;
  /** Latitude coordinate */
  lat: number;
  /** Longitude coordinate */
  lng: number;
  /** Primary category for filtering and styling */
  category: string;
  /** Flexible metadata for additional information */
  metadata: Record<string, any>;
  /** Primary text label or title */
  label: string;
}

/**
 * Interface for HitoData, which represents a process milestone.
 */
export interface HitoData {
  id: string;
  categoria: string;
  hito: string;
  siaper: string;
  normativa: string;
  linkNormativa: string;
  periodicidad: string;
  responsable: string;
  criticidad: string;
  plazoPerentorio: string;
  // Geographic fields for MapaGP extension
  lat?: number;
  lng?: number;
}
