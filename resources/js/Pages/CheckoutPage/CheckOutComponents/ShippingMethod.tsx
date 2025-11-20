import React, { useEffect, useState } from "react";
import { useDarkMode } from "@/Context/DarkModeContext";
import { useCheckout } from "@/Context/CheckoutContext";
import { getCountryCode } from "@/Utils/countryCodes";

interface ShippoRate {
  object_id: string;
  provider: string;
  servicelevel: { name: string };
  amount: string;
  estimated_days?: number;
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

  const isAddressComplete = () =>
    address.firstName &&
    address.lastName &&
    address.addressLine1 &&
    address.city &&
    address.postcode &&
    address.country;

  // ✅ Fetch rates when address is complete
  useEffect(() => {
    if (!isAddressComplete()) return;

    async function fetchRates() {
      setLoading(true);
      setError("");
      setAvailableServices([]);

      try {
        const isoCountry =
          address.country?.length === 2
            ? address.country.toUpperCase()
            : getCountryCode(address.country) || address.country;

        const payload = {
          to_address: {
            name: `${address.firstName || ""} ${address.lastName || ""}`.trim(),
            street1: address.addressLine1,
            street2: address.addressLine2 || "",
            city: address.city,
            zip: address.postcode,
            country: isoCountry,
          },
          parcel,
        };

        console.log("[ShippingMethod] Sending payload:", payload);

        const response = await fetch("/api/shipping/rates", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
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
          setError("No shipping options available for this address");
          return;
        }

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

  const handleSelect = (rateId: string) => {
    setShippingMethod(rateId);
    const selected = availableServices.find((r) => r.object_id === rateId);
    if (selected) {
      setShippingCost(parseFloat(selected.amount));
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

      <div className="grid gap-4">
        {availableServices.map((s) => {
          const isSelected = s.object_id === shippingMethod;
          return (
            <div
              key={s.object_id}
              onClick={() => handleSelect(s.object_id)}
              className={`cursor-pointer border rounded-xl p-4 transition-all
                ${darkMode ? "border-gray-700 bg-gray-800 hover:border-indigo-400" : "border-gray-300 bg-gray-50 hover:border-indigo-500"}
                ${isSelected ? "ring-2 ring-indigo-500 shadow-lg" : "hover:shadow-md"}
              `}
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium text-lg">
                    {s.provider} — {s.servicelevel?.name || "Standard"}
                  </p>
                  {s.estimated_days && (
                    <p className="text-sm text-gray-500">
                      Estimated delivery: {s.estimated_days} day{s.estimated_days > 1 ? "s" : ""}
                    </p>
                  )}
                </div>
                <p className="font-semibold text-indigo-500 text-lg">
                  £{parseFloat(s.amount).toFixed(2)}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
