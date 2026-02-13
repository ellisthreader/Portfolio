import React, { useState } from "react";

export default function SpeakToArtist() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [projectType, setProjectType] = useState("Business Uniform");
  const [quantity, setQuantity] = useState("");
  const [budget, setBudget] = useState("");
  const [details, setDetails] = useState("");

  const handleSubmit = () => {
    alert("Your request has been sent! Our embroidery artist will contact you shortly.");
  };

  return (
    <div>
      <h1 className="text-4xl font-extrabold text-center mb-8">
        Speak to an Embroidery Artist
      </h1>

      <div className="space-y-6">

        <input
          type="text"
          placeholder="Full Name"
          className="w-full border p-3 rounded-xl"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="email"
          placeholder="Email Address"
          className="w-full border p-3 rounded-xl"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="tel"
          placeholder="Phone Number"
          className="w-full border p-3 rounded-xl"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />

        <select
          className="w-full border p-3 rounded-xl"
          value={projectType}
          onChange={(e) => setProjectType(e.target.value)}
        >
          <option>Business Uniform</option>
          <option>School Uniform</option>
          <option>Sports Team</option>
          <option>Custom Fashion</option>
          <option>Other</option>
        </select>

        <input
          type="number"
          placeholder="Estimated Quantity"
          className="w-full border p-3 rounded-xl"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
        />

        <input
          type="text"
          placeholder="Estimated Budget (£)"
          className="w-full border p-3 rounded-xl"
          value={budget}
          onChange={(e) => setBudget(e.target.value)}
        />

        <textarea
          placeholder="Describe your design in detail (placement, colours, stitching type, deadline etc.)"
          className="w-full border p-3 rounded-xl h-32"
          value={details}
          onChange={(e) => setDetails(e.target.value)}
        />

        <button
          onClick={handleSubmit}
          className="w-full bg-black text-white py-3 rounded-xl font-semibold hover:opacity-90 transition"
        >
          Request Detailed Quote
        </button>
      </div>
    </div>
  );
}
