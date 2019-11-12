import { Injectable, Logger } from '@nestjs/common';
import { Interface } from 'readline';

interface Student {
  fullName: string;
  grades: number[];
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
    for (let student in studentList) {
      console.log(studentList[student].fullName.valueOf());

      if (studentList[student].fullName.valueOf() === fullName.valueOf())
        return studentList[student];
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
}
