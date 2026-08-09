import React, { useState, useEffect } from "react";
import {
  Lock,
  LogOut,
  Plus,
  ShieldCheck,
  Mail,
  Phone,
  MapPin,
  Package,
  AlertCircle,
} from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { supabase } from "./lib/supabase";
// Register GSAP ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

// Import custom components
import Header from "./components/Header";
import Hero from "./components/Hero";
import CategoryBar from "./components/CategoryBar";
import ProductCard from "./components/ProductCard";
import CartDrawer from "./components/CartDrawer";
import ProductDetailsModal from "./components/ProductDetailsModal";
import LoginModal from "./components/LoginModal";
import VersionsPage from "./components/VersionsPage";

// Import mock initial database
import { defaultProducts, defaultCategories } from "./data/mockProducts";

export default function App() {
  // --- Persistent States from LocalStorage ---
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  const [categories, setCategories] = useState(defaultCategories);
  const [loadingCategories, setLoadingCategories] = useState(true);

  useEffect(() => {
    const loadCategories = async () => {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("created_at", { ascending: true });

      if (error) {
        console.error("Erro ao carregar categorias:", error);
        setLoadingCategories(false);
        return;
      }

      setCategories(data.map((category) => category.name));
      setLoadingCategories(false);
    };

    loadCategories();
  }, []);

  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem("atacadao_carrinho");
    return saved ? JSON.parse(saved) : [];
  });

  const [isAdmin, setIsAdmin] = useState(() => {
    const saved = localStorage.getItem("atacadao_is_admin");
    return saved === "true";
  });

  const [dark, setDark] = useState(() => {
    const saved = localStorage.getItem("theme");
    return saved ? saved === "dark" : false;
  });

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark");
      document.body.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      document.body.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [dark]);

  // --- UI Layout Navigation States ---
  const [activeTab, setActiveTab] = useState("inicio"); // 'inicio' | 'brasil' | 'selecoes' | 'versoes'
  const [selectedCategory, setSelectedCategory] = useState(""); // Filters inside 'inicio' tab

  // --- Modal & Drawer Open States ---
  const [cartOpen, setCartOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [detailsProduct, setDetailsProduct] = useState(null);

  // --- Sync States to LocalStorage ---
  useEffect(() => {
    localStorage.setItem("atacadao_carrinho", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem("atacadao_is_admin", isAdmin ? "true" : "false");
  }, [isAdmin]);

  // --- GSAP ScrollTrigger Refresh trigger ---
  useEffect(() => {
    // Refresh ScrollTrigger positions after page updates
    ScrollTrigger.refresh();
  }, [activeTab, selectedCategory, products, cartOpen]);

  useEffect(() => {
    async function loadProducts() {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: true });

      if (error) {
        console.error("Erro ao buscar produtos:", error);
        return;
      }

      if (data && data.length > 0) {
        setProducts(data);
      }
    }

    loadProducts();
  }, []);

  useEffect(() => {
    async function loadProducts() {
      setLoadingProducts(true);

      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("title");

      if (error) {
        console.error(error);

        // Backup caso o banco esteja indisponível
        setProducts(defaultProducts);
      } else {
        const formattedProducts = data.map((p) => ({
          id: p.id,
          title: p.title,
          category: p.category,
          description: p.description,
          price: p.price,
          originalPrice: p.original_price,
          stock: p.stock,
          images: p.images,
          technicalDetails: p.technical_details,
        }));

        setProducts(formattedProducts);
      }

      setLoadingProducts(false);
    }

    loadProducts();
  }, []);

  if (loadingProducts) {
    return (
      <div className="flex h-screen items-center justify-center">
        Carregando sua paixão...
      </div>
    );
  }

  // --- Cart Handlers ---
  const handleAddToCart = (product, size) => {
    setCart((prevCart) => {
      const existingIdx = prevCart.findIndex(
        (item) => item.id === product.id && item.size === size,
      );

      if (existingIdx > -1) {
        const updated = [...prevCart];
        updated[existingIdx].quantity += 1;
        return updated;
      } else {
        return [...prevCart, { ...product, size, quantity: 1 }];
      }
    });
    setCartOpen(true);
  };

  const handleUpdateCartQuantity = (id, size, quantity) => {
    if (quantity < 1) return;

    // Find the product to check stock limit
    const prod = products.find((p) => p.id === id);
    if (!prod) return;
    const maxStock = prod.stock[size] || 0;
    const finalQuantity = Math.min(quantity, maxStock);

    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === id && item.size === size
          ? { ...item, quantity: finalQuantity }
          : item,
      ),
    );
  };

  const handleRemoveCartItem = (id, size) => {
    setCart((prevCart) =>
      prevCart.filter((item) => !(item.id === id && item.size === size)),
    );
  };

  // --- Category Handlers ---
  const handleAddCategory = async (newCat) => {
    const categoryName = newCat.trim();

    if (!categoryName) return;

    if (categories.includes(categoryName)) {
      alert("Essa categoria já existe.");
      return;
    }

    const { data, error } = await supabase
      .from("categories")
      .insert([{ name: categoryName }])
      .select()
      .single();

    if (error) {
      console.error("Erro ao adicionar categoria:", error);
      alert("Não foi possível adicionar a categoria.");
      return;
    }

    setCategories((prevCategories) => [...prevCategories, data.name]);
  };

  const handleDeleteCategory = async (catToDelete) => {
    // Impede excluir categorias protegidas
    const isProtected =
      catToDelete.toLowerCase() === "brasileirão" ||
      catToDelete.toLowerCase() === "seleções";

    if (isProtected) {
      alert("Essa categoria não pode ser excluída.");
      return;
    }

    // Move os produtos dessa categoria para "Brasileirão" no Supabase
    const { error: productsError } = await supabase
      .from("products")
      .update({ category: "Brasileirão" })
      .eq("category", catToDelete);

    if (productsError) {
      console.error("Erro ao atualizar produtos da categoria:", productsError);
      alert("Não foi possível atualizar os produtos dessa categoria.");
      return;
    }

    // Exclui a categoria do Supabase
    const { error: categoryError } = await supabase
      .from("categories")
      .delete()
      .eq("name", catToDelete);

    if (categoryError) {
      console.error("Erro ao excluir categoria:", categoryError);
      alert("Não foi possível excluir a categoria.");
      return;
    }

    // Atualiza as categorias na interface
    setCategories((prevCategories) =>
      prevCategories.filter((category) => category !== catToDelete),
    );

    // Atualiza os produtos na interface
    setProducts((prevProducts) =>
      prevProducts.map((product) =>
        product.category === catToDelete
          ? { ...product, category: "Brasileirão" }
          : product,
      ),
    );

    // Limpa a seleção caso a categoria excluída estivesse selecionada
    if (selectedCategory === catToDelete) {
      setSelectedCategory("");
    }
  };

  // --- Product CRUD Handlers ---
  const handleUpdateProduct = async (updatedProduct) => {
    const productData = {
      id: updatedProduct.id,
      title: updatedProduct.title,
      category: updatedProduct.category,
      description: updatedProduct.description,
      price: updatedProduct.price,
      original_price: updatedProduct.originalPrice ?? null,
      stock: updatedProduct.stock,
      images: updatedProduct.images,
      technical_details: updatedProduct.technicalDetails ?? null,
    };

    // Se o produto já existe, atualiza
    const { data, error } = await supabase
      .from("products")
      .upsert(productData)
      .select()
      .single();

    if (error) {
      console.error("Erro ao salvar produto no Supabase:", error);
      alert("Não foi possível salvar o produto.");
      return;
    }

    // Atualiza a tela imediatamente
    const formattedProduct = {
      id: data.id,
      title: data.title,
      category: data.category,
      description: data.description,
      price: data.price,
      originalPrice: data.original_price,
      stock: data.stock,
      images: data.images,
      technicalDetails: data.technical_details,
    };

    setProducts((prevProds) => {
      const index = prevProds.findIndex((p) => p.id === formattedProduct.id);

      if (index > -1) {
        const next = [...prevProds];
        next[index] = formattedProduct;
        return next;
      }

      return [...prevProds, formattedProduct];
    });
  };

  const handleDeleteProduct = async (productId) => {
    const { error } = await supabase
      .from("products")
      .delete()
      .eq("id", productId);

    if (error) {
      console.error("Erro ao excluir produto:", error);
      alert("Não foi possível excluir o produto.");
      return;
    }

    // Remove da tela
    setProducts((prevProds) => prevProds.filter((p) => p.id !== productId));

    // Remove também do carrinho
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
  };

  const triggerAddProduct = () => {
    // Determine pre-filled category based on active view context
    let defaultCat = "Brasileirão";
    if (activeTab === "brasil") defaultCat = "Brasileirão";
    else if (activeTab === "selecoes") defaultCat = "Seleções";
    else if (selectedCategory) defaultCat = selectedCategory;

    const newManto = {
      id: "new-manto-" + Date.now(),
      title: "Nova Camisa de Futebol",
      category: defaultCat,
      description: "Descreva brevemente este manto.",
      price: 79.9,
      stock: { P: 10, M: 10, G: 10, GG: 10, EG: 5, XG: 5, "3G": 5 },
      images: [
        "https://images.unsplash.com/photo-1543351611-58f69d7c1781?q=80&w=600",
      ],
      technicalDetails:
        "Esta camisa une alta performance e estilo para o torcedor. Confeccionada em tecido 100% poliéster, ela conta com tecnologia de absorção de suor, mantendo o corpo seco e fresco. Seu caimento leve oferece total liberdade de movimento para o uso no dia a dia ou na prática de esportes. O modelo traz o escudo do clube em acabamento premium, garantindo alta durabilidade contra o desgaste e as lavagens.",
    };

    setDetailsProduct(newManto);
  };

  // --- Filtering Products ---
  const getFilteredProducts = () => {
    if (activeTab === "brasil") {
      return products.filter((p) => p.category.toLowerCase() === "brasileirão");
    }
    if (activeTab === "selecoes") {
      return products.filter((p) => p.category.toLowerCase() === "seleções");
    }
    // "Início" Tab with CategoryBar filters
    if (selectedCategory) {
      return products.filter((p) => p.category === selectedCategory);
    }
    return products;
  };

  const filteredProducts = getFilteredProducts();
  const cartItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Footer category navigators
  const navigateFooterCategory = (cat) => {
    setActiveTab("inicio");
    setSelectedCategory(cat);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="flex flex-col min-h-screen bg-bg-main text-text-main font-sans selection:bg-primary/20 selection:text-primary">
      {/* Floating Manager Session Indicator */}
      {isAdmin && (
        <div className="bg-amber-600 text-white px-4 py-2.5 flex items-center justify-between text-xs font-bold font-poppins shadow-md z-50 sticky top-0 border-b border-amber-700/30">
          <span className="flex items-center gap-2 uppercase tracking-wider">
            <ShieldCheck className="w-5 h-5 animate-pulse" /> Painel de
            Gerenciamento do Ativo
          </span>
          <button
            onClick={() => setIsAdmin(false)}
            className="flex items-center gap-1.5 bg-amber-800 hover:bg-amber-900 text-white px-3.5 py-1.5 rounded-lg transition-colors cursor-pointer uppercase text-[10px]"
          >
            <LogOut className="w-3.5 h-3.5" /> Sair do Painel
          </button>
        </div>
      )}

      {/* Sticky Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          setSelectedCategory(""); // Reset category when switching main tabs
        }}
        cartCount={cartItemsCount}
        onOpenCart={() => setCartOpen(true)}
      />

      {/* Page Content Router */}
      <main className="flex-grow">
        {activeTab === "inicio" && (
          <>
            {/* Showroom Hero Section */}
            <Hero
              onCatalogClick={() => {
                const grid = document.getElementById("catalog-grid");
                if (grid) grid.scrollIntoView({ behavior: "smooth" });
              }}
            />

            {/* Marketplace Horizontal Category Filter */}
            <CategoryBar
              categories={categories}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
              onAddCategory={handleAddCategory}
              onDeleteCategory={handleDeleteCategory}
              isAdmin={isAdmin}
            />

            {/* Catalog Grid Section */}
            <section
              id="catalog-grid"
              className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
            >
              <div className="flex flex-col md:flex-row md:items-baseline justify-between border-b border-gray-200 dark:border-slate-700 pb-5 mb-8 text-left">
                <div>
                  <h3 className="text-xl sm:text-2xl font-extrabold font-poppins text-text-main">
                    {selectedCategory
                      ? `Catálogo: ${selectedCategory}`
                      : "Catálogo Completo no Atacado"}
                  </h3>
                  <p className="text-xs text-text-sec font-medium font-inter mt-1.5">
                    Preços especiais direto da distribuidora. Frete Grátis em 6
                    peças.
                  </p>
                </div>
                <span className="text-xs font-bold font-montserrat text-primary mt-2 md:mt-0 uppercase tracking-widest bg-primary/10 px-2.5 py-1 rounded-md">
                  {filteredProducts.length}{" "}
                  {filteredProducts.length === 1
                    ? "Manto Disponível"
                    : "Mantos Disponíveis"}
                </span>
              </div>

              {/* Product Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8">
                {/* Admin Dashed "+ ADICIONAR MANTO" Card */}
                {isAdmin && (
                  <button
                    onClick={triggerAddProduct}
                    className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-amber-300 dark:border-amber-700 hover:border-amber-500 bg-amber-50/20 dark:bg-amber-950/20 hover:bg-amber-50/50 dark:hover:bg-amber-950/40 rounded-2xl transition-all h-[420px] cursor-pointer group text-amber-800 dark:text-amber-300"
                  >
                    <div className="bg-amber-100 dark:bg-amber-900/40 p-4 rounded-full mb-3 group-hover:scale-108 transition-transform">
                      <Plus className="w-8 h-8 text-amber-600 dark:text-amber-400 stroke-[3]" />
                    </div>
                    <span className="font-extrabold font-poppins text-sm tracking-wide uppercase">
                      + Adicionar Manto
                    </span>
                    <span className="text-[10px] font-semibold font-inter mt-1 text-amber-600 dark:text-amber-400 uppercase tracking-widest">
                      Novo Produto no Lote
                    </span>
                  </button>
                )}

                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={handleAddToCart}
                    onOpenDetails={setDetailsProduct}
                    isAdmin={isAdmin}
                    onDeleteProduct={handleDeleteProduct}
                  />
                ))}
              </div>

              {filteredProducts.length === 0 && !isAdmin && (
                <div className="text-center py-20">
                  <Package className="w-16 h-16 text-text-sec/40 mx-auto mb-4" />
                  <h4 className="text-lg font-bold font-poppins text-text-main">
                    Nenhum manto encontrado
                  </h4>
                  <p className="text-xs text-text-sec mt-1 max-w-[280px] mx-auto font-inter">
                    Nenhum produto cadastrado na categoria selecionada no
                    momento.
                  </p>
                </div>
              )}
            </section>
          </>
        )}

        {/* Brasileirão Specific Tab */}
        {activeTab === "brasil" && (
          <div className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
            <div className="bg-white dark:bg-slate-800 border border-[#E5E7EB] dark:border-slate-700 rounded-2xl p-8 mb-8 flex flex-col md:flex-row justify-between items-center gap-6 shadow-xs">
              <div>
                <span className="bg-[#0f766e]/10 text-primary text-[10px] font-bold font-poppins px-2.5 py-1.5 rounded-full uppercase tracking-wider">
                  Clubes Nacionais
                </span>
                <h2 className="text-3xl font-extrabold font-poppins text-text-main mt-3">
                  Mantos do Brasileirão
                </h2>
                <p className="text-xs sm:text-sm text-text-sec font-inter mt-1 max-w-2xl leading-relaxed">
                  As camisas mais vendidas do futebol nacional. Modelagens
                  torcedor e jogador prontas para envio imediato para todo o
                  Brasil.
                </p>
              </div>
              <span className="text-xs font-bold font-montserrat text-primary uppercase tracking-widest bg-primary/10 px-3.5 py-1.5 rounded-lg shrink-0">
                {filteredProducts.length} Modelos
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {isAdmin && (
                <button
                  onClick={triggerAddProduct}
                  className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-amber-300 dark:border-amber-700 hover:border-amber-500 bg-amber-50/20 dark:bg-amber-950/20 hover:bg-amber-50/50 dark:hover:bg-amber-950/40 rounded-2xl transition-all h-[420px] cursor-pointer group text-amber-800 dark:text-amber-300"
                >
                  <div className="bg-amber-100 dark:bg-amber-900/40 p-4 rounded-full mb-3 group-hover:scale-108 transition-transform">
                    <Plus className="w-8 h-8 text-amber-700 dark:text-amber-300 stroke-[3]" />
                  </div>
                  <span className="font-extrabold font-poppins text-sm tracking-wide uppercase">
                    + Adicionar Manto
                  </span>
                  <span className="text-[10px] font-semibold font-inter mt-1 text-amber-600 dark:text-amber-400 uppercase tracking-widest">
                    Pre-fill: Brasileirão
                  </span>
                </button>
              )}

              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={handleAddToCart}
                  onOpenDetails={setDetailsProduct}
                  isAdmin={isAdmin}
                  onDeleteProduct={handleDeleteProduct}
                />
              ))}
            </div>
          </div>
        )}

        {/* Seleções Specific Tab */}
        {activeTab === "selecoes" && (
          <div className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
            <div className="bg-white dark:bg-slate-800 border border-[#E5E7EB] dark:border-slate-700 rounded-2xl p-8 mb-8 flex flex-col md:flex-row justify-between items-center gap-6 shadow-xs">
              <div>
                <span className="bg-[#0f766e]/10 text-primary text-[10px] font-bold font-poppins px-2.5 py-1.5 rounded-full uppercase tracking-wider">
                  Nacionais e Internacionais
                </span>
                <h2 className="text-3xl font-extrabold font-poppins text-text-main mt-3">
                  Mantos de Seleções
                </h2>
                <p className="text-xs sm:text-sm text-text-sec font-inter mt-1 max-w-2xl leading-relaxed">
                  As camisas oficiais das maiores potências do futebol mundial.
                  Alta procura nas épocas de copa e eliminatórias para girar seu
                  caixa rápido.
                </p>
              </div>
              <span className="text-xs font-bold font-montserrat text-primary uppercase tracking-widest bg-primary/10 px-3.5 py-1.5 rounded-lg shrink-0">
                {filteredProducts.length} Modelos
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {isAdmin && (
                <button
                  onClick={triggerAddProduct}
                  className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-amber-300 dark:border-amber-700 hover:border-amber-500 bg-amber-50/20 dark:bg-amber-950/20 hover:bg-amber-50/50 dark:hover:bg-amber-950/40 rounded-2xl transition-all h-[420px] cursor-pointer group text-amber-800 dark:text-amber-300"
                >
                  <div className="bg-amber-100 dark:bg-amber-900/40 p-4 rounded-full mb-3 group-hover:scale-108 transition-transform">
                    <Plus className="w-8 h-8 text-amber-700 stroke-[3]" />
                  </div>
                  <span className="font-extrabold font-poppins text-sm tracking-wide uppercase">
                    + Adicionar Manto
                  </span>
                  <span className="text-[10px] font-semibold font-inter mt-1 text-amber-600 uppercase tracking-widest">
                    Pre-fill: Seleções
                  </span>
                </button>
              )}

              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={handleAddToCart}
                  onOpenDetails={setDetailsProduct}
                  isAdmin={isAdmin}
                  onDeleteProduct={handleDeleteProduct}
                />
              ))}
            </div>
          </div>
        )}

        {/* Versões Comparison Tab */}
        {activeTab === "versoes" && <VersionsPage />}
      </main>

      {/* Dark Footer */}
      <footer
        id="footer"
        className="bg-[#111827] text-white pt-16 pb-8 border-t border-gray-800 text-left font-inter"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Col 1: Empresa */}
          <div className="space-y-4">
            <h4 className="text-xl font-extrabold font-poppins text-white tracking-tight">
              ATACADÃO <span className="text-[#0F766E]">DOS MANTOS</span>
            </h4>
            <p className="text-xs text-gray-400 font-semibold tracking-wider uppercase mt-1">
              Distribuidor Oficial Premium
            </p>
            <p className="text-xs text-gray-300 leading-relaxed pt-2">
              Bem-vindo à maior autoridade em mantos sagrados! Nossa loja nasceu
              da paixão pelo futebol para vestir o torcedor com o que há de
              melhor no mercado esportivo. Reunimos em um só lugar os
              lançamentos mais aguardados, modelos clássicos e edições
              exclusivas dos maiores clubes do mundo.
            </p>
          </div>

          {/* Col 2: Categorias */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold font-poppins text-white tracking-widest uppercase">
              Categorias
            </h4>
            <ul className="space-y-2 text-xs text-gray-300">
              {[
                "Brasileirão",
                "Seleções",
                "Internacionais",
                "Infantil",
                "Feminina",
                "Promoções",
              ].map((cat) => (
                <li key={cat}>
                  <button
                    onClick={() => navigateFooterCategory(cat)}
                    className="hover:text-primary transition-colors cursor-pointer text-left font-medium"
                  >
                    {cat}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Atendimento */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold font-poppins text-white tracking-widest uppercase">
              Atendimento
            </h4>
            <ul className="space-y-3 text-xs text-gray-300">
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-primary shrink-0" />
                <span>(91) 5591992384582</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-primary shrink-0" />
                <span>contato@atacadaodosmantos.com.br</span>
              </li>
              <li className="flex items-center gap-2.5">
                <MapPin className="w-4.5 h-4.5 text-primary shrink-0" />
                <span>Castanhal - PA</span>
              </li>
            </ul>
          </div>

          {/* Col 4: Redes Sociais & Trust Badge */}
          <div className="space-y-5">
            <h4 className="text-sm font-bold font-poppins text-white tracking-widest uppercase">
              Redes Sociais
            </h4>

            <div className="flex items-center gap-3">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gray-800 hover:bg-primary p-2.5 rounded-lg transition-all text-white flex items-center justify-center"
                aria-label="Instagram"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-4 h-4"
                >
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                </svg>
              </a>

              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gray-800 hover:bg-primary p-2.5 rounded-lg transition-all text-white flex items-center justify-center"
                aria-label="YouTube"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-4 h-4"
                >
                  <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17z" />
                  <polygon points="10 15 15 12 10 9" />
                </svg>
              </a>
            </div>

            <div className="bg-[#115E59]/20 border border-[#0F766E]/30 p-3.5 rounded-xl self-start inline-block">
              <p className="text-[10px] font-extrabold text-primary font-poppins uppercase tracking-widest">
                Distribuidor Autorizado
              </p>
              <p className="text-[9px] text-gray-300 font-inter mt-0.5 leading-tight">
                Produtos 100% Importados Premium
              </p>
            </div>
          </div>
        </div>

        {/* Footer Bottom Block */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-8 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-400">
          <p className="text-center sm:text-left leading-relaxed">
            Atendemos para todo o Brasil. <br />© 2026 Atacadão dos Mantos.
            Todos os direitos reservados.
          </p>

          {/* Restricted Hidden login trigger */}
          <button
            type="button"
            onClick={() => setLoginOpen(true)}
            className="text-[9px] uppercase font-bold text-gray-500 hover:text-white transition-colors cursor-pointer select-none"
          >
            🔒 ACESSO RESTRITO
          </button>
        </div>
      </footer>

      {/* Cart Right Drawer */}
      <CartDrawer
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        cartItems={cart}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
      />

      {/* Product Details & Admin Inline Editor Modal */}
      <ProductDetailsModal
        isOpen={detailsProduct !== null}
        onClose={() => setDetailsProduct(null)}
        product={detailsProduct}
        onAddToCart={handleAddToCart}
        isAdmin={isAdmin}
        onUpdateProduct={handleUpdateProduct}
      />

      {/* Secret Password Admin login Dialog */}
      <LoginModal
        isOpen={loginOpen}
        onClose={() => setLoginOpen(false)}
        onLoginSuccess={() => setIsAdmin(true)}
      />
    </div>
  );
}
