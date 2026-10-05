import { HttpClient } from '@angular/common/http';
import { Service, inject, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, map } from 'rxjs';
import { NewUser, User } from '../models/user';

const STORAGE_KEY = 'auth_user'; // localStorage key name kept in one place

@Service()
export class Auth {
  private http = inject(HttpClient);
  private router = inject(Router);
  private apiUrl = 'http://localhost:3000/users';

  // Logged-in user. Restored from localStorage on refresh
  currentUser = signal<User | null>(this.loadUser());

  // Derived automatically from currentUser: true if a user exists, false otherwise
  isLoggedIn = computed(() => this.currentUser() !== null);

  // 1) Find user by email
  getUserByEmail(email: string): Observable<User[]> {
    // return this.http.get<User[]>(this.apiUrl, { params: { email } });
    return this.http.get<User[]>(`${this.apiUrl}?email=${email}`);
  }

  // Fetch all users: GET /users
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);
  }

  // 2) Save a new user
  register(user: NewUser): Observable<User> {
    return this.http.post<User>(this.apiUrl, user);
  }

  getUserById(id: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id}`);
  }


  update(id: number, user: User): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/${id}`, user);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // 3) Login: find by email and match password. true if matched, false otherwise
  login(email: string, password: string): Observable<boolean> {
    
    // Send both email and password: GET /users?email=..&password=..
    return this.http.get<User[]>(this.apiUrl, { params: { email, password } }).pipe(
      map((users) => {
        // Empty list = no match
        if (users.length === 0) {
          return false;
        }

        // Matched: the first item in the list is our user
        const user = users[0];

        localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
        this.currentUser.set(user);
        return true;
      }),
    );
  }

  // 4) Logout
  logout(): void {
    localStorage.removeItem(STORAGE_KEY);
    this.currentUser.set(null);
    this.router.navigate(['/login']);
  }

  // Read user from localStorage
  private loadUser() {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : null;
  }
}
