/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Order } from './orders/entities/order.entity';
import { OrdersModule } from './orders/orders.module';
import { User } from './users/entities/user.entity';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.NODE_ENV === 'test' ? '.env.test' : '.env',
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT ?? '5432', 10),
      username: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD || 'secret123!',
      database:
        process.env.DB_DATABASE ||
        (process.env.NODE_ENV === 'test' ? 'sticct_test' : 'sticct'),
      ssl:
        process.env.TYPEORM_SSL === 'true'
          ? {
              rejectUnauthorized:
                process.env.TYPEORM_SSL_REJECT_UNAUTHORIZED !== 'false',
            }
          : false,
      synchronize: true,
      autoLoadEntities: true,
      entities: [Order, User],
    }),
    UsersModule,
    OrdersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
