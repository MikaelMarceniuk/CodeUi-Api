# Instalacao

Para instalar e rodar o projeto e necessario algumas coisas estarem feitas

- Projeto clonado
- Banco Postgresql disponivel
- .env preenchido

## Clonando o projeto

Clone o projeto na sua maquina e rode o comando para instalar as dependencias.

```bash
npm install
```

## Banco Postgresql

Deixe disponivel um banco postgresql e salve sua string de conexao, sera necessaria dentro do arquivo .env.

## .env

Copie e cole o arquivo **.env.example** e preencha as variaveis. Abaixo esta uma descricao para cada variavel:


- PORT: Porta na qual a Api estara ouvindo

- DISCORD_TOKEN: Token do bot do discord.

- LOGS_PORTFOLIO: Id to chat na qual o bot ira mandar mensagem.

- RESEND_TOKEN: Token da lib Resend, para envio de emails.

- DATABASE_URL: Connection string para o banco de dados

- JWT_SECRET: String para gerar o token jwt

- GOOGLE_PROJECT_ID: Codigo do projeto da Google Cloud

- GOOGLE_STORAGE_EMAIL: Email do user IAM da Google Cloud

- GOOGLE_STORAGE_KEY: PrivateKey do user IAM da Google Cloud

## Executando o projeto

Apos todos os criterios forem preenchidos, para rodar em desenvolvimento e necessario usar o seguinte comando:

```bash
npm run start:dev
```

Em producao e necessario buildar, rode o comando

```bash
npm run build
```

e apos buildar, rode o comando para executar em modo producao

```bash
npm run start:prd
```