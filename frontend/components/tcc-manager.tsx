"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { BookOpen, Check, ChevronDown, Download, FileText, Filter, Plus, RefreshCw, Search, Send, X } from "lucide-react";
import { toast } from "sonner";
import { api, getList } from "@/lib/api";
import type { Aluno, Professor, TCC } from "@/lib/types";
import { PageHeader } from "./page-header";

const STATUS = { "0": "Em elaboração", "1": "Enviado", "2": "Aprovado", "3": "Reprovado" } as const;
const TYPE = { MONOGRAFIA: "Monografia", RELATORIO_ESTAGIO: "Relatório de estágio", RELATORIO_TECNICO: "Relatório técnico", ARTIGO: "Artigo" } as const;

export function TccManager() {
  const [items, setItems] = useState<TCC[]>([]);
  const [students, setStudents] = useState<Aluno[]>([]);
  const [professors, setProfessors] = useState<Professor[]>([]);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("todos");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modal, setModal] = useState(false);
  const [details, setDetails] = useState<TCC | null>(null);

  const load = useCallback(async () => {
    setLoading(true); setError("");
    try { const [tccs, alunos, docentes] = await Promise.all([getList<TCC>("tccs"), getList<Aluno>("alunos"), getList<Professor>("professores")]); setItems(tccs); setStudents(alunos); setProfessors(docentes); }
    catch (e) { setError(e instanceof Error ? e.message : "Falha ao carregar trabalhos."); }
    finally { setLoading(false); }
  }, []);
  useEffect(() => { load(); }, [load]);
  const studentMap = useMemo(() => Object.fromEntries(students.map((x) => [x.id, x.nome])), [students]);
  const professorMap = useMemo(() => Object.fromEntries(professors.map((x) => [x.id, x.nome])), [professors]);
  const filtered = useMemo(() => items.filter((item) => (statusFilter === "todos" || item.status === statusFilter) && `${item.titulo} ${item.resumo} ${studentMap[item.aluno] || ""}`.toLowerCase().includes(query.toLowerCase())), [items, query, statusFilter, studentMap]);

  async function updateStatus(item: TCC, status: TCC["status"]) {
    try { const updated = await api<TCC>(`tccs/${item.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status }) }); setItems((current) => current.map((x) => x.id === item.id ? updated : x)); setDetails((current) => current?.id === item.id ? updated : current); toast.success(`Status alterado para ${STATUS[status]}.`); }
    catch (e) { toast.error(e instanceof Error ? e.message : "Não foi possível alterar o status."); }
  }

  return <div className="page">
    <PageHeader eyebrow="Acervo acadêmico" title="Trabalhos de conclusão" description="Consulte, envie e acompanhe o ciclo de avaliação dos TCCs." action={<button className="primary-button" onClick={() => setModal(true)}><Plus size={18} /> Novo TCC</button>} />
    <section className="panel tcc-panel">
      <div className="table-toolbar tcc-toolbar"><div className="search-box"><Search size={18} /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Buscar por título, resumo ou aluno" /></div><label className="select-filter"><Filter size={16} /><select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}><option value="todos">Todos os status</option>{Object.entries(STATUS).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select><ChevronDown size={15} /></label></div>
      {error ? <div className="state-block"><RefreshCw size={28} /><h3>Backend indisponível</h3><p>{error}</p><button className="secondary-button" onClick={load}>Tentar novamente</button></div> : loading ? <div className="card-skeleton">{Array.from({ length: 5 }).map((_, i) => <i key={i} />)}</div> : filtered.length === 0 ? <div className="state-block"><BookOpen size={30} /><h3>Nenhum trabalho encontrado</h3><p>Refine a busca ou cadastre um novo TCC.</p></div> : <div className="tcc-list">{filtered.map((item) => <article key={item.id} className="tcc-row"><button className="tcc-main" onClick={() => setDetails(item)}><div className="file-icon"><FileText size={22} /></div><div><span className={`status-badge status-${item.status}`}>{STATUS[item.status]}</span><h3>{item.titulo}</h3><p>{studentMap[item.aluno] || `Aluno #${item.aluno}`} <i /> {professorMap[item.orientador] || `Orientador #${item.orientador}`}</p></div></button><div className="tcc-meta"><span>{item.tipo_display || TYPE[item.tipo as keyof typeof TYPE] || item.tipo}</span><strong>{item.semestre_letivo_defesa || "Sem semestre"}</strong></div>{item.arquivo ? <a className="icon-button" href={item.arquivo} target="_blank" rel="noreferrer" aria-label="Abrir PDF"><Download size={18} /></a> : <span className="no-file">Sem PDF</span>}</article>)}</div>}
    </section>
    {modal && <TccForm students={students} professors={professors} onClose={() => setModal(false)} onCreated={(item) => { setItems((x) => [item, ...x]); setModal(false); toast.success("TCC cadastrado com sucesso."); }} />}
    {details && <Details item={details} student={studentMap[details.aluno]} professor={professorMap[details.orientador]} onClose={() => setDetails(null)} onStatus={updateStatus} />}
  </div>;
}

function Modal({ children, onClose, wide = false }: { children: React.ReactNode; onClose: () => void; wide?: boolean }) { return <div className="modal-backdrop" onMouseDown={onClose}><div className={`modal ${wide ? "modal-wide" : ""}`} onMouseDown={(e) => e.stopPropagation()}>{children}</div></div>; }

function TccForm({ students, professors, onClose, onCreated }: { students: Aluno[]; professors: Professor[]; onClose: () => void; onCreated: (item: TCC) => void }) {
  const [saving, setSaving] = useState(false);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setSaving(true);
    const form = new FormData(event.currentTarget);
    if (!form.get("coorientador")) form.delete("coorientador");
    if (!(form.get("arquivo") as File)?.size) form.delete("arquivo");
    try { onCreated(await api<TCC>("tccs", { method: "POST", body: form })); }
    catch (e) { toast.error(e instanceof Error ? e.message : "Não foi possível cadastrar o TCC."); }
    finally { setSaving(false); }
  }
  const semesters = ["2026/1","2025/2","2025/1","2024/2","2024/1","2023/2","2023/1","2022/2","2022/1","2021/2","2021/1","2020/2","2020/1"];
  return <Modal onClose={onClose} wide><form onSubmit={submit}><div className="modal-header"><div><span className="eyebrow">Novo registro</span><h2>Cadastrar TCC</h2><p>Preencha os dados acadêmicos e anexe o trabalho em PDF.</p></div><button type="button" className="icon-button" onClick={onClose}><X size={20} /></button></div><div className="form-body"><div className="field full"><label>Título</label><input name="titulo" required maxLength={255} placeholder="Título completo do trabalho" /></div><div className="field full"><label>Resumo</label><textarea name="resumo" required rows={4} placeholder="Apresente brevemente o objetivo e os resultados do trabalho" /></div><div className="field full"><label>Palavras-chave</label><input name="palavras_chave" required placeholder="Ex.: educação, inteligência artificial, dados" /></div><Select name="tipo" label="Tipo" options={Object.entries(TYPE)} /><Select name="idioma" label="Idioma" options={[["PT","Português"],["EN","Inglês"]]} /><Select name="aluno" label="Aluno" options={students.map((x) => [String(x.id), `${x.nome} · ${x.matricula}`])} /><Select name="orientador" label="Orientador" options={professors.map((x) => [String(x.id), x.nome])} /><Select name="coorientador" label="Coorientador (opcional)" optional options={professors.map((x) => [String(x.id), x.nome])} /><Select name="presidente" label="Presidente da banca" options={professors.map((x) => [String(x.id), x.nome])} /><Select name="primeiro_membro" label="Primeiro membro" options={professors.map((x) => [String(x.id), x.nome])} /><Select name="segundo_membro" label="Segundo membro" options={professors.map((x) => [String(x.id), x.nome])} /><Select name="semestre_letivo_defesa" label="Semestre de defesa" options={semesters.map((x) => [x,x])} /><Select name="status" label="Status inicial" options={Object.entries(STATUS)} /><div className="field"><label>Arquivo do trabalho</label><input className="file-input" name="arquivo" type="file" accept="application/pdf,.pdf" /></div></div><div className="modal-footer"><button type="button" className="secondary-button" onClick={onClose}>Cancelar</button><button disabled={saving} className="primary-button" type="submit">{saving ? "Salvando..." : <><Send size={17} /> Cadastrar trabalho</>}</button></div></form></Modal>;
}

function Select({ name, label, options, optional = false }: { name: string; label: string; options: string[][]; optional?: boolean }) { return <div className="field"><label>{label}</label><select name={name} required={!optional}><option value="">{optional ? "Nenhum" : "Selecione"}</option>{options.map(([value,text]) => <option value={value} key={value}>{text}</option>)}</select></div>; }

function Details({ item, student, professor, onClose, onStatus }: { item: TCC; student?: string; professor?: string; onClose: () => void; onStatus: (item: TCC, status: TCC["status"]) => void }) {
  return <Modal onClose={onClose}><div className="modal-header"><div><span className={`status-badge status-${item.status}`}>{STATUS[item.status]}</span><h2>{item.titulo}</h2><p>{student} · Orientação de {professor}</p></div><button className="icon-button" onClick={onClose}><X size={20} /></button></div><div className="details-body"><div className="details-grid"><span><small>Tipo</small>{item.tipo_display || item.tipo}</span><span><small>Idioma</small>{item.idioma_display || item.idioma}</span><span><small>Semestre</small>{item.semestre_letivo_defesa || "Não informado"}</span></div><h4>Resumo</h4><p>{item.resumo}</p><h4>Palavras-chave</h4><div className="keyword-list">{item.palavras_chave.split(",").map((x) => <span key={x}>{x.trim()}</span>)}</div>{item.arquivo && <a className="file-link" href={item.arquivo} target="_blank" rel="noreferrer"><FileText size={20} /><div><strong>Arquivo do TCC</strong><span>Abrir documento em PDF</span></div><Download size={18} /></a>}<h4>Alterar status</h4><div className="status-actions">{Object.entries(STATUS).map(([value,label]) => <button key={value} disabled={item.status === value} className={`status-${value}`} onClick={() => onStatus(item, value as TCC["status"])}>{item.status === value && <Check size={15} />}{label}</button>)}</div></div></Modal>;
}
