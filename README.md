# gRPC Cart API

<p align="center">
    <a href="README_en.md">English</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
    <a href="README.md">Português</a>&nbsp;&nbsp;&nbsp;
</p>

## Sobre

Consiste em uma API HTTP (JSON) de e-commerce (venda online) e tem um endpoint de carrinho (checkout). Esse endpoint aceitará uma requisição com método POST, a estrutura do payload de requisição que segue o exemplo:

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

-   [Node.js](https://nodejs.org/en/)
-   Scripts de teste na API foram escritos através do framework [Jest](https://jestjs.io/pt-BR/)
-   [Docker](https://www.docker.com/get-started)
-   [Docker-Compose](https://docs.docker.com/compose/install/)

## Requisitos

-   [NPM](https://www.npmjs.com/) 8.5 ou superior
-   [Node](https://nodejs.org/en/) 12.22 ou superior
-   [Docker](https://www.docker.com/get-started) 19.x ou superior
-   [Docker-Compose](https://docs.docker.com/compose/install/) 1.26 ou superior

## Clonando o Projeto

```bash
 git clone https://github.com/felipedmsantos95/hash-cart-challenge
 cd hash-cart-challenge
```

## Executando o Projeto (Com Docker Compose)

Considerando que os requisitos para rodar a aplicação estejam satisfeitos, podemos executar os seguintes comandos:

### Configurando Variáveis de Ambiente

Antes de execução dos comandos docker, precisamos configurar um `.env` na raiz do projeto, as variáveis devem ser configuradas seguindo o [exemplo](https://github.com/felipedmsantos95/hash-cart-challenge/blob/main/.env.example)

```bash
 touch .env
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

### Rodando a aplicação

Para baixar as imagens docker necessárias e executar os containers com a API e o [serviço de desconto da Hash](<(https://hub.docker.com/r/hashorg/hash-mock-discount-service)>):

```bash
 docker-compose up
```

Essa deve ser a sáida do terminal e a API estará pronta para receber requisições:

<p align="center">
  <img src="https://github.com/felipedmsantos95/hash-cart-challenge/blob/main/img/initial_log.png"/>
</p>

## Executando o Projeto (Sem Docker Compose)

### Instalando as dependências da API

```bash
 npm install
```

### Scripts da API

Executar serviço:

```bash
 npm start
```

Executar serviço com reinício automático se for detectada alteração no código:

```bash
 npm run dev
```

Executar script de testes unitários e de integração da aplicação

```bash
 npm test
```

### Executando serviço de desconto

```bash
 docker pull hashorg/hash-mock-discount-service
 docker run -p 50051:50051 hashorg/hash-mock-discount-service
```

## Funcionalidades da Aplicação

-   **`POST /checkout`**: A rota deve receber `products` dentro do corpo da requisição, sendo sendo ele um array de objetos que por sua vez contém os campos numéricos `id` e `quantity`, nesta rota também pode ser enviado nos headers a informação `today_date` no formato `yyyy/mm/dd` para que o app possa comparar com o dia da Black Friday configurado no `.env`, se nenhum header for enviado, o app irá comparar a data da Black Friday configurada no .env automaticamente com a data de hoje.

<p align="center">
  <img src="https://github.com/felipedmsantos95/hash-cart-challenge/blob/main/img/checkout_headers.png"/>
</p>

-   **`GET /products`**: Exibe os produtos cadastrados no [products.json](https://github.com/felipedmsantos95/hash-cart-challenge/blob/main/src/Database/products.json).

## Testes executados

Ao ter instaladas as dependências necessárias para rodar os testes, pode ser executado o comando `npm test` no teminal para que sejam vistas as seguintes validações que foram escritas no arquivo [cart.spec.js](https://github.com/felipedmsantos95/hash-cart-challenge/blob/main/tests/cart.spec.js)

-   **`should be able to checkout cart with valid products`**: Permite que seja exibido o valor total do carrinho se a requisição for válida.

-   **`shouldn't be able to checkout with params with invalid data type`**: Não permite que o seja feito checkout se um array de produtos no formato especificado não for enviado na requisição

-   **`shouldn't be able to checkout with invalid products`**: Não permite que seja feito checkout se no carrinho houver um produto não cadastrado

-   **`shouldn't be able to checkout with missing params`**: Não permite que seja feito checkout se no corpo da requisição houver parametros faltantes

-   **`should be able to get all products info at database`**: Permite que sejam exibidos os produtos descritos em products.json

-   **`should be able to add a gift product if it is Black Friday`**: Permite que seja feito checkout de um produto com a flag `is_gift` se for dia de Black Friday

-   **`shouldn't be able to add more than one gift product input if it is Black Friday`**: Não permite que seja feito checkout de mais de um produto com a flag `is_gift` se for dia de Black Friday

-   **`shouldn't be able to add more than one gift product in quantity if it is Black Friday`**: Não permite que seja feito produto com a flag `is_gift` com o campo `quantity` maior que 1

-   **`shouldn't be able to add gift product if it is NOT Black Friday`**: Não permite que seja feito checkout de um produto com a flag `is_gift` se não for dia de Black Friday

<p align="center">
  <img src="https://github.com/felipedmsantos95/hash-cart-challenge/blob/main/img/tests.png"/>
</p>

Para validar a **regra 2** no desafio proposto, onde se pede que caso o serviço de desconto esteja indisponível o endpoint de carrinho deverá continuar funcionando porém não vai realizar o cálculo com desconto, foi feito o seguinte procedimento:

1. API e Serviço de desconto em execução
 <p align="center">
   <img src="https://github.com/felipedmsantos95/hash-cart-challenge/blob/main/img/initial_log.png"/>
 </p>

2. Parada do serviço de desconto
 <p align="center">
   <img src="https://github.com/felipedmsantos95/hash-cart-challenge/blob/main/img/stop_discount.png"/>
 </p>

3. Execução do checkout
 <p align="center">
   <img src="https://github.com/felipedmsantos95/hash-cart-challenge/blob/main/img/200_discount_on.png"/>
 </p>


## Exemplos de output da API

1. Status 200

```javascript
{
    "total_amount": 223715,
    "total_amount_with_discount": 221583,
    "total_discount": 2132,
    "products_details": [
        {
            "id": 5,
            "quantity": 1,
            "unit_amount": 42647,
            "total_amount": 42647,
            "discount": 2132,
            "is_gift": false
        },
        {
            "id": 3,
            "quantity": 3,
            "unit_amount": 60356,
            "total_amount": 181068,
            "discount": 0,
            "is_gift": false
        }
    ]
}
```

2. Corpo da requisição inválido

```javascript
{
    "statusCode": 400,
    "error": "Bad Request",
    "message": "Validation failed",
    "validation": {
        "body": {
        "source": "body",
        "keys": [
            "products.0.id"
        ],
        "message": "\"id\" é um campo obrigatório"
        }
    }
}

```

3. Produto brinde em uma data não Black Friday

```javascript

{
    "validation": {
        "message": [
            "O produto de id 6 é um brinde de black friday e não pode ser adicionado ao carrinho por enquanto..."
        ]
    }
}

```

4. Produto não cadastrado no banco de dados

```javascript
{
    "validation": {
        "message": [
            "O produto de id 50 não está cadastrado em nosso banco de dados",
            "O produto de id 55 não está cadastrado em nosso banco de dados"
        ]
    }
}

```

5. Mais de uma entrada de produtos brinde na black friday

```javascript
{
  "validation": {
    "message": [
      "Só pode haver a quantidade de 1 produto brinde na blackfriday."
    ]
  }
}

```

### Outros trabalhos meus relacionados

-   [GoMarketPlace](https://github.com/felipedmsantos95/gomarketplace)
-   [API de Ecommerce](https://github.com/felipedmsantos95/typeorm-relations)
-   [GoFinances](https://github.com/felipedmsantos95/gofinances-backend)
