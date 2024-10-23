import { en_US, km_KH, zh_CN } from 'ng-zorro-antd/i18n';

export const APP_STORAGE_KEY = {
  Authorized: 'authorized',
  RefreshToken: 'refreshToken',
  Language: 'language',
  Tenant: 'uat-tenant',
  App: 'uat-appinfo',
};

export const DEFAULT_IMAGE = './assets/image/default.webp';

export enum REPORT_RENDER_TYPES {
  HTML5 = 1,
  Excel = 2,
  Word = 3,
  Pdf = 4,
}

export enum PageSize {
  A1 = 1,
  A2 = 2,
  A3 = 3,
  A4 = 4,
  A5 = 5,
}
export enum Orientation {
  Portrait = 1,
  Landscape = 2,
}

export enum ReportParamDisplay {
  Inline = 1,
  Modal = 2,
}

export const PAGE_SIZE_OPTION = [10, 25, 50, 100];

export const Locale: { KH: any; EN: any; ZH: any; DEFAULT: any } = {
  KH: { local: km_KH, localId: 'km' },
  EN: { local: en_US, localId: 'en' },
  ZH: { local: zh_CN, localId: 'zh' },
  DEFAULT: { local: km_KH, localId: 'km' },
};

export const LANGUAGES: {
  key: { local: any; localId: string };
  image: string;
  label: string;
}[] = [
  { key: Locale.KH, label: 'ភាសាខ្មែរ', image: './assets/image/kh_FLAG.png' },
  { key: Locale.EN, label: 'English', image: './assets/image/en_FLAG.png' },
  { key: Locale.ZH, label: '中文', image: './assets/image/ch_FLAG.png' },
];
