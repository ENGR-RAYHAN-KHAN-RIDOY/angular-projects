import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Auth } from '../../services/auth';
import { User } from '../../models/user';

@Component({
  imports: [RouterLink],
  selector: 'app-home',
  styleUrl: './home.css',
  templateUrl: './home.html',
})
export class Home implements OnInit {
  auth = inject(Auth);

  users = signal<User[]>([]);

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.auth.getUsers().subscribe((data) => this.users.set(data));
  }

  deleteUser(user: User) {
    if (confirm(`Delete ${user.name}?`)) {
      this.auth.delete(user.id).subscribe(() => this.loadUsers());
    }
  }
}
