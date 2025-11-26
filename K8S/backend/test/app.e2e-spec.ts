import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { config as loadEnv } from 'dotenv';
import { join } from 'path';
import * as request from 'supertest';
import { DataSource } from 'typeorm';
import { AppModule } from '../src/app.module';
import { Order } from '../src/orders/entities/order.entity';
import { User } from '../src/users/entities/user.entity';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let dataSource: DataSource;

  beforeAll(async () => {
    process.env.NODE_ENV = 'test';
    loadEnv({ path: join(__dirname, '..', '.env.test') });
    process.env.DB_HOST = process.env.DB_HOST || 'localhost';
    process.env.DB_PORT = process.env.DB_PORT || '5432';
    process.env.DB_USERNAME = process.env.DB_USERNAME || 'postgres';
    process.env.DB_PASSWORD = process.env.DB_PASSWORD || 'secret123!';
    process.env.DB_DATABASE = process.env.DB_DATABASE || 'sticct_test';

    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    await app.init();

    dataSource = app.get(DataSource);
    await clearDatabase(dataSource);
  });

  afterEach(async () => {
    await clearDatabase(dataSource);
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/users (POST)', () => {
    it('should create a new user and return it', async () => {
      const createUserDto = {
        name: 'John',
        institute: 'Testing Inc.',
        mail: 'john.doe@example.com',
        cel: 549123456,
      };

      const response = await request(app.getHttpServer())
        .post('/users')
        .send(createUserDto)
        .expect(201);

      expect(response.body).toMatchObject({
        name: 'John',
        institute: 'Testing Inc.',
        mail: 'john.doe@example.com',
        cel: 549123456,
        isActive: true,
      });
      expect(response.body).toHaveProperty('id');
    });

    it('should return a 400 error if email is missing', async () => {
      const invalidUserDto = {
        name: 'Jane',
        institute: 'Testing Inc.',
        cel: 549123456,
      };

      await request(app.getHttpServer())
        .post('/users')
        .send(invalidUserDto)
        .expect(400);
    });
  });

  describe('/orders (POST)', () => {
    it('should create a new order when priority is provided', async () => {
      const userRepository = dataSource.getRepository(User);
      const user = await userRepository.save({
        name: 'Alice',
        institute: 'QA Labs',
        mail: 'alice@example.com',
        cel: 123456789,
      });

      const createOrderDto = {
        userId: user.id,
        name: 'Alice',
        priority: 'Alta',
        description: 'Orden de prueba',
        description2: 'Detalle adicional',
        isActive: true,
        estado: 'En espera',
      };

      const response = await request(app.getHttpServer())
        .post('/orders')
        .send(createOrderDto)
        .expect(201);

      expect(response.body).toMatchObject({
        name: 'Alice',
        priority: 'Alta',
        description: 'Orden de prueba',
        description2: 'Detalle adicional',
        estado: 'En espera',
        isActive: true,
      });
      expect(response.body).toHaveProperty('id');

      const persistedOrder = await dataSource
        .getRepository(Order)
        .findOne({ where: { id: response.body.id }, relations: ['user'] });

      expect(persistedOrder).toBeTruthy();
      expect(persistedOrder?.priority).toBe('Alta');
      expect(persistedOrder?.user.id).toBe(user.id);
    });

    it('should return 400 when priority is missing', async () => {
      const userRepository = dataSource.getRepository(User);
      const user = await userRepository.save({
        name: 'Bob',
        institute: 'QA Labs',
        mail: 'bob@example.com',
        cel: 987654321,
      });

      const invalidOrderDto = {
        userId: user.id,
        name: 'Bob',
        description: 'Orden inválida',
        description2: 'Sin prioridad',
        isActive: true,
        estado: 'En espera',
      };

      await request(app.getHttpServer())
        .post('/orders')
        .send(invalidOrderDto)
        .expect(400);
    });
  });
});

async function clearDatabase(source: DataSource): Promise<void> {
  await source.createQueryBuilder().delete().from(Order).execute();
  await source.createQueryBuilder().delete().from(User).execute();
}
