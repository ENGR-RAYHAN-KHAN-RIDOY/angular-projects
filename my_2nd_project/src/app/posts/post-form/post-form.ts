import { Component, OnInit, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PostService } from '../post-service';

@Component({
  imports: [ReactiveFormsModule, RouterLink],
  selector: 'app-post-form',
  styleUrl: './post-form.css',
  templateUrl: './post-form.html',
})
export class PostForm implements OnInit {
  // Tools we need
  private readonly route = inject(ActivatedRoute); // reads the URL
  private readonly router = inject(Router); // moves to another page
  private readonly postService = inject(PostService); // talks to the API

  // The id of the post we are editing. null means we are creating a new post.
  postId: number | null = null;

  // Error message to show on screen (empty string = no error)
  errorMessage = signal('');

  // The form. Each FormControl is one input box: new FormControl(startValue, rules)
  form = new FormGroup({
    userId: new FormControl(1, { nonNullable: true, validators: [Validators.required] }),
    title: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(3)],
    }),
    body: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
  });

  // Runs once when the page opens
  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id'); // e.g. '5' from /posts/5/edit

    if (id) {
      // Edit mode: get the old post and put its values in the form
      this.postId = Number(id);
      this.postService.getById(this.postId).subscribe((post) => {
        this.form.patchValue(post); // fills the matching form fields
      });
    }
  }

  // Runs when the Save button is clicked
  save(): void {

    // 1. If any rule is broken, show the errors and stop
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.errorMessage.set('');

    // 2. Read the values typed in the form
    const value = this.form.getRawValue(); // { userId, title, body }

    // 3. Edit mode: update the post
    if (this.postId) {
      const post = { id: this.postId, ...value };
      this.postService.update(post).subscribe({
        next: () => this.router.navigate(['/posts']), // go back to the list
        error: () => this.errorMessage.set('Could not save the post.'),
      });
      return;
    }

    // 4. Create mode: create a new post
    this.postService.create(value).subscribe({
      next: () => this.router.navigate(['/posts']), // go back to the list
      error: () => this.errorMessage.set('Could not save the post.'),
    });
  }
}
