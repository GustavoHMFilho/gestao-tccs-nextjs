"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  BookOpenText,
  Building2,
  GraduationCap,
  Landmark,
  LibraryBig,
  Menu,
  Users,
  X,
} from "lucide-react";
import { useState } from "react";

const links = [
  { href: "/", label: "Visão geral", icon: BarChart3 },
  { href: "/tccs", label: "Trabalhos", icon: BookOpenText },
  { href: "/cadastros/alunos", label: "Alunos", icon: GraduationCap },
  { href: "/cadastros/professores", label: "Professores", icon: Users },
  { href: "/cadastros/cursos", label: "Cursos", icon: LibraryBig },
  { href: "/cadastros/departamentos", label: "Departamentos", icon: Building2 },
  { href: "/cadastros/unidades-academicas", label: "Unidades acadêmicas", icon: Landmark },
];

export function Sidebar() {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  return (
    <>
      <button className="mobile-menu" aria-label="Abrir menu" onClick={() => setOpen(true)}><Menu size={22} /></button>
      {open && <button className="menu-backdrop" aria-label="Fechar menu" onClick={() => setOpen(false)} />}
      <aside className={`sidebar ${open ? "sidebar-open" : ""}`}>
        <div className="brand">
          <div className="brand-mark">T</div>
          <div><strong>Acervo</strong><span>Gestão de TCCs</span></div>
          <button className="close-menu" onClick={() => setOpen(false)} aria-label="Fechar menu"><X size={20} /></button>
        </div>
        <nav>
          <p className="nav-eyebrow">Navegação</p>
          {links.map(({ href, label, icon: Icon }) => {
            const active = href === "/" ? path === "/" : path.startsWith(href);
            return <Link key={href} href={href} className={active ? "active" : ""} onClick={() => setOpen(false)}><Icon size={19} /><span>{label}</span></Link>;
          })}
        </nav>
        <div className="sidebar-footer"><span className="status-dot" /> API Django REST</div>
      </aside>
    </>
  );
}
