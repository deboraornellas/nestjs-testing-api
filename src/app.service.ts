import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  isNameValid(firstName: string, lastName: string): boolean { 
      if ((firstName === 'Anna' && lastName === 'Julia') 
      ||
      (firstName === 'Jane' && lastName === 'Doe')) return true;
      else return false;
  }

  getStudent(firstName, lastName) {
      if ((firstName === 'Anna' && lastName === 'Julia')) {
          return ({
              name: 'Anna Julia',
              grades: [3.3, 3.1, 3.5, 3.15, 3.5]
          })
      }
      else if ((firstName === 'Jane' && lastName === 'Doe')) {
          return ({
              name: 'Jane Doe',
              grades: [3.2, 3.6, 3.7, 3.3, 3.6]
          })
      }

  }
} 
