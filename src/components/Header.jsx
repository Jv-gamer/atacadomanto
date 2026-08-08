import React from "react";
import { ShoppingCart, Phone } from "lucide-react";
import logo from "../assets/logo.svg";

export default function Header({
  activeTab,
  setActiveTab,
  cartCount,
  onOpenCart,
}) {
  const navItems = [
    { id: "inicio", label: "Início" },
    { id: "brasil", label: "Brasileirão" },
    { id: "selecoes", label: "Seleções" },
    { id: "versoes", label: "Versões" },
    { id: "contato", label: "Contato" },
  ];

  const handleNavClick = (id) => {
    if (id === "contato") {
      const footer = document.getElementById("footer");
      if (footer) {
        footer.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      setActiveTab(id);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white border-b border-[#F0F0F0] shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Logo Section */}
        <div
          className="flex items-center gap-3 cursor-pointer select-none"
          onClick={() => handleNavClick("inicio")}
        >
          <img
            src={logo}
            alt="Atacadão dos Mantos Logo"
            className="w-10 h-10 object-contain"
          />
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold font-poppins text-[#111827] tracking-tight leading-none">
              ATACADÃO <span className="text-primary">DOS MANTOS</span>
            </h1>
            <p className="text-[10px] text-text-sec font-semibold tracking-wider uppercase font-inter mt-0.5">
              Distribuidora Premium
            </p>
          </div>
        </div>

        {/* Center Navigation Menu */}
        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`font-semibold font-poppins text-sm tracking-wide transition-colors py-2 relative ${
                  isActive
                    ? "text-primary"
                    : "text-text-main hover:text-primary-hover"
                }`}
              >
                {item.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-primary rounded-full" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-4">
          {/* Cart Icon Toggle */}
          <button
            onClick={onOpenCart}
            aria-label="Abrir carrinho"
            className="relative p-2.5 text-text-main hover:text-primary transition-colors hover:bg-[#F5F6F8] rounded-full"
          >
            <ShoppingCart className="w-6 h-6" />
            {cartCount > 0 && (
              <span className="absolute top-1.5 right-1.5 bg-[#EF4444] text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full font-montserrat shadow-sm">
                {cartCount}
              </span>
            )}
          </button>

          {/* Contact Button */}
          <a
            href="https://wa.me/5591992384582?text=Ol%C3%A1%21+Gostaria+de+saber+mais+sobre+o+cat%C3%A1logo+de+camisas+no+atacado."
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center gap-2 bg-[#0F766E] hover:bg-[#115E59] text-white px-5 py-3 rounded-lg text-sm font-semibold font-poppins transition-colors duration-200 shadow-md hover:shadow-lg"
          >
            <Phone className="w-4 h-4 fill-white" />
            Fale no WhatsApp
          </a>
        </div>
      </div>
    </header>
  );
}
