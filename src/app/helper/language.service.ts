import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { NzI18nService } from 'ng-zorro-antd/i18n';
import { LocalStorageService } from './localStorage.service';
import { APP_STORAGE_KEY, Locale } from '../const';
import { MultiLanguageInput } from '../pages/shared/language-input.component';

@Injectable({ providedIn: 'root' })
export class LanguageService {
  constructor(
    public translate: TranslateService,
    private i18n: NzI18nService,
    private localStorageService: LocalStorageService
  ) {}

  switchLanguage(key: any) {
    this.translate.use(key.localId);
    this.i18n.setLocale(key.local);
    this.localStorageService.setValue({
      key: APP_STORAGE_KEY.Language,
      value: key.localId,
    });
  }

  initialLanguage() {
    let language: { local?: any; localId?: string } = {};
    for (let key in Locale) {
      if (
        // @ts-ignore
        Locale[key].localId ==
        this.localStorageService.getValue(APP_STORAGE_KEY.Language)
      ) {
        // @ts-ignore
        language = Locale[key];
        break;
      }
    }
    this.translate.use(language.localId ?? Locale.DEFAULT.localId);
    this.i18n.setLocale(language.local ?? Locale.DEFAULT.local);
  }

  mapLanguageWithCurrentLocalId(val: any, localId: string = '') {
    try {
      let languages: MultiLanguageInput[] = JSON.parse(val);
      return languages.find(
        (x) => x.localId == localId || this.translate.currentLang
      )?.val;
    } catch {
      return null;
    }
  }
  getNameEnOrKh(nameKh: any, nameEn: any) {
    if (this.translate.currentLang == Locale.KH.localId) {
      return nameKh;
    } else {
      return nameEn;
    }
  }
}
