"use client";

import Wompi from './components/wompi'; 
import { Header, Footer } from '../../../components';

export default function WompiPage() {
  console.log(process.env.NEXT_PUBLIC_WOMPI_PUBKEY)
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="bg-[#E8F4E8] py-16">
      <h1>Pago con Wompi</h1>
      <Wompi />
      </div>
      <Footer />
    </div>
  );
}