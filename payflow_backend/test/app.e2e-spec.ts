import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
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
  });

  it('/health (GET)', () => {
    return request(app.getHttpServer())
      .get('/health')
      .expect(200)
      .expect({ status: 'ok' });
  });

  describe('/payments/initialize (POST)', () => {
    it('should reject payment creation when customer name contains HTML / scripts', async () => {
      const response = await request(app.getHttpServer())
        .post('/payments/initialize')
        .send({
          customerName: '<script>alert("hack")</script>',
          email: 'pascal.kouadio96@gmail.com',
          customerPhone: '+2250759723109',
          description: 'Fitness',
          amount: 10000,
        })
        .expect(400);

      expect(response.body.message).toContain(
        'Le nom contient des caractères non autorisés.',
      );
    });

    it('should reject payment creation when customer name is empty', async () => {
      await request(app.getHttpServer())
        .post('/payments/initialize')
        .send({
          customerName: '',
          email: 'pascal.kouadio96@gmail.com',
          customerPhone: '+2250759723109',
          description: 'Fitness',
          amount: 10000,
        })
        .expect(400);
    });

    it('should accept valid customer name "Pascal Kouadio" and return payment authorization', async () => {
      const response = await request(app.getHttpServer())
        .post('/payments/initialize')
        .send({
          customerName: 'Pascal Kouadio',
          email: 'pascal.kouadio96@gmail.com',
          customerPhone: '+2250759723109',
          description: 'Fitness',
          amount: 10000,
        });

      if (response.status !== 201) {
        console.error('FAILED 201:', response.status, response.body);
      }
      expect(response.status).toBe(201);

      expect(response.body).toHaveProperty('status');
      expect(response.body.status).toBe(true);
      expect(response.body).toHaveProperty('authorization_url');
      expect(response.body).toHaveProperty('reference');
      expect(response.body.reference).toMatch(/^PAYFLOW-/);
    });
  });

  afterEach(async () => {
    await app.close();
  });
});
