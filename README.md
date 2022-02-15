# Hash Cart Challenge

<p align="center">
    <a href="README_en.md">English</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
    <a href="README.md">Português</a>&nbsp;&nbsp;&nbsp;
</p>


## Sobre


Consiste em uma API HTTP (JSON) de e-commerce (venda online) e que terá um endpoint de carrinho (checkout). Esse endpoint aceitará uma requisição com método POST, a estrutura do payload de requisição que segue o exemplo:

Em resumo a requisição deve conter uma lista de produtos e a quantidade de cada um a ser comprado.

```javascript
{
    "products": [
        {
            "id": 1,
            "quantity": 1 // Quantidade a ser comprada do produto
        }
    ]
}
```

### Regras

A API conta com as seguintes regras de negócio:

1. Para cada produto é calculada a porcentagem de desconto e isso é feito consumindo um serviço gRPC fornecido pela Hash, disponível em uma [imagem Docker](https://hub.docker.com/r/hashorg/hash-mock-discount-service) e o cliente foi gerado em Javascript a partir do [arquivo proto](https://github.com/hashlab/hiring/blob/master/challenges/pt-br/new-backend-challenge/discount.proto)

2. Caso o serviço de desconto esteja indisponível o endpoint de carrinho deverá continuar funcionando porém não vai realizar o cálculo com desconto.

3. É verificado se é black friday e caso seja, um produto brinde pode ser adicionado no carrinho. No arquivo [products.json](https://github.com/felipedmsantos95/hash-cart-challenge/blob/main/src/Database/products.json) eles estão marcados com a flag `is_gift = true` e não são aceitos em requisições para adicioná-los ao carrinho. A data da Black Friday pode ser configurada através de um arquivo .env, um [arquivo exemplo](https://github.com/felipedmsantos95/hash-cart-challenge/blob/main/.env.example) foi anexado ao repositório para verificação de como setar as variáveis de ambiente.

4. Há apenas uma entrada de produto brinde no carrinho.

Abaixo segue um exemplo de resposta com status HTTP 200 da API:

```javascript
{
    "total_amount": 20000, // Valor total da compra sem desconto
    "total_amount_with_discount": 19500, // Valor total da compra com desconto
    "total_discount": 500, // Valor total de descontos
    "products": [
        {
            "id": 1,
            "quantity": 2,
            "unit_amount": 10000, // Preço do produto em centavos
            "total_amount": 20000, // Valor total na compra desse produto em centavos
            "discount": 500, // Valor total de desconto em centavos
            "is_gift": false // É brinde?
        },
        {
            "id": 3,
            "quantity": 1,
            "unit_amount": 0, // Preço do produto em centavos
            "total_amount": 0, // Valor total na compra desse produto em centavos
            "discount": 0, // Valor total de desconto em centavos
            "is_gift": true // É brinde?
        }
    ]
}
```

## Tecnologias Utilizadas

*	[Node.js](https://nodejs.org/en/)
*   Scripts de teste na API foram escritos através do framework [Jest](https://jestjs.io/pt-BR/)
*	[Docker](https://www.docker.com/get-started)
*   [Docker-Compose](https://docs.docker.com/compose/install/)

## Requisitos

*   [NPM](https://www.npmjs.com/) 8.5 ou superior
*   [Node](https://nodejs.org/en/) 12.22 ou superior
*   [Docker](https://www.docker.com/get-started) 19.x ou superior
*   [Docker-Compose](https://docs.docker.com/compose/install/) 1.26 ou superior

## Executando o Projeto (Com Docker Compose)

Considerando que os requisitos para rodar a aplicação estejam satisfeitos, podemos executar os seguintes comandos:

### Clonando o Projeto

```bash
$ git clone https://github.com/felipedmsantos95/hash-cart-challenge 
$ cd hash-cart-challenge
```

## Configurando Variáveis de Ambiente

Antes de execução dos comandos docker, precisamos configurar um `.env` na raiz do projeto, as variáveis devem ser configuradas seguindo o [exemplo](https://github.com/felipedmsantos95/hash-cart-challenge/blob/main/.env.example)

```bash
$ touch .env
```
Modelo de conteúdo do arquivo:

```bash
# --------- #
##  GENERAL  ##
# --------- #
PROJECT_NAME=hash-cart-challenge

# You can change to run API in another HTTP port
API_PORT=3000


# --------- #
##   gRPC   ##
# --------- #

#If it is running in your local machine, please input IP address of your machine
GRPC_SERVER_ADDRESS=your_ip_server_address:50051



# -------------------#
##  Bussiness Rules  ##
# ------------------ #

# Date format ==> year/month/day
BLACK_FRIDAY_DAY=2022/02/16
```
