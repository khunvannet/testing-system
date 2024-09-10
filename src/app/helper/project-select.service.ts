import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private projectIdSource = new BehaviorSubject<number | null>(null);
  currentProjectId$ = this.projectIdSource.asObservable();

  constructor() {}

  changeProjectId(id: number | null): void {
    this.projectIdSource.next(id);
  }
}
