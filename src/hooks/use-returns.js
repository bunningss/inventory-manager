import { create } from "zustand";

export const useReturns = create((set) => ({
  returnItems: [],
  total: 0,
  onClear: () =>
    set(() => ({
      returnItems: [],
      total: 0,
    })),
  onAdd: (product) =>
    set((state) => {
      const existingItemIndex = state.returnItems.findIndex(
        (item) => item._id === product._id && item.price === product.price
      );

      if (existingItemIndex !== -1) {
        // If product with same ID and price exists, increase quantity
        const newItems = [...state.returnItems];
        newItems[existingItemIndex].quantity += product.quantity || 1;
        const newTotal = state.total + product.price * (product.quantity || 1);
        return {
          returnItems: newItems,
          total: newTotal,
        };
      } else {
        // If product doesn't exist or has a different price, add as new entry
        const newItems = [
          ...state.returnItems,
          { ...product, quantity: product.quantity || 1 },
        ];
        const newTotal = state.total + product.price * (product.quantity || 1);
        return {
          returnItems: newItems,
          total: newTotal,
        };
      }
    }),
  onRemove: (id, price) =>
    set((state) => {
      const existingItemIndex = state.returnItems.findIndex(
        (item) => item._id === id && item.price === price
      );

      if (existingItemIndex === -1) {
        console.log("No item found with the given id and price");
        return state;
      }

      const existingItem = state.returnItems[existingItemIndex];
      const newItems = state.returnItems.filter(
        (_, index) => index !== existingItemIndex
      );
      const newTotal = state.total - existingItem.quantity * existingItem.price;

      return {
        returnItems: newItems,
        total: newTotal,
      };
    }),
}));
