import { supabase } from "./lib/supabase";
import { defaultProducts } from "./data/mockProducts";

export async function importProducts() {
  const products = defaultProducts.map((p) => ({
    id: p.id,
    title: p.title,
    category: p.category,
    description: p.description,
    price: p.price,
    original_price: p.originalPrice ?? null,
    stock: p.stock,
    images: p.images,
    technical_details: p.technicalDetails ?? null,
  }));

  const { data, error } = await supabase
    .from("products")
    .insert(products)
    .select();

  console.log("DATA:", data);
  console.log("ERROR:", error);

  if (error) {
    console.log(JSON.stringify(error, null, 2));
  }
}
