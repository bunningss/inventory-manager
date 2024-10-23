import { successNotification, warningNotification } from "@/utils/toast";
import { create } from "zustand";
import {
  persist,
  createJSONStorage,
  subscribeWithSelector,
} from "zustand/middleware";

export const useWishlist = create(
  subscribeWithSelector(
    persist(
      (set) => ({
        wishlistItems: [],
        onAdd: (product) =>
          set((state) => {
            const existingItem = state.wishlistItems.find(
              (item) => item._id === product._id
            );

            if (existingItem) {
              warningNotification(`${product?.title} already in wishlist!`);
              return {
                wishlistItems: state.wishlistItems,
              };
            }

            successNotification(`${product?.title} added to wishlist!`);
            return {
              wishlistItems: [...state.wishlistItems, { ...product }],
            };
          }),

        onRemove: (id, title) =>
          set((state) => {
            const existingItem = state.wishlistItems.find(
              (item) => item._id === id
            );

            if (!existingItem) return;

            warningNotification(`${title} removed from wishlist!`);
            return {
              wishlistItems: state.wishlistItems.filter(
                (item) => item._id !== id
              ),
            };
          }),
      }),
      {
        name: "ze-wishlist",
        storage: createJSONStorage(() => localStorage),
      }
    )
  )
);
