// src/common/interceptors/http-metrics.interceptor.ts
import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
  } from '@nestjs/common';
  import { Observable, tap } from 'rxjs';
  import { InjectMetric } from '@willsoto/nestjs-prometheus';
  import { Counter, Histogram } from 'prom-client';
  
  @Injectable()
  export class HttpMetricsInterceptor implements NestInterceptor {
    constructor(
      @InjectMetric('http_requests_total')
      private counter: Counter<string>,
      @InjectMetric('http_request_duration_seconds')
      private histogram: Histogram<string>,
    ) {}
  
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
      const req = context.switchToHttp().getRequest();
      const method = req.method;
      const route = req.url;
      const res = context.switchToHttp().getResponse();
      const start = Date.now();
  
      return next.handle().pipe(
        tap(() => {
          const status = res.statusCode;
          this.counter.inc({ method, route, status });
          const elapsed = (Date.now() - start) / 1000;
          this.histogram.observe({ method, route, status }, elapsed);
        }),
      );
    }
  }
  