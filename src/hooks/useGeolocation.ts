"use client";
import { useState, useCallback } from "react";

interface GeoState {
  loading: boolean;
  error: string | null;
  address: string | null;
  coords: string | null;
}

export function useGeolocation() {
  const [geo, setGeo] = useState<GeoState>({
    loading: false,
    error: null,
    address: null,
    coords: null,
  });

  const detect = useCallback(() => {
    if (!navigator.geolocation) {
      setGeo((p) => ({ ...p, error: "Geolocation not supported by your browser" }));
      return;
    }

    setGeo({ loading: true, error: null, address: null, coords: null });

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        const coords = `${latitude.toFixed(5)}, ${longitude.toFixed(5)}`;

        // Reverse geocode via Nominatim (free, no key needed)
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`,
            { headers: { "User-Agent": "CivicComplaintCopilot/1.0" } }
          );
          const data = await res.json();
          const address = data.display_name || coords;
          setGeo({ loading: false, error: null, address, coords });
        } catch {
          // Reverse geocode failed — use raw coords
          setGeo({ loading: false, error: null, address: coords, coords });
        }
      },
      (err) => {
        const msg =
          err.code === 1
            ? "Location access denied. Please enter manually."
            : err.code === 2
            ? "Location unavailable. Please enter manually."
            : "Location request timed out. Please enter manually.";
        setGeo({ loading: false, error: msg, address: null, coords: null });
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, []);

  return { ...geo, detect };
}
