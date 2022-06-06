import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { IIngredientBookmarkIn, IRecipeBookmarkIn } from 'src/app/interfaces/IBookmark';
import { mockIngredientBookmarkList, mockRecipeBookmarkList } from 'src/app/mocks/bookmarkMock';

import { BookmarksService } from './bookmarks.service';

describe('BookmarksService', () => {
  let bookmarkService: BookmarksService
  let httpMock: HttpTestingController
  let url = 'http://localhost:3000/userBookmarks'

  const bookmarkServiceSpy = jasmine.createSpyObj("BookmarkService",
  ['getAllIngredientBookmarks','getAllRecipeBookmarks','updateIngredientBookmark','updateRecipeBookmark'])

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ RouterTestingModule , HttpClientTestingModule ],
      providers:
      [
        {
          provide: BookmarksService
        }
      ]
    });
    bookmarkService = TestBed.inject(BookmarksService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach( () => {
    httpMock.verify()
  })

  it('BookmarkService should be created', () => {
    expect(bookmarkService).toBeTruthy();
  });

  // ================ GET ALL INGREDIENT BOOKMARKS METHOD ========================
  it( 'should getAllIngredientBookmarks method', () => {
    bookmarkServiceSpy.getAllIngredientBookmarks()
    expect(bookmarkServiceSpy.getAllIngredientBookmarks).toHaveBeenCalled();
  });

  it( 'should return all ingredient bookmarks from api via GET method', () => {
    bookmarkService.getAllIngredientBookmarks().subscribe( (bookmarkList) => {
      expect(bookmarkList).toBeDefined()
      expect(bookmarkList).toEqual(mockIngredientBookmarkList)
    })

    const req = httpMock.expectOne(`${url}/ingredient`)

    expect(req.request.method).toBe("GET")

    req.flush(mockIngredientBookmarkList)
  });

  // ================ GET ALL RECIPE BOOKMARKS METHOD ========================
  it( 'should getAllRecipeBookmarks method', () => {
    bookmarkServiceSpy.getAllRecipeBookmarks()
    expect(bookmarkServiceSpy.getAllRecipeBookmarks).toHaveBeenCalled();
  });

  it( 'should return all recipe bookmarks from api via GET method', () => {
    bookmarkService.getAllRecipeBookmarks().subscribe( (bookmarkList) => {
      expect(bookmarkList).toBeDefined()
      expect(bookmarkList).toEqual(mockRecipeBookmarkList)
    })

    const req = httpMock.expectOne(`${url}/recipe`)

    expect(req.request.method).toBe("GET")

    req.flush(mockRecipeBookmarkList)
  });
  // ================ UPDATE INGREDIENT BOOKMARKS METHOD ========================
  it( 'should updateIngredientBookmark method', () => {
    bookmarkServiceSpy.updateIngredientBookmark()
    expect(bookmarkServiceSpy.updateIngredientBookmark).toHaveBeenCalled();
  });

  it( 'should update a user ingredient bookmark from api via PUT method', () => {
    const id = 1
    const bookmark:IIngredientBookmarkIn = 
    {
      ingredientId: 1,
      userId: 1,
      saved: false
    }

    bookmarkService.updateIngredientBookmark(bookmark,id).subscribe( (res) => {
      expect(res).toBeDefined()
    })

    const req = httpMock.expectOne(`${url}/ingredient/${id}`)

    expect(req.request.method).toBe("PUT")

    req.flush([bookmark,id])
  });

  // ================ UPDATE RECIPE BOOKMARKS METHOD ========================
  
  it( 'should updateRecipeBookmark method', () => {
    bookmarkServiceSpy.updateRecipeBookmark()
    expect(bookmarkServiceSpy.updateRecipeBookmark).toHaveBeenCalled();
  });

  it( 'should update a user recipe bookmark from api via PUT method', () => {
    const id = 2
    const bookmark: IRecipeBookmarkIn = 
    {
      recipeId: 2,
      userId: 1,
      saved: false
    }

    bookmarkService.updateRecipeBookmark(bookmark,id).subscribe( (res) => {
      expect(res).toBeDefined()
    })

    const req = httpMock.expectOne(`${url}/recipe/${id}`)

    expect(req.request.method).toBe("PUT")

    req.flush([bookmark,id])
  });
});
