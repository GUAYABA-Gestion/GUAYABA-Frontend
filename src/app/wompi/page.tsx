"use client";
import { createHash } from "crypto";
import { useState } from "react";

interface WompiProps {
  publicKey?: string;
  currency?: string;
  amountInCents?: number;
  reference?: string;
  redirectUrl?: string;
  expirationTime?: string;
  vatTaxInCents?: number;
  consumptionTaxInCents?: number;
  buttonText?: string;
  className?: string;
}

const Wompi: React.FC<WompiProps> = ({
  publicKey = process.env.WOMPI_PUBKEY,
  currency = "COP",
  amountInCents = 1000000,
  reference = "REF_Test1",
  redirectUrl = "https://guayaba-frontend.vercel.app/",
  expirationTime,
  vatTaxInCents,
  consumptionTaxInCents,
  buttonText = "Pagar con Wompi",
  className = ""
}) => {
  // Mapping of services to their respective amount and reference
  const serviceOptions: {
    [key: string]: { amountInCents: number; reference: string };
  } = {
    "60 horas de servicio por 1 mes": {
      amountInCents: 1000000,
      reference: "REF_60H"
    },
    "Subscripcion a la plataforma": {
      amountInCents: 2000000,
      reference: "REF_SUBS"
    },
    "Licenciamiento de la plataforma": {
      amountInCents: 3000000,
      reference: "REF_LICENSE"
    }
  };

  // State for service selection
  const [selectedService, setSelectedService] = useState("");

  // States for customer data
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerFullName, setCustomerFullName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerLegalId, setCustomerLegalId] = useState("");
  const [customerLegalIdType, setCustomerLegalIdType] = useState("");

  // Update amount and reference based on selected service
  let serviceAmount = amountInCents;
  let serviceReference = reference;
  let computedSignature = "";
  let computedSignatureIntegrity = "";

  if (selectedService) {
    const serviceDetails = serviceOptions[selectedService];
    serviceAmount = serviceDetails.amountInCents;
    serviceReference = serviceDetails.reference;
    computedSignature =
      serviceReference +
      serviceAmount +
      currency +
      process.env.WOMPI_INTEGRITY;
    computedSignatureIntegrity = createHash("sha256")
      .update(computedSignature, "utf8")
      .digest("hex")
      .toLowerCase();
  }

  return (
    <form
      action="https://checkout.wompi.co/p/"
      method="GET"
      className={`max-w-2xl mx-auto p-6 bg-white shadow-md rounded ${className}`}
    >
      {/* Service selection */}
      <div className="mb-6">
        <label className="block text-lg font-medium mb-2 text-gray-800" htmlFor="service">
          Selecciona tu servicio
        </label>
        <select
          id="service"
          onChange={(e) => setSelectedService(e.target.value)}
          value={selectedService}
          className="w-full p-2 border border-gray-300 rounded bg-white text-gray-800"
          required
        >
          <option value="" disabled>
            Elige tu servicio
          </option>
          {Object.keys(serviceOptions).map((option) => (
            <option key={option} value={option} className="bg-white text-gray-800">
              {option}
            </option>
          ))}
        </select>
      </div>

      {/* Customer Information */}
      <div className="mb-6 p-4 bg-gray-50 border rounded">
        <h3 className="text-xl font-semibold mb-4 text-gray-800">Información del Cliente</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 text-gray-800" htmlFor="customerEmail">
              Email
            </label>
            <input
              type="email"
              id="customerEmail"
              name="customer-data:email"
              value={customerEmail}
              onChange={(e) => setCustomerEmail(e.target.value)}
              placeholder="tuemail@ejemplo.com"
              className="w-full p-2 border border-gray-300 rounded bg-white text-gray-800"
              required
            />
          </div>
          <div>
            <label className="block mb-1 text-gray-800" htmlFor="customerFullName">
              Nombre Completo
            </label>
            <input
              type="text"
              id="customerFullName"
              name="customer-data:full-name"
              value={customerFullName}
              onChange={(e) => setCustomerFullName(e.target.value)}
              placeholder="Tu nombre completo"
              className="w-full p-2 border border-gray-300 rounded bg-white text-gray-800"
              required
            />
          </div>
          <div>
            <label className="block mb-1 text-gray-800" htmlFor="customerPhone">
              Teléfono
            </label>
            <input
              type="tel"
              id="customerPhone"
              name="customer-data:phone-number"
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              placeholder="Número de teléfono"
              className="w-full p-2 border border-gray-300 rounded bg-white text-gray-800"
              required
            />
          </div>
          <div>
            <label className="block mb-1 text-gray-800" htmlFor="customerLegalId">
              Documento de Identidad
            </label>
            <input
              type="text"
              id="customerLegalId"
              name="customer-data:legal-id"
              value={customerLegalId}
              onChange={(e) => setCustomerLegalId(e.target.value)}
              placeholder="Número de documento"
              className="w-full p-2 border border-gray-300 rounded bg-white text-gray-800"
              required
            />
          </div>
          <div>
            <label className="block mb-1 text-gray-800" htmlFor="customerLegalIdType">
              Tipo de Documento
            </label>
            <input
              type="text"
              id="customerLegalIdType"
              name="customer-data:legal-id-type"
              value={customerLegalIdType}
              onChange={(e) => setCustomerLegalIdType(e.target.value)}
              placeholder="Ej. CC, NIT"
              className="w-full p-2 border border-gray-300 rounded bg-white text-gray-800"
              required
            />
          </div>
        </div>
      </div>

      {/* Hidden inputs for Wompi */}
      <input type="hidden" name="public-key" value={publicKey} />
      <input type="hidden" name="currency" value={currency} />
      <input type="hidden" name="amount-in-cents" value={serviceAmount} />
      <input type="hidden" name="reference" value={serviceReference} />
      <input
        type="hidden"
        name="signature:integrity"
        value={computedSignatureIntegrity}
      />
      <input type="hidden" name="redirect-url" value={redirectUrl} />

      {expirationTime && (
        <input type="hidden" name="expiration-time" value={expirationTime} />
      )}

      {vatTaxInCents && (
        <input
          type="hidden"
          name="tax-in-cents:vat"
          value={vatTaxInCents}
        />
      )}

      {consumptionTaxInCents && (
        <input
          type="hidden"
          name="tax-in-cents:consumption"
          value={consumptionTaxInCents}
        />
      )}

      <button
        type="submit"
        disabled={!selectedService}
        className={`w-full mt-4 py-3 px-6 bg-green-600 text-white rounded transition-colors ${
          !selectedService ? "opacity-50 cursor-not-allowed" : "hover:bg-green-700"
        }`}
      >
        {buttonText}
      </button>
    </form>
  );
};

export default Wompi;
