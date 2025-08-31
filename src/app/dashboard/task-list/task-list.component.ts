import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatSliderModule } from '@angular/material/slider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDateRangeInput, MatDateRangePicker } from '@angular/material/datepicker';
import { v4 as uuidv4 } from 'uuid';
import { DataService } from '../../services/data.service';
import { SortingService } from '../../services/sorting.service';
import { trigger, transition, style, animate } from '@angular/animations';
import { FileStorageService } from '../../services/file-storage.service';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatListModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    MatSliderModule,
    MatExpansionModule,
    MatIconModule,
    MatMenuModule,
    MatFormFieldModule,
    MatDateRangeInput,
    MatDateRangePicker
  ],
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css'],
  animations: [
    trigger('flyInOut', [
      transition(':leave', [
        style({ opacity: 1, transform: 'translateX(0)' }),
        animate('0.3s ease-out', style({
          opacity: 0,
          height: 0,
          padding: 0,
          margin: 0
        }))
      ])
    ])
  ]
})
export class TaskListComponent implements OnInit {
  @Input() tasks: any[] = [];
  @Input() userId: string | null = null;
  isAddingTask: boolean = false;
  editingTaskId: string | null = null;
  editingTask: any = null;
  currentSort: { criteria: string, direction: 'asc' | 'desc' } = { criteria: 'createdAt', direction: 'asc' };
  newTask: {
    title: string;
    description: string;
    startDate: Date | null;
    endDate: Date | null;
    priority: 'low' | 'medium' | 'high';
    notes: string;
    progress: number;
    completed: boolean;
    status: 'in-progress' | 'completed' | 'overdue';
  } = {
    title: '',
    description: '',
    startDate: null,
    endDate: null,
    priority: 'medium',
    notes: '',
    progress: 0,
    completed: false,
    status: 'in-progress'
  };
  selectedFile: File | null = null;

  constructor(
    private dataService: DataService,
    private sortingService: SortingService,
    private fileStorageService: FileStorageService
  ) {}

  ngOnInit() {
    this.sortBy(this.currentSort.criteria, this.currentSort.direction);
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  async addTask(form: NgForm) {
    if (form.valid && this.userId) {
      if (this.selectedFile) {
        try {
          const fileUrl: string | undefined = await this.fileStorageService.uploadFile(this.selectedFile).toPromise();
          if (fileUrl) {
            await this.dataService.addTask(this.userId!, {
              ...this.newTask,
              createdAt: new Date(),
              id: uuidv4(),
              fileUrl: fileUrl,
              fileName: this.selectedFile.name ?? ''
            });
            console.log('Task added with file URL:', fileUrl);
          } else {
            console.error('File upload failed, fileUrl is undefined.');
          }
        } catch (error) {
          console.error('File upload or task add failed:', error);
        }
      } else {
        await this.dataService.addTask(this.userId, {
          ...this.newTask,
          createdAt: new Date(),
          id: uuidv4()
        });
      }
      this.resetForm(form);
      this.isAddingTask = false;
    }
  }

  async updateTask() {
    if (!this.userId || !this.editingTaskId) {
      console.error('UserId или TaskId отсутствуют.');
      return;
    }
    const updatedData: any = {
      title: this.editingTask.title,
      description: this.editingTask.description,
      startDate: this.editingTask.startDate,
      endDate: this.editingTask.endDate,
      priority: this.editingTask.priority,
      notes: this.editingTask.notes,
      progress: this.editingTask.progress,
      completed: this.editingTask.progress === 100,
      status: this.editingTask.status
    };
    if (this.selectedFile) {
      try {
        const fileUrl: string | undefined = await this.fileStorageService.uploadFile(this.selectedFile).toPromise();
        if (fileUrl) {
          updatedData.fileUrl = fileUrl;
          updatedData.fileName = this.selectedFile.name ?? '';
        } else {
          console.error('File upload failed, fileUrl is undefined.');
        }
      } catch (error) {
        console.error('File upload failed during update:', error);
      }
    }
    await this.dataService.updateTask(this.userId, this.editingTaskId, updatedData);
    this.editingTaskId = null;
    this.editingTask = null;
    this.selectedFile = null;
  }

  editTask(task: any) {
    this.editingTaskId = task.id;
    this.editingTask = { ...task };
  }

  deleteTask(taskId: string) {
    if (this.userId && confirm('Вы уверены, что хотите удалить эту задачу?')) {
      this.dataService.deleteTask(this.userId, taskId);
    }
  }

  async markAsCompleted(task: any) {
    if (this.userId) {
      await this.dataService.updateTask(this.userId, task.id, {
        status: 'completed',
        completed: true,
        progress: 100
      });
    }
  }

  async markAsOverdue(task: any) {
    if (this.userId) {
      await this.dataService.updateTask(this.userId, task.id, {
        status: 'overdue',
        completed: false
      });
    }
  }

  async unmarkTask(task: any) {
    if (this.userId) {
      await this.dataService.updateTask(this.userId, task.id, {
        status: 'in-progress',
        completed: false,
        progress: 0
      });
    }
  }

  resetForm(form: NgForm) {
    form.resetForm();
    this.newTask = {
      title: '',
      description: '',
      startDate: null,
      endDate: null,
      priority: 'medium',
      notes: '',
      progress: 0,
      completed: false,
      status: 'in-progress'
    };
    this.selectedFile = null;
  }

  onCancelEdit() {
    this.editingTaskId = null;
    this.editingTask = null;
    this.selectedFile = null;
  }

  toggleAddTaskForm() {
    this.isAddingTask = !this.isAddingTask;
  }

  formatLabel(value: number): string {
    if (value >= 100) {
      return 'Готово';
    }
    return `${value}%`;
  }

  sortBy(criteria: string, direction: 'asc' | 'desc'): void {
    this.currentSort = { criteria, direction };
    this.sortingService.sortBy(this.tasks, criteria, direction);
  }

  getSortName(): string {
    const names: { [key: string]: string } = {
      'createdAt': 'Дате создания',
      'priority': 'Приоритету',
      'progress': 'Прогрессу',
      'title': 'Имени',
      'endDate': 'Дате окончания'
    };
    const directionText = this.currentSort.direction === 'asc' ? ' (по возрастанию)' : ' (по убыванию)';
    return names[this.currentSort.criteria] + directionText;
  }

  isOverdue(task: any): boolean {
    if (task.endDate && !task.completed) {
      const now = new Date();
      return now > task.endDate;
    }
    return false;
  }

  downloadFile(task: any) {
    if (task.fileUrl) {
      window.open(task.fileUrl, '_blank');
    }
  }

  trackByTask(index: number, task: any): string {
    return task.id;
  }
}
