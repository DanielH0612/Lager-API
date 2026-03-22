# Lager API

A REST API built with Node.js, Express.js, and PostgreSQL for managing products, inventory, and customer orders.

## Overview

This project simulates a basic inventory and order management system. It allows you to create products, manage stock levels, and handle customer orders with automatic stock updates.

## Features

- CRUD operations for products
- Update stock quantity
- Create orders with multiple items
- Automatic stock reduction when creating orders
- Update order status (received, picked, sent)
- Basic validation and error handling

## Tech Stack

- Node.js
- Express.js
- PostgreSQL
- dotenv
- pg

## API Endpoints

### Products
- `GET /products`
- `GET /products/:id`
- `POST /products`
- `PUT /products/:id/stock`
- `DELETE /products/:id`

### Orders
- `GET /orders`
- `GET /orders/:id`
- `POST /orders`
- `PUT /orders/:id/status`

## Example Requests

### Create Product

```json
{
  "name": "Keyboard",
  "sku": "KEY-001",
  "price": 799.00,
  "stock_quantity": 12
}

### Create Order
```json
{
  "customer_name": "Ola Nordmann",
  "items": [
    {
      "product_id": 1,
      "quantity": 2
    }
  ]
}
 ## Running the Project
 ```bash
npm install
npm run dev

## Server runs at:

http://localhost:3000

## What I Learned

This project helped me gain practical experience with:

building REST APIs
structuring backend applications with routes and controllers
working with PostgreSQL
handling validation and errors
implementing business logic (stock management)
