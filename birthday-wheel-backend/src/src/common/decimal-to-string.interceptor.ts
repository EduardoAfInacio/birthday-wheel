import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Decimal } from '@prisma/client/runtime/library';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class DecimalToStringInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(map((data) => this.transformData(data)));
  }

  private transformData(data: any): any {
    if (!data) return data;

    if (Decimal.isDecimal(data) || data instanceof Decimal) {
      return data.toString();
    }

    if (Array.isArray(data)) {
      return data.map((item) => this.transformData(item));
    }

    if (typeof data === 'object' && data !== null) {
      // Se for Date, deixa quieto (JSON.stringify cuida)
      if (data instanceof Date) return data;

      const newData = {};
      for (const key in data) {
        if (Object.prototype.hasOwnProperty.call(data, key)) {
          newData[key] = this.transformData(data[key]);
        }
      }
      return newData;
    }
    return data;
  }
}
