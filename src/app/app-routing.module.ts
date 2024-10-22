import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LayoutComponent } from './pages/layout/layout.component';
import { TestRunComponent } from './pages/test-run/test-run.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ActiveRunComponent } from './pages/test-run/active-run/active-run.component';
import { CloseRunComponent } from './pages/test-run/close-run/close-run.component';
import { SettingComponent } from './pages/setting/setting.component';
import { MainTestListComponent } from './pages/main-test/main-list.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'home' },
  { path: 'home', component: HomeComponent },
  {
    path: 'test',
    component: LayoutComponent,
    children: [
      { path: 'dashboard', component: DashboardComponent },
      {
        path: 'test_cases',
        component: MainTestListComponent,
        data: {
          nzComponentParams: {
            mode: 'testcase',
          },
        },
      },
      {
        path: 'test_run',
        component: TestRunComponent,
        data: {
          nzComponentParams: {
            mode: 'testrun',
          },
        },
      },
      {
        path: 'test_run/:id',
        component: ActiveRunComponent,
        data: [
          { index: 0, label: 'Test Run', url: '/test/test_run' },
          { index: 1, label: 'Active', url: null },
        ],
      },
      {
        path: 'test_run/close',
        component: CloseRunComponent,
        data: [
          { index: 0, label: 'Test Run', url: '/test/test_run' },
          { index: 1, label: 'Close', url: null },
        ],
      },
      {
        path: 'settings',
        component: SettingComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
