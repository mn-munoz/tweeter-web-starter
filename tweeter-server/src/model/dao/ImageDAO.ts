// AI-assisted: see AI-ATTRIBUTION.md

export interface ImageDAO {
  // Stores a base64-encoded image and returns its public URL.
  putImage(fileName: string, imageStringBase64Encoded: string): Promise<string>;
}
