import React, { useState, useEffect } from "react";
import {
  X,
  ShoppingBag,
  Plus,
  Trash2,
  Edit,
  Save,
  AlertCircle,
} from "lucide-react";
import { supabase } from "../lib/supabase";

export default function ProductDetailsModal({
  isOpen,
  onClose,
  product,
  onAddToCart,
  isAdmin = false,
  onUpdateProduct,
}) {
  const [selectedSize, setSelectedSize] = useState(null);
  const [sizeWarning, setSizeWarning] = useState(false);
  const [activeImageIdx, setActiveImageIdx] = useState(0);

  // Estados de edição do administrador
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editCategory, setEditCategory] = useState("");
  const [editPrice, setEditPrice] = useState(0);
  const [editOriginalPrice, setEditOriginalPrice] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editTechDetails, setEditTechDetails] = useState("");
  const [editStock, setEditStock] = useState({});
  const [editImages, setEditImages] = useState([]);

  useEffect(() => {
    if (product) {
      setSelectedSize(null);
      setSizeWarning(false);
      setActiveImageIdx(0);
      setIsEditing(false);

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

  const sizeMeasurements = [
    { size: "P", width: "48 cm", length: "69 cm" },
    { size: "M", width: "50 cm", length: "71 cm" },
    { size: "G", width: "52 cm", length: "73 cm" },
    { size: "GG", width: "54 cm", length: "75 cm" },
    { size: "EG", width: "56 cm", length: "77 cm" },
    { size: "XG", width: "58 cm", length: "79 cm" },
    { size: "3G", width: "60 cm", length: "81 cm" },
  ];

  const currentImages = isEditing ? editImages : product.images || [];

  const handleAddClick = () => {
    if (!selectedSize) {
      setSizeWarning(true);
      return;
    }

    onAddToCart(product, selectedSize);
    onClose();
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files || []);

    if (!files.length) return;

    for (const file of files) {
      try {
        const fileExt = file.name.split(".").pop();
        const fileName = `${crypto.randomUUID()}.${fileExt}`;
        const filePath = `products/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from("products")
          .upload(filePath, file, {
            cacheControl: "3600",
            upsert: false,
          });

        if (uploadError) {
          console.error("Erro ao enviar imagem:", uploadError);
          alert(`Erro ao enviar ${file.name}`);
          continue;
        }

        const { data } = supabase.storage
          .from("products")
          .getPublicUrl(filePath);

        if (data?.publicUrl) {
          setEditImages((prev) => [...prev, data.publicUrl]);
        }
      } catch (error) {
        console.error("Erro no upload:", error);
        alert("Não foi possível enviar a imagem.");
      }
    }

    e.target.value = "";
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
      [size]: Number.isNaN(num) ? 0 : num,
    }));
  };

  const handleSave = () => {
    const updated = {
      ...product,
      title: editTitle,
      category: editCategory,
      price: parseFloat(editPrice) || 0,
      originalPrice:
        editOriginalPrice !== "" ? parseFloat(editOriginalPrice) : undefined,
      description: editDescription,
      technicalDetails: editTechDetails,
      stock: editStock,
      images: editImages,
    };

    onUpdateProduct(updated);
    setIsEditing(false);
  };

  const totalStock = Object.values(
    isEditing ? editStock : product.stock || {},
  ).reduce((total, value) => total + (Number(value) || 0), 0);

  const activeImage = currentImages[activeImageIdx] || currentImages[0] || null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 dark:bg-black/70 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white dark:bg-slate-900 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col z-10 text-left border border-gray-100 dark:border-slate-800 transition-colors duration-200">
        {/* Botão Fechar */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 bg-[#F5F6F8] dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 text-text-sec dark:text-slate-400 hover:text-text-main dark:hover:text-white rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Barra de Administrador */}
        {isAdmin && (
          <div className="bg-amber-50 dark:bg-amber-950/20 border-b border-amber-200 dark:border-amber-900/40 px-6 py-3.5 flex items-center justify-between gap-4">
            <span className="text-xs font-bold text-amber-800 dark:text-amber-400 font-poppins flex items-center gap-1.5 uppercase">
              <AlertCircle className="w-4 h-4" />
              Modo Administrador Ativo
            </span>

            <button
              onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
              className="flex items-center gap-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold px-4 py-2 rounded-lg font-poppins uppercase tracking-wider transition-colors shadow-xs"
            >
              {isEditing ? (
                <>
                  <Save className="w-3.5 h-3.5" />
                  Salvar Edições
                </>
              ) : (
                <>
                  <Edit className="w-3.5 h-3.5" />
                  Editar Manto
                </>
              )}
            </button>
          </div>
        )}

        {/* Conteúdo */}
        <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* ==================== COLUNA ESQUERDA ==================== */}
          <div className="space-y-4">
            {/* Imagem principal */}
            <div className="relative pt-[100%] bg-white dark:bg-slate-800 rounded-xl overflow-hidden border border-gray-100 dark:border-slate-700">
              {activeImage ? (
                <img
                  src={activeImage}
                  alt={editTitle || product.title || "Produto"}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-text-sec dark:text-slate-500 text-sm font-inter">
                  Nenhuma imagem disponível
                </div>
              )}
            </div>

            {/* Miniaturas */}
            <div className="flex flex-wrap gap-2.5 items-center">
              {currentImages.map((img, idx) => (
                <div key={`${img}-${idx}`} className="relative group/thumb">
                  <button
                    type="button"
                    onClick={() => setActiveImageIdx(idx)}
                    className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                      activeImageIdx === idx
                        ? "border-primary dark:border-teal-400"
                        : "border-gray-200 dark:border-slate-700 hover:border-gray-300 dark:hover:border-slate-500"
                    }`}
                  >
                    <img
                      src={img}
                      alt={`Miniatura ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>

                  {isEditing && (
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(idx)}
                      className="absolute -top-1.5 -right-1.5 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600 opacity-0 group-hover/thumb:opacity-100 transition-opacity"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  )}
                </div>
              ))}

              {/* Upload */}
              {isEditing && (
                <label className="w-16 h-16 border-2 border-dashed border-gray-300 dark:border-slate-700 hover:border-primary dark:hover:border-teal-400 bg-[#F5F6F8] dark:bg-slate-800 rounded-lg flex flex-col items-center justify-center cursor-pointer text-text-sec dark:text-slate-400 transition-colors">
                  <Plus className="w-5 h-5" />

                  <span className="text-[9px] font-bold font-inter mt-1">
                    Upload
                  </span>

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

            {/* Ficha Técnica */}
            <div className="bg-[#F5F6F8] dark:bg-slate-800 rounded-xl p-5 border border-gray-200/50 dark:border-slate-700">
              <h4 className="text-xs font-bold font-poppins text-text-main dark:text-white tracking-wider uppercase mb-2">
                Ficha Técnica
              </h4>

              {isEditing ? (
                <textarea
                  value={editTechDetails}
                  onChange={(e) => setEditTechDetails(e.target.value)}
                  className="w-full bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg p-3 text-xs font-inter text-text-main dark:text-white focus:outline-none focus:border-primary dark:focus:border-teal-400"
                  rows="4"
                />
              ) : (
                <p className="text-xs font-inter text-text-sec dark:text-slate-400 leading-relaxed whitespace-pre-line">
                  {product.technicalDetails ||
                    "Nenhuma informação técnica cadastrada."}
                </p>
              )}
            </div>
          </div>

          {/* ==================== COLUNA DIREITA ==================== */}
          <div className="space-y-6">
            {/* Informações do Produto */}
            <div className="space-y-3 pr-8">
              {isEditing ? (
                <>
                  {/* Categoria */}
                  <div>
                    <label className="block text-[10px] font-bold font-poppins text-text-sec dark:text-slate-400 uppercase tracking-wider mb-1.5">
                      Categoria
                    </label>

                    <input
                      type="text"
                      value={editCategory}
                      onChange={(e) => setEditCategory(e.target.value)}
                      className="w-full bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg px-3 py-2 text-xs text-text-main dark:text-white focus:outline-none focus:border-primary dark:focus:border-teal-400"
                    />
                  </div>

                  {/* Título */}
                  <div>
                    <label className="block text-[10px] font-bold font-poppins text-text-sec dark:text-slate-400 uppercase tracking-wider mb-1.5">
                      Nome do Manto
                    </label>

                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="w-full bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm font-bold text-text-main dark:text-white focus:outline-none focus:border-primary dark:focus:border-teal-400"
                    />
                  </div>

                  {/* Preço */}
                  <div>
                    <label className="block text-[10px] font-bold font-poppins text-text-sec dark:text-slate-400 uppercase tracking-wider mb-1.5">
                      Preço
                    </label>

                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={editPrice}
                      onChange={(e) => setEditPrice(e.target.value)}
                      className="w-full bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg px-3 py-2 text-xs text-text-main dark:text-white focus:outline-none focus:border-primary dark:focus:border-teal-400"
                    />
                  </div>

                  {/* Preço original */}
                  <div>
                    <label className="block text-[10px] font-bold font-poppins text-text-sec dark:text-slate-400 uppercase tracking-wider mb-1.5">
                      Preço Original
                    </label>

                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={editOriginalPrice}
                      onChange={(e) => setEditOriginalPrice(e.target.value)}
                      placeholder="Opcional"
                      className="w-full bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg px-3 py-2 text-xs text-text-main dark:text-white placeholder:text-gray-400 dark:placeholder:text-slate-600 focus:outline-none focus:border-primary dark:focus:border-teal-400"
                    />
                  </div>
                </>
              ) : (
                <>
                  <p className="text-xs font-bold text-primary dark:text-teal-400 font-poppins uppercase tracking-wider">
                    {product.category}
                  </p>

                  <h2 className="text-2xl sm:text-3xl font-extrabold font-poppins text-text-main dark:text-white leading-tight">
                    {product.title}
                  </h2>

                  <div className="flex flex-wrap items-end gap-3">
                    <span className="text-2xl font-extrabold font-poppins text-primary dark:text-teal-400">
                      R$ {Number(product.price || 0).toFixed(2)}
                    </span>

                    {product.originalPrice && (
                      <span className="text-sm text-text-sec dark:text-slate-500 line-through font-inter">
                        R$ {Number(product.originalPrice).toFixed(2)}
                      </span>
                    )}
                  </div>

                  <p className="text-[10px] text-text-sec dark:text-slate-500 font-inter uppercase tracking-wider">
                    Preço de Distribuidora
                  </p>
                </>
              )}
            </div>

            {/* Descrição */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold font-poppins text-text-main dark:text-white uppercase tracking-wider">
                Descrição do Manto
              </h3>

              {isEditing ? (
                <textarea
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="w-full bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg p-3 text-xs font-inter text-text-main dark:text-white focus:outline-none focus:border-primary dark:focus:border-teal-400"
                  rows="4"
                />
              ) : (
                <p className="text-xs font-inter text-text-sec dark:text-slate-400 leading-relaxed whitespace-pre-line">
                  {product.description || "Nenhuma descrição cadastrada."}
                </p>
              )}
            </div>

            {/* Estoque / Tamanhos */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold font-poppins text-text-main dark:text-white uppercase tracking-wider">
                  {isEditing
                    ? "Editar Estoque por Tamanho"
                    : "Selecione o Tamanho"}
                </h3>

                <span className="text-[10px] font-bold font-inter text-text-sec dark:text-slate-400">
                  {totalStock} disponíveis
                </span>
              </div>

              {isEditing ? (
                <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                  {sizes.map((size) => (
                    <div
                      key={size}
                      className="bg-[#F5F6F8] dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg p-2"
                    >
                      <div className="text-center text-[10px] font-bold font-poppins text-text-main dark:text-white mb-1">
                        {size}
                      </div>

                      <input
                        type="number"
                        min="0"
                        value={editStock[size] ?? 0}
                        onChange={(e) =>
                          handleStockChange(size, e.target.value)
                        }
                        className="w-full h-8 bg-white dark:bg-slate-900 border border-gray-300 dark:border-slate-600 rounded-md px-1 text-center text-sm font-bold font-montserrat text-text-main dark:text-white focus:outline-none focus:border-primary dark:focus:border-teal-400 appearance-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                  {sizes.map((size) => {
                    const count = Number(product.stock?.[size] || 0);
                    const isAvailable = count > 0;
                    const isSelected = selectedSize === size;

                    return (
                      <button
                        key={size}
                        type="button"
                        disabled={!isAvailable}
                        onClick={() => {
                          setSelectedSize(size);
                          setSizeWarning(false);
                        }}
                        className={`py-2.5 text-xs font-extrabold font-montserrat rounded-xl border text-center transition-all ${
                          !isAvailable
                            ? "bg-gray-100 dark:bg-slate-800 text-gray-300 dark:text-slate-600 border-gray-100 dark:border-slate-800 cursor-not-allowed"
                            : isSelected
                              ? "bg-primary dark:bg-teal-600 text-white border-primary dark:border-teal-500"
                              : "bg-white dark:bg-slate-800 text-text-main dark:text-white border-gray-200 dark:border-slate-700 hover:border-primary/50 dark:hover:border-teal-500/50 hover:bg-[#F5F6F8] dark:hover:bg-slate-700"
                        }`}
                      >
                        {size}
                      </button>
                    );
                  })}
                </div>
              )}

              {sizeWarning && !isEditing && (
                <p className="text-[11px] text-red-500 dark:text-red-400 font-inter font-semibold">
                  Por favor, escolha o tamanho desejado antes de adicionar.
                </p>
              )}
            </div>

            {/* Tabela de Medidas */}
            {!isEditing && (
              <div className="border border-gray-200 dark:border-slate-700 rounded-xl overflow-hidden">
                <div className="bg-[#F5F6F8] dark:bg-slate-800 px-4 py-3 border-b border-gray-200 dark:border-slate-700">
                  <h3 className="text-xs font-bold font-poppins text-text-main dark:text-white uppercase tracking-wider">
                    Tabela de Medidas
                  </h3>

                  <p className="text-[10px] text-text-sec dark:text-slate-400 font-inter mt-1">
                    Medidas aproximadas da camisa.
                  </p>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="bg-white dark:bg-slate-900 text-text-sec dark:text-slate-400 font-poppins uppercase text-[9px]">
                        <th className="px-3 py-2 text-left">Tamanho</th>
                        <th className="px-3 py-2 text-center">Largura</th>
                        <th className="px-3 py-2 text-center">Comprimento</th>
                      </tr>
                    </thead>

                    <tbody>
                      {sizeMeasurements.map((measurement, index) => (
                        <tr
                          key={measurement.size}
                          className={
                            index % 2 === 0
                              ? "bg-gray-50 dark:bg-slate-800/70"
                              : "bg-white dark:bg-slate-900"
                          }
                        >
                          <td className="px-3 py-2 font-bold text-text-main dark:text-white border-t border-gray-100 dark:border-slate-700">
                            {measurement.size}
                          </td>

                          <td className="px-3 py-2 text-center text-text-sec dark:text-slate-400 border-t border-gray-100 dark:border-slate-700">
                            {measurement.width}
                          </td>

                          <td className="px-3 py-2 text-center text-text-sec dark:text-slate-400 border-t border-gray-100 dark:border-slate-700">
                            {measurement.length}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Botão Carrinho */}
            {!isEditing && (
              <button
                type="button"
                disabled={totalStock === 0}
                onClick={handleAddClick}
                className={`w-full py-4 rounded-xl font-bold font-poppins text-xs tracking-wider uppercase transition-all flex items-center justify-center gap-2 shadow-sm ${
                  totalStock === 0
                    ? "bg-gray-200 dark:bg-slate-800 text-gray-400 dark:text-slate-500 cursor-not-allowed"
                    : "bg-[#0f766e] hover:bg-[#115e59] dark:bg-teal-600 dark:hover:bg-teal-500 text-white cursor-pointer"
                }`}
              >
                <ShoppingBag className="w-4 h-4" />

                {selectedSize
                  ? `Adicionar ao Carrinho (Tamanho ${selectedSize})`
                  : "Adicionar ao Carrinho"}
              </button>
            )}

            {/* Aviso quando está editando */}
            {isEditing && (
              <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 rounded-xl p-4">
                <p className="text-xs font-inter text-amber-800 dark:text-amber-400 leading-relaxed">
                  Você está editando este produto. Clique em{" "}
                  <strong>Salvar Edições</strong> no topo do modal para aplicar
                  as alterações.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
