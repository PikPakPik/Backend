.env
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=your_password
DATABASE_NAME=trinity
JWT_SECRET=your_jwt_secret
OPENFOODFACTS_API_URL=https://world.openfoodfacts.org/api/v0/product/


nest new trinity --package-manager pnpm
cd trinity
pnpm add @nestjs/typeorm typeorm pg bcrypt class-transformer @nestjs/jwt passport-jwt passport @nestjs/passport axios
pnpm add -D @nestjs/testing jest @types/jest ts-jest supertest @types/supertest

# Generate modules, controllers, and services
nest g module auth
nest g controller auth
nest g service auth

nest g module users
nest g controller users
nest g service users

nest g module products
nest g controller products
nest g service products

nest g module invoices
nest g controller invoices
nest g service invoices

nest g module reports
nest g controller reports
nest g service reports

nest g module seed
nest g service seed
touch src/seed/seed.ts


touch src/auth/jwt.strategy.ts
touch src/auth/jwt-auth.guard.ts
touch src/auth/roles.decorator.ts
touch src/auth/roles.guard.ts
touch src/users/user.entity.ts
touch src/products/product.entity.ts
touch src/invoices/invoice.entity.ts
touch src/invoices/invoice-product.entity.ts
touch .env


Database :
CREATE DATABASE trinity;

CREATE TABLE "user" (
    id SERIAL PRIMARY KEY,
    firstName VARCHAR(255) NOT NULL,
    lastName VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'user',
    billingAddress TEXT,
    homeAddress TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE "product" (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    brand VARCHAR(255),
    barcode TEXT UNIQUE NOT NULL,
    price DECIMAL(10, 2) DEFAULT 0.00,
    stock INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE "invoice" (
    id SERIAL PRIMARY KEY,
    userId INT REFERENCES "user"(id) ON DELETE CASCADE,
    orderNumber VARCHAR(50) UNIQUE NOT NULL,
    status VARCHAR(50) DEFAULT 'PENDING',
    date TIMESTAMP DEFAULT NOW(),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE "invoice_product" (
    id SERIAL PRIMARY KEY,
    invoiceId INT REFERENCES "invoice"(id) ON DELETE CASCADE,
    productId INT REFERENCES "product"(id) ON DELETE CASCADE,
    quantity INT NOT NULL,
    price DECIMAL(10, 2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE (invoiceId, productId) -- Ensures no duplicate product per invoice
);





