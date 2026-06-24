"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, BookOpenText, CheckCircle2, Clock3, GraduationCap, RefreshCw } from "lucide-react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import { api } from "@/lib/api";
import type { Statistics } from "@/lib/types";
import { PageHeader } from "./page-header";

const COLORS = ["#2459e0", "#68a0ff", "#f5ae42", "#35a67a", "#ef6b73", "#8a6ee8"];
const mojibake: Record<string, string> = { "Em ElaboraÃ§Ã£o": "Em elaboração", "RelatÃ³rio de EstÃ¡gio": "Relatório de estágio", "RelatÃ³rio TÃ©cnico": "Relatório técnico", "PortuguÃªs": "Português", "InglÃªs": "Inglês" };
const fix = (value: string) => mojibake[value] || value;

export function Dashboard() {
  const [data, setData] = useState<Statistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const load = () => { setLoading(true); setError(""); api<Statistics>("tccs/estatisticas").then(setData).catch((e) => setError(e.message)).finally(() => setLoading(false)); };
  useEffect(load, []);
  const statusData = useMemo(() => Object.entries(data?.por_status || {}).map(([name, value]) => ({ name: fix(name), value })), [data]);
  const courseData = useMemo(() => Object.entries(data?.por_curso || {}).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value).slice(0, 6), [data]);
  const approved = statusData.find((item) => item.name === "Aprovado")?.value || 0;
  const draft = statusData.find((item) => item.name === "Em elaboração")?.value || 0;

  return <div className="page dashboard-page">
    <PageHeader eyebrow="Painel acadêmico" title="Visão geral" description="Acompanhe o acervo de trabalhos e os principais indicadores acadêmicos." action={<Link className="primary-button" href="/tccs"><BookOpenText size={18} /> Ver trabalhos</Link>} />
    {error && <div className="error-banner"><div><strong>Não foi possível carregar o painel</strong><span>{error}</span></div><button onClick={load}><RefreshCw size={17} /> Tentar novamente</button></div>}
    <section className="metric-grid">
      <Metric label="Total de trabalhos" value={data?.total_geral} icon={<BookOpenText />} accent="blue" loading={loading} />
      <Metric label="Trabalhos aprovados" value={approved} icon={<CheckCircle2 />} accent="green" loading={loading} />
      <Metric label="Em elaboração" value={draft} icon={<Clock3 />} accent="amber" loading={loading} />
      <Metric label="Cursos no acervo" value={Object.keys(data?.por_curso || {}).length} icon={<GraduationCap />} accent="violet" loading={loading} />
    </section>
    <section className="chart-grid">
      <article className="panel chart-card"><div className="panel-heading"><div><span className="eyebrow">Distribuição</span><h2>Trabalhos por status</h2></div><Link href="/tccs">Explorar <ArrowUpRight size={16} /></Link></div><div className="donut-wrap"><div className="chart-area"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={statusData} dataKey="value" nameKey="name" innerRadius={68} outerRadius={96} paddingAngle={3}>{statusData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer><div className="donut-center"><strong>{data?.total_geral ?? "—"}</strong><span>trabalhos</span></div></div><div className="legend">{statusData.map((item, i) => <div key={item.name}><i style={{ background: COLORS[i % COLORS.length] }} /><span>{item.name}</span><strong>{item.value}</strong></div>)}</div></div></article>
      <article className="panel chart-card"><div className="panel-heading"><div><span className="eyebrow">Cursos</span><h2>Produção acadêmica</h2></div></div><div className="bar-area"><ResponsiveContainer width="100%" height="100%"><BarChart data={courseData} margin={{ top: 12, right: 8, left: -24, bottom: 0 }}><CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e7ebf3" /><XAxis dataKey="name" tick={{ fontSize: 11, fill: "#667085" }} axisLine={false} tickLine={false} interval={0} tickFormatter={(v) => v.length > 12 ? `${v.slice(0, 11)}…` : v} /><YAxis allowDecimals={false} tick={{ fontSize: 11, fill: "#98a2b3" }} axisLine={false} tickLine={false} /><Tooltip /><Bar dataKey="value" name="Trabalhos" fill="#2459e0" radius={[6, 6, 0, 0]} maxBarSize={46} /></BarChart></ResponsiveContainer></div></article>
    </section>
    <section className="panel compact-panel"><div className="panel-heading"><div><span className="eyebrow">Orientação</span><h2>Orientadores com mais trabalhos</h2></div></div><div className="ranking-list">{Object.entries(data?.por_orientador || {}).sort((a,b) => b[1]-a[1]).slice(0,5).map(([name,count],i) => <div key={name}><span className="rank">{String(i+1).padStart(2,"0")}</span><div className="avatar">{name.split(" ").slice(0,2).map(n=>n[0]).join("")}</div><strong>{name}</strong><span>{count} {count === 1 ? "trabalho" : "trabalhos"}</span></div>)}{!loading && !data?.total_geral && <p className="empty-inline">Cadastre o primeiro TCC para ver os indicadores.</p>}</div></section>
  </div>;
}

function Metric({ label, value, icon, accent, loading }: { label: string; value: number | undefined; icon: React.ReactNode; accent: string; loading: boolean }) {
  return <article className="metric-card"><div className={`metric-icon ${accent}`}>{icon}</div><div><span>{label}</span><strong>{loading ? "—" : value ?? 0}</strong></div></article>;
}
