import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../app.module';
import { INestApplication, HttpService, HttpModule } from '@nestjs/common';
import { AppService } from '../app.service';
import { AxiosResponse } from 'axios';
import { of } from 'rxjs';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const mockAppModule: TestingModule = await Test.createTestingModule({
      imports: [AppModule, HttpModule],
      providers: [AppService],
    }).compile();

    app = mockAppModule.createNestApplication();
    await app.init();
  });

  it('Should add a new student, add two grades and return the correct student average', async () => {
    const fullName = 'Paula';
    const course = 'Engenharia Eletrônica';
    const grade1 = 10;
    const grade2 = 9;
    const graduationYear = 2019;

    await request(app.getHttpServer())
      .post(
        `/new-student?fullName=${fullName}&course=${course}&graduationYear=${graduationYear}`,
      )
      .expect(201);

    await request(app.getHttpServer())
      .post(`/add-grade?fullName=${fullName}&newGrade=${grade1}`)
      .expect(201);

    await request(app.getHttpServer())
      .post(`/add-grade?fullName=${fullName}&newGrade=${grade2}`)
      .expect(201);

    const studentData = await request(app.getHttpServer())
      .get(`/student?fullName=${fullName}`)
      .expect(200);

    expect(studentData.body.average).toEqual(9.5);
  });

  afterAll(async () => {
    await app.close();
  });
});
