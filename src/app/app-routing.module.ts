import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LayoutComponent } from './pages/layout/layout.component';
import { TestRunComponent } from './pages/test-run/test-run.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ActiveRunComponent } from './pages/test-run/active-run/active-run.component';
import { CloseRunComponent } from './pages/test-run/close-run/close-run.component';
import { SettingComponent } from './pages/setting/setting.component';
import { MainTestListComponent } from './pages/main/main-list.component';
import { RedirectComponent } from './pages/redirect/redirect.component';
import { ListComponent } from './pages/project/project-list.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'home' },
  { path: 'home', component: LayoutComponent }, // Root path to LayoutComponent
  {
    path: '',
    component: LayoutComponent, // Using LayoutComponent as the parent layout
    children: [
      { path: 'dashboard', component: DashboardComponent }, // Child route
      {
        path: 'test_cases',
        component: MainTestListComponent,
        data: {
          nzComponentParams: { mode: 'testcase' },
        },
      },
      {
        path: 'project',
        component: ListComponent,
      },
      {
        path: 'test_run',
        component: TestRunComponent,
      },
      {
        path: 'test_run/:id',
        component: ActiveRunComponent,
        data: [
          { index: 0, label: 'Test Run', url: '/test_run' },
          { index: 1, label: 'Active', url: null },
        ],
      },
      {
        path: 'test_run/close',
        component: CloseRunComponent,
        data: [
          { index: 0, label: 'Test Run', url: '/test_run' },
          { index: 1, label: 'Close', url: null },
        ],
      },
      { path: 'settings', component: SettingComponent }, // Child route
    ],
  },
  {
    path: 'redirect/:requestId',
    component: RedirectComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
