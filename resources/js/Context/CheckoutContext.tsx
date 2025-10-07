import React, { createContext, useContext, useState, ReactNode } from "react";
import { useCart } from "@/Context/CartContext";

interface Address {
  firstName: string;
  lastName: string;
  phone: string;
  country: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  postcode: string;
}

interface ShippingService {
  code: string;
  name: string;
  cost: number;
}

interface CheckoutContextType {
  email: string;
  setEmail: (val: string) => void;
  phone: string;
  setPhone: (val: string) => void;

  address: Address;
  setAddress: React.Dispatch<React.SetStateAction<Address>>;

  // ✅ Explicit country control for DeliveryInfo
  country: string;
  setCountry: (val: string) => void;

  availableServices: ShippingService[];
  setAvailableServices: React.Dispatch<React.SetStateAction<ShippingService[]>>;

  shippingMethod: string;
  setShippingMethod: (val: string) => void;
  shippingCost: number;
  setShippingCost: (val: number) => void;

  discount: string;
  setDiscount: (val: string) => void;
  appliedDiscount: number;
  setAppliedDiscount: (val: number) => void;

  loading: boolean;
  setLoading: (val: boolean) => void;
  error: string | null;
  setError: (val: string | null) => void;
}

const CheckoutContext = createContext<CheckoutContextType | undefined>(undefined);

export const CheckoutProvider = ({ children }: { children: ReactNode }) => {
  const { cart } = useCart();

  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const [address, setAddress] = useState<Address>({
    firstName: "",
    lastName: "",
    phone: "",
    country: "United Kingdom",
    addressLine1: "",
    addressLine2: "",
    city: "",
    postcode: "",
  });

  // ✅ Isolate country for easier access
  const [country, setCountry] = useState("United Kingdom");

  const [availableServices, setAvailableServices] = useState<ShippingService[]>([]);
  const [shippingMethod, setShippingMethod] = useState("");
  const [shippingCost, setShippingCost] = useState(0);

  const [discount, setDiscount] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState(0);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <CheckoutContext.Provider
      value={{
        email,
        setEmail,
        phone,
        setPhone,
        address,
        setAddress,
        country,
        setCountry, // ✅ Now accessible to DeliveryInfo
        availableServices,
        setAvailableServices,
        shippingMethod,
        setShippingMethod,
        shippingCost,
        setShippingCost,
        discount,
        setDiscount,
        appliedDiscount,
        setAppliedDiscount,
        loading,
        setLoading,
        error,
        setError,
      }}
    >
      {children}
    </CheckoutContext.Provider>
  );
};

export const useCheckout = (): CheckoutContextType => {
  const ctx = useContext(CheckoutContext);
  if (!ctx) throw new Error("useCheckout must be used within CheckoutProvider");
  return ctx;
};
