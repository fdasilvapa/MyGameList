# 🚀 Guia de Desenvolvimento & Padrões do Projeto

Bem-vindo ao backend da nossa Rede Social Gamer! Este guia serve para mantermos o código organizado e evitarmos conflitos.

## 📂 1. Estrutura de Pastas (Onde codar?)

No backend, trabalhamos com uma arquitetura simples em camadas dentro de `src/`:

* **`config/`**: Configurações de banco de dados e variáveis de ambiente.
* **`controllers/`**: **AQUI VAI A LÓGICA.** É onde as funções recebem `req` e `res`.
    * *Ex:* `auth.controller.ts` (tem as funções `login` e `register`).
* **`routes/`**: Define as URLs e chama os controllers.
    * *Ex:* `router.post('/login', AuthController.login)`.
* **`models/`** (ou `services/`): Se a lógica ficar complexa, ou para queries SQL puras, usamos aqui.
* **`middlewares/`**: Funções que rodam *antes* do controller (ex: checar se está logado).

---

## 🌳 2. Fluxo de Git (Git Flow Simplificado)

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

## 📝 3. Padrão de Commits (Conventional Commits)

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
* ✅ `chore(db): add initial migration for users table`

---

## 🛠️ 4. Comandos Essenciais

### NPM (Node Package Manager)
* `npm install`: Baixa as bibliotecas (rode sempre que alguém adicionar algo novo no `package.json`).
* `npm run dev`: Roda o servidor backend em modo de desenvolvimento (reinicia sozinho quando salva).
* `npm run build`: Transforma o TypeScript em JavaScript (para produção).

### Docker (Para rodar o Banco)
* `docker-compose up -d`: Sobe o banco de dados e o projeto (se configurado- a flag "-d" serve para rodar o container e deixar o terminal liberado).
* `docker-compose down`: Desliga tudo.