# 📚 Acervo — Sistema de Gestão de Trabalhos de Conclusão de Curso

Frontend desenvolvido em **Next.js** para consumo da API de gestão de Trabalhos de Conclusão de Curso (TCCs), criada na disciplina **GAC116 – Programação Web**.

O sistema centraliza o cadastro, consulta e acompanhamento de TCCs, oferecendo recursos de visualização, busca e análise de dados acadêmicos.

---

## 👨‍💻 Autores

* [**Gustavo Henrique Moraes Filho**](https://github.com/GustavoHMFilho)
* [**Lucas Reis**](https://github.com/lucasreissvn)

---

## ✨ Principais Funcionalidades

### 📊 Dashboard

* Visão geral dos trabalhos cadastrados;
* Indicadores quantitativos por status;
* Distribuição de TCCs por curso;
* Ranking de orientadores;
* Gráficos interativos para análise dos dados.

### 🎓 Gestão Acadêmica

Consulta e gerenciamento de:

* TCCs;
* Alunos;
* Professores;
* Cursos;
* Departamentos;
* Unidades acadêmicas.

### 📄 Cadastro de Trabalhos

* Cadastro completo de TCC utilizando `multipart/form-data`;
* Upload de arquivos PDF;
* Acesso e visualização dos documentos armazenados;
* Atualização rápida do status dos trabalhos.

### 🔍 Pesquisa e Filtros

* Busca por título;
* Busca por resumo;
* Busca por aluno;
* Busca por status;
* Filtragem dinâmica dos resultados.

### ⚙️ Infraestrutura

* Interface responsiva para desktop, tablet e dispositivos móveis;
* Proxy interno do Next.js para desacoplamento entre frontend e backend;
* Ambiente totalmente conteinerizado com Docker Compose.

---

## 🏗️ Estrutura do Projeto

```text
acervo/
├── frontend/           # Aplicação Next.js + TypeScript
├── backend/            # API Django REST Framework
└── docker-compose.yml  # Orquestração dos serviços
```

---

## 🚀 Pré-requisitos

### Backend

* Python 3.11 ou superior;
* pip.

### Frontend

* Node.js 22 ou versão LTS recente;
* Corepack habilitado.

### Docker (Opcional)

* Docker Desktop;
* Docker Compose.

---

# 💻 Execução Local

## 0. Clonando o repositório

```bash
git clone https://github.com/GustavoHMFilho/gestao-tccs-nextjs
cd gestao-tccs-nextjs
```

## 1. Iniciando o Backend

### Windows (PowerShell)

```powershell
cd backend

python -m venv .venv
venv\scripts\activate

pip install -r requirements.txt

python manage.py migrate
python load.py
python manage.py runserver
```
### Linux / macOS (Terminal)

```bash
cd backend

python3 -m venv .venv
source .venv/bin/activate

pip install -r requirements.txt

python manage.py migrate
python load.py
python manage.py runserver
```


### Dados de Demonstração

O script `load.py` popula o banco com dados fictícios para testes.

> ⚠️ Atenção: o script remove os registros existentes antes de realizar a carga dos dados.

O backend ficará disponível em:

```text
http://127.0.0.1:8000
```

---

## 2. Iniciando o Frontend

Em outro terminal:

```powershell
cd frontend

corepack pnpm install
corepack pnpm dev
```

### 🌐 Acessando a aplicação

Após iniciar o frontend, abra o navegador e acesse:

```text
http://localhost:3000
```

> ✅ Este é o endereço principal da aplicação e deve ser utilizado para acessar o sistema.

### Configuração do Backend

Por padrão, o frontend consome a API disponível em:

```text
http://127.0.0.1:8000
```

Caso o backend esteja sendo executado em outro endereço, copie o arquivo `.env.example` para `.env.local` e ajuste a variável:

```env
BACKEND_URL=
```

---

## 📦 Sobre o uso do Corepack

O comando `pnpm` só funciona diretamente quando instalado globalmente.

Como o Corepack acompanha as versões recentes do Node.js, ele garante a execução da versão correta do `pnpm` sem necessidade de instalação adicional.

Caso o terminal informe que `corepack` não foi encontrado:

1. Instale uma versão recente do Node.js;
2. Reinicie o terminal;
3. Execute novamente os comandos.

---

# 🐳 Execução com Docker

Com o Docker Desktop em execução:

```powershell
docker compose up --build -d
```

Aplicar migrações:

```powershell
docker compose exec backend python manage.py migrate
```

Popular o banco com dados de demonstração:

```powershell
docker compose exec backend python load.py
```

> ⚠️ O comando `load.py` remove os registros anteriores antes da carga dos dados.

### 🌐 Acessando a aplicação

Após a inicialização dos containers, abra:

```text
http://localhost:3000
```

### Logs

```powershell
docker compose logs -f
```

### Encerrar os serviços

```powershell
docker compose down
```

---

# ✅ Validação e Testes

## Frontend

```powershell
cd frontend

corepack pnpm lint
corepack pnpm build
```

## Backend

```powershell
python manage.py check
python manage.py test
```

---

# 🛠️ Tecnologias Utilizadas

### Frontend

* Next.js 15;
* React 19;
* TypeScript;
* Recharts;
* Lucide React.

### Backend

* Django;
* Django REST Framework.

### DevOps

* Docker;
* Docker Compose.

