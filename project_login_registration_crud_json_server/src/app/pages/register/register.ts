import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Auth } from '../../services/auth';

@Component({
  imports: [ReactiveFormsModule, RouterLink],
  selector: 'app-register',
  styleUrl: './register.css',
  templateUrl: './register.html',
})
export class Register {
  private fb = inject(FormBuilder);
  private auth = inject(Auth);
  private router = inject(Router);

  error = signal('');

  form = this.fb.nonNullable.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const user = this.form.getRawValue();

    // Step 1: check whether the email already exists
    this.auth.getUserByEmail(user.email).subscribe((found) => {
      if (found.length > 0) {
        this.error.set('This email is already registered');
        return;
      }

      // Step 2: not found, so save it
      this.auth.register(user).subscribe(() => {
        // logged-in user came from the home page, so go back there
        this.router.navigate([this.auth.isLoggedIn() ? '/home' : '/login']);
      });
    });
  }
}
