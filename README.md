# Voca Commerce Server

## Stack
- NodeJS with Typescript
- Express
- Postgresql
- Prisma ORM
- Redis
- Vercel

## Getting Started

To get started with the API, follow the steps below:

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

4. Edit the database configuration in `.env.development` with your PostgreSQL credentials `(please create new database)`

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