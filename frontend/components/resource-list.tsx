"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Search, RefreshCw, UsersRound } from "lucide-react";
import { getList } from "@/lib/api";
import { resourceConfigs } from "@/lib/resources";
import type { Aluno, Curso, Departamento, Professor, Unidade } from "@/lib/types";

type Row = Aluno | Professor | Curso | Departamento | Unidade;

export function ResourceList({ resource }: { resource: string }) {
  const config = resourceConfigs[resource];
  const [rows, setRows] = useState<Row[]>([]);
  const [relations, setRelations] = useState<Record<string, string>>({});
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true); setError("");
    try {
      const [data, cursos, departamentos, unidades] = await Promise.all([
        getList<Row>(config.endpoint),
        getList<Curso>("cursos"),
        getList<Departamento>("departamentos"),
        getList<Unidade>("unidades-academicas"),
      ]);
      setRows(data);
      setRelations(Object.fromEntries([...cursos, ...departamentos, ...unidades].map((item) => [`${item.constructor?.name || ""}-${item.id}`, item.nome])));
      const map: Record<string, string> = {};
      cursos.forEach((x) => map[`curso-${x.id}`] = x.nome);
      departamentos.forEach((x) => map[`departamento-${x.id}`] = x.nome);
      unidades.forEach((x) => map[`unidade-${x.id}`] = x.nome);
      setRelations(map);
    } catch (e) { setError(e instanceof Error ? e.message : "Falha ao carregar dados."); }
    finally { setLoading(false); }
  }, [config.endpoint]);

  useEffect(() => { load(); }, [load]);
  const filtered = useMemo(() => rows.filter((row) => Object.values(row).some((value) => String(value).toLowerCase().includes(query.toLowerCase()))), [rows, query]);

  return <section className="panel table-panel">
    <div className="table-toolbar"><div className="search-box"><Search size={18} /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder={config.searchPlaceholder} /></div><span className="result-count">{filtered.length} {filtered.length === 1 ? "registro" : "registros"}</span></div>
    {error ? <div className="state-block"><RefreshCw size={28} /><h3>Dados indisponíveis</h3><p>{error}</p><button className="secondary-button" onClick={load}>Tentar novamente</button></div> : loading ? <div className="table-skeleton">{Array.from({ length: 6 }).map((_, i) => <i key={i} />)}</div> : filtered.length === 0 ? <div className="state-block"><UsersRound size={30} /><h3>Nenhum registro encontrado</h3><p>Tente ajustar os termos da busca.</p></div> : <div className="table-scroll"><table><thead><tr>{headers(resource).map((item) => <th key={item}>{item}</th>)}</tr></thead><tbody>{filtered.map((row) => <tr key={row.id}>{cells(resource, row, relations).map((cell, i) => <td key={i}>{cell}</td>)}</tr>)}</tbody></table></div>}
  </section>;
}

function headers(resource: string) {
  if (resource === "alunos") return ["Aluno", "Matrícula", "Curso"];
  if (resource === "professores") return ["Professor", "Departamento"];
  if (resource === "cursos") return ["Curso", "Sigla", "Código"];
  if (resource === "departamentos") return ["Departamento", "Sigla", "Unidade acadêmica"];
  return ["Unidade acadêmica", "Sigla"];
}

function identity(name: string) { return <div className="person-cell"><div className="avatar small">{name.split(" ").slice(0,2).map((part) => part[0]).join("")}</div><strong>{name}</strong></div>; }
function cells(resource: string, row: Row, relations: Record<string, string>): React.ReactNode[] {
  if (resource === "alunos") { const x = row as Aluno; return [identity(x.nome), <code key="m">{x.matricula}</code>, relations[`curso-${x.curso}`] || `Curso #${x.curso}`]; }
  if (resource === "professores") { const x = row as Professor; return [identity(x.nome), relations[`departamento-${x.departamento}`] || `Departamento #${x.departamento}`]; }
  if (resource === "cursos") { const x = row as Curso; return [<strong key="n">{x.nome}</strong>, <span className="tag" key="s">{x.sigla}</span>, <code key="c">{x.codigo}</code>]; }
  if (resource === "departamentos") { const x = row as Departamento; return [<strong key="n">{x.nome}</strong>, <span className="tag" key="s">{x.sigla}</span>, relations[`unidade-${x.unidade_academica}`] || `Unidade #${x.unidade_academica}`]; }
  const x = row as Unidade; return [<strong key="n">{x.nome}</strong>, <span className="tag" key="s">{x.sigla}</span>];
}
