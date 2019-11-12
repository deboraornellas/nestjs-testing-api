import { Controller, Get, Query, HttpException, Post } from '@nestjs/common';
import { AppService } from './app.service';

interface Student {
  fullName: string;
  grades: number[];
  course: string;
  graduationYear: number;
  avatarSrc: string;
}

let studentList: Student[] = [
  {
    fullName: 'Maria dos Santos',
    grades: [9.2, 8.6, 8.7, 9.3, 8.6],
    course: 'Engenharia Aeronáutica',
    graduationYear: 2021,
    avatarSrc: 'https://random.dog/42980553-2f4f-4829-86a0-1c9ba7b7300c.jpg',
  },
  {
    fullName: 'João da Silva',
    grades: [8.2, 7.6, 8.7, 7.3, 8.6],
    course: 'Engenharia de Computação',
    graduationYear: 2023,
    avatarSrc: 'https://random.dog/1e8ff2fc-6a85-42c4-b9d8-a81bcf36dd98.jpg',
  },
];

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('/student')
  getStudent(@Query('fullName') fullName: string): Student {
    console.log(fullName);
    const student = this.appService.getStudent(fullName, studentList);
    if (!student) {
      throw new HttpException(
        'Incomplete student information or student not found',
        400,
      );
    }
    console.log(studentList);
    return student;
  }

  @Post('/new-student')
  addNewStudent(
    @Query('fullName') fullName: string,
    @Query('course') course: string,
    @Query('graduationYear') graduationYear: number,
  ): void {
    if (!fullName) {
      throw new HttpException('Student full name is obligatory', 400);
    }
    if (this.appService.isStudentInList(fullName, studentList)) {
      throw new HttpException('Student is already in the database', 400);
    }
    studentList = this.appService.addNewStudent(
      { fullName, course, graduationYear, avatarSrc: undefined, grades: [] },
      studentList,
    );
    console.log(studentList);
  }

  @Post('/add-grade')
  addGradeToExistingStudent(
    @Query('fullName') fullName: string,
    @Query('newGrade') newGrade: number,
  ): void {
    if (!fullName) {
      throw new HttpException('Student full name is obligatory', 400);
    }
    if (!this.appService.isStudentInList(fullName, studentList)) {
      throw new HttpException('Student is not in the database', 400);
    }
    studentList = this.appService.addGradesToExistingStudent(
      fullName,
      newGrade,
      studentList,
    );
    console.log(studentList);
  }
}
