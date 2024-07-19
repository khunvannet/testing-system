import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NZ_I18N } from 'ng-zorro-antd/i18n';
import { en_US } from 'ng-zorro-antd/i18n';
import { registerLocaleData } from '@angular/common';
import en from '@angular/common/locales/en';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgZorroAntdModule } from './ng-zorro-antd.module';
import { HomeComponent } from './pages/home/home.component';
import { NoResultFoundComponent } from './pages/shared/no-result-found.component';
import { ListComponent } from './pages/home/list.component';
import { LayoutComponent } from './pages/layout/layout.component';
import { TestcaseComponent } from './pages/testcase/testcase.component';
import { NoProjectFoundComponent } from './pages/shared/no-project-found.component';
import { OperationComponent } from './pages/home/home-operation.component';
import { TestOperationComponent } from './pages/testcase/test-operation.component';
import { NoTestCaseComponent } from './pages/shared/no-test-case.component';
import { TestCaseListComponent } from './pages/testcase/test-case-list.component';
import { DetailModalComponent } from './pages/testcase/detail-modal.component';
import { MainTestComponent } from './pages/testcase/main-test/main-test.component';

import { MainTestOperationComponent } from './pages/testcase/main-test/main-test-operation.component';
import { MainTestListComponent } from './pages/testcase/main-test/main-list.component';
import { TestRunComponent } from './pages/test-run/test-run.component';
import { ActiveRunListComponent } from './pages/test-run/active-run/active-run-list.component';
import { CloseRunListComponent } from './pages/test-run/close-run/close-run-list.component';
import { RunOperationComponent } from './pages/test-run/run-operation.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ActiveRunComponent } from './pages/test-run/active-run/active-run.component';
import { CloseRunComponent } from './pages/test-run/close-run/close-run.component';

import { RunResultsComponent } from './pages/test-run/active-run/result-modal.component';
import { BreadcrumbComponent } from './pages/shared/breadcrumb.component';
import { SettingComponent } from './pages/setting/setting.component';
import { SelecionComponent } from './pages/shared/selection.component';
import { SelectMainComponent } from './pages/testcase/main-test/selectmain.component';
registerLocaleData(en);

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NoResultFoundComponent,
    ListComponent,
    OperationComponent,
    LayoutComponent,
    //test case
    TestcaseComponent,
    TestOperationComponent,
    NoProjectFoundComponent,
    NoTestCaseComponent,
    TestCaseListComponent,
    DetailModalComponent,
    MainTestComponent,
    MainTestListComponent,
    MainTestOperationComponent,
    SelectMainComponent,
    SelecionComponent,

    //test run
    TestRunComponent,
    ActiveRunListComponent,
    CloseRunListComponent,
    RunOperationComponent,
    ActiveRunComponent,
    CloseRunComponent,

    RunResultsComponent,
    BreadcrumbComponent,
    //dashboard
    DashboardComponent,

    //settings
    SettingComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    NgZorroAntdModule,
    ReactiveFormsModule,
  ],
  providers: [{ provide: NZ_I18N, useValue: en_US }],
  bootstrap: [AppComponent],
})
export class AppModule {}
