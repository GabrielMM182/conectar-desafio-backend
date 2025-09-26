# Users API

## Autenticação

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
GOOGLE_CLIENT_ID=seu-client-id
GOOGLE_CLIENT_SECRET=seu-client-secret
GOOGLE_CLIENT_CALLBACK_URL=http://localhost:3000/auth/google/callback
```

## Endpoints

### POST /users
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

## Tratamento de Erros

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

### 422 Validation Error
```json
{
  "statusCode": 422,
  "message": [
    "Nome é obrigatório",
    "Email deve ter um formato válido",
    "Senha deve ter pelo menos 6 caracteres"
  ],
  "error": "Unprocessable Entity"
}
```

## Funcionalidades Implementadas

 **Criação de usuário**  hash de senha usando bcrypt
 **Listagem paginada** com filtros por nome, email e role
 **Busca por ID** com validação
 **Atualização** com rehash de senha quando alterada
 **Remoção** com validação de existência
 **Tratamento de erros** 
  - Usuário não encontrado
  - Email duplicado
  - Validação de dados
  - IDs inválidos
 **Validação de DTOs** com class-validator
 **Testes unitários** jest e supertest
 **Métodos auxiliares** para autenticação