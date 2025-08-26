import React from "react";
import ProductCard from "./ProductCard";
import { useAppContext } from "@/context/AppContext";
import Spinner from "./Spinner";

const HomeProducts = () => {

  const { products, router, loading } = useAppContext()

  return (
    <div className="flex flex-col items-center pt-14">
      <div className="flex flex-col items-center ">
        <p className="text-3xl font-medium">Popular products</p>
        <div className="w-28 h-0.5 bg-orange-600 mt-2"></div>
      </div>
      <br/>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 flex-col items-center gap-6 mt-6 pb-14 w-full">
        {loading ? <Spinner /> : products.map((product, index) => <ProductCard key={index} product={product} />)}
      </div>
          <button
          onClick={() => { router.push('/all-products') }}
          className="px-12 py-2.5 border border-gray-500/70 rounded text-gray-500/70 hover:border-gray-800 transition"
        >
          See more
        </button>
      
    </div>
  );
};

export default HomeProducts;
