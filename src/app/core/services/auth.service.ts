import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs/Observable';
import { Response } from '@angular/http';
import { HttpService } from './http';
import { AppState } from '../../interfaces';
import { Store } from '@ngrx/store';
import { AuthActions } from '../../auth/actions/auth.actions';

@Injectable()
export class AuthService {

  /**
   * Creates an instance of AuthService.
   * @param {HttpService} http
   * @param {AuthActions} actions
   * @param {Store<AppState>} store
   *
   * @memberof AuthService
   */
  constructor(
    private http: HttpService,
    private actions: AuthActions,
    private store: Store<AppState>
  ) {

  }

  /**
   *
   *
   * @param {any} data
   * @returns {Observable<any>}
   *
   * @memberof AuthService
   */
  login(data): Observable<any> {
    return this.http.post(
      '/login', { data }).map((res: Response) => {
        data = res.json();
        if (!data.error) {
        // Setting token after login
        this.setTokenInLocalStorage(data);
        this.store.dispatch(this.actions.loginSuccess());
      } else {
        this.http.loading.next({
          loading: false,
          hasError: true,
          hasMsg: 'Please enter valid Credentials'
        });
      }
      return data;
    });
  }

  /**
   *
   *
   * @param {any} data
   * @returns {Observable<any>}
   *
   * @memberof AuthService
   */
  register(data): Observable<any> {
    return this.http.post(
      '/registerUser', {data}).map((res: Response) => {
        data = res.json();
        if (!data.errors) {
          // Setting token after login
          this.setTokenInLocalStorage(res.json());
          this.store.dispatch(this.actions.loginSuccess());
        } else {
          this.http.loading.next({
            loading: false,
            hasError: true,
            hasMsg: 'Please enter valid Credentials'
          });
        }
        return res.json();
      });
  }

  /**
   *
   *
   * @returns {Observable<any>}
   *
   * @memberof AuthService
   */
  authorized(): Observable<any> {
    return this.http
      .get('/user')
      .map((res: Response) => res.json());
  }

  /**
   *
   *
   * @returns
   *
   * @memberof AuthService
   */
  logout() {
    localStorage.removeItem('user');
    this.store.dispatch(this.actions.logoutSuccess());
    return true;
  }

  /**
   *
   *
   * @private
   * @param {any} user_data
   *
   * @memberof AuthService
   */
  private setTokenInLocalStorage(user_data): void {
    const jsonData = JSON.stringify(user_data);
    localStorage.setItem('user', jsonData);
  }
}
