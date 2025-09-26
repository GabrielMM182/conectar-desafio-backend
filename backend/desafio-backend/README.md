# Desafio Backend API

API para gerenciamento de usuários e clientes com autenticação JWT e Google OAuth.

## 🚀 Como Rodar o Projeto

### Pré-requisitos
- Node.js (versão 18 ou superior)
- npm ou yarn

### Instalação e Execução

1. **Clone o repositório e instale as dependências:**
```bash
npm install
```

2. **Configure as variáveis de ambiente:**
```bash
cp .env.example .env
```
Edite o arquivo `.env` com suas configurações.

3. **Execute as migrações do banco:**
```bash
npm run migration:run
```

4. **Execute os seeds (opcional):**
```bash
npm run seed:run
```

5. **Inicie o servidor:**
```bash
# Desenvolvimento
npm run start:dev

# Produção
npm run build
npm run start:prod
```

6. **Acesse a documentação Swagger:**
```
http://localhost:3000/docs
```

### Scripts Disponíveis
- `npm run start:dev` - Inicia em modo desenvolvimento com hot reload
- `npm run build` - Compila o projeto
- `npm run test` - Executa os testes
- `npm run test:e2e` - Executa testes end-to-end
- `npm run migration:generate` - Gera nova migração
- `npm run migration:run` - Executa migrações
- `npm run seed:run` - Executa seeds

## 📚 Documentação da API

### Swagger/OpenAPI
A documentação completa da API está disponível em: **http://localhost:3000/docs**

## 🔐 Autenticação

### Autenticação Local
- **POST /auth/register** - Registrar novo usuário
- **POST /auth/login** - Login com email/senha
- **GET /auth/profile** - Obter perfil do usuário autenticado

### Autenticação Google OAuth
- **GET /auth/google** - Iniciar autenticação com Google
- **GET /auth/google/callback** - Callback do Google OAuth

#### Como usar Google OAuth:
1. Redirecione o usuário para `GET /auth/google`
2. O usuário será redirecionado para o Google para autenticação
3. Após autorização, o Google redirecionará para `/auth/google/callback`
4. O sistema retornará um JWT token que pode ser usado nas requisições

#### Variáveis de ambiente necessárias:
```env
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=24h
NODE_ENV=development
GOOGLE_CLIENT_ID=seu-client-id
GOOGLE_CLIENT_SECRET=seu-client-secret
GOOGLE_CLIENT_CALLBACK_URL=http://localhost:3000/auth/google/callback
```

## 📋 Endpoints da API

### 👥 Usuários (Users)

#### POST /users
Criar um novo usuário

**Body:**
```json
{
  "name": "João Silva",
  "email": "joao@example.com",
  "password": "senha123",
  "role": "user" // opcional, padrão: "user"
}
```

**Response (201):**
```json
{
  "id": 1,
  "name": "João Silva",
  "email": "joao@example.com",
  "role": "user",
  "createdAt": "2024-01-01T10:00:00.000Z",
  "updatedAt": "2024-01-01T10:00:00.000Z"
}
```

### GET /users
Listar usuários com paginação e filtros

**Query Parameters:**
- `page`: número da página (padrão: 1)
- `limit`: itens por página (padrão: 10)
- `name`: filtrar por nome (busca parcial)
- `email`: filtrar por email (busca parcial)
- `role`: filtrar por role (admin ou user)

**Examples:**
- `GET /users?page=1&limit=5`
- `GET /users?name=João&role=admin`
- `GET /users?email=example.com`

**Response (200):**
```json
{
  "data": [
    {
      "id": 1,
      "name": "João Silva",
      "email": "joao@example.com",
      "role": "user",
      "createdAt": "2024-01-01T10:00:00.000Z",
      "updatedAt": "2024-01-01T10:00:00.000Z"
    }
  ],
  "total": 1,
  "page": 1,
  "limit": 10,
  "totalPages": 1
}
```

### GET /users/:id
Buscar usuário por ID

**Response (200):**
```json
{
  "id": 1,
  "name": "João Silva",
  "email": "joao@example.com",
  "role": "user",
  "createdAt": "2024-01-01T10:00:00.000Z",
  "updatedAt": "2024-01-01T10:00:00.000Z"
}
```

### PATCH /users/:id
Atualizar usuário

**Body (todos os campos são opcionais):**
```json
{
  "name": "João Santos",
  "email": "joao.santos@example.com",
  "password": "novaSenha123",
  "role": "admin"
}
```

**Response (200):**
```json
{
  "id": 1,
  "name": "João Santos",
  "email": "joao.santos@example.com",
  "role": "admin",
  "createdAt": "2024-01-01T10:00:00.000Z",
  "updatedAt": "2024-01-01T10:30:00.000Z"
}
```

### DELETE /users/:id
Remover usuário

**Response (204):** Sem conteúdo

---

### 🏢 Clientes (Customers)

#### POST /customers
Criar um novo cliente

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Body:**
```json
{
  "razaoSocial": "Empresa Exemplo Ltda",
  "cnpj": "12.345.678/0001-90",
  "nomeFachada": "Empresa Exemplo",
  "tags": ["tecnologia", "startup", "b2b"],
  "status": "ativo",
  "conectaPlus": false
}
```

**Response (201):**
```json
{
  "id": 1,
  "razaoSocial": "Empresa Exemplo Ltda",
  "cnpj": "12.345.678/0001-90",
  "nomeFachada": "Empresa Exemplo",
  "tags": ["tecnologia", "startup", "b2b"],
  "status": "ativo",
  "conectaPlus": false,
  "createdAt": "2024-01-01T10:00:00.000Z",
  "updatedAt": "2024-01-01T10:00:00.000Z"
}
```

#### GET /customers
Listar clientes com paginação e filtros

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Query Parameters:**
- `page`: número da página (padrão: 1)
- `limit`: itens por página (padrão: 10)
- `razaoSocial`: filtrar por razão social (busca parcial)
- `cnpj`: filtrar por CNPJ (busca exata)
- `status`: filtrar por status (ativo ou inativo)
- `conectaPlus`: filtrar por Conecta Plus (true/false)

**Examples:**
- `GET /customers?page=1&limit=5`
- `GET /customers?razaoSocial=Empresa&status=ativo`
- `GET /customers?conectaPlus=true`

**Response (200):**
```json
{
  "data": [
    {
      "id": 1,
      "razaoSocial": "Empresa Exemplo Ltda",
      "cnpj": "12.345.678/0001-90",
      "nomeFachada": "Empresa Exemplo",
      "tags": ["tecnologia", "startup", "b2b"],
      "status": "ativo",
      "conectaPlus": false,
      "createdAt": "2024-01-01T10:00:00.000Z",
      "updatedAt": "2024-01-01T10:00:00.000Z"
    }
  ],
  "total": 1,
  "page": 1,
  "limit": 10,
  "totalPages": 1
}
```

#### GET /customers/:id
Buscar cliente por ID

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Response (200):**
```json
{
  "id": 1,
  "razaoSocial": "Empresa Exemplo Ltda",
  "cnpj": "12.345.678/0001-90",
  "nomeFachada": "Empresa Exemplo",
  "tags": ["tecnologia", "startup", "b2b"],
  "status": "ativo",
  "conectaPlus": false,
  "createdAt": "2024-01-01T10:00:00.000Z",
  "updatedAt": "2024-01-01T10:00:00.000Z"
}
```

#### PATCH /customers/:id
Atualizar cliente

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Body (todos os campos são opcionais):**
```json
{
  "razaoSocial": "Nova Empresa Ltda",
  "nomeFachada": "Nova Empresa",
  "tags": ["tecnologia", "inovação"],
  "status": "inativo",
  "conectaPlus": true
}
```

**Response (200):**
```json
{
  "id": 1,
  "razaoSocial": "Nova Empresa Ltda",
  "cnpj": "12.345.678/0001-90",
  "nomeFachada": "Nova Empresa",
  "tags": ["tecnologia", "inovação"],
  "status": "inativo",
  "conectaPlus": true,
  "createdAt": "2024-01-01T10:00:00.000Z",
  "updatedAt": "2024-01-01T10:30:00.000Z"
}
```

#### DELETE /customers/:id
Remover cliente

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Response (204):** Sem conteúdo

---

### 🔔 Notificações (Notifications)

#### GET /notification
Listar usuários inativos (sem login nos últimos 30 dias)

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Response (200):**
```json
{
  "inactiveUsers": ["user1@example.com", "user2@example.com"],
  "count": 2,
  "daysInactive": 30
}
```

---

## ⚠️ Tratamento de Erros

### 400 Bad Request
```json
{
  "statusCode": 400,
  "message": "ID inválido",
  "error": "Bad Request"
}
```

### 404 Not Found
```json
{
  "statusCode": 404,
  "message": "Usuário com ID 1 não encontrado",
  "error": "Not Found"
}
```

### 409 Conflict
```json
{
  "statusCode": 409,
  "message": "Email já está em uso",
  "error": "Conflict"
}
```

### 401 Unauthorized
```json
{
  "statusCode": 401,
  "message": "Token inválido ou ausente",
  "error": "Unauthorized"
}
```

### 422 Validation Error
```json
{
  "statusCode": 422,
  "message": [
    "Nome é obrigatório",
    "Email deve ter um formato válido",
    "Senha deve ter pelo menos 6 caracteres",
    "CNPJ deve estar no formato XX.XXX.XXX/XXXX-XX",
    "Máximo de 3 tags permitidas"
  ],
  "error": "Unprocessable Entity"
}
```

---

## ✨ Funcionalidades Implementadas

### 👥 Usuários
- ✅ **Criação de usuário** com hash de senha usando bcrypt
- ✅ **Listagem paginada** com filtros por nome, email e role
- ✅ **Busca por ID** com validação
- ✅ **Atualização** com rehash de senha quando alterada
- ✅ **Remoção** com validação de existência

### 🏢 Clientes
- ✅ **CRUD completo** para gerenciamento de clientes
- ✅ **Validação de CNPJ** com algoritmo de verificação
- ✅ **Sistema de tags** (máximo 3 por cliente)
- ✅ **Filtros avançados** por razão social, CNPJ, status e Conecta Plus
- ✅ **Paginação** para listagem de clientes

### 🔐 Autenticação
- ✅ **JWT Authentication** com Bearer Token
- ✅ **Google OAuth 2.0** integração completa
- ✅ **Registro e login local** com validação
- ✅ **Proteção de rotas** com guards

### 🔔 Notificações
- ✅ **Detecção de usuários inativos** (30+ dias sem login)
- ✅ **Relatório de inatividade** com contagem e emails

### 🛠️ Recursos Técnicos
- ✅ **Documentação Swagger/OpenAPI** completa
- ✅ **Validação de DTOs** com class-validator
- ✅ **Tratamento de erros** padronizado
- ✅ **TypeORM** com SQLite
- ✅ **Migrations e Seeds** para banco de dados
- ✅ **Testes unitários** com Jest
- ✅ **ESLint e Prettier** para qualidade de código

---

## 🗄️ Estrutura do Banco de Dados

### Tabela: users
- `id` - Primary Key
- `name` - Nome do usuário
- `email` - Email único
- `password` - Senha hasheada
- `role` - Papel (admin/user)
- `lastLogin` - Último login
- `createdAt` - Data de criação
- `updatedAt` - Data de atualização

### Tabela: customers
- `id` - Primary Key
- `razaoSocial` - Razão social da empresa
- `cnpj` - CNPJ único
- `nomeFachada` - Nome fantasia
- `tags` - Array de tags (JSON)
- `status` - Status (ativo/inativo)
- `conectaPlus` - Boolean para plano premium
- `createdAt` - Data de criação
- `updatedAt` - Data de atualização

---

## 🧪 Testes

```bash
# Testes unitários
npm run test

# Testes com coverage
npm run test:cov

# Testes e2e
npm run test:e2e

# Testes em modo watch
npm run test:watch
```