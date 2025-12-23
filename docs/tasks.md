# 📋 Planejamento da Sprint 1 - Backend

**Objetivo:** Ter o sistema de cadastro/login funcionando e permitir salvar jogos na biblioteca do usuário.

## 👤 Felipe: Autenticação & Usuários
**Foco:** Garantir que só usuários registrados acessem o sistema.
* [ ] **Configuração do Banco:** Criar o arquivo `src/config/db.ts` para conectar no Postgres.
* [ ] **Rota POST /auth/register:** Receber `name`, `email`, `password`. Criptografar senha (bcrypt) e salvar na tabela `users`.
* [ ] **Rota POST /auth/login:** Receber `email`, `password`. Validar e retornar um Token JWT.
* [ ] **Middleware de Auth:** Criar função que intercepta rotas privadas e valida se o Token JWT é válido.

## 🎮 Lucas: Jogos & Biblioteca
**Foco:** Permitir manipulação de dados de jogos e lista pessoal.
* [ ] **Rota POST /games:** (Temporária) Cadastrar um jogo manualmente no banco (`title`, `slug`, `cover_url`, etc) para termos massa de dados.
* [ ] **Rota GET /games:** Listar todos os jogos cadastrados.
* [ ] **Rota POST /library:** Adicionar um jogo à lista do usuário (`user_id`, `game_id`, `status`).
    * *Obs:* Como a Auth ainda está sendo feita, combine com o Felipe para usar um ID de usuário fixo (ex: 1) para testar.
* [ ] **Rota GET /library/:userId:** Listar os jogos de um usuário específico.