import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, tap, finalize } from 'rxjs/operators';
import { TestCase, TestCaseService } from '../pages/testcase/test-case.service';

@Injectable({
  providedIn: 'root',
})
export class TestCaseStateService {
  private testCaseSubject = new BehaviorSubject<TestCase[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);
  testCases$ = this.testCaseSubject.asObservable();
  loading$ = this.loadingSubject.asObservable();

  constructor(private testCaseService: TestCaseService) {
    this.loadInitialTestCases();
  }

  private loadInitialTestCases(): void {
    this.loadingSubject.next(true);
    this.testCaseService
      .getTesteCase()
      .pipe(
        tap((testCases) => this.testCaseSubject.next(testCases)),
        catchError((err) => {
          console.error('Error loading test cases:', err);
          return of([]); // Return an empty array on error
        }),
        finalize(() => this.loadingSubject.next(false))
      )
      .subscribe();
  }

  addTestCase(testCase: TestCase): void {
    const currentTestCases = this.testCaseSubject.value;
    this.testCaseSubject.next([...currentTestCases, testCase]);
  }

  updateTestCase(updatedTestCase: TestCase): void {
    const currentTestCases = this.testCaseSubject.value;
    const updatedTestCases = currentTestCases.map((testCase) =>
      testCase.id === updatedTestCase.id ? updatedTestCase : testCase
    );
    this.testCaseSubject.next(updatedTestCases);
  }

  removeTestCase(testCaseId: string): void {
    const currentTestCases = this.testCaseSubject.value;
    const updatedTestCases = currentTestCases.filter(
      (testCase) => testCase.id !== testCaseId
    );
    this.testCaseSubject.next(updatedTestCases);
  }

  resetState(): void {
    this.testCaseSubject.next([]);
    this.loadingSubject.next(false);
  }

  logState(): void {
    console.log('Current Test Cases:', this.testCaseSubject.value);
  }
}
