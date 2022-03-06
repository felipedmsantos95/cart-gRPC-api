# gRPC Cart API

<p align="center">
    <a href="README_en.md">English</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
    <a href="README.md">Português</a>&nbsp;&nbsp;&nbsp;
</p>

## About

It consists of an e-commerce (online selling) HTTP API (JSON) and has a cart (checkout) endpoint. This endpoint will accept a request with POST method, the request payload structure that follows the example:

In summary, the requisition must contain a list of products and the quantity of each to be purchased.

```javascript
{
    "products": [
        {
            "id": 1,
            "quantity": 1
        }
    ]
}
```

### Rules

The API has the following business rules:

1. For each product, the discount percentage is calculated and this is done by consuming a gRPC service provided by Hash, available in a [Docker image](https://hub.docker.com/r/hashorg/hash-mock-discount-service) and the client was generated in Javascript from the [proto file](https://github.com/hashlab/hiring/blob/master/challenges/pt-br/new-backend-challenge/discount.proto)

2. If the discount service is unavailable, the cart endpoint should continue to work, but it will not perform the discount calculation.

3. It is verified if it is black friday and if it is, a gift product can be added to the cart. In file [products.json](https://github.com/felipedmsantos95/hash-cart-challenge/blob/main/src/Database/products.json) they are `is_gift = true` flagged and are not accepted in requests to add them to the cart. The Black Friday date can be configured through an .env file, an [example file](https://github.com/felipedmsantos95/hash-cart-challenge/blob/main/.env.example) was attached to this repository to check how to set the environment variables.

4. There is only one gift product input in the cart.

Below is an example response with HTTP 200 status from the API:

```javascript
{
    "total_amount": 20000,
    "total_amount_with_discount": 19500,
    "total_discount": 500,
        {
            "id": 1,
            "quantity": 2,
            "unit_amount": 10000,
            "total_amount": 20000,
            "discount": 500,
            "is_gift": false
        },
        {
            "id": 3,
            "quantity": 1,
            "unit_amount": 0,
            "total_amount": 0,
            "discount": 0,
            "is_gift": true
        }
    ]
}
```

## Used Technologies

-   [Node.js](https://nodejs.org/en/)
-   API test scripts were written through [Jest](https://jestjs.io/pt-BR/) framework
-   [Docker](https://www.docker.com/get-started)
-   [Docker-Compose](https://docs.docker.com/compose/install/)

## Requirements

-   [NPM](https://www.npmjs.com/) 8.5 or later
-   [Node](https://nodejs.org/en/) 12.22 or later
-   [Docker](https://www.docker.com/get-started) 19.x or later
-   [Docker-Compose](https://docs.docker.com/compose/install/) 1.26 or later

## Clonning Project

```bash
 git clone https://github.com/felipedmsantos95/hash-cart-challenge
 cd hash-cart-challenge
```

## Running the Project (With Docker Compose)

Considering the application requirements are satisfied, we can run the following commands:

### Setting Enviromment Variables

Before executing the docker commands, we need to configure an `.env` in the project root, the variables must be configured following [example](https://github.com/felipedmsantos95/hash-cart-challenge/blob/main/.env.example)

```bash
 touch .env
```

File content model:

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

### Runnig application

To download the necessary docker images and run the containers with the API and the [Hash service discount](<(https://hub.docker.com/r/hashorg/hash-mock-discount-service)>):

```bash
 docker-compose up
```

This should be the output of the terminal and the API will be ready to receive requests:

<p align="center">
  <img src="https://github.com/felipedmsantos95/hash-cart-challenge/blob/main/img/initial_log.png"/>
</p>

## Running the Project (Without Docker Compose)

### Installing API Dependencies

```bash
 npm install
```

### API Scripts

Run service:

```bash
 npm start
```

Run service with automatic restart if code change is detected

```bash
 npm run dev
```

Run application integration and unitary tests script

```bash
 npm test
```


### Running discount service

```bash
 docker pull hashorg/hash-mock-discount-service
 docker run -p 50051:50051 hashorg/hash-mock-discount-service
```

## App Functionalities

-   **`POST /checkout`**: The route must receive `products` inside the body of the request, being it an array of objects that in turn contains the numeric fields `id` and `quantity`, in this route the information `today_date` can also be sent in the headers in the `yyyy/mm/dd` format so that the app can compare with the Black Friday day configured in the `.env`, if no header is sent, the app will automatically compare the Black Friday date configured in the .env with the date of today.

<p align="center">
  <img src="https://github.com/felipedmsantos95/hash-cart-challenge/blob/main/img/checkout_headers.png"/>
</p>

-   **`GET /products`**: Displays the products registered in [products.json](https://github.com/felipedmsantos95/hash-cart-challenge/blob/main/src/Database/products.json).

## Tests executed

Once you have installed the necessary dependencies to run the tests, you can run the `npm test` command on the terminal to see the following validations that were written in the file [cart.spec.js](https://github.com/felipedmsantos95/hash-cart-challenge/blob/main/tests/cart.spec.js)

-   **`should be able to checkout cart with valid products`**: Allow the total value of the cart to be displayed as a valid request.

-   **`shouldn't be able to checkout with params with invalid data type`**: Does not allow checkout if an array of products in the specified format is not sent in the request

-   **`shouldn't be able to checkout with invalid products`**: Does not allow checkout if there is an unregistered product in the cart

-   **`shouldn't be able to checkout with missing params`**: Does not allow checkout if there are missing parameters in the request body

-   **`should be able to get all products info at database`**: Allows the products described in products.json to be displayed

-   **`should be able to add a gift product if it is Black Friday`**: Allows you to checkout a product with the `is_gift` flag if it is a Black Friday day

-   **`shouldn't be able to add more than one gift product input if it is Black Friday`**: It does not allow the checkout of more than one product with the `is_gift` flag if it is a Black Friday day

-   **`shouldn't be able to add more than one gift product in quantity if it is Black Friday`**: It does not allow making a product with the `is_gift` flag with the `quantity` field greater than 1

-   **`shouldn't be able to add gift product if it is NOT Black Friday`**: Does not allow a product to be checked out with the `is_gift` flag if it is not Black Fridayy

<p align="center">
  <img src="https://github.com/felipedmsantos95/hash-cart-challenge/blob/main/img/tests.png"/>
</p>

To validate the **rule 2** in the proposed challenge, where it is asked that if the discount service is unavailable the cart endpoint should continue working but it will not perform the discount calculation, the following procedure was done:

1. API and Discount Server in Execution
 <p align="center">
   <img src="https://github.com/felipedmsantos95/hash-cart-challenge/blob/main/img/initial_log.png"/>
 </p>

2. Stopping discount service
 <p align="center">
   <img src="https://github.com/felipedmsantos95/hash-cart-challenge/blob/main/img/stop_discount.png"/>
 </p>

3. Checkout
 <p align="center">
   <img src="https://github.com/felipedmsantos95/hash-cart-challenge/blob/main/img/200_discount_on.png"/>
 </p>

## API output examples

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

2. Invalid body

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

3. is_gift product added in not Black Friday day

```javascript

{
    "validation": {
        "message": [
            "O produto de id 6 é um brinde de black friday e não pode ser adicionado ao carrinho por enquanto..."
        ]
    }
}

```

4. Product not found in database

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

5. More than one is_gift product in Black Friday

```javascript
{
  "validation": {
    "message": [
      "Só pode haver a quantidade de 1 produto brinde na blackfriday."
    ]
  }
}

```

### Links to others related works

-   [GoMarketPlace](https://github.com/felipedmsantos95/gomarketplace)
-   [Ecommerce API](https://github.com/felipedmsantos95/typeorm-relations)
-   [GoFinances](https://github.com/felipedmsantos95/gofinances-backend)
