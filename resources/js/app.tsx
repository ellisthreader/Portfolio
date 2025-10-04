// resources/js/app.tsx
import { createInertiaApp } from "@inertiajs/react";
import { resolvePageComponent } from "laravel-vite-plugin/inertia-helpers";
import { createRoot } from "react-dom/client";
import React from "react";
import { DarkModeProvider } from "@/Context/DarkModeContext";
import { CartProvider } from "@/Context/CartContext";
import "../css/google-autocomplete.css";


createInertiaApp({
  resolve: (name: string) =>
    resolvePageComponent(
      [
        // Try nested first
        `./Pages/${name}/${name}.tsx`,
        // Fallback to flat structure
        `./Pages/${name}.tsx`,
      ],
      import.meta.glob("./Pages/**/*.tsx")
    ),
  setup: ({ el, App, props }) => {
    const root = createRoot(el as HTMLElement);
    root.render(
      <React.StrictMode>
        <CartProvider>
          <DarkModeProvider>
            <App {...props} />
          </DarkModeProvider>
        </CartProvider>
      </React.StrictMode>
    );
  },
});
