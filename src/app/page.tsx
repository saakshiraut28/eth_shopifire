/** @format */

import Image from "next/image";
import Link from "next/link";
import shop from "../assets/shop.jpg";

export default function Home() {
  return (
    <main className="flex flex-col justify-between items-center p-24 min-h-screen">
      <div className="items-center gap-8 grid md:grid-cols-2 container">
        <Image
          src={shop}
          width={600}
          height={600}
          alt="Hero Image"
          className="mx-auto rounded-xl aspect-square object-cover"
        />
        <div className="space-y-4 text-center md:text-left">
          <h1 className="font-bold text-4xl sm:text-5xl md:text-6xl tracking-tighter">
            Shop Smarter with ShopApp
          </h1>
          <p className="text-muted-foreground md:text-xl">
            Discover the best products, compare prices, and get the perfect
            items delivered to your doorstep.
          </p>
          <Link href="/shop">
            <button className="bg-indigo-700 m-2 my-3 px-4 p-2 rounded-lg font-bold text-white text-xl underline">
              Get Started
            </button>
          </Link>
        </div>
      </div>
    </main>
  );
}
