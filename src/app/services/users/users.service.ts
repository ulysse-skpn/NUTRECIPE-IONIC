import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { tap , catchError, retry } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { IUser, IUserIn, IUserOut } from 'src/app/interfaces/IUser';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(
    private http:HttpClient
  ) { }


  private host = environment.host
  private port = environment.port

  getSizeArrayUsers():Observable<any>
  {
    const url = `http://${this.host}:${this.port}/users/size`
    return this.http.get(url)
    .pipe(
      tap( (data:any) => {
        console.log(data)
      }),
      retry(1),
      catchError(this.handleError)
    )
  }

  getAllUsers(pageIndex:number,pageSize:number):Observable<IUserOut[]>
  {
    const url = `http://${this.host}:${this.port}/users/pagination`
    return this.http.post<IUserOut[]>(url,{pageIndex,pageSize})
    .pipe(
      tap( (data:IUserOut[]) => {
        console.log(data)
      }),
      retry(1),
      catchError(this.handleError)
    )
  }

  getUserById(id:number):Observable<IUser>
  {
    const url = `http://${this.host}:${this.port}/users/${id}`
    return this.http.get<IUser>(url)
    .pipe(
      tap( (data:IUser) => {
        console.log(data)
      }),
      retry(1),
      catchError(this.handleError)
    )
  }

  addUser(user:IUserIn):Observable<IUserOut>
  {
    const url = `http://${this.host}:${this.port}/users`
    return this.http.post<IUserOut>(url,user)
    .pipe(
      tap( (data:any) => console.log(data) ),
      retry(1),
      catchError(this.handleError)
    )
  }

  updateUser(user:IUserIn,id:number):Observable<any>
  {
    const url = `http://${this.host}:${this.port}/users/${id}`
    return this.http.put<any>(url,user)
    .pipe(
      tap( (data:any) => console.log(data) ),
      retry(1),
      catchError(this.handleError)
    )
  }

  deleteUser(id:number):Observable<any>
  {
    const url = `http://${this.host}:${this.port}/users/${id}`
    return this.http.delete(url)
    .pipe(
      tap( (data:any) => console.log(data) ),
      retry(1),
      catchError(this.handleError)
    )
  }

  private handleError(error:any)
  {
    let errorMessage = ""

    if( error.error instanceof ErrorEvent ) errorMessage = `Error : ${error.error.message}`
    else errorMessage = `Error code : ${error.status} \t Message : ${error.message}`

    console.log(errorMessage);

    return throwError( () => {
      return errorMessage
    })
  }
}
