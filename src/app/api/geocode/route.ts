import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const lat = searchParams.get("lat");
  const lng = searchParams.get("lng");

  if (!lat || !lng) {
    return NextResponse.json({ error: "Latitude and longitude required" }, { status: 400 });
  }

  try {
    // Call Nominatim with User-Agent header from server side to prevent CORS & 403 blocks
    const nominatimUrl = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&addressdetails=1&zoom=18`;
    const res = await fetch(nominatimUrl, {
      headers: {
        "User-Agent": "MedRelay-Medicine-Delivery-App/1.0 (contact@medrelay.com)",
        "Accept-Language": "en-US,en;q=0.9",
      },
    });

    if (res.ok) {
      const data = await res.json();
      const addr = data.address || {};

      const road = addr.road || addr.pedestrian || addr.street || addr.footway || addr.path || "";
      const suburb = addr.suburb || addr.neighbourhood || addr.residential || addr.quarter || addr.colony || addr.village || "";
      const city = addr.city || addr.town || addr.city_district || addr.district || addr.county || addr.state_district || "";
      const state = addr.state || addr.region || addr.country || "";
      const pincode = addr.postcode || "";

      // Format accurate detailed address
      const areaParts = Array.from(new Set([road, suburb, city].filter(Boolean)));
      const areaName = areaParts.length > 0 ? areaParts.join(", ") : data.display_name || `Location (${lat}, ${lng})`;
      const cityName = [city || suburb, pincode, state].filter(Boolean).join(", ");

      return NextResponse.json({
        area: areaName,
        city: cityName,
        state: state || "India",
        displayName: data.display_name || areaName,
        address: addr,
        lat: Number(lat),
        lng: Number(lng),
      });
    }
  } catch (error) {
    console.error("Server geocode error:", error);
  }

  // Fallback to BigDataCloud if Nominatim fails
  try {
    const bdcUrl = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`;
    const res = await fetch(bdcUrl);
    if (res.ok) {
      const data = await res.json();
      const locality = data.locality || data.city || "";
      const city = data.city || data.locality || data.principalSubdivision || "";
      const state = data.principalSubdivision || data.countryName || "";
      const postcode = data.postcode || "";

      const areaName = locality && locality !== city ? `${locality}, ${city}` : (locality || city);
      const cityName = [city || locality, postcode, state].filter(Boolean).join(", ");

      return NextResponse.json({
        area: areaName,
        city: cityName,
        state,
        lat: Number(lat),
        lng: Number(lng),
      });
    }
  } catch (error) {
    console.error("BigDataCloud error:", error);
  }

  return NextResponse.json({
    area: `Live Coordinates (${Number(lat).toFixed(4)}°, ${Number(lng).toFixed(4)}°)`,
    city: "GPS Location",
    state: "Current Location",
    lat: Number(lat),
    lng: Number(lng),
  });
}
