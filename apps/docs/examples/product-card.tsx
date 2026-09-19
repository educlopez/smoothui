"use client";

import ProductCard from "@repo/smoothui/components/product-card";
import { productImages } from "@smoothui/data/products";

const [sneaker, headphones] = productImages;

const products = [
  {
    badge: "Sale",
    image: `${sneaker.src}?tr=w-600,h-600,f-auto`,
    originalPrice: 179,
    price: 129,
    rating: 4.5,
    title: sneaker.title,
  },
  {
    badge: "New",
    image: `${headphones.src}?tr=w-600,h-600,f-auto`,
    price: 89,
    rating: 5,
    title: headphones.title,
  },
];

export default function ProductCardDemo() {
  return (
    <div className="mx-auto grid w-full max-w-lg grid-cols-2 gap-4">
      {products.map((product) => (
        <ProductCard key={product.title} onAddToCart={() => {}} {...product} />
      ))}
    </div>
  );
}
