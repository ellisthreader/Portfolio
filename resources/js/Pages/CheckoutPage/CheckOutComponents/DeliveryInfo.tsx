import React, { useEffect, useRef } from "react";
import { useDarkMode } from "@/Context/DarkModeContext";
import { useCheckout } from "@/Context/CheckoutContext";
import { Autocomplete, useLoadScript } from "@react-google-maps/api";
import { getCountryCode } from "@/Utils/countryCodes";

export default function DeliveryInfo() {
  const { darkMode } = useDarkMode();
  const { address, setAddress, country, setCountry } = useCheckout();

  const inputRef = useRef<HTMLInputElement | null>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const logPrefix = "[DeliveryInfo]";

  // --- Google Maps API ---
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string,
    libraries: ["places"],
  });

  // --- Countries List ---
  const countries = [
    "Australia", "Austria", "Belgium", "Canada", "Croatia", "Cyprus", "Czech Republic",
    "Denmark", "Estonia", "Finland", "France", "Germany", "Greece", "Hong Kong",
    "Hungary", "Iceland", "India", "Indonesia", "Ireland", "Israel", "Italy", "Japan",
    "Latvia", "Lithuania", "Luxembourg", "Malaysia", "Malta", "Mexico", "Netherlands",
    "New Zealand", "Norway", "Philippines", "Poland", "Portugal", "Singapore",
    "Slovakia", "Slovenia", "South Korea", "Spain", "Sweden", "Switzerland", "Taiwan",
    "Thailand", "Turkey", "United Arab Emirates", "United Kingdom", "United States", "Vietnam"
  ];

  // --- Styling ---
  const inputStyle = `w-full rounded-lg border p-3 transition-colors duration-200 focus:ring-2 focus:ring-indigo-500 ${
    darkMode
      ? "bg-gray-800 border-gray-700 text-gray-100 placeholder-gray-400"
      : "bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500"
  }`;

  // --- Autocomplete Setup ---
  const handleLoadAutocomplete = (autoC: google.maps.places.Autocomplete) => {
    autocompleteRef.current = autoC;
    const iso = getCountryCode(country);
    if (iso) autoC.setComponentRestrictions({ country: iso });
    console.log(`${logPrefix} Autocomplete loaded, restricted to:`, country);
  };

  // 🔁 Update restriction dynamically if user changes country
  useEffect(() => {
    const auto = autocompleteRef.current;
    if (auto) {
      const iso = getCountryCode(country);
      if (iso) {
        auto.setComponentRestrictions({ country: iso });
        console.log(`${logPrefix} Autocomplete restriction updated to:`, iso);
      }
    }
  }, [country]);

  const handlePlaceChanged = () => {
    const auto = autocompleteRef.current;
    if (!auto) return;
    const place = auto.getPlace();
    if (!place.address_components) return;

    const comps = place.address_components;
    const street_number = comps.find(c => c.types.includes("street_number"))?.long_name || "";
    const route = comps.find(c => c.types.includes("route"))?.long_name || "";
    const locality =
      comps.find(c => c.types.includes("locality"))?.long_name ||
      comps.find(c => c.types.includes("postal_town"))?.long_name || "";
    const postal_code = comps.find(c => c.types.includes("postal_code"))?.long_name || "";
    const countryComp = comps.find(c => c.types.includes("country"))?.long_name;

    setAddress(prev => ({
      ...prev,
      addressLine1: `${street_number} ${route}`.trim(),
      city: locality || prev.city,
      postcode: postal_code || prev.postcode,
      country: countryComp && countries.includes(countryComp) ? countryComp : prev.country,
    }));

    if (countryComp && countries.includes(countryComp)) setCountry(countryComp);

    console.log(`${logPrefix} Place changed:`, { street_number, route, locality, postal_code, countryComp });
  };

  const handleChange =
    (key: keyof typeof address) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const value = e.target.value;
      if (key === "country") setCountry(value);
      setAddress(prev => ({ ...prev, [key]: value }));
    };

  if (!isLoaded) return <p>Loading address autocomplete...</p>;

  return (
    <div
      className={`p-6 rounded-xl shadow transition-colors ${
        darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"
      }`}
    >
      <h2 className="text-xl font-semibold mb-4">Delivery Information</h2>

      {/* Name */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <input
          className={inputStyle}
          value={address.firstName}
          onChange={handleChange("firstName")}
          placeholder="First Name"
          required
        />
        <input
          className={inputStyle}
          value={address.lastName}
          onChange={handleChange("lastName")}
          placeholder="Last Name"
          required
        />
      </div>

      {/* Country */}
      <div className="mt-4">
        <select
          className={`${inputStyle} appearance-none`}
          value={country}
          onChange={handleChange("country")}
          required
        >
          <option value="">Select country</option>
          {countries.map(c => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      {/* Address Line 1 */}
      <div className="mt-4">
        <Autocomplete onLoad={handleLoadAutocomplete} onPlaceChanged={handlePlaceChanged}>
          <input
            className={inputStyle}
            ref={inputRef}
            value={address.addressLine1}
            onChange={handleChange("addressLine1")}
            placeholder="Address Line 1"
            required
          />
        </Autocomplete>
      </div>

      {/* Address Line 2 */}
      <div className="mt-4">
        <input
          className={inputStyle}
          value={address.addressLine2}
          onChange={handleChange("addressLine2")}
          placeholder="Address Line 2 (optional)"
        />
      </div>

      {/* City + Postcode */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
        <input
          className={inputStyle}
          value={address.city}
          onChange={handleChange("city")}
          placeholder="City"
          required
        />
        <input
          className={inputStyle}
          value={address.postcode}
          onChange={handleChange("postcode")}
          placeholder="Postcode"
          required
        />
      </div>

      {/* Phone (optional) */}
      <div className="mt-4">
        <input
          className={inputStyle}  
          value={address.phone}
          onChange={handleChange("phone")}
          placeholder="Phone number (optional)"
        />
      </div>
    </div>
  );
}
