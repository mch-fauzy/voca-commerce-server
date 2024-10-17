# Voca Commerce  (STATUS: IN PROGRESS)
REST API server that handles users, products, wallets, transactions, and related features. The system includes roles for managing access (ADMIN and USER), user wallets for transactions, and a product system where users can buy products through their wallets. Redis cache is integrated to optimize performance by caching frequently accessed data, such as product listings and transaction statuses

Live demo [_here_](https://voca-commerce-server.vercel.app/)

## Table of Contents
* [Technologies Used](#technologies-used)
* [Features](#features)
* [Setup](#setup)

## Technologies Used
- NodeJS - version 18.17.0
- Redis - version 7.2.4
- Postgresql - version 14.13.0

## Features
- User Management
- Product Management
- Wallet Management
- Transaction Handling
- Soft Delete
- Role-based Access Control

## Setup
To run this project in local, follow the steps below:

1. Clone this repository:

   ```
   git clone https://github.com/mch-fauzy/voca-commerce-server.git
   ```

2. Navigate to the project directory:
   ```
   cd voca-commerce-server
   ```

3. Install the required dependencies:
   ```
   npm install
   ```

4. Edit the database and Redis configuration in `.env.development` with your credentials:
    
    __Note: Please create new database or schema__
    
    ```
    DATABASE_URL='postgresql://johndoe:mypassword@localhost:5432/mydb?schema=public'
    REDIS_URL='redis://:@localhost:6379'
    ```

5. Migrate the database:
   ```
   npm run prismamigrate:dev
   ```

6. Generate Prisma client:
   ```
   npm run prismagenerate
   ```

7. Compile Typescript into Javascript code:
   ```
   npm run build
   ```

8. Start the server:
   ```
   npm run dev
   ```

9. By default, the server will run in:
    ```
    http://localhost:3000
    ```
