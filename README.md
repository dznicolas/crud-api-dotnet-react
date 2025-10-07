# CRUD API - .NET 8 + React 18

Sistema de cadastro de pessoas com API REST em .NET 8 e interface React, incluindo autenticação JWT e documentação Swagger.

## 🚀 Stack Tecnológico

**Backend (.NET 8)**
- ASP.NET Core Web API
- Entity Framework Core InMemory
- JWT Authentication + BCrypt
- Swagger

**Frontend (React 18)**
- Axios + Tailwind CSS
- Material Tailwind Components
- Context API para autenticação

## ✨ Funcionalidades

- **CRUD completo** de pessoas com validações (CPF, email, datas)
- **Autenticação JWT** com usuário padrão
- **Interface responsiva** com tabelas interativas
- **Documentação automática** via Swagger

## � Como Executar

**Pré-requisitos:** .NET 8 SDK + Node.js 16+

### Backend
```bash
cd backend/CrudAPI
dotnet restore
dotnet run
```
📍 API: `https://localhost:7272` | Swagger: `https://localhost:7272/swagger`

### Frontend
```bash
cd frontend
npm install
npm start
```
📍 React: `http://localhost:3000`

## 🔐 Login 
- **Login:** `admin`
- **Senha:** `admin123`

