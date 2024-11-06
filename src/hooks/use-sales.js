import { create } from "zustand";

export const useSales = create((set) => ({
  salesItems: [],
  total: 0,
  onClear: () =>
    set(() => ({
      salesItems: [],
      total: 0,
    })),
  onAdd: (product) =>
    set((state) => {
      const existingItemIndex = state.salesItems.findIndex(
        (item) => item._id === product._id && item.price === product.price
      );

      if (existingItemIndex !== -1) {
        // If product with same ID and price exists, increase quantity
        const newItems = [...state.salesItems];
        newItems[existingItemIndex].quantity += product.quantity || 1;
        const newTotal = state.total + product.price * (product.quantity || 1);
        return {
          salesItems: newItems,
          total: newTotal,
        };
      } else {
        // If product doesn't exist or has a different price, add as new entry
        const newItems = [
          ...state.salesItems,
          { ...product, quantity: product.quantity || 1 },
        ];
        const newTotal = state.total + product.price * (product.quantity || 1);
        return {
          salesItems: newItems,
          total: newTotal,
        };
      }
    }),
  onRemove: (id, price) =>
    set((state) => {
      const existingItemIndex = state.salesItems.findIndex(
        (item) => item._id === id && item.price === price
      );

      if (existingItemIndex === -1) {
        console.log("No item found with the given id and price");
        return state;
      }

      const existingItem = state.salesItems[existingItemIndex];
      const newItems = state.salesItems.filter(
        (_, index) => index !== existingItemIndex
      );
      const newTotal = state.total - existingItem.quantity * existingItem.price;

      return {
        salesItems: newItems,
        total: newTotal,
      };
    }),
}));
