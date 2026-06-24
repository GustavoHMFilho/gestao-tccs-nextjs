import type { Metadata } from "next";
import { Toaster } from "sonner";
import { Sidebar } from "@/components/sidebar";
import "./globals.css";

export const metadata: Metadata = {
  title: "Acervo | Gestão de TCCs",
  description: "Sistema acadêmico para gestão de Trabalhos de Conclusão de Curso",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="pt-BR"><body><div className="app-shell"><Sidebar /><main>{children}</main></div><Toaster richColors position="top-right" /></body></html>;
}
