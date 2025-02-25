import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Observable, tap } from 'rxjs';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  intercept(
    executionContext: ExecutionContext,
    next: CallHandler,
  ): Observable<any> {
    const graphqlContext = GqlExecutionContext.create(executionContext);
    const context = graphqlContext.getContext();
    const operationInfo = graphqlContext.getInfo();

    const operationType = operationInfo.operation.operation.toUpperCase();
    const fieldName = operationInfo.fieldName;
    const requestArguments = graphqlContext.getArgs();
    const authenticatedUser = context.req?.user || { id: 'unauthenticated' };

    this.logger.debug(
      `GraphQL Request:\n${JSON.stringify(
        { operationType, fieldName, authenticatedUser, requestArguments },
        null,
        2,
      )}`,
    );

    const startTimestamp = performance.now();

    return next.handle().pipe(
      tap({
        next: (responseData) => {
          const executionDuration = (
            performance.now() - startTimestamp
          ).toFixed(2);

          this.logger.log(
            `[${operationType}] ${fieldName} - ${executionDuration}ms`,
          );
          this.logger.debug(
            `Response Data:\n${JSON.stringify(responseData, null, 2)}`,
          );
        },
        error: (error) => {
          const executionDuration = (
            performance.now() - startTimestamp
          ).toFixed(2);

          this.logger.error(
            `[${operationType}] ${fieldName} FAILED - ${executionDuration}ms`,
            error.stack,
          );

          this.logger.debug(
            `Error Details:\n${JSON.stringify(error, Object.getOwnPropertyNames(error), 2)}`,
          );
        },
      }),
    );
  }
}
