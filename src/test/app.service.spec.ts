import { Test, TestingModule } from '@nestjs/testing';
import { AppService } from '../app.service';
import { HttpModule, HttpService } from '@nestjs/common';
import { of } from 'rxjs/internal/observable/of';
import { AxiosResponse } from 'axios';

const result: AxiosResponse = {
  data: {
    url: 'https://fakeURL.com',
  },
  status: 200,
  statusText: 'OK',
  headers: {},
  config: {},
};

describe('AppService', () => {
  let app: TestingModule;
  let appService: AppService;
  let httpService: HttpService;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      providers: [AppService],
      imports: [HttpModule],
    }).compile();
    appService = app.get<AppService>(AppService);
    httpService = app.get<HttpService>(HttpService);

    jest.spyOn(httpService, 'get').mockImplementation(() => of(result));
  });

  describe('calculateAverage', () => {
    it('should return zero if grade array does not exist', async () => {
      const gradesArray = null;
      const average = await appService.calculateAverage(gradesArray);

      expect(average).toEqual(0);
    });
    it('should return zero if grade array is empty', async () => {
      const gradesArray = [];
      const average = await appService.calculateAverage(gradesArray);

      expect(average).toEqual(0);
    });
    it('should calculate student graduate correctly if grade array is not empty', async () => {
      const gradesArray = [9.0, 9.4, 9.1, 9.3];
      const expectedAverage = 9.2;
      const average = await appService.calculateAverage(gradesArray);

      expect(average).toEqual(expectedAverage);
    });
  });
});
