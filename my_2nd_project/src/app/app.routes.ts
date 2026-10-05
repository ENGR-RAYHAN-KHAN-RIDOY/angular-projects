import { Routes } from '@angular/router';
import { PostForm } from './posts/post-form/post-form';
import { PostList } from './posts/post-list/post-list';

export const routes: Routes = [
  { path: '', redirectTo: 'posts', pathMatch: 'full' },
  { path: 'posts', component: PostList },
  { path: 'posts/new', component: PostForm },
  { path: 'posts/:id/edit', component: PostForm }
  // { path: 'posts/:id/delete', component: PostList }
];
