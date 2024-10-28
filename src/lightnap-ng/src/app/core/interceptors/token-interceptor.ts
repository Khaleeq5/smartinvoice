import { HttpEvent, HttpHandlerFn, HttpRequest } from "@angular/common/http";
import { inject } from "@angular/core";
import { API_URL_ROOT } from "@core";
import { IdentityService } from "@identity";
import { Observable } from "rxjs";

export function tokenInterceptor(request: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
  const apiUrlRoot = inject(API_URL_ROOT);
  const identityService = inject(IdentityService);

  if (request.url.startsWith(apiUrlRoot)) {
    const token = identityService.getBearerToken();
    if (token) {
      return next(
        request.clone({
          headers: request.headers.set("Authorization", token),
          withCredentials: true,
        })
      );
    }
  }

  return next(request);
}
