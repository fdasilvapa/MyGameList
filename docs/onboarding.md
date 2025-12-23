# 🚀 Guia de Desenvolvimento & Padrões do Projeto

Bem-vindo ao backend da nossa Rede Social Gamer! Este guia serve para mantermos o código organizado e evitarmos conflitos entre Felipe e Lucas.

## 📂 1. Estrutura de Pastas (Onde codar?)

No backend, trabalhamos com uma arquitetura simples em camadas dentro de `src/` e usamos o Prisma para o banco:

* **`src/config/`**: Configurações gerais (onde fica a instância do `prisma`).
* **`src/controllers/`**: **AQUI VAI A LÓGICA.** É onde as funções recebem `req` e `res`.
    * *Ex:* `auth.controller.ts` (tem as funções `login` e `register`).
* **`src/routes/`**: Define as URLs e chama os controllers.
    * *Ex:* `router.post('/login', AuthController.login)`.
* **`src/middlewares/`**: Funções que rodam *antes* do controller (ex: checar se está logado).
* **`prisma/`**:
    * `schema.prisma`: Onde definimos as tabelas do banco.

---

## 💎 2. Prisma ORM (Banco de Dados)

Nós não escrevemos SQL na mão. Usamos o Prisma para gerenciar o banco.

### Fluxo de Trabalho:
1.  Se precisar mudar o banco, edite o arquivo `prisma/schema.prisma`.
2.  Rode o comando de migração (veja abaixo).
3.  O Prisma atualiza o banco e os tipos do TypeScript automaticamente.

### Comandos do Prisma:
* **`npx prisma migrate dev --name nome-da-mudanca`**
    * Rode isso sempre que alterar o `schema.prisma`. Ele cria a tabela no banco Docker.
    * *Ex:* `npx prisma migrate dev --name create_reviews_table`
* **`npx prisma studio`** 🌟 (Muito Útil)
    * Abre um painel no seu navegador (tipo um Excel) para você ver, editar e criar dados no banco visualmente. Ótimo para testar se salvou mesmo.
* **`npx prisma generate`**
    * Se o VS Code parar de completar os nomes das tabelas, rode isso para ele "reler" o arquivo.

---

## 🌳 3. Fluxo de Git (Git Flow Simplificado)

Nós nunca trabalhamos direto na `main`.

1.  **`main`**: Código pronto, testado e funcionando. (Produção).
2.  **`develop`**: Onde juntamos o código do Felipe e do Lucas para testar.
3.  **`feature/nome-da-tarefa`**: Onde você trabalha.

### Passo a Passo para criar uma nova funcionalidade:

1.  **Atualize seu projeto:** Vá para a develop e puxe as novidades.
    ```bash
    git checkout develop
    git pull origin develop
    ```
2.  **Crie sua branch:**
    ```bash
    git checkout -b feature/criar-cadastro-jogos
    ```
3.  **Code, code, code...** 👨‍💻
4.  **Salve seu trabalho:** (Veja a seção de Commits abaixo).
5.  **Envie para o GitHub:**
    ```bash
    git push origin feature/criar-cadastro-jogos
    ```
6.  **Abra um Pull Request (PR):** No GitHub, peça para jogar sua branch na `develop`.

---

## 📝 4. Padrão de Commits (Conventional Commits)

Nós escrevemos as mensagens de commit em inglês e seguindo um padrão para facilitar a leitura do histórico.

**Estrutura:** `tipo(escopo): descrição curta`

### Tipos comuns:
* `feat`: Uma nova funcionalidade (Ex: nova rota, nova tabela).
* `fix`: Correção de bug.
* `docs`: Mudança apenas em documentação.
* `style`: Formatação, ponto e vírgula, coisas que não mudam a lógica.
* `refactor`: Melhoria de código que não cria func nova nem corrige bug.
* `chore`: Configurações de build, atualizações de pacotes, docker.

### Exemplos reais:
* ✅ `feat(auth): implement login route with jwt`
* ✅ `fix(games): correct game title validation`
* ✅ `chore(prisma): add review model to schema`

---

## 🛠️ 5. Comandos Essenciais

### NPM (Node Package Manager)
* `npm install`: Baixa as bibliotecas (rode sempre que alguém adicionar algo novo no `package.json`).
* `npm run dev`: Roda o servidor backend em modo de desenvolvimento (reinicia sozinho quando salva).

### Docker (Para rodar o Banco)
* `docker-compose up`: Sobe o banco de dados e o projeto (se configurado).
* `docker-compose down`: Desliga tudo.

### Dica Importante sobre Instalação
Se precisar instalar uma biblioteca nova (ex: axios), faça isso **dentro do container** ou garanta que sua versão local do Node seja igual à do Docker.