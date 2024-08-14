import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { HomeService, Project } from '../home/home.service';
import { ProjectSelectionService } from 'src/app/helper/projectselection.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-selection',
  template: `
    <nz-select
      [(ngModel)]="selectedValue"
      (ngModelChange)="onProjectChange($event)"
    >
      <nz-option
        *ngFor="let data of projects"
        [nzValue]="data.id"
        [nzLabel]="data.name"
      >
        {{ data.name }}
      </nz-option>
    </nz-select>
  `,
  styles: [
    `
      nz-select {
        width: 250px;
      }
    `,
  ],
})
export class SelecionComponent implements OnInit, OnDestroy {
  @Output() selectedProjectId = new EventEmitter<number | null>();
  projects: Project[] = [];
  selectedValue: number | null = null;
  loading: boolean = false;
  private destroy$ = new Subject<void>();

  constructor(
    private service: HomeService,
    private projectSelectionService: ProjectSelectionService
  ) {}

  ngOnInit(): void {
    this.getAllProjects();
    this.projectSelectionService.selectedProject$
      .pipe(takeUntil(this.destroy$))
      .subscribe((project) => {
        this.selectedValue = project ? project.id : null;
        this.selectedProjectId.emit(this.selectedValue);
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onProjectChange(selectedValue: number | null): void {
    const selectedProjectName = this.getProjectName(selectedValue);
    this.projectSelectionService.setSelectedProject({
      id: selectedValue,
      name: selectedProjectName,
    });
    this.selectedProjectId.emit(selectedValue);
  }

  private getProjectName(projectId: number | null): string {
    const project = this.projects.find((proj) => proj.id === projectId);
    return project ? project.name : '';
  }

  getAllProjects(): void {
    this.loading = true;
    this.service.getSelect().subscribe({
      next: (projects: Project[]) => {
        this.projects = projects;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching projects:', err);
        this.loading = false;
      },
    });
  }
}
