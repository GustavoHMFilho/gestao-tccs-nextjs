# Acervo - Gestão de TCCs

Frontend em Next.js para a API de gestão de Trabalhos de Conclusão de Curso fornecida na disciplina GAC116 - Programação Web.

## Autores

- [Gustavo Henrique Martins Filho](https://github.com/GustavoHMFilho)
- [Lucas Reis](https://github.com/lucasreissvn)

## Funcionalidades

- Dashboard com total de trabalhos e gráficos por status e curso;
- ranking de orientadores;
- listagem e busca de TCCs, alunos, professores, cursos, departamentos e unidades acadêmicas;
- cadastro completo de TCC em `multipart/form-data`;
- upload e acesso ao arquivo PDF do trabalho;
- filtros por título, resumo, aluno e status;
- alteração rápida do status do TCC;
- interface responsiva para desktop, tablet e celular;
- proxy interno do Next.js para a API Django, evitando acoplamento do navegador à URL do backend;
- execução conteinerizada com Docker Compose.

## Estrutura

```text
frontend/                                      # Next.js + TypeScript
projeto-gestao-tccs-main/projeto-gestao-tccs-main/  # Django REST Framework
docker-compose.yml                             # Execução integrada
```

## Execução local

### 1. Backend

No PowerShell:

```powershell
cd projeto-gestao-tccs-main/projeto-gestao-tccs-main
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
python manage.py migrate
python load.py
python manage.py runserver
```

O script `load.py` popula o banco com dados de demonstração. Ele limpa os registros existentes, portanto deve ser executado apenas quando essa reinicialização for desejada.

### 2. Frontend

O frontend requer o Node.js 22 ou uma versão LTS recente. Em outro terminal, execute a partir da raiz do projeto:

```powershell
cd frontend
corepack pnpm install
corepack pnpm dev
```

Acesse [http://localhost:3000](http://localhost:3000). Por padrão, o frontend procura o Django em `http://127.0.0.1:8000`. Para usar outra URL, copie `.env.example` para `.env.local` e altere `BACKEND_URL`.

> **Por que utilizar `corepack pnpm`?** O comando `pnpm` somente funciona diretamente quando o gerenciador foi instalado globalmente. O Corepack acompanha as versões recentes do Node.js e executa a versão adequada do pnpm sem exigir instalação global. O arquivo `pnpm-workspace.yaml` também autoriza os scripts nativos necessários de `sharp` e `unrs-resolver` no pnpm 11.

Se o terminal informar que `corepack` não foi encontrado, instale uma versão LTS recente do [Node.js](https://nodejs.org/) e abra um novo PowerShell.

## Execução com Docker

Com Docker Desktop ativo:

```powershell
docker compose up --build -d
docker compose exec backend python manage.py migrate
docker compose exec backend python load.py
```

O primeiro comando constrói e inicia frontend e backend em segundo plano. O comando `load.py` popula o banco persistente com os dados de demonstração e limpa registros anteriores, portanto deve ser usado apenas quando essa reinicialização for desejada.

Para acompanhar os logs ou encerrar os contêineres:

```powershell
docker compose logs -f
docker compose down
```

## Validação

```powershell
cd frontend
corepack pnpm lint
corepack pnpm build
```

No backend:

```powershell
python manage.py check
python manage.py test
```

## Tecnologias

- Next.js 15, React 19 e TypeScript;
- Recharts para visualização de dados;
- Lucide React para iconografia;
- Django REST Framework no backend;
- Docker e Docker Compose.
