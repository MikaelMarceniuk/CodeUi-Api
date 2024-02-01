# Endpoints

## Usuario

### Criar usuario

**Descrição**

Registra um novo usuario, com os campos username, email e senha.
O campo username e automaticamente preenchido pegando tudo que vem antes do @ do email.
O campo plan vai estar como FREE.

**Endpoint**

```
POST /api/user

Body: {
  email: string
  password: string
}
```

**Resposta de Sucesso**

O body vai retornar vazio, entretando, o StatusCode vai ser **201 - Created**

### Autenticar Usuario

Autentica o usuario, retornando um JWT Token e algumas informacoes.

**Endpoint**

```
POST /api/user/session

Body: {
  email: string
  password: string
}
```

**Resposta de Sucesso**


```
Cookies: refreshToken
Body: {
  accessToken: string,
  user: {
    id: string,
    email: string
  }
}
```

Status Code: 200 - OK

### Refresh Token

Cria um novo JWT para usuario

**Endpoint**

```
POST /api/user/session/refresh
```

**Resposta de Sucesso**


```
Cookies: refreshToken
Body: {
  token: string,
}
```

Status Code: 200 - OK

### Pegar todas informacoes do usuario

Retorna todas as informacoes do usuario autenticado, como favoritos e futuramente projetos.

**Endpoint**

```
GET /api/user
Header: 'Authorization': 'Bearer <token>'
```

**Resposta de Sucesso**


```
{
  id: string
  username: string
  email: string
  contact: string | null
  avatar: string | null
  preferred_currency: string | null
  plan: "FREE" | "PRO
  created_at: DateTime
  favorites: {
    id: string
    name: string
    user_id: string
  }[]
}
```

Status Code: 200 - OK

### Atualiza informacoes do usuario

Atualiza todas as informacoes do usuario autenticado

**Endpoint**

```
PUT /api/user
Header: 'Authorization': 'Bearer <token>'
```

**Resposta de Sucesso**

Status Code: 204 - No Content

### Atualiza Plano do Usuario

Atualiza apenas o plano de usuario autenticado para 'FREE' ou 'PRO'

**Endpoint**

```
PATCH /api/user/plan
Header: 'Authorization': 'Bearer <token>'
Body {
  name: 'FREE' | 'PRO'
}
```

**Resposta de Sucesso**

Status Code: 204 - No Content

### Atualiza Avatar do Usuario

Atualiza apenas o avatar do usuario autenticado

**Endpoint**

```
PATCH /api/user/avatar
Header: 'Authorization': 'Bearer <token>'
multipart form {
  avatar: file
}
```

**Resposta de Sucesso**

Status Code: 200

## User Favorites

### Criar novo favorito

Cria um novo favorito para usuario autenticado, o usuario pode ter no maximo 3

**Endpoint**

```
POST /api/user/favorites
Header: 'Authorization': 'Bearer <token>'
Body {
  name: string
}
```

**Resposta de Sucesso**

Status Code: 201 - Created

### Deleta favorito

Retira o favorito do usuario autenticado

**Endpoint**

```
DELETE /api/user/plan/:id
Header: 'Authorization': 'Bearer <token>'
```

**Resposta de Sucesso**

Status Code: 204 - No Content

## Currency

### Pegar currencies

Pega todas as moedas disponiveis

**Endpoint**

```
GET /api/currency
```

**Resposta de Sucesso**

```
Status Code: 200
body {
  currencies: string[]
}
```
