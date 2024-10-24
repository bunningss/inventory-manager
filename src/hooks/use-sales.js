import { create } from "zustand";

export const useSales = create((set) => ({
  salesItems: [],
  total: 0,
  onClear: () =>
    set(() => {
      return {
        salesItems: [],
        total: 0,
      };
    }),
  onAdd: (product) =>
    set((state) => {
      const existingItem = state.salesItems.find(
        (item) => item._id === product._id
      );

      if (existingItem) {
        const newItems = state.salesItems.map((item) =>
          item._id === product._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
        const newTotal = state.total + product.price;

        return {
          salesItems: newItems,
          total: newTotal,
        };
      }

      if (!existingItem) {
        const newItems = [
          ...state.salesItems,
          { ...product, quantity: product.quantity ? product.quantity : 1 },
        ];
        const newTotal = state.total + product.price * product.quantity;
        return {
          salesItems: newItems,
          total: newTotal,
        };
      }
    }),
  onRemove: (id) =>
    set((state) => {
      const existingItem = state.salesItems.find((item) => item._id === id);

      if (!existingItem) {
        return {
          salesItems: state.salesItems,
          total: state.total,
        };
      }

      const newItems = state.salesItems.filter((item) => item._id !== id);
      const newTotal = state.total - existingItem.quantity * existingItem.price;
      return {
        salesItems: newItems,
        total: newTotal,
      };
    }),

  onIncrease: (id) =>
    set((state) => {
      const index = state.salesItems.findIndex((item) => item._id === id);

      if (index === -1) {
        return {
          salesItems: state.salesItems,
          total: state.total,
        };
      }

      state.salesItems[index].quantity += 1;
      state.total += state.salesItems[index].price;

      return {
        salesItems: state.salesItems,
        total: state.total,
      };
    }),

  onDecrease: (id, title) =>
    set((state) => {
      const index = state.salesItems.findIndex((item) => item._id === id);

      if (index === -1) {
        return {
          salesItems: state.salesItems,
          total: state.total,
        };
      }

      state.salesItems[index].quantity -= 1;
      state.total -= state.salesItems[index].price;

      if (state.salesItems[index].quantity === 0) {
        state.salesItems.splice(index, 1);
      }

      return {
        salesItems: state.salesItems,
        total: state.total,
      };
    }),
}));
