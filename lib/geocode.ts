// lib/geocode.ts
export async function geocodeAddress(address: string) {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
      address
    )}`;
  
    const response = await fetch(url, {
      headers: {
        "User-Agent": "frutos-vermelhos/1.0 (teu-email@dominio.pt)",
        "Accept-Language": "pt-PT",
      },
    });
  
    if (!response.ok) throw new Error("Geocoding failed");
  
    const data = await response.json();
    if (data.length === 0) throw new Error("Address not found");
  
    return {
      lat: parseFloat(data[0].lat),
      lon: parseFloat(data[0].lon),
      displayName: data[0].display_name,
    };
  }
  