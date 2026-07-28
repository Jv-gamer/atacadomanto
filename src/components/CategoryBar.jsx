import React from "react";
import * as Icons from "lucide-react";

export default function CategoryBar({ 
  categories, 
  selectedCategory, 
  onSelectCategory,
  onAddCategory,
  onDeleteCategory,
  isAdmin = false
}) {
  const [isAddingCategory, setIsAddingCategory] = React.useState(false);
  const [newCatName, setNewCatName] = React.useState("");

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (newCatName.trim()) {
      onAddCategory(newCatName.trim());
      setNewCatName("");
      setIsAddingCategory(false);
    }
  };
  
  // Icon mapper helper
  const getCategoryIcon = (categoryName) => {
    const name = categoryName.toLowerCase();
    if (name.includes("brasileirão") || name.includes("brasil")) {
      return <Icons.Shield className="w-5 h-5" />;
    }
    if (name.includes("seleções") || name.includes("selecoes")) {
      return <Icons.Flag className="w-5 h-5" />;
    }
    if (name.includes("internacionais") || name.includes("inter")) {
      return <Icons.Globe className="w-5 h-5" />;
    }
    if (name.includes("infantil") || name.includes("kids")) {
      return <Icons.Baby className="w-5 h-5" />;
    }
    if (name.includes("feminina") || name.includes("mulher")) {
      return <Icons.User2 className="w-5 h-5" />;
    }
    if (name.includes("promoções") || name.includes("promo")) {
      return <Icons.Tag className="w-5 h-5" />;
    }
    return <Icons.Shirt className="w-5 h-5" />;
  };

  return (
    <div className="w-full bg-white border-b border-[#F0F0F0] py-4 sticky top-20 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Horizontal Scrolling Box */}
        <div className="flex items-center gap-3 overflow-x-auto scrollbar-none py-1.5 -mx-4 px-4 sm:mx-0 sm:px-0">
          
          {/* "Todos" Option */}
          <button
            onClick={() => onSelectCategory("")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold font-poppins transition-all shrink-0 border select-none ${
              selectedCategory === ""
                ? "bg-primary text-white border-primary shadow-xs"
                : "bg-white text-text-main border-[#E5E7EB] hover:border-primary/50 hover:bg-[#F5F6F8]"
            }`}
          >
            <Icons.Boxes className="w-5 h-5" />
            Todos os Mantos
          </button>

          {categories.map((category) => {
            const isSelected = selectedCategory === category;
            const isProtected = category.toLowerCase() === "brasileirão" || category.toLowerCase() === "seleções";
            return (
              <div
                key={category}
                className="relative flex items-center shrink-0"
              >
                <button
                  onClick={() => onSelectCategory(category)}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold font-poppins transition-all border select-none ${
                    isSelected
                      ? "bg-primary text-white border-primary shadow-xs"
                      : "bg-white text-text-main border-[#E5E7EB] hover:border-primary/50 hover:bg-[#F5F6F8]"
                  } ${isAdmin && !isProtected ? "pr-10" : ""}`}
                >
                  {getCategoryIcon(category)}
                  {category}
                </button>

                {isAdmin && !isProtected && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteCategory(category);
                    }}
                    className="absolute right-2 p-1 text-red-500 hover:text-white hover:bg-red-500 rounded-full transition-all cursor-pointer"
                    title={`Excluir categoria ${category}`}
                  >
                    <Icons.X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            );
          })}

          {/* Admin panel triggers for creating categories */}
          {isAdmin && (
            <div className="shrink-0 flex items-center">
              {isAddingCategory ? (
                <form onSubmit={handleAddSubmit} className="flex items-center gap-1.5 bg-amber-50/50 p-1.5 rounded-xl border border-amber-200">
                  <input
                    type="text"
                    required
                    autoFocus
                    value={newCatName}
                    onChange={(e) => setNewCatName(e.target.value)}
                    placeholder="Nova categoria..."
                    className="bg-white border border-gray-200 text-xs font-semibold rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-primary w-36"
                  />
                  <button 
                    type="submit" 
                    className="bg-primary text-white p-1.5 rounded-lg hover:bg-primary-hover transition-colors cursor-pointer"
                  >
                    <Icons.Check className="w-3.5 h-3.5" />
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setIsAddingCategory(false)}
                    className="bg-gray-100 text-gray-500 p-1.5 rounded-lg hover:bg-gray-200 transition-colors cursor-pointer"
                  >
                    <Icons.X className="w-3.5 h-3.5" />
                  </button>
                </form>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsAddingCategory(true)}
                  className="flex items-center gap-1 px-4 py-2.5 rounded-full text-xs font-bold font-poppins bg-amber-50 hover:bg-amber-100 text-amber-700 border border-dashed border-amber-300 transition-colors select-none cursor-pointer"
                >
                  <Icons.Plus className="w-4 h-4" />
                  Criar Categoria
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
