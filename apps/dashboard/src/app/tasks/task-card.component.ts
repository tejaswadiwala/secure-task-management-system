import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-task-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="task-card task-card-hover group">
      <!-- Task Header -->
      <div class="flex-between mb-3">
        <h3 class="font-semibold text-gray-900 truncate pr-2">{{ task.title }}</h3>
        <div class="flex items-center gap-2">
          <div [class]="getPriorityClass(task.priority)" class="priority-indicator"></div>
          <!-- Actions Menu -->
          <div class="relative">
            <button
              (click)="showActions = !showActions"
              class="p-1 rounded-full hover:bg-gray-100 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
            >
              <svg class="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z"/>
              </svg>
            </button>
            <!-- Actions Dropdown -->
            <div
              *ngIf="showActions"
              class="absolute right-0 top-8 w-32 bg-white rounded-md shadow-lg border border-gray-200 z-10"
              (click)="showActions = false"
            >
              <button
                (click)="onEdit()"
                class="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-t-md"
              >
                Edit
              </button>
              <button
                (click)="onDelete()"
                class="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-b-md"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Task Description -->
      <p class="text-gray-600 mb-4 text-sm leading-relaxed line-clamp-3">
        {{ task.description || 'No description provided' }}
      </p>

      <!-- Task Category -->
      <div *ngIf="task.category" class="mb-3">
        <span [class]="getCategoryClass(task.category)" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium">
          {{ task.category }}
        </span>
      </div>

      <!-- Task Footer -->
      <div class="flex-between">
        <!-- Status Badge -->
        <div class="relative">
          <select
            [value]="task.status"
            (change)="onStatusChange($event)"
            [class]="getStatusClass(task.status)"
            class="status-badge appearance-none pr-6 cursor-pointer"
          >
            <option value="TODO">TODO</option>
            <option value="IN_PROGRESS">IN PROGRESS</option>
            <option value="REVIEW">REVIEW</option>
            <option value="DONE">DONE</option>
            <option value="BLOCKED">BLOCKED</option>
          </select>
          <svg class="absolute right-1 top-1/2 transform -translate-y-1/2 w-3 h-3 text-white pointer-events-none" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd"/>
          </svg>
        </div>

        <!-- Due Date -->
        <div class="text-right">
          <span *ngIf="task.dueDate" [class]="getDueDateClass(task.dueDate)" class="text-xs">
            {{ formatDueDate(task.dueDate) }}
          </span>
          <span *ngIf="!task.dueDate" class="text-xs text-gray-400">
            No due date
          </span>
        </div>
      </div>

      <!-- Progress Bar (if applicable) -->
      <div *ngIf="task.status === 'IN_PROGRESS'" class="mt-3">
        <div class="w-full bg-gray-200 rounded-full h-1.5">
          <div class="bg-primary-600 h-1.5 rounded-full transition-all duration-300" [style.width.%]="getProgressPercentage()"></div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .task-card {
      @apply bg-white rounded-lg p-4 shadow-sm border border-gray-200 transition-all duration-200;
    }
    
    .task-card-hover:hover {
      @apply shadow-md border-gray-300 transform -translate-y-1;
    }
    
    .flex-between {
      @apply flex items-center justify-between;
    }
    
    .priority-indicator {
      @apply w-3 h-3 rounded-full;
    }
    
    .status-badge {
      @apply px-2.5 py-1 rounded-full text-xs font-medium text-white;
    }
    
    .line-clamp-3 {
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
  `]
})
export class TaskCardComponent {
  @Input() task: any = {};
  @Output() edit = new EventEmitter<any>();
  @Output() delete = new EventEmitter<string>();
  @Output() statusChange = new EventEmitter<{taskId: string, status: string}>();

  showActions = false;

  onEdit(): void {
    this.edit.emit(this.task);
  }

  onDelete(): void {
    this.delete.emit(this.task.id);
  }

  onStatusChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const newStatus = target.value;
    this.statusChange.emit({ taskId: this.task.id, status: newStatus });
  }

  getPriorityClass(priority: string): string {
    const priorityClasses = {
      'LOW': 'bg-priority-low',
      'MEDIUM': 'bg-priority-medium', 
      'HIGH': 'bg-priority-high',
      'URGENT': 'bg-priority-urgent'
    };
    return priorityClasses[priority as keyof typeof priorityClasses] || 'bg-gray-400';
  }

  getStatusClass(status: string): string {
    const statusClasses = {
      'TODO': 'bg-status-todo',
      'IN_PROGRESS': 'bg-status-progress',
      'REVIEW': 'bg-status-review', 
      'DONE': 'bg-status-done',
      'BLOCKED': 'bg-status-blocked'
    };
    return statusClasses[status as keyof typeof statusClasses] || 'bg-gray-500';
  }

  getCategoryClass(category: string): string {
    const categoryClasses = {
      'WORK': 'bg-blue-100 text-blue-800',
      'PERSONAL': 'bg-green-100 text-green-800',
      'URGENT': 'bg-red-100 text-red-800',
      'MEETING': 'bg-purple-100 text-purple-800'
    };
    return categoryClasses[category as keyof typeof categoryClasses] || 'bg-gray-100 text-gray-800';
  }

  getDueDateClass(dueDate: string): string {
    const today = new Date();
    const due = new Date(dueDate);
    const diffDays = Math.ceil((due.getTime() - today.getTime()) / (1000 * 3600 * 24));
    
    if (diffDays < 0) return 'text-red-600 font-medium'; // Overdue
    if (diffDays === 0) return 'text-orange-600 font-medium'; // Due today
    if (diffDays <= 3) return 'text-yellow-600'; // Due soon
    return 'text-gray-500'; // Normal
  }

  formatDueDate(dueDate: string): string {
    const date = new Date(dueDate);
    const today = new Date();
    const diffDays = Math.ceil((date.getTime() - today.getTime()) / (1000 * 3600 * 24));
    
    if (diffDays < 0) return `${Math.abs(diffDays)} days overdue`;
    if (diffDays === 0) return 'Due today';
    if (diffDays === 1) return 'Due tomorrow';
    if (diffDays <= 7) return `Due in ${diffDays} days`;
    
    return date.toLocaleDateString();
  }

  getProgressPercentage(): number {
    // Simple progress calculation based on status
    if (this.task.status === 'TODO') return 0;
    if (this.task.status === 'IN_PROGRESS') return 50;
    if (this.task.status === 'REVIEW') return 75;
    if (this.task.status === 'DONE') return 100;
    return 25; // Default for other statuses
  }
} 