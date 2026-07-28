export const defaultCategories = [
  "Brasileirão",
  "Seleções",
  "Internacionais",
  "Infantil",
  "Feminina",
  "Promoções"
];

export const defaultProducts = [
  {
    id: "manto-1",
    title: "Camisa Flamengo Home 2026/27",
    category: "Brasileirão",
    description: "Manto sagrado com listras horizontais tradicionais vermelhas e pretas. Tecnologia Dry-Fit com costuras reforçadas e escudo bordado de alta definição.",
    price: 79.90,
    originalPrice: 129.90,
    stock: { P: 15, M: 20, G: 25, GG: 12, EG: 5, XG: 0, "3G": 3 },
    images: [
      "https://images.unsplash.com/photo-1517466787929-bc90951d0974?q=80&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=600&auto=format&fit=crop"
    ],
    technicalDetails: "100% Poliéster Reciclado. Tecnologia de absorção de suor. Lavável à máquina. Versão Torcedor. Origem: Importada."
  },
  {
    id: "manto-2",
    title: "Camisa Seleção Brasileira Oficial Home",
    category: "Seleções",
    description: "A clássica amarelinha com detalhes em verde gola pólo retrô. Patch de Campeão do Mundo bordado. Ideal para lojistas de alta rotatividade.",
    price: 84.90,
    originalPrice: 139.90,
    stock: { P: 8, M: 12, G: 0, GG: 15, EG: 4, XG: 2, "3G": 0 },
    images: [
      "https://images.unsplash.com/photo-1620589125156-fd5028c5e05b?q=80&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1543351611-58f69d7c1781?q=80&w=600&auto=format&fit=crop"
    ],
    technicalDetails: "Escudo termoselado. Tecido Dry-Fit Active com microperfurações traseiras. Versão Jogador. Modelagem Slim Fit."
  },
  {
    id: "manto-3",
    title: "Camisa Real Madrid Home 2026/27",
    category: "Internacionais",
    description: "O manto merengue na cor clássica branca com detalhes em dourado metálico. Tecido premium texturizado com alta respirabilidade.",
    price: 89.90,
    stock: { P: 10, M: 10, G: 10, GG: 8, EG: 5, XG: 5, "3G": 5 },
    images: [
      "https://images.unsplash.com/photo-1579952365111-3958b45680ec?q=80&w=600&auto=format&fit=crop"
    ],
    technicalDetails: "Gola em V premium. Tecido aerodinâmico. Detalhes texturizados em jacquard. Versão Torcedor."
  },
  {
    id: "manto-4",
    title: "Camisa Palmeiras Third Green Gold",
    category: "Brasileirão",
    description: "Terceira camisa do Verdão em verde escuro texturizado com detalhes dourados. Edição especial de colecionador, sucesso absoluto de vendas.",
    price: 79.90,
    originalPrice: 119.90,
    stock: { P: 5, M: 0, G: 12, GG: 8, EG: 0, XG: 1, "3G": 2 },
    images: [
      "https://images.unsplash.com/photo-1616244678572-3522ec187c20?q=80&w=600&auto=format&fit=crop"
    ],
    technicalDetails: "Costuras duplas reforçadas. Escudo oficial bordado 3D. Fibra dry-tech premium."
  },
  {
    id: "manto-5",
    title: "Camisa Argentina Messi 10 Champion",
    category: "Seleções",
    description: "Manto albiceleste listrado azul e branco com o número 10 estampado e patch oficial dourado da FIFA. Recordista de procura no atacado.",
    price: 84.90,
    originalPrice: 149.90,
    stock: { P: 20, M: 25, G: 30, GG: 20, EG: 10, XG: 8, "3G": 5 },
    images: [
      "https://images.unsplash.com/photo-1579952365111-3958b45680ec?q=80&w=600&auto=format&fit=crop"
    ],
    technicalDetails: "Estampa Messi 10 oficial. Três estrelas bordadas. 100% poliéster reciclado aeroready."
  },
  {
    id: "manto-6",
    title: "Camisa Barcelona Away Black Gold",
    category: "Internacionais",
    description: "Manto reserva do Barça em preto fosco com detalhes dourados elegantes. Escudo centralizado monocromático. Uma das mais pedidas para revenda.",
    price: 79.90,
    stock: { P: 10, M: 12, G: 15, GG: 10, EG: 4, XG: 3, "3G": 1 },
    images: [
      "https://images.unsplash.com/photo-1518063319789-7217e6706b04?q=80&w=600&auto=format&fit=crop"
    ],
    technicalDetails: "100% Poliéster double-knit. Tecido respirável de alta gramatura. Gola anatômica."
  },
  {
    id: "manto-7",
    title: "Camisa Infantil Seleção Brasileira Oficial",
    category: "Infantil",
    description: "Manto oficial tamanho infantil para os pequenos torcedores. Conforto térmico, leveza e durabilidade excepcionais para revendedores infantis.",
    price: 59.90,
    originalPrice: 89.90,
    stock: { P: 15, M: 15, G: 15, GG: 0, EG: 0, XG: 0, "3G": 0 },
    images: [
      "https://images.unsplash.com/photo-1543351611-58f69d7c1781?q=80&w=600&auto=format&fit=crop"
    ],
    technicalDetails: "Modelagem infantil confortável. Tecido ultra-leve anti-alérgico. Lavagem fácil de secagem rápida."
  },
  {
    id: "manto-8",
    title: "Camisa Feminina Itália Squadra Azzurra",
    category: "Feminina",
    description: "Camisa oficial da seleção italiana com modelagem acinturada feminina. Azul clássico com detalhes da bandeira italiana nas mangas.",
    price: 69.90,
    stock: { P: 12, M: 18, G: 14, GG: 8, EG: 0, XG: 0, "3G": 0 },
    images: [
      "https://images.unsplash.com/photo-1599447421416-3414500d18a5?q=80&w=600&auto=format&fit=crop"
    ],
    technicalDetails: "Modelagem feminina acinturada (Baby Look). Escudo bordado de alto relevo. Costuras macias de alta resistência."
  },
  {
    id: "manto-9",
    title: "Camisa Liverpool Home Promo",
    category: "Promoções",
    description: "Manto dos Reds em vermelho tradicional com detalhes brancos. Preço imbatível no lote para atacado acima de 10 unidades.",
    price: 49.90,
    originalPrice: 99.90,
    stock: { P: 30, M: 40, G: 35, GG: 20, EG: 10, XG: 5, "3G": 5 },
    images: [
      "https://images.unsplash.com/photo-1517466787929-bc90951d0974?q=80&w=600&auto=format&fit=crop"
    ],
    technicalDetails: "Versão torcedor clássica. Tecido de alta ventilação. Logo oficial bordado."
  }
];
