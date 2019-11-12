import { Injectable, Logger } from '@nestjs/common';
import { Interface } from 'readline';

interface Student {
  fullName: string;
  grades: number[];
  average: number;
  course: string;
  graduationYear: number;
  avatarSrc: string;
}

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  isStudentInList(fullName: string, studentList: Student[]): boolean {
    for (let student in studentList) {
      if (studentList[student].fullName == fullName) return true;
    }
    return false;
  }

  addNewStudent(newStudent: Student, studentList: Student[]): Student[] {
    studentList.push(newStudent);
    return studentList;
  }

  getStudent(fullName, studentList) {
    for (let index in studentList) {
      let student = studentList[index];
      console.log(student.fullName.valueOf());

      if (student.fullName.valueOf() === fullName.valueOf()) {
        student.average = this.calculateAverage(student.grades);
        return student;
      }
    }
    return null;
  }

  addGradesToExistingStudent(fullName, newGrade, studentList) {
    for (let student in studentList) {
      if (studentList[student].fullName == fullName) {
        studentList[student].grades.push(parseFloat(newGrade));
        return studentList;
      }
    }
    return null;
  }

  calculateAverage(grades: number[]): number {
    let gpa: number = 0;

    for (const grade of grades) {
      gpa += grade / grades.length;
    }

    return gpa;
  }
}
