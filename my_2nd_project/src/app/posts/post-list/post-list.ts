import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Post } from '../post.model';
import { PostService } from '../post-service';

@Component({
  imports: [RouterLink],
  selector: 'app-post-list',
  styleUrl: './post-list.css',
  templateUrl: './post-list.html',
})
export class PostList implements OnInit {
  private readonly postService = inject(PostService);

  protected readonly posts = signal<Post[]>([]);
  protected readonly loading = signal(true);
  protected readonly error = signal<string | null>(null);

  ngOnInit(): void {
    this.loadPosts();
  }

  protected deletePost(post: Post): void {
    if (!confirm(`Delete "${post.title}"?`)) return;

    this.postService.delete(post.id).subscribe({
      next: () => this.posts.update((posts) => posts.filter((p) => p.id !== post.id)),
      error: () => this.error.set('Failed to delete post. Please try again.'),
    });
  }

  protected loadPosts(): void {
    this.loading.set(true);
    this.error.set(null);
    this.postService.getAll().subscribe({
      next: (posts) => {
        this.posts.set(posts);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Failed to load posts. Please try again later.');
        this.loading.set(false);
      },
    });
  }
}
