"use client";

import ProductCard from "@repo/smoothui/components/product-card";

const products = [
  {
    badge: "Sale",
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=600&fit=crop",
    originalPrice: 179,
    price: 129,
    rating: 4.5,
    title: "Nike Air Max",
  },
  {
    badge: "New",
    image:
      "https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=600&h=600&fit=crop",
    price: 89,
    rating: 5,
    title: "Luxury Perfume",
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
