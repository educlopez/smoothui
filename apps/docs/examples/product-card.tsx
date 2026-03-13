"use client";

import ProductCard from "@repo/smoothui/components/product-card";

const products = [
  {
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=600&fit=crop",
    title: "Nike Air Max",
    price: 129,
    originalPrice: 179,
    rating: 4.5,
    badge: "Sale",
  },
  {
    image:
      "https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=600&h=600&fit=crop",
    title: "Luxury Perfume",
    price: 89,
    rating: 5,
    badge: "New",
  },
];

export default function ProductCardDemo() {
  return (
    <div className="mx-auto grid w-full max-w-lg grid-cols-2 gap-4">
      {products.map((product) => (
        <ProductCard
          key={product.title}
          onAddToCart={() => {}}
          {...product}
        />
      ))}
    </div>
  );
}
