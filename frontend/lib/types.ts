export type NamedEntity = { id: number; nome: string };
export type Unidade = NamedEntity & { sigla: string };
export type Departamento = NamedEntity & { sigla: string; unidade_academica: number };
export type Curso = NamedEntity & { sigla: string; codigo: string };
export type Aluno = NamedEntity & { matricula: string; curso: number };
export type Professor = NamedEntity & { departamento: number };

export type TCC = {
  id: number;
  titulo: string;
  resumo: string;
  palavras_chave: string;
  tipo: string;
  tipo_display: string;
  idioma: string;
  idioma_display: string;
  aluno: number;
  orientador: number;
  coorientador: number | null;
  presidente: number;
  primeiro_membro: number;
  segundo_membro: number;
  semestre_letivo_defesa: string | null;
  status: "0" | "1" | "2" | "3";
  status_display: string;
  arquivo: string | null;
};

export type Statistics = {
  total_geral: number;
  por_status: Record<string, number>;
  por_tipo: Record<string, number>;
  por_idioma: Record<string, number>;
  por_semestre: Record<string, number>;
  por_orientador: Record<string, number>;
  por_coorientador: Record<string, number>;
  por_curso: Record<string, number>;
  por_departamento: Record<string, number>;
  por_unidade_academica: Record<string, number>;
};

export type ApiList<T> = T[] | { results: T[] };
