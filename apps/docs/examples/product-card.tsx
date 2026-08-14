"use client";

import ProductCard from "@repo/smoothui/components/product-card";

const products = [
  {
    badge: "Sale",
    image:
      "https://ik.imagekit.io/16u211libb/smoothui/products/sneaker.jpg?tr=w-600,h-600,f-auto",
    originalPrice: 179,
    price: 129,
    rating: 4.5,
    title: "Nike Air Max",
  },
  {
    badge: "New",
    image:
      "https://ik.imagekit.io/16u211libb/smoothui/products/headphones.jpg?tr=w-600,h-600,f-auto",
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
