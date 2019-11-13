import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from '../app.controller';
import { AppService } from '../app.service';
import { HttpModule } from '@nestjs/common';

describe('AppController', () => {
  let appController: AppController;
  let appService: AppService;
  const mockStudentList = [
    {
      fullName: 'Maria',
      grades: [9.2, 8.6, 8.7, 9.3, 8.6],
      average: 8.88,
      course: 'Engenharia Aeronáutica',
      graduationYear: 2021,
      avatarSrc: 'https://random.dog/42980553-2f4f-4829-86a0-1c9ba7b7300c.jpg',
    },
    {
      fullName: 'João',
      grades: [8.2, 7.5, 8.4, 7.4, 8.0],
      average: 7.9,
      course: 'Engenharia de Computação',
      graduationYear: 2023,
      avatarSrc: 'https://random.dog/1e8ff2fc-6a85-42c4-b9d8-a81bcf36dd98.jpg',
    },
  ];

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
    appService = app.get<AppService>(AppService);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(appController.getHello()).toBe('Hello World!');
    });
  });

  describe('getStudent', () => {
    it('should throw an HTTP Exception if student does not exist', () => {
      const fullName = 'Ana';
      jest.spyOn(appService, 'getStudent').mockImplementation(() => null);
      expect(() => appController.getStudent(fullName)).toThrowError();
    });
    it('should return a student if student exists', () => {
      const fullName = 'Maria';
      const studentData = {
        fullName: 'Maria',
        grades: [9.2, 8.6, 8.7, 9.3, 8.6, 9.0],
        average: 8.88,
        course: 'Engenharia Aeronáutica',
        graduationYear: 2021,
        avatarSrc:
          'https://random.dog/42980553-2f4f-4829-86a0-1c9ba7b7300c.jpg',
      };
      jest
        .spyOn(appService, 'getStudent')
        .mockImplementation(() => studentData);
      expect(appController.getStudent(fullName)).toEqual(studentData);
    });
  });

  describe('addNewStudent', () => {
    it('should throw an HTTP Exception if there is not a student name', async () => {
      const fullName = undefined;
      const course = 'Engenharia Aeronáutica';
      const graduationYear = 2022;
      await expect(
        appController.addNewStudent(fullName, course, graduationYear),
      ).rejects.toThrow('Student full name is obligatory');
    });
    it('should throw an HTTP Exception if the student is already in list', async () => {
      const fullName = 'Maria';
      const course = 'Engenharia Aeronáutica';
      const graduationYear = 2022;
      await expect(
        appController.addNewStudent(fullName, course, graduationYear),
      ).rejects.toThrow('Student is already in the database');
    });
    it('should return a student if student exists', () => {
      const fullName = 'Angela';
      const course = 'Engenharia Aeronáutica';
      const graduationYear = 2022;
      const studentData = {
        fullName: 'Angela',
        grades: [],
        average: undefined,
        course: 'Engenharia Aeronáutica',
        graduationYear: 2022,
        avatarSrc: 'https://random.dog/random.jpg',
      };
      jest
        .spyOn(appService, 'addNewStudent')
        .mockImplementation(
          async () => await [...mockStudentList, studentData],
        );
      const result = appController.addNewStudent(
        fullName,
        course,
        graduationYear,
      );
      expect(result).resolves.toEqual(studentData);
    });
  });

  describe('addGradeToExistingStudent', () => {
    it('should throw an HTTP Exception if there is not a student name', () => {
      const fullName = undefined;
      const newGrade = 6.7;
      expect(() =>
        appController.addGradeToExistingStudent(fullName, newGrade),
      ).toThrow('Student full name is obligatory');
    });
    it('should throw an HTTP Exception if the student is not in list', () => {
      const fullName = 'Claudia';
      const newGrade = 6.7;
      expect(() =>
        appController.addGradeToExistingStudent(fullName, newGrade),
      ).toThrow('Student is not in the database');
    });
    it('should run correctly if student exists', () => {
      const fullName = 'Maria';
      const newGrade = 6.7;
      const updatedList = [
        {
          fullName: 'Maria',
          grades: [9.2, 8.6, 8.7, 9.3, 8.6, 6.7],
          average: 8.52,
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
      jest
        .spyOn(appService, 'addGradesToExistingStudent')
        .mockImplementation(() => updatedList);
      expect(() =>
        appController.addGradeToExistingStudent(fullName, newGrade),
      ).not.toThrow();
    });
  });
});
