const fetch = require("node-fetch");

// Récupère la clé API depuis les variables d'environnement
const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY;
if (!GOOGLE_MAPS_API_KEY) {
  throw new Error("La variable d'environnement GOOGLE_MAPS_API_KEY est manquante. Assurez-vous de l'avoir définie dans Railway.");
}

// Définir l'URL de base pour l'API Google Maps
const BASE_URL = "https://maps.googleapis.com/maps/api/place";

/**
 * Définit la structure des résultats renvoyés par l'API Google Maps.
 */
interface PlaceResult {
  name: string;
  formatted_address: string;
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
  [key: string]: any; // Pour d'autres propriétés dynamiques
}

/**
 * Recherche des lieux via l'API Google Maps en fonction d'une requête textuelle.
 *
 * @param query - La recherche textuelle pour les lieux
 * @param type - (Optionnel) Type de lieu (restaurants, hôtels, etc.)
 * @returns Une promesse contenant les résultats ou une erreur
 */
async function searchPlaces(query: string, type?: string): Promise<PlaceResult[]> {
  // Construire l'URL de la requête
  const url = `${BASE_URL}/textsearch/json?query=${encodeURIComponent(
    query
  )}&type=${type || ""}&key=${GOOGLE_MAPS_API_KEY}`;

  // Effectuer la requête HTTP
  const response = await fetch(url);

  // Vérifier si la réponse est valide
  if (!response.ok) {
    throw new Error(`Erreur API Google Maps: ${response.statusText}`);
  }

  // Convertir la réponse en JSON
  const data = (await response.json()) as { results: PlaceResult[]; error_message?: string };

  // Vérifier si l'API renvoie un message d'erreur
  if (data.error_message) {
    throw new Error(`Erreur API Google Maps: ${data.error_message}`);
  }

  // Retourner les résultats
  return data.results;
}

// Exporter la fonction pour l'utiliser ailleurs dans le projet
module.exports = {
  searchPlaces,
};
