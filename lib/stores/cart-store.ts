import { create } from "zustand"
import { persist } from "zustand/middleware"

interface CartItem {
  id: string
  name: string
  brand: string
  price: string
  color: string
  category: string
  quantity: number
}

interface Order {
  id: string
  items: CartItem[]
  total: number
  date: string
  status: "pending" | "processing" | "completed" | "cancelled"
  shippingAddress?: {
    name: string
    address: string
    city: string
    zipCode: string
    phone: string
  }
  paymentMethod?: "cod" | "digital"
}

interface CartStore {
  items: CartItem[]
  orders: Order[]
  addItem: (item: Omit<CartItem, "quantity">) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  getTotal: () => number
  checkout: (orderData: { shippingAddress: any; paymentMethod: string }) => void
  cancelOrder: (orderId: string) => void
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      orders: [],

      addItem: (item) =>
        set((state) => {
          const existingItem = state.items.find((i) => i.id === item.id)
          if (existingItem) {
            return {
              items: state.items.map((i) => (i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i)),
            }
          }
          return {
            items: [...state.items, { ...item, quantity: 1 }],
          }
        }),

      removeItem: (id) =>
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        })),

      updateQuantity: (id, quantity) =>
        set((state) => ({
          items: state.items.map((item) => (item.id === id ? { ...item, quantity } : item)),
        })),

      clearCart: () => set({ items: [] }),

      getTotal: () => {
        const { items } = get()
        return items.reduce((total, item) => {
          const price = Number.parseFloat(item.price.replace("$", ""))
          return total + price * item.quantity
        }, 0)
      },

      checkout: (orderData) =>
        set((state) => {
          const order: Order = {
            id: `order-${Date.now()}`,
            items: [...state.items],
            total: state.getTotal(),
            date: new Date().toISOString(),
            status: "pending",
            shippingAddress: orderData.shippingAddress,
            paymentMethod: orderData.paymentMethod as "cod" | "digital",
          }
          return {
            items: [],
            orders: [...state.orders, order],
          }
        }),

      cancelOrder: (orderId) =>
        set((state) => ({
          orders: state.orders.map((order) => (order.id === orderId ? { ...order, status: "cancelled" } : order)),
        })),
    }),
    {
      name: "cart-storage",
    },
  ),
)
