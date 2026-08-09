import React, { useState, useEffect } from "react";
import { X, Trash2, Plus, Minus, Truck, Send, MapPin } from "lucide-react";

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

  const [shippingType, setShippingType] = useState(null);
  const [shippingRates, setShippingRates] = useState({
    pac: 0,
    sedex: 0,
  });

  const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const itemsSubtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  // Recalcula o frete quando a quantidade muda
  useEffect(() => {
    if (address && totalQuantity > 0) {
      calculateShipping(totalQuantity);
    }
  }, [totalQuantity, address]);

  // ==============================
  // CONSULTAR CEP
  // ==============================
  const handleCepSearch = async (e) => {
    e.preventDefault();

    const cleanCep = cep.replace(/\D/g, "");

    if (cleanCep.length !== 8) {
      setCepError("Digite um CEP válido com 8 dígitos.");
      setAddress(null);
      setShippingType(null);
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

      if (!response.ok) {
        throw new Error("Erro na consulta do CEP.");
      }

      const data = await response.json();

      if (data.erro) {
        setCepError("CEP não encontrado.");
        return;
      }

      const newAddress = {
        rua: data.logradouro || "Área Geral",
        bairro: data.bairro || "Centro",
        cidade: data.localidade,
        uf: data.uf,
        cep: data.cep,
      };

      setAddress(newAddress);

      calculateShipping(totalQuantity);
    } catch (error) {
      console.error("Erro ao consultar CEP:", error);
      setCepError("Erro ao consultar o CEP. Tente novamente.");
    } finally {
      setLoadingCep(false);
    }
  };

  // ==============================
  // CÁLCULO DO FRETE
  // ==============================
  const calculateShipping = (qty) => {
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

  // ==============================
  // FINALIZAR PEDIDO
  // ==============================
  const handleCheckout = () => {
    if (cartItems.length === 0) return;

    let orderSummary = `*ATACADÃO DOS MANTOS* - NOVO PEDIDO\n`;
    orderSummary += `----------------------------------------\n\n`;

    cartItems.forEach((item, idx) => {
      orderSummary += `*${idx + 1}. ${item.title}*\n`;
      orderSummary += `   Tamanho: ${item.size} | Qtd: ${item.quantity}\n`;
      orderSummary += `   Unitário: R$ ${Number(item.price).toFixed(
        2,
      )} | Subtotal: R$ ${(item.price * item.quantity).toFixed(2)}\n\n`;
    });

    orderSummary += `----------------------------------------\n`;
    orderSummary += `*Quantidade total:* ${totalQuantity} ${
      totalQuantity === 1 ? "peça" : "peças"
    }\n`;
    orderSummary += `*Subtotal dos Mantos:* R$ ${itemsSubtotal.toFixed(2)}\n`;

    if (address && shippingType) {
      orderSummary += `*Frete (${shippingType.toUpperCase()}):* R$ ${selectedShippingCost.toFixed(
        2,
      )}\n`;

      orderSummary += `*Prazo estimado:* ${
        shippingType === "pac" ? "8-15 dias úteis" : "3-6 dias úteis"
      }\n`;

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

    // WhatsApp: (91) 99238-4582
    const whatsappNumber = "5591992384582";

    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
      orderSummary,
    )}`;

    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Fundo escurecido */}
      <div
        className="absolute inset-0 bg-black/40 dark:bg-black/60 transition-opacity"
        onClick={onClose}
      />

      {/* Painel lateral */}
      <div className="absolute inset-y-0 right-0 max-w-full flex">
        <div className="w-screen max-w-md bg-white dark:bg-slate-900 shadow-xl flex flex-col h-full text-left transition-colors duration-200">
          {/* ==============================
              CABEÇALHO
          ============================== */}
          <div className="p-6 border-b border-[#F0F0F0] dark:border-slate-800 flex items-center justify-between">
            <h2 className="text-lg font-bold font-poppins text-text-main dark:text-white flex items-center gap-2">
              Seu Carrinho Atacado
              <span className="bg-primary/10 dark:bg-teal-400/10 text-primary dark:text-teal-400 text-xs font-bold px-2 py-0.5 rounded-full font-montserrat">
                {totalQuantity} {totalQuantity === 1 ? "peça" : "peças"}
              </span>
            </h2>

            <button
              type="button"
              onClick={onClose}
              className="p-1 rounded-full text-text-sec hover:text-text-main dark:text-slate-400 dark:hover:text-white hover:bg-[#F5F6F8] dark:hover:bg-slate-800 transition-colors"
              aria-label="Fechar carrinho"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* ==============================
              CORPO
          ============================== */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Carrinho vazio */}
            {cartItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center text-text-sec dark:text-slate-400">
                <div className="bg-[#F5F6F8] dark:bg-slate-800 p-5 rounded-full mb-4">
                  <Truck className="w-10 h-10 text-primary/50 dark:text-teal-400/50" />
                </div>

                <h3 className="font-bold font-poppins text-text-main dark:text-white">
                  Seu carrinho está vazio
                </h3>

                <p className="text-xs font-inter mt-1 max-w-[250px]">
                  Navegue pelo nosso catálogo e selecione mantos para iniciar
                  sua cotação.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* ==============================
                    LISTA DE PRODUTOS
                ============================== */}
                {cartItems.map((item) => (
                  <div
                    key={`${item.id}-${item.size}`}
                    className="flex gap-4 p-4 rounded-xl border border-[#E5E7EB] dark:border-slate-800 bg-white dark:bg-slate-800/50 shadow-xs"
                  >
                    {/* Imagem */}
                    <img
                      src={
                        item.images && item.images[0]
                          ? item.images[0]
                          : "/placeholder-product.png"
                      }
                      alt={item.title}
                      className="w-16 h-16 object-cover rounded-lg border border-gray-100 dark:border-slate-700"
                    />

                    {/* Informações */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <h4 className="text-xs sm:text-sm font-bold font-poppins text-text-main dark:text-white line-clamp-1">
                          {item.title}
                        </h4>

                        <p className="text-[10px] text-text-sec dark:text-slate-400 font-bold font-inter uppercase mt-0.5">
                          Tamanho:{" "}
                          <span className="text-primary dark:text-teal-400">
                            {item.size}
                          </span>
                        </p>
                      </div>

                      {/* Quantidade */}
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center border border-gray-200 dark:border-slate-700 rounded-lg overflow-hidden">
                          {/* Diminuir */}
                          <button
                            type="button"
                            onClick={() =>
                              onUpdateQuantity(
                                item.id,
                                item.size,
                                item.quantity - 1,
                              )
                            }
                            disabled={item.quantity <= 1}
                            className="p-1.5 text-gray-500 dark:text-slate-400 hover:text-text-main dark:hover:text-white hover:bg-gray-100 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                            aria-label="Diminuir quantidade"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>

                          {/* Quantidade */}
                          <span className="px-2 text-xs font-bold font-inter text-text-main dark:text-white min-w-[28px] text-center">
                            {item.quantity}
                          </span>

                          {/* Aumentar */}
                          <button
                            type="button"
                            onClick={() =>
                              onUpdateQuantity(
                                item.id,
                                item.size,
                                item.quantity + 1,
                              )
                            }
                            className="p-1.5 text-gray-500 dark:text-slate-400 hover:text-text-main dark:hover:text-white hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
                            aria-label="Aumentar quantidade"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Remover */}
                        <button
                          type="button"
                          onClick={() => onRemoveItem(item.id, item.size)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30 p-1.5 rounded-lg transition-colors"
                          title="Remover item"
                          aria-label={`Remover ${item.title}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Preço */}
                    <div className="flex flex-col justify-end text-right">
                      <span className="text-xs sm:text-sm font-bold font-poppins text-primary dark:text-teal-400">
                        R$ {(item.price * item.quantity).toFixed(2)}
                      </span>

                      <span className="text-[9px] text-text-sec dark:text-slate-500 font-inter mt-0.5">
                        R$ {Number(item.price).toFixed(2)} / un.
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* ==============================
                SIMULADOR DE FRETE
            ============================== */}
            {cartItems.length > 0 && (
              <div className="border-t border-gray-100 dark:border-slate-800 pt-6 space-y-4">
                <div>
                  <h3 className="text-sm font-bold font-poppins text-text-main dark:text-white flex items-center gap-2">
                    <Truck className="w-4 h-4 text-primary dark:text-teal-400" />
                    Simulador de Frete
                  </h3>

                  <p className="text-[10px] text-text-sec dark:text-slate-500 font-inter mt-1">
                    Origem: Castanhal-PA
                  </p>
                </div>

                {/* CEP */}
                <form onSubmit={handleCepSearch} className="flex gap-2">
                  <input
                    type="text"
                    value={cep}
                    onChange={(e) => setCep(e.target.value)}
                    placeholder="Digite o CEP (Ex: 01001-000)"
                    maxLength={9}
                    className="flex-1 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg px-3 py-2 text-xs font-inter text-text-main dark:text-white placeholder:text-gray-400 dark:placeholder:text-slate-600 focus:outline-none focus:border-primary dark:focus:border-teal-400 font-semibold"
                  />

                  <button
                    type="submit"
                    disabled={loadingCep}
                    className="bg-[#0f766e] hover:bg-[#115e59] dark:bg-teal-600 dark:hover:bg-teal-500 disabled:bg-gray-300 dark:disabled:bg-slate-700 text-white px-4 py-2 rounded-lg text-xs font-bold font-poppins transition-colors"
                  >
                    {loadingCep ? "Buscando..." : "Calcular"}
                  </button>
                </form>

                {/* Erro */}
                {cepError && (
                  <p className="text-[10px] text-red-500 dark:text-red-400 font-inter font-semibold">
                    {cepError}
                  </p>
                )}

                {/* Endereço */}
                {address && (
                  <div className="bg-[#F5F6F8] dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-4 space-y-3">
                    <div className="flex gap-2">
                      <MapPin className="w-4 h-4 text-primary dark:text-teal-400 shrink-0 mt-0.5" />

                      <div>
                        <p className="text-[10px] font-bold font-poppins text-text-main dark:text-white uppercase">
                          Destinatário
                        </p>

                        <p className="text-[10px] text-text-sec dark:text-slate-400 font-inter mt-1">
                          {address.rua}, {address.bairro}
                        </p>

                        <p className="text-[10px] text-text-sec dark:text-slate-400 font-inter">
                          {address.cidade} - {address.uf} | CEP: {address.cep}
                        </p>
                      </div>
                    </div>

                    {/* Opções de frete */}
                    <div className="grid grid-cols-1 gap-2 pt-1">
                      {/* PAC */}
                      <button
                        type="button"
                        onClick={() => setShippingType("pac")}
                        className={`p-3 rounded-xl border-2 text-left transition-all ${
                          shippingType === "pac"
                            ? "border-primary dark:border-teal-500 bg-white dark:bg-slate-900 shadow-xs"
                            : "border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:border-primary/50 dark:hover:border-teal-500/50"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-xs font-bold font-poppins text-text-main dark:text-white">
                              PAC Correios
                            </p>

                            <p className="text-[10px] text-text-sec dark:text-slate-400 font-inter mt-0.5">
                              8 a 15 dias úteis
                            </p>
                          </div>

                          <span className="text-xs font-bold font-poppins text-primary dark:text-teal-400">
                            R$ {shippingRates.pac.toFixed(2)}
                          </span>
                        </div>
                      </button>

                      {/* SEDEX */}
                      <button
                        type="button"
                        onClick={() => setShippingType("sedex")}
                        className={`p-3 rounded-xl border-2 text-left transition-all ${
                          shippingType === "sedex"
                            ? "border-primary dark:border-teal-500 bg-white dark:bg-slate-900 shadow-xs"
                            : "border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:border-primary/50 dark:hover:border-teal-500/50"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-xs font-bold font-poppins text-text-main dark:text-white">
                              SEDEX Correios
                            </p>

                            <p className="text-[10px] text-text-sec dark:text-slate-400 font-inter mt-0.5">
                              3 a 6 dias úteis
                            </p>
                          </div>

                          <span className="text-xs font-bold font-poppins text-primary dark:text-teal-400">
                            R$ {shippingRates.sedex.toFixed(2)}
                          </span>
                        </div>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* ==============================
              RODAPÉ
          ============================== */}
          {cartItems.length > 0 && (
            <div className="border-t border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-4">
              {/* Subtotal */}
              <div className="flex items-center justify-between">
                <span className="text-xs font-inter text-text-sec dark:text-slate-400">
                  Mantos ({totalQuantity} Qtd):
                </span>

                <span className="text-sm font-bold font-poppins text-text-main dark:text-white">
                  R$ {itemsSubtotal.toFixed(2)}
                </span>
              </div>

              {/* Frete */}
              <div className="flex items-center justify-between">
                <span className="text-xs font-inter text-text-sec dark:text-slate-400">
                  Frete calculado:
                </span>

                <span className="text-xs font-bold font-poppins text-text-main dark:text-white">
                  {shippingType
                    ? `R$ ${selectedShippingCost.toFixed(2)}`
                    : "A combinar"}
                </span>
              </div>

              {/* Total */}
              <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-slate-800">
                <span className="text-sm font-bold font-poppins text-text-main dark:text-white">
                  Valor Total:
                </span>

                <span className="text-xl font-extrabold font-poppins text-primary dark:text-teal-400">
                  R$ {finalTotal.toFixed(2)}
                </span>
              </div>

              {/* Finalizar */}
              <button
                type="button"
                onClick={handleCheckout}
                className="w-full py-4 rounded-xl font-bold font-poppins text-sm uppercase tracking-wider flex items-center justify-center gap-2 transition-colors shadow-md bg-[#0f766e] hover:bg-[#115e59] dark:bg-teal-600 dark:hover:bg-teal-500 text-white cursor-pointer"
              >
                <Send className="w-4 h-4" />
                Finalizar Pedido via WhatsApp
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
