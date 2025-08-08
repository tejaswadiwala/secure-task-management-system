import { Component, Input, Output, EventEmitter, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TaskStatus, TaskPriority, TaskCategory } from '@data';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <!-- Modal Overlay -->
    <div *ngIf="isOpen" class="fixed inset-0 z-50 overflow-y-auto">
      <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <!-- Background overlay -->
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" (click)="onClose()"></div>

        <!-- Modal panel -->
        <div class="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
          <!-- Modal Header -->
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-lg font-medium text-gray-900">
              {{ task ? 'Edit Task' : 'Create New Task' }}
            </h3>
            <button
              (click)="onClose()"
              class="rounded-md text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- Form -->
          <form [formGroup]="taskForm" (ngSubmit)="onSubmit()">
            <!-- Title Field -->
            <div class="mb-4">
              <label for="title" class="block text-sm font-medium text-gray-700 mb-1">
                Title *
              </label>
              <input
                id="title"
                type="text"
                formControlName="title"
                placeholder="Enter task title"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                [class.border-red-500]="taskForm.get('title')?.invalid && taskForm.get('title')?.touched"
              />
              <div *ngIf="taskForm.get('title')?.invalid && taskForm.get('title')?.touched" class="mt-1 text-sm text-red-600">
                <span *ngIf="taskForm.get('title')?.errors?.['required']">Title is required</span>
                <span *ngIf="taskForm.get('title')?.errors?.['maxlength']">Title must be less than 200 characters</span>
              </div>
            </div>

            <!-- Description Field -->
            <div class="mb-4">
              <label for="description" class="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                id="description"
                formControlName="description"
                rows="3"
                placeholder="Enter task description"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none"
                [class.border-red-500]="taskForm.get('description')?.invalid && taskForm.get('description')?.touched"
              ></textarea>
              <div *ngIf="taskForm.get('description')?.invalid && taskForm.get('description')?.touched" class="mt-1 text-sm text-red-600">
                <span *ngIf="taskForm.get('description')?.errors?.['maxlength']">Description must be less than 1000 characters</span>
              </div>
            </div>

            <!-- Priority and Category Row -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <!-- Priority Field -->
              <div>
                <label for="priority" class="block text-sm font-medium text-gray-700 mb-1">
                  Priority
                </label>
                <select
                  id="priority"
                  formControlName="priority"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                  <option value="URGENT">Urgent</option>
                </select>
              </div>

              <!-- Category Field -->
              <div>
                <label for="category" class="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  id="category"
                  formControlName="category"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="WORK">Work</option>
                  <option value="PERSONAL">Personal</option>
                  <option value="URGENT">Urgent</option>
                  <option value="MEETING">Meeting</option>
                </select>
              </div>
            </div>

            <!-- Status and Due Date Row -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <!-- Status Field -->
              <div>
                <label for="status" class="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  id="status"
                  formControlName="status"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="todo">To Do</option>
                  <option value="in_progress">In Progress</option>
                  <option value="done">Done</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              <!-- Due Date Field -->
              <div>
                <label for="dueDate" class="block text-sm font-medium text-gray-700 mb-1">
                  Due Date
                </label>
                <input
                  id="dueDate"
                  type="date"
                  formControlName="dueDate"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  [min]="getMinDate()"
                />
              </div>
            </div>

            <!-- Form Actions -->
            <div class="flex justify-end space-x-3">
              <button
                type="button"
                (click)="onClose()"
                class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                [disabled]="taskForm.invalid || isLoading"
                class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span *ngIf="!isLoading">{{ task ? 'Update Task' : 'Create Task' }}</span>
                <span *ngIf="isLoading" class="flex items-center">
                  <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {{ task ? 'Updating...' : 'Creating...' }}
                </span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .modal-backdrop {
      backdrop-filter: blur(2px);
    }
  `]
})
export class TaskFormComponent implements OnInit {
  private fb = inject(FormBuilder);

  @Input() task: any = null;
  @Input() isOpen = false;
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<any>();

  taskForm: FormGroup;
  isLoading = false;

  // Enum access for template
  TaskStatus = TaskStatus;
  TaskPriority = TaskPriority;
  TaskCategory = TaskCategory;

  constructor() {
    this.taskForm = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(200)]],
      description: ['', [Validators.maxLength(1000)]],
      priority: [TaskPriority.MEDIUM],
      category: [TaskCategory.WORK],
      status: [TaskStatus.TODO],
      dueDate: ['']
    });
  }

  ngOnInit(): void {
    if (this.task) {
      this.populateForm();
    }
  }

  populateForm(): void {
    if (this.task) {
      this.taskForm.patchValue({
        title: this.task.title || '',
        description: this.task.description || '',
        priority: this.task.priority || TaskPriority.MEDIUM,
        category: this.task.category || TaskCategory.WORK,
        status: this.task.status || TaskStatus.TODO,
        dueDate: this.task.dueDate ? this.formatDateForInput(this.task.dueDate) : ''
      });
    }
  }

  onSubmit(): void {
    if (this.taskForm.valid) {
      this.isLoading = true;
      
      const formValue = this.taskForm.value;
      const taskData = {
        ...formValue,
        dueDate: formValue.dueDate ? new Date(formValue.dueDate).toISOString() : null
      };

      console.log('Submitting task:', taskData);
      
      // Simulate API call delay
      setTimeout(() => {
        this.save.emit(taskData);
        this.isLoading = false;
      }, 500);
    } else {
      // Mark all fields as touched to show validation errors
      Object.keys(this.taskForm.controls).forEach(key => {
        this.taskForm.get(key)?.markAsTouched();
      });
    }
  }

  onClose(): void {
    this.close.emit();
    this.resetForm();
  }

  resetForm(): void {
    this.taskForm.reset({
      title: '',
      description: '',
      priority: TaskPriority.MEDIUM,
      category: TaskCategory.WORK,
      status: TaskStatus.TODO,
      dueDate: ''
    });
    this.isLoading = false;
  }

  getMinDate(): string {
    const today = new Date();
    return today.toISOString().split('T')[0];
  }

  formatDateForInput(dateString: string): string {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  }
} 