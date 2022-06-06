import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, retry, tap } from 'rxjs/operators';
import { IIngredientBookmarkOut, IRecipeBookmarkOut } from 'src/app/interfaces/IBookmark';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BookmarksService {

  constructor(
    private http:HttpClient
  ) { }

  private host = environment.host
  private port = environment.port

  getAllIngredientBookmarks():Observable<IIngredientBookmarkOut[]>
  {
    const url = `http://${this.host}:${this.port}/userBookmarks/ingredient`
    return this.http.get<IIngredientBookmarkOut[]>(url)
    .pipe(
      tap( (data:IIngredientBookmarkOut[]) => {
        console.log(data)
      }),
      retry(1),
      catchError(this.handleError)
    )
  }


  updateIngredientBookmark(bookmark:any,id:number):Observable<any>
  {    
    const url = `http://${this.host}:${this.port}/userBookmarks/ingredient/${id}`
    return this.http.put<any>(url,bookmark)
    .pipe(
      tap( (data:any) => console.log(data) ),
      retry(1),
      catchError(this.handleError)
    )
  }


  getAllRecipeBookmarks():Observable<IRecipeBookmarkOut[]>
  {
    const url = `http://${this.host}:${this.port}/userBookmarks/recipe`
    return this.http.get<IRecipeBookmarkOut[]>(url)
    .pipe(
      tap( (data:IRecipeBookmarkOut[]) => {
        console.log(data)
      }),
      retry(1),
      catchError(this.handleError)
    )
  }


  updateRecipeBookmark(bookmark:any,id:number):Observable<any>
  {    
    const url = `http://${this.host}:${this.port}/userBookmarks/recipe/${id}`
    return this.http.put<any>(url,bookmark)
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
