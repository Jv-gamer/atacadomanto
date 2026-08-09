import React, { useState } from "react";
import { Check, Info, ShoppingBag, Trash2 } from "lucide-react";

export default function ProductCard({
  product,
  onAddToCart,
  onOpenDetails,
  isAdmin = false,
  onDeleteProduct,
}) {
  const [selectedSize, setSelectedSize] = useState(null);
  const [sizeWarning, setSizeWarning] = useState(false);

  const sizes = ["P", "M", "G", "XL", "2XL", "3XL"];

  // Calcula o estoque total somando todos os tamanhos
  const totalStock = Object.values(product.stock).reduce((a, b) => a + b, 0);

  const getStockStatus = () => {
    if (totalStock === 0)
      return {
        label: "Sem Estoque",
        color: "bg-red-100 dark:bg-red-900/40 text-red-800 dark:text-red-300",
      };

    if (totalStock < 15)
      return {
        label: "Poucas Unidades",
        color:
          "bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300",
      };

    return {
      label: "Estoque Disponível",
      color:
        "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-300",
    };
  };

  const status = getStockStatus();

  const handleSizeClick = (size) => {
    setSelectedSize(size);
    setSizeWarning(false);
  };

  const handleAddClick = (e) => {
    e.stopPropagation();
    if (!selectedSize) {
      setSizeWarning(true);
      return;
    }
    onAddToCart(product, selectedSize);
    setSelectedSize(null);
  };

  return (
    <div className="group bg-white dark:bg-slate-800 rounded-2xl overflow-hidden border border-[#E5E7EB] dark:border-slate-700 hover:border-primary/20 hover:shadow-lg transition-all duration-300 flex flex-col h-full text-left">
      {/* Imagem do Produto */}
      <div
        className="relative pt-[100%] bg-white dark:bg-slate-800 overflow-hidden cursor-pointer"
        onClick={() => onOpenDetails(product)}
      >
        <img
          src={
            product.images && product.images[0]
              ? product.images[0]
              : "https://unsplash.com"
          }
          alt={product.title}
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
        />

        {/* Badge da Categoria */}
        <span className="absolute top-3 left-3 bg-primary text-white text-[11px] font-bold font-poppins px-2.5 py-1 rounded-md uppercase tracking-wider shadow-sm">
          {product.category}
        </span>

        {/* Badge de Status do Estoque */}
        <span
          className={`absolute top-3 right-3 text-[10px] font-bold font-inter px-2 py-0.5 rounded-md uppercase shadow-xs ${status.color}`}
        >
          {status.label}
        </span>

        {/* Botão de Excluir (Apenas Admin) */}
        {isAdmin && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              if (
                confirm(
                  `Deseja realmente excluir "${product.title}" do catálogo?`,
                )
              ) {
                onDeleteProduct(product.id);
              }
            }}
            className="absolute bottom-3 right-3 bg-red-600 hover:bg-red-700 text-white rounded-lg p-2 shadow-md hover:shadow-lg transition-all z-10 cursor-pointer"
            title="Excluir Manto"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Detalhes e Textos */}
      <div className="p-5 flex flex-col flex-grow">
        <h3
          className="text-base font-bold font-poppins text-text-main dark:text-white line-clamp-1 hover:text-primary cursor-pointer transition-colors"
          onClick={() => onOpenDetails(product)}
        >
          {product.title}
        </h3>

        <p className="text-text-sec dark:text-slate-400 text-xs font-inter line-clamp-2 mt-1.5 flex-grow">
          {product.description}
        </p>

        {/* Preços */}
        <div className="mt-4 flex items-baseline gap-2">
          <span className="text-xl font-bold font-montserrat text-[#0F766E] dark:text-teal-400">
            R$ {product.price.toFixed(2)}
          </span>

          {product.originalPrice && (
            <span className="text-xs font-semibold font-montserrat text-red-500 line-through">
              R$ {product.originalPrice.toFixed(2)}
            </span>
          )}

          <span className="text-[10px] text-text-sec dark:text-slate-300 font-bold font-inter ml-auto uppercase tracking-wide bg-[#F5F6F8] dark:bg-slate-700 px-1.5 py-0.5 rounded">
            Atacado
          </span>
        </div>

        {/* Seleção de Tamanhos */}
        <div className="mt-5">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-bold font-poppins text-text-main dark:text-slate-200 tracking-wide">
              TAMANHOS DISPONÍVEIS:
            </span>
            {selectedSize && (
              <span className="text-xs font-bold font-inter text-primary dark:text-teal-400 flex items-center gap-0.5">
                {selectedSize} Selecionado <Check className="w-3.5 h-3.5" />
              </span>
            )}
          </div>

          <div className="grid grid-cols-7 gap-1.5">
            {sizes.map((size) => {
              const stockCount = product.stock[size] || 0;
              const hasStock = stockCount > 0;
              const isSelected = selectedSize === size;

              return (
                <button
                  key={size}
                  type="button"
                  disabled={!hasStock}
                  onClick={() => handleSizeClick(size)}
                  className={`py-1.5 text-xs font-extrabold font-montserrat rounded-lg transition-all border text-center ${
                    !hasStock
                      ? "bg-gray-100 dark:bg-slate-700 text-gray-300 dark:text-slate-500 border-gray-100 dark:border-slate-700 cursor-not-allowed"
                      : isSelected
                        ? "bg-primary text-white border-primary"
                        : "bg-white dark:bg-slate-700 text-text-main dark:text-white border-gray-200 dark:border-slate-600 hover:border-primary/50 hover:bg-[#F5F6F8] dark:hover:bg-slate-600"
                  }`}
                  title={hasStock ? `${stockCount} unidades` : "Sem estoque"}
                >
                  {size}
                </button>
              );
            })}
          </div>

          {sizeWarning && (
            <p className="text-[11px] font-semibold font-inter text-red-500 mt-2 flex items-center gap-1 animate-pulse">
              Por favor, selecione um tamanho antes de adicionar.
            </p>
          )}
        </div>

        {/* Botões de Ação */}
        <div className="mt-5 flex flex-col gap-2">
          <button
            type="button"
            disabled={totalStock === 0}
            onClick={handleAddClick}
            className={`w-full py-3 rounded-xl font-bold font-poppins text-xs tracking-wider transition-colors flex items-center justify-center gap-2 uppercase shadow-xs ${
              totalStock === 0
                ? "bg-gray-200 dark:bg-slate-700 text-gray-400 dark:text-slate-500 cursor-not-allowed"
                : "bg-primary hover:bg-primary-hover text-white cursor-pointer"
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            {selectedSize
              ? `ADICIONAR AO CARRINHO (${selectedSize})`
              : "Adicionar ao Carrinho"}
          </button>

          <button
            type="button"
            onClick={() => onOpenDetails(product)}
            className="w-full py-2.5 rounded-xl font-semibold font-poppins text-xs tracking-wide text-primary dark:text-teal-400 border border-primary/20 dark:border-teal-500/30 hover:border-primary dark:hover:border-teal-500 hover:bg-[#F5F6F8] dark:hover:bg-slate-700 transition-colors flex items-center justify-center gap-1.5"
          >
            <Info className="w-3.5 h-3.5" />
            VER DETALHES & FOTOS
          </button>
        </div>
      </div>
    </div>
  );
}
