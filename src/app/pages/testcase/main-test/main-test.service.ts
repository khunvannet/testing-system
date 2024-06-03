import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface MainTest {
  id: number;
  name: string;
  project: string;
}

@Injectable({
  providedIn: 'root',
})
export class MainTestService {
  private mainTestsSubject = new BehaviorSubject<MainTest[]>([]);
  mainTests$ = this.mainTestsSubject.asObservable();

  private mainTests: MainTest[] = [];

  constructor() {}

  addMainTest(testCase: MainTest): void {
    this.mainTests.push(testCase);
  }

  getAllMainTests(): MainTest[] {
    return this.mainTests;
  }

  getMainTestById(id: number): MainTest | undefined {
    return this.mainTests.find((test) => test.id === id);
  }

  updateMainTest(updatedTest: MainTest): void {
    const index = this.mainTests.findIndex(
      (test) => test.id === updatedTest.id
    );
    if (index !== -1) {
      this.mainTests[index] = updatedTest;
      console.log('Test updated successfully', this.mainTests);
    } else {
      console.log('Test not found');
    }
  }
  deleteMainTest(id: number): void {
    this.mainTests = this.mainTests.filter((test) => test.id !== id);
  }
}
