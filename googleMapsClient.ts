import fetch from "node-fetch";

const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY; // Récupère la clé API depuis les variables d'environnement
const BASE_URL = "https://maps.googleapis.com/maps/api/place";

export async function searchPlaces(query: string, type?: string): Promise<any> {
  const url = `${BASE_URL}/textsearch/json?query=${encodeURIComponent(
    query
  )}&type=${type || ""}&key=${GOOGLE_MAPS_API_KEY}`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Erreur API Google Maps: ${response.statusText}`);
  }

  const data = await response.json();
  if (data.error_message) {
    throw new Error(`Erreur API Google Maps: ${data.error_message}`);
  }

  return data.results;
}
