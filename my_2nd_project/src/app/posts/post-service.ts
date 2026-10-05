import { HttpClient } from '@angular/common/http';
import { Service, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { NewPost, Post } from './post.model';

@Service()
export class PostService {
  private readonly http = inject(HttpClient);
  private readonly url = 'https://jsonplaceholder.typicode.com/posts';

  getAll(): Observable<Post[]> {
    return this.http.get<Post[]>(this.url);
  }

  getById(id: number): Observable<Post> {
    return this.http.get<Post>(`${this.url}/${id}`);
  }

  create(post: NewPost): Observable<Post> {
    return this.http.post<Post>(this.url, post);
  }

  update(post: Post): Observable<Post> {
    return this.http.put<Post>(`${this.url}/${post.id}`, post);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}
