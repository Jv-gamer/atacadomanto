import React, { useState, useEffect } from "react";
import { X, Check, ShoppingBag, Plus, Trash2, Edit, Save, AlertCircle } from "lucide-react";

export default function ProductDetailsModal({ 
  isOpen, 
  onClose, 
  product, 
  onAddToCart, 
  isAdmin = false, 
  onUpdateProduct // Callback from parent to persist changes in products list
}) {
  const [selectedSize, setSelectedSize] = useState(null);
  const [sizeWarning, setSizeWarning] = useState(false);
  const [activeImageIdx, setActiveImageIdx] = useState(0);

  // Admin edit state
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editCategory, setEditCategory] = useState("");
  const [editPrice, setEditPrice] = useState(0);
  const [editOriginalPrice, setEditOriginalPrice] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editTechDetails, setEditTechDetails] = useState("");
  const [editStock, setEditStock] = useState({});
  const [editImages, setEditImages] = useState([]);

  // Reset and load product details whenever it changes
  useEffect(() => {
    if (product) {
      setSelectedSize(null);
      setSizeWarning(false);
      setActiveImageIdx(0);
      setIsEditing(false);

      // Seed edit fields
      setEditTitle(product.title || "");
      setEditCategory(product.category || "");
      setEditPrice(product.price || 0);
      setEditOriginalPrice(product.originalPrice || "");
      setEditDescription(product.description || "");
      setEditTechDetails(product.technicalDetails || "");
      setEditStock({ ...(product.stock || {}) });
      setEditImages([...(product.images || [])]);
    }
  }, [product, isOpen]);

  if (!isOpen || !product) return null;

  const sizes = ["P", "M", "G", "GG", "EG", "XG", "3G"];
  
  // Size measurements sheet
  const sizeMeasurements = [
    { size: "P", width: "48 cm", length: "69 cm" },
    { size: "M", width: "50 cm", length: "71 cm" },
    { size: "G", width: "52 cm", length: "73 cm" },
    { size: "GG", width: "54 cm", length: "75 cm" },
    { size: "EG", width: "56 cm", length: "77 cm" },
    { size: "XG", width: "58 cm", length: "79 cm" },
    { size: "3G", width: "60 cm", length: "81 cm" }
  ];

  const handleAddClick = () => {
    if (!selectedSize) {
      setSizeWarning(true);
      return;
    }
    onAddToCart(product, selectedSize);
    onClose();
  };

  // Image Upload -> Base64
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditImages((prev) => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemoveImage = (idxToRemove) => {
    if (editImages.length <= 1) {
      alert("O manto precisa de pelo menos 1 imagem ativa.");
      return;
    }
    setEditImages((prev) => prev.filter((_, idx) => idx !== idxToRemove));
    if (activeImageIdx >= editImages.length - 1) {
      setActiveImageIdx(0);
    }
  };

  const handleStockChange = (size, val) => {
    const num = parseInt(val, 10);
    setEditStock((prev) => ({
      ...prev,
      [size]: isNaN(num) ? 0 : num
    }));
  };

  const handleSave = () => {
    const updated = {
      ...product,
      title: editTitle,
      category: editCategory,
      price: parseFloat(editPrice) || 0,
      originalPrice: editOriginalPrice !== "" ? parseFloat(editOriginalPrice) : undefined,
      description: editDescription,
      technicalDetails: editTechDetails,
      stock: editStock,
      images: editImages
    };

    onUpdateProduct(updated);
    setIsEditing(false);
  };

  const totalStock = Object.values(isEditing ? editStock : product.stock).reduce((a, b) => a + b, 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 transition-opacity" onClick={onClose} />

      {/* Modal Container */}
      <div className="relative bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col z-10 text-left border border-gray-100">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 bg-[#F5F6F8] hover:bg-gray-200 text-text-sec hover:text-text-main rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Admin floating Edit mode trigger */}
        {isAdmin && (
          <div className="bg-amber-50 border-b border-amber-200 px-6 py-3.5 flex items-center justify-between">
            <span className="text-xs font-bold text-amber-800 font-poppins flex items-center gap-1.5 uppercase">
              <AlertCircle className="w-4 h-4" /> Modo Administrador Ativo
            </span>
            <button
              onClick={() => {
                if (isEditing) {
                  handleSave();
                } else {
                  setIsEditing(true);
                }
              }}
              className="flex items-center gap-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold px-4 py-2 rounded-lg font-poppins uppercase tracking-wider transition-colors shadow-xs"
            >
              {isEditing ? (
                <>
                  <Save className="w-3.5 h-3.5" /> Salvar Edições
                </>
              ) : (
                <>
                  <Edit className="w-3.5 h-3.5" /> Editar Manto
                </>
              )}
            </button>
          </div>
        )}

        <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-8 overflow-y-auto">
          
          {/* Left Column: Image Gallery & Upload controls */}
          <div className="space-y-4">
            
            {/* Main Active Image */}
            <div className="relative pt-[100%] bg-white border border-[#E5E7EB] rounded-xl overflow-hidden shadow-xs">
              <img
                src={isEditing ? editImages[activeImageIdx] : (product.images && product.images[activeImageIdx] ? product.images[activeImageIdx] : "https://images.unsplash.com/photo-1543351611-58f69d7c1781?q=80&w=600")}
                alt={editTitle}
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>

            {/* Thumbnail Carousel / Grid */}
            <div className="flex flex-wrap gap-2.5 items-center">
              {(isEditing ? editImages : product.images).map((img, idx) => (
                <div key={idx} className="relative group/thumb">
                  <button
                    onClick={() => setActiveImageIdx(idx)}
                    className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                      activeImageIdx === idx ? "border-primary" : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <img src={img} alt={`Thumb ${idx}`} className="w-full h-full object-cover" />
                  </button>
                  
                  {/* Delete button on image for admins */}
                  {isEditing && (
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(idx)}
                      className="absolute -top-1.5 -right-1.5 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600 transition-colors opacity-0 group-hover/thumb:opacity-100"
                      title="Deletar foto"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  )}
                </div>
              ))}

              {/* Photo Upload Box for Admin */}
              {isEditing && (
                <label className="w-16 h-16 border-2 border-dashed border-gray-300 hover:border-primary bg-[#F5F6F8] rounded-lg flex flex-col items-center justify-center cursor-pointer transition-colors text-text-sec hover:text-primary">
                  <Plus className="w-5 h-5" />
                  <span className="text-[9px] font-bold font-inter mt-1">Upload</span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              )}
            </div>

            {/* Technical Specs box */}
            <div className="bg-[#F5F6F8] rounded-xl p-5 border border-gray-200/50">
              <h4 className="text-xs font-bold font-poppins text-text-main tracking-wider uppercase mb-2">
                Ficha Técnica
              </h4>
              {isEditing ? (
                <textarea
                  value={editTechDetails}
                  onChange={(e) => setEditTechDetails(e.target.value)}
                  className="w-full bg-white border border-gray-200 rounded-lg p-3 text-xs font-inter focus:outline-none focus:border-primary font-semibold"
                  rows="3"
                />
              ) : (
                <p className="text-xs font-inter text-text-sec leading-relaxed whitespace-pre-line">
                  {product.technicalDetails || "Nenhuma informação técnica cadastrada."}
                </p>
              )}
            </div>
          </div>

          {/* Right Column: Descriptions, Size Selection, Measurements & Action Buttons */}
          <div className="flex flex-col space-y-6">
            
            {/* Title & Category Info */}
            <div>
              {isEditing ? (
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-text-sec uppercase">Título do Manto</label>
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm font-bold font-poppins focus:outline-none focus:border-primary"
                  />
                  
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <div>
                      <label className="text-[10px] font-bold text-text-sec uppercase">Categoria</label>
                      <input
                        type="text"
                        value={editCategory}
                        onChange={(e) => setEditCategory(e.target.value)}
                        className="w-full bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-xs font-semibold focus:outline-none focus:border-primary"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-text-sec uppercase">Preço Atacado</label>
                      <input
                        type="number"
                        step="0.01"
                        value={editPrice}
                        onChange={(e) => setEditPrice(e.target.value)}
                        className="w-full bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-xs font-semibold focus:outline-none focus:border-primary font-price"
                      />
                    </div>
                  </div>

                  <div className="mt-2">
                    <label className="text-[10px] font-bold text-text-sec uppercase">Preço Original (De / Para - Opcional)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={editOriginalPrice}
                      onChange={(e) => setEditOriginalPrice(e.target.value)}
                      className="w-full bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-xs font-semibold focus:outline-none focus:border-primary font-price"
                      placeholder="Ex: 129.90"
                    />
                  </div>
                </div>
              ) : (
                <>
                  <span className="text-xs font-bold text-primary tracking-wider uppercase bg-primary/10 px-2.5 py-1 rounded-md">
                    {product.category}
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-extrabold font-poppins text-text-main mt-3">
                    {product.title}
                  </h2>
                  
                  {/* Prices display */}
                  <div className="mt-3 flex items-baseline gap-3">
                    <span className="text-2xl font-bold font-montserrat text-[#0F766E]">
                      R$ {product.price.toFixed(2)}
                    </span>
                    {product.originalPrice && (
                      <span className="text-sm font-semibold font-montserrat text-red-500 line-through">
                        R$ {product.originalPrice.toFixed(2)}
                      </span>
                    )}
                    <span className="text-[10px] font-extrabold text-[#F59E0B] border border-[#F59E0B]/20 bg-[#F59E0B]/5 px-2 py-0.5 rounded uppercase tracking-wider">
                      Preço de Distribuidora
                    </span>
                  </div>
                </>
              )}
            </div>

            {/* Description Textarea */}
            <div>
              <h4 className="text-xs font-bold font-poppins text-text-main tracking-wider uppercase mb-2">
                Descrição do Manto
              </h4>
              {isEditing ? (
                <textarea
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="w-full bg-white border border-gray-200 rounded-lg p-3 text-xs font-inter focus:outline-none focus:border-primary font-semibold"
                  rows="3"
                />
              ) : (
                <p className="text-xs font-inter text-text-sec leading-relaxed">
                  {product.description}
                </p>
              )}
            </div>

            {/* Sizes stock configuration or size selection */}
            <div>
              <h4 className="text-xs font-bold font-poppins text-text-main tracking-wider uppercase mb-3">
                {isEditing ? "Editar Estoque por Tamanho" : "Selecione o Tamanho"}
              </h4>

              {isEditing ? (
                <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                  {sizes.map((size) => (
                    <div key={size} className="text-center">
                      <label className="block text-[10px] font-bold text-text-sec uppercase mb-1 font-montserrat">{size}</label>
                      <input
                        type="number"
                        min="0"
                        value={editStock[size] || 0}
                        onChange={(e) => handleStockChange(size, e.target.value)}
                        className="w-full bg-white border border-gray-200 rounded-lg px-2 py-1 text-xs text-center font-bold focus:outline-none focus:border-primary font-montserrat"
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-7 gap-2">
                  {sizes.map((size) => {
                    const count = product.stock[size] || 0;
                    const isAvailable = count > 0;
                    const isSelected = selectedSize === size;

                    return (
                      <button
                        key={size}
                        disabled={!isAvailable}
                        onClick={() => {
                          setSelectedSize(size);
                          setSizeWarning(false);
                        }}
                        className={`py-2 text-xs font-extrabold font-montserrat rounded-xl border text-center transition-all ${
                          !isAvailable
                            ? "bg-gray-100 text-gray-300 border-gray-100 cursor-not-allowed"
                            : isSelected
                            ? "bg-primary text-white border-primary"
                            : "bg-white text-text-main border-gray-200 hover:border-primary/50 hover:bg-[#F5F6F8]"
                        }`}
                      >
                        {size}
                      </button>
                    );
                  })}
                </div>
              )}
              {sizeWarning && !isEditing && (
                <p className="text-[11px] font-semibold text-red-500 font-inter mt-2 flex items-center gap-1 animate-pulse">
                  Por favor, escolha o tamanho desejado antes de adicionar.
                </p>
              )}
            </div>

            {/* Clear Measurements table (Netshoes style) */}
            {!isEditing && (
              <div className="border border-gray-100 rounded-xl overflow-hidden">
                <table className="min-w-full divide-y divide-gray-100 text-center">
                  <thead className="bg-[#F5F6F8]">
                    <tr>
                      <th scope="col" className="px-4 py-2 text-[10px] font-bold text-text-sec uppercase font-poppins">Tamanho</th>
                      <th scope="col" className="px-4 py-2 text-[10px] font-bold text-text-sec uppercase font-poppins">Largura</th>
                      <th scope="col" className="px-4 py-2 text-[10px] font-bold text-text-sec uppercase font-poppins">Comprimento</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-xs font-semibold text-text-main font-montserrat">
                    {sizeMeasurements.map((m) => (
                      <tr 
                        key={m.size} 
                        className={`hover:bg-[#F5F6F8]/30 transition-colors ${selectedSize === m.size ? "bg-primary/5" : ""}`}
                      >
                        <td className="px-4 py-1.5 font-bold text-primary">{m.size}</td>
                        <td className="px-4 py-1.5 text-text-sec">{m.width}</td>
                        <td className="px-4 py-1.5 text-text-sec">{m.length}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Add to Cart button */}
            {!isEditing && (
              <div className="pt-4 border-t border-[#F0F0F0] mt-auto">
                <button
                  type="button"
                  disabled={totalStock === 0}
                  onClick={handleAddClick}
                  className={`w-full py-4 rounded-xl font-bold font-poppins text-xs tracking-wider uppercase transition-all flex items-center justify-center gap-2 shadow-sm ${
                    totalStock === 0
                      ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                      : selectedSize
                      ? "bg-primary hover:bg-primary-hover text-white cursor-pointer"
                      : "bg-[#0f766e] hover:bg-[#115e59] text-white cursor-pointer"
                  }`}
                >
                  <ShoppingBag className="w-4 h-4" />
                  {selectedSize ? `ADICIONAR AO CARRINHO (TAMANHO ${selectedSize})` : "Adicionar ao Carrinho"}
                </button>
              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
}
