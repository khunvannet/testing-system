import {
  AbstractControl,
  UntypedFormControl,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { Observable, Observer } from 'rxjs';

export type MyErrorsOptions = { km: string; en: string };
export type MyValidationErrors = Record<string, MyErrorsOptions>;

export class CustomValidators extends Validators {
  static autoTips: Record<string, Record<string, string>> = {
    km: {
      required: 'ទាមទារការបញ្ចូល!',
    },
    en: {
      required: 'Input is required!',
    },
    default: {},
  };

  static emailValidator(control: AbstractControl): ValidationErrors | null {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    const isValid = emailPattern.test(control.value);

    if (!isValid) {
      return {
        emailValidator: {
          km: `អុីមែលមិនត្រឹមត្រូវ!`,
          en: `Email is not valid!`,
        },
      };
    }

    return null;
  }

  static nameExistValidator(
    service: any,
    id: number = 0,
    parentId: number = 0
  ): any {
    return (control: UntypedFormControl) =>
      new Observable((observer: Observer<Validators | null>) => {
        if (id && !(control.value && control.dirty)) {
          observer.next(null);
          observer.complete();
          return;
        }

        setTimeout(() => {
          if (control.value && control.status) {
            const params = [];
            if (parentId) {
              params.push({
                key: 'parentId',
                val: parentId,
              });
            }
            service.exist(control.value, id, params).subscribe({
              next: (result: boolean) => {
                if (result) {
                  observer.next({
                    duplicated: {
                      km: 'ឈ្មោះមានរួចហើយ!',
                      en: 'Name already exists!',
                    },
                  });
                } else {
                  observer.next(null);
                }
                observer.complete();
              },
              error: (error: any) => {
                console.error('Error checking name existence:', error);
                observer.complete();
              },
            });
          }
        }, 600);
      });
  }
  static codeExistValidator(
    service: any,
    id: number = 0,
    parentId: number = 0
  ): any {
    return (control: UntypedFormControl) =>
      new Observable((observer: Observer<Validators | null>) => {
        if (id) {
          if (!(control.value && control.dirty)) {
            observer.next(null);
            observer.complete();
            return;
          }
        }
        setTimeout(() => {
          if (control.value && control.status) {
            const params = [
              {
                key: 'code',
                val: control.value,
              },
            ];
            if (parentId) {
              params.push({
                key: 'parentId',
                val: parentId,
              });
            }
            service.exist('', id, params).subscribe((result: boolean) => {
              if (result) {
                observer.next({
                  duplicated: {
                    km: 'កូដមានរួចហើយ!',
                    en: 'Code already exists!',
                  },
                });
              } else {
                observer.next(null);
              }
              observer.complete();
            });
          }
        }, 600);
      });
  }
}
