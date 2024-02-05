import { create } from "zustand"
import { persist } from "zustand/middleware"

export const useStore = create(
  persist(
    (set) => ({
      user: null,
      login: (user) =>
        set({
          user: {
            email: user.user.email,
            token: user.token,
            user_id: user.user._id,
          },
        }),
      logout: () => set({ user: null }),
    }),
    { name: "user" }
  )
)

export const useResultStore = create((set) => ({
  results: null,
  setResults: (results) => set({ results }),
  clearResults: () => set({ results: null }),
}))
