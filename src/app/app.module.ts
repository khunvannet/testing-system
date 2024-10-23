import { APP_INITIALIZER, LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { km_KH, NzI18nInterface, NZ_I18N } from 'ng-zorro-antd/i18n';
import { en_US } from 'ng-zorro-antd/i18n';
import { registerLocaleData } from '@angular/common';
import en from '@angular/common/locales/en';
import km from '@angular/common/locales/en';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgZorroAntdModule } from './ng-zorro-antd.module';
import { NoResultFoundComponent } from './pages/shared/no-result-found.component';
import { ListComponent } from './pages/project/project-list.component';
import { LayoutComponent } from './pages/layout/layout.component';
import { NoProjectFoundComponent } from './pages/shared/no-project-found.component';
import { OperationComponent } from './pages/project/project-operation.component';
import { TestOperationComponent } from './pages/testcase/testcase-operation.component';
import { NoTestCaseComponent } from './pages/shared/no-test-case.component';
import { TestCaseListComponent } from './pages/testcase/testcase-list.component';
import { DetailModalComponent } from './pages/testcase/detail-modal.component';

import { MainTestOperationComponent } from './pages/main/main-test-operation.component';
import { MainTestListComponent } from './pages/main/main-list.component';
import { TestRunComponent } from './pages/test-run/test-run.component';
import { ActiveRunListComponent } from './pages/test-run/active-run/active-run-list.component';
import { CloseRunListComponent } from './pages/test-run/close-run/close-run-list.component';
import { RunOperationComponent } from './pages/test-run/test-run-operation.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ActiveRunComponent } from './pages/test-run/active-run/active-run.component';
import { CloseRunComponent } from './pages/test-run/close-run/close-run.component';

import { RunResultsComponent } from './pages/test-run/active-run/result-modal.component';
import { BreadcrumbComponent } from './pages/shared/breadcrumb.component';
import { SettingComponent } from './pages/setting/setting.component';
import { InputSearchComponent } from './pages/shared/input-search.component';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { DeleteProjectComponent } from './pages/project/project-delete.component';
import { DeleteMainComponent } from './pages/main/main-delete.component';
import { SelectMainComponent } from './pages/main/selectmain.component';
import { DeleteTestComponent } from './pages/testcase/testacse-delete.component';
import { SelectProjectComponent } from './pages/project/project-select.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MainMultipleSelectComponent } from './pages/main/main-multiple-select.component';
import { TestMultipleSelectComponent } from './pages/testcase/testcase-multiple-select.component';
import { CloseActiveComponent } from './pages/test-run/active-run/active-run-close.component';
import { RunAgainComponent } from './pages/test-run/close-run/close-run-again.component';
import { DeleteRunComponent } from './pages/test-run/active-run/active-run-delete.component';
import { TreeSelectComponent } from './pages/test-run/test-run-tree-select.component';
import { EnumStatusComponent } from './pages/shared/EnumStatus.component';
import { LanguageInputComponent } from './pages/shared/language-input.component';
import { SettingHttpService, SettingService } from './app-setting';
import { Observable, catchError } from 'rxjs';

// registerLocaleData(en);
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

// export function i18nFactory(): NzI18nInterface {
//   const storedLang = localStorage.getItem('selectedLang') || 'en';
//   return storedLang === 'km' ? km_KH : en_US;
// }
// export function app_Init(settingsHttpService: SettingHttpService) {
//   return () => settingsHttpService.initializeApp();
// }
export function app_Init(settingsHttpService: SettingHttpService) {
  return () => settingsHttpService.initializeApp();
}

registerLocaleData(km);
registerLocaleData(en);

export class CustomTranslate implements TranslateLoader {
  constructor(
    private http: HttpClient,
    private settingService: SettingService
  ) {}
  getTranslation(lang: string): Observable<any> {
    // Here we are making http call to our server to get the
    // translation files. lang will be our language for which we are
    // calling translations if it fails to get that language's
    // translation then translation should be called for en language.
    return this.http
      .get(`${this.settingService.setting.LANG_URL}-${lang}.json`)
      .pipe(catchError((_) => this.http.get(`/assets/i18n/${lang}.json`)));
  }
}

@NgModule({
  declarations: [
    AppComponent,
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
    LanguageInputComponent,

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
    TreeSelectComponent,
    EnumStatusComponent,

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
        provide: TranslateLoader, // Main provider for loader
        useClass: CustomTranslate, // Custom Loader
        deps: [HttpClient, SettingService], // Dependencies which helps serving loader
      },
      isolate: false,
    }),
  ],
  providers: [
    {
      provide: NZ_I18N,
      useFactory: (localId: string) => {
        switch (localId) {
          case 'km':
            return km_KH;
          case 'en':
            return en_US;
          /** keep the same with angular.json/i18n/locales configuration **/
          default:
            return km_KH;
        }
      },
      deps: [LOCALE_ID],
    },
    {
      provide: APP_INITIALIZER,
      useFactory: app_Init,
      deps: [SettingHttpService],
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
