export type ResourceConfig = {
  title: string;
  singular: string;
  description: string;
  endpoint: string;
  searchPlaceholder: string;
};

export const resourceConfigs: Record<string, ResourceConfig> = {
  alunos: {
    title: "Alunos",
    singular: "aluno",
    description: "Estudantes vinculados aos cursos e seus registros acadêmicos.",
    endpoint: "alunos",
    searchPlaceholder: "Buscar por nome ou matrícula",
  },
  professores: {
    title: "Professores",
    singular: "professor",
    description: "Docentes aptos a orientar e compor bancas de TCC.",
    endpoint: "professores",
    searchPlaceholder: "Buscar professor por nome",
  },
  cursos: {
    title: "Cursos",
    singular: "curso",
    description: "Cursos de graduação representados no acervo acadêmico.",
    endpoint: "cursos",
    searchPlaceholder: "Buscar por nome, sigla ou código",
  },
  departamentos: {
    title: "Departamentos",
    singular: "departamento",
    description: "Departamentos associados às unidades acadêmicas.",
    endpoint: "departamentos",
    searchPlaceholder: "Buscar por nome ou sigla",
  },
  "unidades-academicas": {
    title: "Unidades acadêmicas",
    singular: "unidade",
    description: "Estrutura organizacional das unidades acadêmicas da universidade.",
    endpoint: "unidades-academicas",
    searchPlaceholder: "Buscar por nome ou sigla",
  },
};
