"use client";
import { useWishlist } from "@/hooks/use-wishlist";
import { Product } from "./product-cards/product";
import { ProductView } from "./product-view";
import { Empty } from "./empty";

export function Wishlist() {
  const { wishlistItems } = useWishlist();

  return (
    <>
      {wishlistItems.length > 0 && (
        <ProductView title="wishlist items">
          {wishlistItems?.map((item, index) => (
            <Product key={index} product={item} />
          ))}
        </ProductView>
      )}
      {wishlistItems.length === 0 && (
        <Empty message="Looks like your wishlist is empty. Add some items to your wishlist." />
      )}
    </>
  );
}
