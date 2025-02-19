"use client";
import { createHash } from 'crypto';
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRol } from "../../../context/RolContext";
import { hash } from "crypto";
interface WompiProps {
  publicKey: string;
  currency: string;
  amountInCents: number;
  reference: string;
  signature: string;
  signatureIntegrity: string;
  redirectUrl: string;
  expirationTime?: string;
  vatTaxInCents?: number;
  consumptionTaxInCents?: number;
  customerEmail: string;
  customerFullName: string;
  customerPhone: string;
  customerLegalId: string;
  customerLegalIdType: string;
  shippingAddress: string;
  shippingCountry: string;
  shippingPhone: string;
  shippingCity: string;
  shippingRegion: string;
  buttonText?: string;
  className?: string;
}

const Wompi: React.FC<WompiProps> = ({
  publicKey= "",
  currency= "COP",
  amountInCents= 1000000,
  reference="REF_Test1",
  //esta firma se debe validar SOLO en back esto es solo para pruebas
  signature=reference+amountInCents+currency+"",
  signatureIntegrity=createHash("sha256").update(signature,'utf8').digest('hex').toLowerCase(),//Crypto.SHA256(signature).toString(Crypto.enc.Hex),
  redirectUrl="https://guayaba-frontend.vercel.app/",
  expirationTime,
  vatTaxInCents,
  consumptionTaxInCents,
  customerEmail,
  customerFullName,
  customerPhone,
  customerLegalId,
  customerLegalIdType,
  shippingAddress,
  shippingCountry,
  shippingPhone,
  shippingCity,
  shippingRegion,
  buttonText = "Pagar con Wompi",
  className = ""

}) => {
  return (
    <form 
      action="https://checkout.wompi.co/p/" 
      method="GET"
      className={className}
    >
      <input type="hidden" name="public-key" value={publicKey} />
      <input type="hidden" name="currency" value={currency} />
      <input type="hidden" name="amount-in-cents" value={amountInCents} />
      <input type="hidden" name="reference" value={reference} />
      <input type="hidden" name="signature:integrity" value={signatureIntegrity} />
      <input type="hidden" name="redirect-url" value={redirectUrl} />

      {expirationTime && (
        <input type="hidden" name="expiration-time" value={expirationTime} />
      )}

      {vatTaxInCents && (
        <input type="hidden" name="tax-in-cents:vat" value={vatTaxInCents} />
      )}

      {consumptionTaxInCents && (
        <input
          type="hidden"
          name="tax-in-cents:consumption"
          value={consumptionTaxInCents}
        />
      )}

      <input type="hidden" name="customer-data:email" value={customerEmail} />
      <input type="hidden" name="customer-data:full-name" value={customerFullName} />
      <input type="hidden" name="customer-data:phone-number" value={customerPhone} />
      <input type="hidden" name="customer-data:legal-id" value={customerLegalId} />
      <input
        type="hidden"
        name="customer-data:legal-id-type"
        value={customerLegalIdType}
      />

      

      <button
        type="submit"
        className="wompi-button bg-primary text-white py-2 px-6 rounded hover:bg-primary-dark transition-colors"
      >
        {buttonText}
      </button>
    </form>
  );
};

export default Wompi;