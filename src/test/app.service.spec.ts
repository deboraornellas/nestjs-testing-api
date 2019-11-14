import { Test, TestingModule } from '@nestjs/testing';
import { AppService } from '../app.service';
import { HttpModule, HttpService } from '@nestjs/common';
import { of } from 'rxjs/internal/observable/of';
import { AxiosResponse } from 'axios';

describe('AppService', () => {
  let app: TestingModule;
  let appService: AppService;
  let httpService: HttpService;
  let mockStudentList;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      providers: [AppService],
      imports: [HttpModule],
    }).compile();
    appService = app.get<AppService>(AppService);
    httpService = app.get<HttpService>(HttpService);
  });

  beforeEach(() => {
    mockStudentList = [
      {
        fullName: 'Maria',
        grades: [9.2, 8.6, 8.7, 9.3, 8.6],
        average: 8.88,
        course: 'Engenharia Aeronáutica',
        graduationYear: 2021,
        avatarSrc:
          'https://random.dog/42980553-2f4f-4829-86a0-1c9ba7b7300c.jpg',
      },
      {
        fullName: 'João',
        grades: [8.2, 7.5, 8.4, 7.4, 8.0],
        average: 7.9,
        course: 'Engenharia de Computação',
        graduationYear: 2023,
        avatarSrc:
          'https://random.dog/1e8ff2fc-6a85-42c4-b9d8-a81bcf36dd98.jpg',
      },
    ];
  });

  describe('getStudent', () => {
    it('should return null if there is no student name', async () => {
      const studentName = undefined;
      const getStudentResult = await appService.getStudent(
        studentName,
        mockStudentList,
      );
      expect(getStudentResult).toEqual(null);
    });
    it('should return null if student is not in student list', async () => {
      const studentName = 'Ana';
      const getStudentResult = await appService.getStudent(
        studentName,
        mockStudentList,
      );
      expect(getStudentResult).toEqual(null);
    });
    it('should return the student if he/she is in student list', async () => {
      const studentName = 'Maria';
      const getStudentResult = await appService.getStudent(
        studentName,
        mockStudentList,
      );
      const expectedResult = {
        fullName: 'Maria',
        grades: [9.2, 8.6, 8.7, 9.3, 8.6],
        average: 8.88,
        course: 'Engenharia Aeronáutica',
        graduationYear: 2021,
        avatarSrc:
          'https://random.dog/42980553-2f4f-4829-86a0-1c9ba7b7300c.jpg',
      };
      expect(getStudentResult).toEqual(expectedResult);
    });
  });

  describe('isStudentInList', () => {
    it('should return false if there is no student name', async () => {
      const studentName = undefined;
      const isStudentOnList = await appService.isStudentInList(
        studentName,
        mockStudentList,
      );
      expect(isStudentOnList).toBe(false);
    });
    it('should return true if student is in student list', async () => {
      const studentName = 'João';
      const isStudentOnList = await appService.isStudentInList(
        studentName,
        mockStudentList,
      );
      expect(isStudentOnList).toBe(true);
    });
    it('should return false if the student is not in student list', async () => {
      const studentName = 'Ana';
      const isStudentOnList = await appService.isStudentInList(
        studentName,
        mockStudentList,
      );
      expect(isStudentOnList).toBe(false);
    });
  });

  describe('addNewStudent', () => {
    const result: AxiosResponse = {
      data: {
        url: 'https://fakeURL.com/image.jpg',
      },
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {},
    };

    it('should add the student into the student list', async () => {
      const newStudent = {
        fullName: 'José',
        grades: [],
        average: undefined,
        course: 'Engenharia Civil-Aeronáutica',
        graduationYear: 2020,
        avatarSrc: undefined,
      };
      jest.spyOn(httpService, 'get').mockImplementation(() => of(result));
      const updatedList = await appService.addNewStudent(
        newStudent,
        mockStudentList,
      );

      expect(updatedList).toEqual([
        {
          fullName: 'Maria',
          grades: [9.2, 8.6, 8.7, 9.3, 8.6],
          average: 8.88,
          course: 'Engenharia Aeronáutica',
          graduationYear: 2021,
          avatarSrc:
            'https://random.dog/42980553-2f4f-4829-86a0-1c9ba7b7300c.jpg',
        },
        {
          fullName: 'João',
          grades: [8.2, 7.5, 8.4, 7.4, 8.0],
          average: 7.9,
          course: 'Engenharia de Computação',
          graduationYear: 2023,
          avatarSrc:
            'https://random.dog/1e8ff2fc-6a85-42c4-b9d8-a81bcf36dd98.jpg',
        },
        {
          fullName: 'José',
          grades: [],
          average: undefined,
          course: 'Engenharia Civil-Aeronáutica',
          graduationYear: 2020,
          avatarSrc: 'https://fakeURL.com/image.jpg',
        },
      ]);
    });
  });

  describe('calculateAverage', () => {
    it('should return zero if grade array does not exist', () => {
      const gradesArray = null;
      const average = appService.calculateAverage(gradesArray);

      expect(average).toEqual(0);
    });
    it('should return zero if grade array is empty', () => {
      const gradesArray = [];
      const average = appService.calculateAverage(gradesArray);

      expect(average).toEqual(0);
    });
    it('should calculate student graduate correctly if grade array is not empty', () => {
      const gradesArray = [9.0, 9.4, 9.1, 9.3];
      const expectedAverage = 9.2;
      const average = appService.calculateAverage(gradesArray);

      expect(average).toEqual(expectedAverage);
    });
  });

  describe('addGradesToExistingStudent', () => {
    const newGrade = 9.0;

    it('should return null if there is no student name', async () => {
      const studentName = undefined;
      const addGradesToExistingStudentResult = await appService.addGradesToExistingStudent(
        studentName,
        newGrade,
        mockStudentList,
      );
      expect(addGradesToExistingStudentResult).toEqual(null);
    });
    it('should return null if student is not in student list', async () => {
      const studentName = 'Ana';
      const addGradesToExistingStudentResult = await appService.addGradesToExistingStudent(
        studentName,
        newGrade,
        mockStudentList,
      );
      expect(addGradesToExistingStudentResult).toEqual(null);
    });
    it('should add the grade to the student object if he/she is in student list', async () => {
      const studentName = 'Maria';
      const addGradesToExistingStudentResult = await appService.addGradesToExistingStudent(
        studentName,
        newGrade,
        mockStudentList,
      );
      expect(addGradesToExistingStudentResult).toEqual([
        {
          fullName: 'Maria',
          grades: [9.2, 8.6, 8.7, 9.3, 8.6, 9.0],
          average: 8.9,
          course: 'Engenharia Aeronáutica',
          graduationYear: 2021,
          avatarSrc:
            'https://random.dog/42980553-2f4f-4829-86a0-1c9ba7b7300c.jpg',
        },
        {
          fullName: 'João',
          grades: [8.2, 7.5, 8.4, 7.4, 8.0],
          average: 7.9,
          course: 'Engenharia de Computação',
          graduationYear: 2023,
          avatarSrc:
            'https://random.dog/1e8ff2fc-6a85-42c4-b9d8-a81bcf36dd98.jpg',
        },
      ]);
    });
  });
});
