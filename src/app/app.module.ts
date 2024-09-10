import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NZ_I18N } from 'ng-zorro-antd/i18n';
import { en_US } from 'ng-zorro-antd/i18n';
import { registerLocaleData } from '@angular/common';
import en from '@angular/common/locales/en';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
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
import { TreeSelection } from './pages/shared/tree.component';
import { InputSearchComponent } from './pages/shared/input-search.component';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { DeleteProjectComponent } from './pages/home/delete-project.component';
import { SelectProComponent } from './pages/shared/select-project.component';
import { SelectForMainComponent } from './pages/home/select-formain.component';
import { DeleteMainComponent } from './pages/testcase/main-test/delete-main.component';
import { SelectMainComponent } from './pages/testcase/main-test/selectmain.component';
import { DeleteTestComponent } from './pages/testcase/delete-testcase.component';
registerLocaleData(en);
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}
@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NoResultFoundComponent,
    ListComponent,
    OperationComponent,
    LayoutComponent,
    DeleteProjectComponent,
    //test case
    TestcaseComponent,
    TestOperationComponent,
    NoProjectFoundComponent,
    NoTestCaseComponent,
    TestCaseListComponent,
    DetailModalComponent,
    MainTestListComponent,
    MainTestOperationComponent,
    SelectMainComponent,
    InputSearchComponent,
    SelectForMainComponent,
    DeleteMainComponent,
    DeleteTestComponent,
    //share
    SelectProComponent,

    //test run
    TestRunComponent,
    ActiveRunListComponent,
    CloseRunListComponent,
    RunOperationComponent,
    ActiveRunComponent,
    CloseRunComponent,
    TreeSelection,

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
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
  ],
  providers: [{ provide: NZ_I18N, useValue: en_US }],
  bootstrap: [AppComponent],
})
export class AppModule {}
