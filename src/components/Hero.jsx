import React from "react";
import { Check } from "lucide-react";

export default function Hero({ onCatalogClick }) {
  const indicators = [
    "Envio para todo Brasil",
    "Frete rápido",
    "Pedido mínimo de 5 peças",
    "Produtos Premium",
  ];

  return (
    <section className="bg-white border-b border-[#F0F0F0] py-12 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Split Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Column: Branding Copy */}
          <div className="flex flex-col space-y-6 text-left">
            <span className="inline-block bg-[#0F766E]/10 text-primary text-xs font-bold font-poppins px-3 py-1.5 rounded-full uppercase tracking-wider self-start">
              Distribuidora Oficial
            </span>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold font-poppins text-text-main leading-tight">
              O maior atacado de <br />
              <span className="text-primary">camisas de futebol</span> do Brasil
            </h2>
            <p className="text-text-sec text-base sm:text-lg font-inter leading-relaxed max-w-xl">
              Trabalhamos com camisas nacionais e internacionais, versões
              torcedor e jogador, pedidos para lojistas, revendedores e compras
              em quantidade.
            </p>

            {/* Call to Actions */}
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <button
                onClick={onCatalogClick}
                className="bg-[#0F766E] hover:bg-[#115E59] text-white px-8 py-4 rounded-xl text-base font-semibold font-poppins transition-colors shadow-md hover:shadow-lg text-center"
              >
                VER CATÁLOGO
              </button>
              <a
                href="https://wa.me/5591992384582?text=Ol%C3%A1%21+Gostaria+de+fazer+um+pedido+de+camisas+no+atacado."
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white hover:bg-slate-50 text-primary border border-primary px-8 py-4 rounded-xl text-base font-semibold font-poppins transition-colors text-center"
              >
                PEDIR NO WHATSAPP
              </a>
            </div>
          </div>

          {/* Right Column: Hero Image */}
          <div className="relative w-full h-[320px] sm:h-[450px] rounded-2xl overflow-hidden shadow-lg border border-[#F0F0F0]">
            <img
              src="https://admin.cnnbrasil.com.br/wp-content/uploads/sites/12/2026/04/yamal_selecao_espanha-e1775651642227.jpg?w=1200&h=900&crop=0&quality=90"
              alt="Showroom de Camisas Esportivas Atacadão"
              className="w-full h-full object-cover"
            />
            {/* Subtle Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
            <div className="absolute bottom-6 left-6 text-white text-left hidden sm:block">
              <p className="text-xs uppercase tracking-widest font-semibold font-inter opacity-85">
                Showroom Exclusivo
              </p>
              <h3 className="text-xl font-bold font-poppins">
                Estoque Renovado Semanalmente
              </h3>
            </div>
          </div>
        </div>

        {/* B2B Trust Indicators Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-[#F0F0F0] grid grid-cols-2 md:grid-cols-4 gap-6">
          {indicators.map((indicator, index) => (
            <div
              key={index}
              className="flex items-center gap-3 p-4 rounded-xl bg-[#F5F6F8]/60 hover:bg-[#F5F6F8] transition-colors border border-[#F0F0F0] justify-center md:justify-start"
            >
              <div className="bg-[#0F766E]/10 p-1.5 rounded-full">
                <Check className="w-4 h-4 text-primary stroke-[3]" />
              </div>
              <span className="text-text-main font-semibold text-sm font-inter text-left">
                {indicator}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
