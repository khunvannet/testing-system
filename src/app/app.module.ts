import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { km_KH, NzI18nInterface, NZ_I18N } from 'ng-zorro-antd/i18n';
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
import { NoProjectFoundComponent } from './pages/shared/no-project-found.component';
import { OperationComponent } from './pages/home/home-operation.component';
import { TestOperationComponent } from './pages/testcase/test-operation.component';
import { NoTestCaseComponent } from './pages/shared/no-test-case.component';
import { TestCaseListComponent } from './pages/testcase/test-case-list.component';
import { DetailModalComponent } from './pages/testcase/detail-modal.component';

import { MainTestOperationComponent } from './pages/main-test/main-test-operation.component';
import { MainTestListComponent } from './pages/main-test/main-list.component';
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
import { InputSearchComponent } from './pages/shared/input-search.component';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { DeleteProjectComponent } from './pages/home/delete-project.component';
import { DeleteMainComponent } from './pages/main-test/delete-main.component';
import { SelectMainComponent } from './pages/main-test/selectmain.component';
import { DeleteTestComponent } from './pages/testcase/delete-testcase.component';
import { SelectProjectComponent } from './pages/home/select-project.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MainMultipleSelectComponent } from './pages/main-test/main-multiple-select.component';
import { TestMultipleSelectComponent } from './pages/testcase/test-multiple-select.component';
import { CloseActiveComponent } from './pages/test-run/active-run/close-active.component';
import { RunAgainComponent } from './pages/test-run/close-run/run-again.component';
import { DeleteRunComponent } from './pages/test-run/active-run/delete-run.component';

registerLocaleData(en);
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

export function i18nFactory(): NzI18nInterface {
  const storedLang = localStorage.getItem('selectedLang') || 'en';
  return storedLang === 'km' ? km_KH : en_US;
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
    TestOperationComponent,
    NoProjectFoundComponent,
    NoTestCaseComponent,
    TestCaseListComponent,
    DetailModalComponent,
    MainTestListComponent,
    MainTestOperationComponent,
    SelectMainComponent,
    InputSearchComponent,
    SelectProjectComponent,
    DeleteMainComponent,
    DeleteTestComponent,
    MainMultipleSelectComponent,
    TestMultipleSelectComponent,

    //share

    //test run
    TestRunComponent,
    ActiveRunListComponent,
    CloseRunListComponent,
    RunOperationComponent,
    ActiveRunComponent,
    CloseRunComponent,
    CloseActiveComponent,
    RunAgainComponent,
    DeleteRunComponent,

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
    DragDropModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
  ],
  providers: [{ provide: NZ_I18N, useFactory: i18nFactory }],
  bootstrap: [AppComponent],
})
export class AppModule {}
