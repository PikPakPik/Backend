import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './identity/identity.module';
import { UsersModule } from './users/users.module';
import { ProductsModule } from './products/products.module';
import { InvoicesModule } from './invoices/invoices.module';
import { ReportsModule } from './reports/reports.module';
import { AppController } from './app.controller'; // Import AppController
import { AppService } from './app.service'; // Import AppService

@Module({
  imports: [
    // Load environment variables
    ConfigModule.forRoot({ isGlobal: true }),

    // Connect to PostgreSQL using TypeORM
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DATABASE_HOST'),
        port: configService.get<number>('DATABASE_PORT'),
        username: configService.get<string>('DATABASE_USERNAME'),
        password: configService.get<string>('DATABASE_PASSWORD'),
        database: configService.get<string>('DATABASE_NAME'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'], // Automatically load entities
        synchronize: true, // Use only in development
      }),
      inject: [ConfigService],
    }),

    // Application modules
    AuthModule,
    UsersModule,
    ProductsModule,
    InvoicesModule,
    ReportsModule,
  ],
  controllers: [AppController], // Register AppController
  providers: [AppService], // Register AppService
})
export class AppModule {}
