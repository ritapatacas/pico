// /lib/geocode.ts
export async function geocodeAddress(address: string) {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`;
    const response = await fetch(url);
    const data = await response.json();
    if (data.length === 0) throw new Error("Address not found");
    return {
      lat: parseFloat(data[0].lat),
      lon: parseFloat(data[0].lon),
    };
  }
  