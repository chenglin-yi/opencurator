import { create } from "zustand";
import { persist } from "zustand/middleware";
import { APIConfig, defaultAPIConfig } from "@/types/ai";

interface ConfigState {
  apiConfig: APIConfig | null;
  theme: "light" | "dark" | "system";
  
  setApiConfig: (config: APIConfig) => void;
  clearApiConfig: () => void;
  setTheme: (theme: "light" | "dark" | "system") => void;
}

export const useConfigStore = create<ConfigState>()(
  persist(
    (set) => ({
      apiConfig: null,
      theme: "system",

      setApiConfig: (config) => set({ apiConfig: config }),
      
      clearApiConfig: () => set({ apiConfig: null }),
      
      setTheme: (theme) => set({ theme }),
    }),
    {
      name: "opencurator-config",
    }
  )
);
