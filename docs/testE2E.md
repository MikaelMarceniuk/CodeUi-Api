# Testes End to End (E2E)

## Descricao

Os testes End to End tem o foco de testar a aplicacao na pele de um usuario, os testes estao localizados no diretorio **src/http/controllers/[currency, user]/\_\_tests\_\_**.

## Instalacao

Clone o projeto e instale usando npm

```bash
npm install
```

## Requisitos

E necessario ter o .env preenchido para poder rodar os testes. Entretando, n e necessario criar alguns recursos para rodar os testes e2e. As variaveis q devem ser necessarias para rodar os testes e2e sao:

- DATABASE_URL: Contendo uma string de conexao para um banco de dados Postgresql
- JWT_SECRET: Contendo qualquer valor

As outras variaveis pode ser preenchidas com qualquer coisa.

## Rodando os testes

Existem 2 comandos para executar testes e2e

- Para rodar apenas 1 vez

```bash
npm run test:e2e
```

- Para rodar a cada alteracao dentro dos arquivos

```bash
npm run test:e2e:watch
```
