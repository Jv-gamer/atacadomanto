import React, { useState, useEffect } from "react";
import {
  X,
  Trash2,
  Plus,
  Minus,
  Truck,
  Send,
  AlertTriangle,
  MapPin,
} from "lucide-react";

export default function CartDrawer({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
}) {
  const [cep, setCep] = useState("");
  const [address, setAddress] = useState(null);
  const [loadingCep, setLoadingCep] = useState(false);
  const [cepError, setCepError] = useState("");

  // Shipping options
  const [shippingType, setShippingType] = useState(null); // 'pac' | 'sedex' | null
  const [shippingRates, setShippingRates] = useState({ pac: 0, sedex: 0 });

  const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const itemsSubtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  // Minimum B2B order rule
  const minOrderQuantity = 5;
  const isMinOrderMet = totalQuantity >= minOrderQuantity;

  // Recalculate shipping whenever cart quantity changes
  useEffect(() => {
    if (address && totalQuantity > 0) {
      calculateShipping(totalQuantity);
    }
  }, [totalQuantity, address]);

  const handleCepSearch = async (e) => {
    e.preventDefault();
    const cleanCep = cep.replace(/\D/g, "");

    if (cleanCep.length !== 8) {
      setCepError("Digite um CEP válido com 8 dígitos.");
      setAddress(null);
      return;
    }

    setLoadingCep(true);
    setCepError("");
    setAddress(null);
    setShippingType(null);

    try {
      const response = await fetch(
        `https://viacep.com.br/ws/${cleanCep}/json/`,
      );
      const data = await response.json();

      if (data.erro) {
        setCepError("CEP não encontrado.");
      } else {
        setAddress({
          rua: data.logradouro || "Área Geral",
          bairro: data.bairro || "Centro",
          cidade: data.localidade,
          uf: data.uf,
          cep: data.cep,
        });
        calculateShipping(totalQuantity);
      }
    } catch (err) {
      setCepError("Erro ao consultar o CEP. Tente novamente.");
    } finally {
      setLoadingCep(false);
    }
  };

  const calculateShipping = (qty) => {
    // Castanhal-PA Shipping Formula
    // Base flat rates + weight incremental (R$ 3.00/unit for PAC, R$ 5.00/unit for SEDEX after first item)
    const pacBase = 35.0;
    const sedexBase = 65.0;
    const pacExtra = (qty - 1) * 3.0;
    const sedexExtra = (qty - 1) * 5.0;

    setShippingRates({
      pac: pacBase + Math.max(0, pacExtra),
      sedex: sedexBase + Math.max(0, sedexExtra),
    });
  };

  const selectedShippingCost = shippingType ? shippingRates[shippingType] : 0;
  const finalTotal = itemsSubtotal + selectedShippingCost;

  const handleCheckout = () => {
    if (!isMinOrderMet) return;

    // Compile WhatsApp message
    let orderSummary = `*ATACADÃO DOS MANTOS* - NOVO PEDIDO\n`;
    orderSummary += `----------------------------------------\n\n`;

    cartItems.forEach((item, idx) => {
      orderSummary += `*${idx + 1}. ${item.title}*\n`;
      orderSummary += `   Tamanho: ${item.size} | Qtd: ${item.quantity}\n`;
      orderSummary += `   Unitário: R$ ${item.price.toFixed(2)} | Subtotal: R$ ${(item.price * item.quantity).toFixed(2)}\n\n`;
    });

    orderSummary += `----------------------------------------\n`;
    orderSummary += `*Subtotal dos Mantos:* R$ ${itemsSubtotal.toFixed(2)}\n`;

    if (address && shippingType) {
      orderSummary += `*Frete (${shippingType.toUpperCase()}):* R$ ${selectedShippingCost.toFixed(2)}\n`;
      orderSummary += `*Prazo estimado:* ${shippingType === "pac" ? "8-15 dias úteis" : "3-6 dias úteis"}\n`;
      orderSummary += `*Endereço de Entrega:*\n`;
      orderSummary += `   ${address.rua}, ${address.bairro}\n`;
      orderSummary += `   ${address.cidade} - ${address.uf} | CEP: ${address.cep}\n`;
    } else {
      orderSummary += `*Frete:* A retirar / Combinar frete\n`;
    }

    orderSummary += `\n*TOTAL FINAL:* R$ ${finalTotal.toFixed(2)}\n\n`;
    orderSummary += `----------------------------------------\n`;
    orderSummary += `Origem da Distribuidora: Castanhal-PA\n`;
    orderSummary += `Por favor, envie seus dados de faturamento para emitirmos seu boleto/chave PIX.`;

    const whatsappUrl = `https://wa.me/559192384582?text=${encodeURIComponent(orderSummary)}`;
    window.open(whatsappUrl, "_blank");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 transition-opacity"
        onClick={onClose}
      />

      <div className="absolute inset-y-0 right-0 max-w-full flex">
        {/* Drawer container */}
        <div className="w-screen max-w-md bg-white shadow-xl flex flex-col h-full text-left">
          {/* Header */}
          <div className="p-6 border-b border-[#F0F0F0] flex items-center justify-between">
            <h2 className="text-lg font-bold font-poppins text-text-main flex items-center gap-2">
              Seu Carrinho Atacado
              <span className="bg-primary/10 text-primary text-xs font-bold px-2 py-0.5 rounded-full font-montserrat">
                {totalQuantity} {totalQuantity === 1 ? "peça" : "peças"}
              </span>
            </h2>
            <button
              onClick={onClose}
              className="p-1 rounded-full text-text-sec hover:text-text-main hover:bg-[#F5F6F8] transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Drawer Body (Scrollable) */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Minimum Order Warning Alert */}
            {!isMinOrderMet && cartItems.length > 0 && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3 text-left">
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-amber-800 font-poppins">
                    Pedido Mínimo de Atacado
                  </h4>
                  <p className="text-xs text-amber-700 font-inter mt-1 leading-relaxed">
                    Você selecionou{" "}
                    <strong className="font-semibold">{totalQuantity}</strong>{" "}
                    {totalQuantity === 1 ? "peça" : "peças"}. Para comprar no
                    preço de fábrica, seu pedido deve conter no mínimo{" "}
                    <strong className="font-semibold">
                      {minOrderQuantity}
                    </strong>{" "}
                    peças. Adicione mais{" "}
                    <strong className="font-semibold">
                      {minOrderQuantity - totalQuantity}
                    </strong>{" "}
                    {minOrderQuantity - totalQuantity === 1 ? "peça" : "peças"}.
                  </p>
                </div>
              </div>
            )}

            {/* Cart Items list */}
            {cartItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center text-text-sec">
                <div className="bg-[#F5F6F8] p-5 rounded-full mb-4">
                  <Truck className="w-10 h-10 text-primary/50" />
                </div>
                <h3 className="font-bold font-poppins text-text-main">
                  Seu carrinho está vazio
                </h3>
                <p className="text-xs font-inter mt-1 max-w-[250px]">
                  Navegue pelo nosso catálogo e selecione mantos para iniciar
                  sua cotação de atacado.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div
                    key={`${item.id}-${item.size}`}
                    className="flex gap-4 p-4 rounded-xl border border-[#E5E7EB] bg-white shadow-xs"
                  >
                    <img
                      src={
                        item.images && item.images[0]
                          ? item.images[0]
                          : "https://images.unsplash.com/photo-1543351611-58f69d7c1781?q=80&w=150"
                      }
                      alt={item.title}
                      className="w-16 h-16 object-cover rounded-lg border border-gray-100"
                    />
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <h4 className="text-xs sm:text-sm font-bold font-poppins text-text-main line-clamp-1">
                          {item.title}
                        </h4>
                        <p className="text-[10px] text-text-sec font-bold font-inter uppercase mt-0.5">
                          Tamanho:{" "}
                          <span className="text-primary">{item.size}</span>
                        </p>
                      </div>

                      {/* Quantity & Actions Bar */}
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center border border-gray-200 rounded-lg">
                          <button
                            onClick={() =>
                              onUpdateQuantity(
                                item.id,
                                item.size,
                                item.quantity - 1,
                              )
                            }
                            className="p-1 text-gray-500 hover:text-text-main transition-colors"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="px-2 text-xs font-bold font-montserrat text-text-main min-w-[20px] text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              onUpdateQuantity(
                                item.id,
                                item.size,
                                item.quantity + 1,
                              )
                            }
                            className="p-1 text-gray-500 hover:text-text-main transition-colors"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <button
                          onClick={() => onRemoveItem(item.id, item.size)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1.5 rounded-lg transition-colors"
                          title="Remover item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-bold font-montserrat text-primary">
                        R$ {(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Shipping Calculator Section */}
            {cartItems.length > 0 && (
              <div className="bg-[#F5F6F8] rounded-2xl p-5 border border-gray-100">
                <h3 className="text-xs font-bold font-poppins text-text-main tracking-wider uppercase mb-3 flex items-center gap-1.5">
                  <Truck className="w-4 h-4 text-primary" />
                  Simulador de Frete (Origem: Castanhal-PA)
                </h3>

                <form onSubmit={handleCepSearch} className="flex gap-2">
                  <input
                    type="text"
                    value={cep}
                    onChange={(e) => setCep(e.target.value)}
                    placeholder="Digite o CEP (Ex: 01001-000)"
                    className="flex-1 bg-white border border-gray-200 rounded-lg px-3 py-2 text-xs font-inter focus:outline-none focus:border-primary font-semibold"
                  />
                  <button
                    type="submit"
                    disabled={loadingCep}
                    className="bg-primary hover:bg-primary-hover text-white text-xs font-bold px-4 py-2 rounded-lg font-poppins uppercase tracking-wider transition-colors disabled:opacity-55"
                  >
                    {loadingCep ? "Buscando..." : "Calcular"}
                  </button>
                </form>

                {cepError && (
                  <p className="text-[11px] font-semibold text-red-500 font-inter mt-2">
                    {cepError}
                  </p>
                )}

                {address && (
                  <div className="mt-4 space-y-3">
                    {/* Displayed Address */}
                    <div className="bg-white p-3 rounded-lg border border-gray-200/50 flex gap-2">
                      <MapPin className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                      <div className="text-left">
                        <p className="text-xs font-bold text-text-main font-poppins">
                          Destinatário
                        </p>
                        <p className="text-[10px] text-text-sec font-semibold font-inter mt-0.5 leading-tight">
                          {address.rua}, {address.bairro}
                          <br />
                          {address.cidade} - {address.uf} | CEP: {address.cep}
                        </p>
                      </div>
                    </div>

                    {/* Shipping Options Rates */}
                    <div className="grid grid-cols-2 gap-2">
                      {/* PAC Option */}
                      <button
                        type="button"
                        onClick={() => setShippingType("pac")}
                        className={`p-3 rounded-xl border-2 text-left transition-all ${
                          shippingType === "pac"
                            ? "border-primary bg-white shadow-xs"
                            : "border-gray-200 bg-white hover:border-gray-300"
                        }`}
                      >
                        <p className="text-[10px] font-bold text-text-sec uppercase font-inter">
                          PAC Correios
                        </p>
                        <p className="text-sm font-extrabold text-primary font-montserrat mt-0.5">
                          R$ {shippingRates.pac.toFixed(2)}
                        </p>
                        <p className="text-[9px] font-semibold text-text-sec font-inter mt-1">
                          8 a 15 dias úteis
                        </p>
                      </button>

                      {/* SEDEX Option */}
                      <button
                        type="button"
                        onClick={() => setShippingType("sedex")}
                        className={`p-3 rounded-xl border-2 text-left transition-all ${
                          shippingType === "sedex"
                            ? "border-primary bg-white shadow-xs"
                            : "border-gray-200 bg-white hover:border-gray-300"
                        }`}
                      >
                        <p className="text-[10px] font-bold text-text-sec uppercase font-inter">
                          SEDEX Correios
                        </p>
                        <p className="text-sm font-extrabold text-primary font-montserrat mt-0.5">
                          R$ {shippingRates.sedex.toFixed(2)}
                        </p>
                        <p className="text-[9px] font-semibold text-text-sec font-inter mt-1">
                          3 a 6 dias úteis
                        </p>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Drawer Footer Summary */}
          {cartItems.length > 0 && (
            <div className="p-6 border-t border-[#F0F0F0] bg-white space-y-4 shadow-2xl">
              {/* Financial Breakdown */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-semibold text-text-sec font-inter">
                  <span>Mantos ({totalQuantity} Qtd):</span>
                  <span className="font-bold font-montserrat text-text-main">
                    R$ {itemsSubtotal.toFixed(2)}
                  </span>
                </div>

                <div className="flex justify-between text-xs font-semibold text-text-sec font-inter">
                  <span>Frete calculado:</span>
                  <span className="font-bold font-montserrat text-text-main">
                    {shippingType
                      ? `R$ ${selectedShippingCost.toFixed(2)}`
                      : "A combinar"}
                  </span>
                </div>

                <div className="pt-3 border-t border-gray-100 flex justify-between items-baseline">
                  <span className="text-sm font-bold font-poppins text-text-main">
                    Valor Total:
                  </span>
                  <span className="text-2xl font-extrabold font-montserrat text-[#0F766E]">
                    R$ {finalTotal.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Checkout Trigger */}
              <button
                type="button"
                disabled={!isMinOrderMet}
                onClick={handleCheckout}
                className={`w-full py-4 rounded-xl font-bold font-poppins text-sm uppercase tracking-wider flex items-center justify-center gap-2 transition-colors shadow-md ${
                  isMinOrderMet
                    ? "bg-[#0f766e] hover:bg-[#115e59] text-white cursor-pointer"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }`}
              >
                <Send className="w-4 h-4 fill-white text-[#0f766e] group-disabled:text-gray-400" />
                Finalizar Pedido via WhatsApp
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
