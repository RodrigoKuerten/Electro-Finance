# > 🚧 Projeto ainda em desenvolvimento.

# ⚡ Electro Finance

Projeto Full Stack para controle de finanças pessoais, com gerenciamento de receitas, despesas e movimentações.

O frontend foi desenvolvido em **Angular** e o backend em **Spring Boot**, utilizando MySQL para persistência dos dados.

## 🚀 Tecnologias

### Backend

* Java 21
* Spring Boot
* Spring Security
* Spring Data JPA
* JWT
* Maven
* MySQL
* Docker

### Frontend

* Angular 17
* TypeScript
* Tailwind CSS
* PrimeNG

## 💡 Sobre o projeto

O **Electro Finance** é uma aplicação para controle financeiro pessoal.

Cada usuário possui sua própria conta e pode gerenciar suas movimentações. A comunicação entre frontend e backend é feita através de uma API REST.

```text
Angular
   │
   │ HTTP / REST
   ▼
Spring Boot
   │
   │ JPA
   ▼
 MySQL
```

## 🔐 Autenticação

A autenticação é feita com **Spring Security e JWT**.

Após o login, o token JWT é armazenado no cookie `auth_token` e enviado nas próximas requisições. No backend, um filtro valida o token antes de liberar o acesso aos endpoints protegidos.

A autenticação é stateless e o sistema também mantém controle dos tokens revogados.

## 📌 Funcionalidades

* Cadastro e login
* Controle de receitas e despesas
* Gerenciamento de movimentações
* Autenticação com JWT
* Proteção de endpoints
* Logout e revogação de tokens
* Validação dos dados recebidos
* Tratamento de erros
* Notificações no frontend

## 🏗️ Estrutura

O projeto é separado entre frontend e backend:

```text
Frontend
└── Angular 17
      │
      └── REST API
             │
Backend      │
└── Spring Boot
      ├── Controllers
      ├── Services
      ├── Repositories
      ├── Security
      ├── DTOs
      └── Entities
             │
             └── MySQL
```

## ⚙️ Executando o projeto

### Pré-requisitos

* Java 21
* Node.js
* Angular CLI
* Maven
* MySQL

### Backend

Clone o projeto:

```bash
git clone <URL_DO_REPOSITORIO>
```

Entre na pasta do backend:

```bash
cd backend
```

Configure as variáveis de ambiente do banco de dados e do JWT e execute:

```bash
./mvnw spring-boot:run
```

No Windows:

```bash
mvnw.cmd spring-boot:run
```

A API será iniciada em:

```text
http://localhost:8080
```

## 🖥️ Frontend

Entre na pasta:

```bash
cd frontend
```

Instale as dependências:

```bash
npm install
```

Inicie o projeto:

```bash
ng serve
```

O frontend será iniciado em:

```text
http://localhost:4200
```
