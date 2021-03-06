import { Injectable, Logger, HttpService } from '@nestjs/common';
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
  constructor(private http: HttpService) {}
  getHello(): string {
    return 'Hello World!';
  }

  isStudentInList(fullName: string, studentList: Student[]): boolean {
    if (!fullName) return false;
    for (let student in studentList) {
      if (studentList[student].fullName == fullName) return true;
    }
    return false;
  }

  async getAvatarPicture(): Promise<string> {
    const randomDogURL = 'https://random.dog/woof.json';
    let response;
    do {
      response = await this.http.get(randomDogURL).toPromise();
    } while (!response.data.url.includes('jpg'));
    return response.data.url;
  }

  async addNewStudent(
    newStudent: Student,
    studentList: Student[],
  ): Promise<Student[]> {
    newStudent.avatarSrc = await this.getAvatarPicture();
    studentList.push(newStudent);
    return studentList;
  }

  getStudent(fullName, studentList) {
    if (!fullName) return null;

    for (let index in studentList) {
      let student = studentList[index];
      if (student.fullName.valueOf() === fullName.valueOf()) {
        student.average = this.calculateAverage(student.grades);
        return student;
      }
    }
    return null;
  }

  addGradesToExistingStudent(fullName, newGrade, studentList) {
    if (!fullName) return null;
    for (let index in studentList) {
      const student = studentList[index];
      if (student.fullName.valueOf() === fullName.valueOf()) {
        student.grades.push(parseFloat(newGrade));
        student.average = this.calculateAverage(student.grades);
        return studentList;
      }
    }
    return null;
  }

  calculateAverage(grades: number[]): number {
    if (!grades || !grades.length) return 0;

    let average: number = 0;

    for (const grade of grades) {
      average += grade / grades.length;
    }

    return parseFloat(average.toFixed(2));
  }
}
