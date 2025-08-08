import { Route } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

export const appRoutes: Route[] = [
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadComponent: () => import('./auth/login.component').then(c => c.LoginComponent)
  },
  {
    path: 'dashboard',
    canActivate: [AuthGuard],
    loadComponent: () => import('./tasks/task-list.component').then(c => c.TaskListComponent)
  },
  {
    path: 'tasks',
    canActivate: [AuthGuard],
    loadComponent: () => import('./tasks/task-list.component').then(c => c.TaskListComponent)
  },

  {
    path: '**',
    redirectTo: '/dashboard'
  }
];
