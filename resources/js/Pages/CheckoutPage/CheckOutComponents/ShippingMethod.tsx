import React, { useEffect, useState } from "react";
import { useDarkMode } from "@/Context/DarkModeContext";
import { useCheckout } from "@/Context/CheckoutContext";

interface ShippoRate {
  object_id: string;
  provider: string;
  servicelevel: { name: string };
  amount: string;
}

export default function ShippingMethod() {
  const { darkMode } = useDarkMode();
  const {
    address,
    product,
    availableServices,
    setAvailableServices,
    shippingMethod,
    setShippingMethod,
    setShippingCost,
  } = useCheckout();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // --- Product parcel dimensions ---
  const parcel = (() => {
    switch (product) {
      case "webdev":
        return { length: "25", width: "20", height: "3", distance_unit: "cm", weight: "1", mass_unit: "kg" };
      case "tiktok":
        return { length: "40", width: "30", height: "15", distance_unit: "cm", weight: "3", mass_unit: "kg" };
      case "marketing":
        return { length: "30", width: "25", height: "5", distance_unit: "cm", weight: "1.2", mass_unit: "kg" };
      default:
        return { length: "20", width: "15", height: "5", distance_unit: "cm", weight: "1", mass_unit: "kg" };
    }
  })();

  // ✅ Helper: check if address is complete enough to fetch rates
  const isAddressComplete = () => {
    return (
      address.firstName &&
      address.lastName &&
      address.addressLine1 &&
      address.city &&
      address.postcode &&
      address.country
    );
  };

  // ✅ Fetch shipping rates whenever address becomes complete
  useEffect(() => {
    if (!isAddressComplete()) {
      console.log("[ShippingMethod] Address incomplete — skipping rate fetch.", address);
      return;
    }

    async function fetchRates() {
      console.log("[ShippingMethod] Fetching shipping rates...", { address, parcel });
      setLoading(true);
      setError("");
      setAvailableServices([]);

      try {
        const response = await fetch("/api/shipping/rates", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            to_address: {
              name: `${address.firstName || ""} ${address.lastName || ""}`.trim(),
              street1: address.addressLine1,
              street2: address.addressLine2 || "",
              city: address.city,
              zip: address.postcode,
              country: address.country,
            },
            parcel,
          }),
        });

        const text = await response.text();
        if (!response.ok) throw new Error(`Failed to fetch shipping rates (${response.status})`);

        let data: ShippoRate[];
        try {
          data = JSON.parse(text);
        } catch {
          throw new Error("Invalid JSON returned from server");
        }

        if (!Array.isArray(data) || data.length === 0) {
          console.warn("[ShippingMethod] No rates found in response:", data);
          setError("No shipping options available for this address");
          return;
        }

        console.log("[ShippingMethod] Rates received:", data);
        setAvailableServices(data);
      } catch (err: any) {
        console.error("[ShippingMethod] Error fetching rates:", err);
        setError(err.message || "Error fetching shipping rates");
      } finally {
        setLoading(false);
      }
    }

    fetchRates();
  }, [
    address.firstName,
    address.lastName,
    address.addressLine1,
    address.city,
    address.postcode,
    address.country,
    product,
  ]);

  // --- When user selects a rate ---
  const handleSelect = (rateId: string) => {
    setShippingMethod(rateId);
    const selected = availableServices.find((r) => r.object_id === rateId);
    if (selected) {
      setShippingCost(parseFloat(selected.amount));
      console.log("[ShippingMethod] Selected shipping method:", selected);
    }
  };

  // --- UI ---
  if (loading)
    return (
      <div className={`p-6 rounded-xl shadow ${darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"}`}>
        <p>Loading shipping options...</p>
      </div>
    );

  if (error)
    return (
      <div className={`p-6 rounded-xl shadow ${darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"}`}>
        <p className="text-red-500">{error}</p>
      </div>
    );

  if (!availableServices.length)
    return (
      <div className={`p-6 rounded-xl shadow ${darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"}`}>
        <p>No shipping options available.</p>
      </div>
    );

  return (
    <div
      className={`p-6 rounded-xl shadow transition-colors ${
        darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"
      }`}
    >
      <h2 className="text-xl font-semibold mb-4">Shipping Method</h2>

      <select
        value={shippingMethod}
        onChange={(e) => handleSelect(e.target.value)}
        className={`w-full p-3 border rounded-lg transition-colors ${
          darkMode
            ? "bg-gray-800 border-gray-700 text-white"
            : "bg-gray-50 border-gray-300 text-gray-900"
        }`}
        required
      >
        <option value="">Select shipping method</option>
        {availableServices.map((s) => (
          <option key={s.object_id} value={s.object_id}>
            {s.provider} - {s.servicelevel?.name || "Unknown"} (£{parseFloat(s.amount).toFixed(2)})
          </option>
        ))}
      </select>
    </div>
  );
}
