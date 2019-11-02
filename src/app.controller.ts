import { Controller, Get, Query, HttpException } from '@nestjs/common';
import { AppService } from './app.service';

interface Student {
    name: string;
    grades: number[];
  }
  

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('/student')
  getStudent(
    @Query('firstName') firstName: string,
    @Query('lastName') lastName: string,
  ): Student {
    if (!this.appService.isNameValid(firstName, lastName)) {
      throw new HttpException('Incomplete student information or student not found', 400);
    }
    return this.appService.getStudent(firstName, lastName);
  }
}
