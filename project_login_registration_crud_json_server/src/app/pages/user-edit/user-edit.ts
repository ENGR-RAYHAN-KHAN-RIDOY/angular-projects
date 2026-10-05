import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Auth } from '../../services/auth';
import { User } from '../../models/user';

@Component({
  imports: [ReactiveFormsModule, RouterLink],
  selector: 'app-user-edit',
  templateUrl: './user-edit.html',
})
export class UserEdit implements OnInit {
  private fb = inject(FormBuilder);
  private auth = inject(Auth);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  private user!: User;   // the user loaded from the server

  form = this.fb.nonNullable.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
  });

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.auth.getUserById(id).subscribe((user) => {
      this.user = user;
      this.form.patchValue({ name: user.name, email: user.email });
    });
  }

  save() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const updated = { ...this.user, ...this.form.getRawValue() };
    this.auth.update(updated.id, updated).subscribe(() => this.router.navigate(['/home']));
  }
}
