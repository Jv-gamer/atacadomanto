import React, { useState } from "react";
import { Check, Info, ShoppingBag, Trash2 } from "lucide-react";

export default function ProductCard({ product, onAddToCart, onOpenDetails, isAdmin = false, onDeleteProduct }) {
  const [selectedSize, setSelectedSize] = useState(null);
  const [sizeWarning, setSizeWarning] = useState(false);

  const sizes = ["P", "M", "G", "GG", "EG", "XG", "3G"];

  // Calculate total stock across all sizes
  const totalStock = Object.values(product.stock).reduce((a, b) => a + b, 0);

  const getStockStatus = () => {
    if (totalStock === 0) return { label: "Sem Estoque", color: "bg-red-100 text-red-800" };
    if (totalStock < 15) return { label: "Poucas Unidades", color: "bg-amber-100 text-amber-800" };
    return { label: "Estoque Disponível", color: "bg-emerald-100 text-emerald-800" };
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
    // Reset selection after adding
    setSelectedSize(null);
  };

  return (
    <div className="group bg-white rounded-2xl overflow-hidden border border-[#E5E7EB] hover:border-primary/20 hover:shadow-lg transition-all duration-300 flex flex-col h-full text-left">
      
      {/* Product Image Section */}
      <div className="relative pt-[100%] bg-white overflow-hidden cursor-pointer" onClick={() => onOpenDetails(product)}>
        <img
          src={product.images && product.images[0] ? product.images[0] : "https://images.unsplash.com/photo-1543351611-58f69d7c1781?q=80&w=600"}
          alt={product.title}
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
        />
        
        {/* Category Badge (Top-Left) */}
        <span className="absolute top-3 left-3 bg-primary text-white text-[11px] font-bold font-poppins px-2.5 py-1 rounded-md uppercase tracking-wider shadow-sm">
          {product.category}
        </span>

        {/* Stock Badge (Top-Right) */}
        <span className={`absolute top-3 right-3 text-[10px] font-bold font-inter px-2 py-0.5 rounded-md uppercase shadow-xs ${status.color}`}>
          {status.label}
        </span>

        {/* Delete Button (Admins only) */}
        {isAdmin && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              if (confirm(`Deseja realmente excluir "${product.title}" do catálogo?`)) {
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

      {/* Product Content Details */}
      <div className="p-5 flex flex-col flex-grow">
        
        {/* Title */}
        <h3 
          className="text-base font-bold font-poppins text-text-main line-clamp-1 hover:text-primary cursor-pointer transition-colors"
          onClick={() => onOpenDetails(product)}
        >
          {product.title}
        </h3>

        {/* Short description */}
        <p className="text-text-sec text-xs font-inter line-clamp-2 mt-1.5 flex-grow">
          {product.description}
        </p>

        {/* Price Tag */}
        <div className="mt-4 flex items-baseline gap-2">
          <span className="text-xl font-bold font-montserrat text-[#0F766E]">
            R$ {product.price.toFixed(2)}
          </span>
          {product.originalPrice && (
            <span className="text-xs font-semibold font-montserrat text-red-500 line-through">
              R$ {product.originalPrice.toFixed(2)}
            </span>
          )}
          <span className="text-[10px] text-text-sec font-bold font-inter ml-auto uppercase tracking-wide bg-[#F5F6F8] px-1.5 py-0.5 rounded">
            Atacado
          </span>
        </div>

        {/* Size Selection Grid */}
        <div className="mt-5">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-bold font-poppins text-text-main tracking-wide">
              TAMANHOS DISPONÍVEIS:
            </span>
            {selectedSize && (
              <span className="text-xs font-bold font-inter text-primary flex items-center gap-0.5">
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
                      ? "bg-gray-100 text-gray-300 border-gray-100 cursor-not-allowed"
                      : isSelected
                      ? "bg-primary text-white border-primary"
                      : "bg-white text-text-main border-gray-200 hover:border-primary/50 hover:bg-[#F5F6F8]"
                  }`}
                  title={hasStock ? `${stockCount} unidades em estoque` : "Sem estoque"}
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

        {/* CTA Buttons */}
        <div className="mt-5 flex flex-col gap-2">
          <button
            type="button"
            disabled={totalStock === 0}
            onClick={handleAddClick}
            className={`w-full py-3 rounded-xl font-bold font-poppins text-xs tracking-wider transition-colors flex items-center justify-center gap-2 uppercase shadow-xs ${
              totalStock === 0
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : selectedSize
                ? "bg-primary hover:bg-primary-hover text-white cursor-pointer"
                : "bg-primary/90 hover:bg-primary text-white cursor-pointer"
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            {selectedSize ? `ADICIONAR AO CARRINHO (${selectedSize})` : "Adicionar ao Carrinho"}
          </button>

          <button
            type="button"
            onClick={() => onOpenDetails(product)}
            className="w-full py-2.5 rounded-xl font-semibold font-poppins text-xs tracking-wide text-primary border border-primary/20 hover:border-primary hover:bg-[#F5F6F8] transition-colors flex items-center justify-center gap-1.5"
          >
            <Info className="w-3.5 h-3.5" />
            VER DETALHES & FOTOS
          </button>
        </div>

      </div>
    </div>
  );
}
