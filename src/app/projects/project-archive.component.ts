import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { DataService } from '../services/data.service';
import { AuthService } from '../services/auth.service';
import { FileStorageService } from '../services/file-storage.service';

@Component({
  selector: 'app-project-archive',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatExpansionModule,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './project-archive.component.html',
  styleUrls: ['./project-archive.component.css']
})
export class ProjectArchiveComponent implements OnInit {
  archivedTasks: any[] = [];
  userId: string | null = null;

  constructor(
    private dataService: DataService,
    private authService: AuthService,
    private fileStorageService: FileStorageService
  ) {}

  ngOnInit() {
    this.authService.getUser().subscribe(user => {
      if (user) {
        this.userId = user.uid;
        this.loadArchivedTasks();
      }
    });
  }

  loadArchivedTasks() {
    if (this.userId) {
      this.dataService.getTasks(this.userId).subscribe(tasks => {
        this.archivedTasks = tasks.map(task => ({
          ...task,
          startDate: task.startDate ? task.startDate.toDate() : null,
          endDate: task.endDate ? task.endDate.toDate() : null
        }));
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

  deleteTask(taskId: string) {
    if (this.userId && confirm('Вы уверены, что хотите удалить эту задачу?')) {
      this.dataService.deleteTask(this.userId, taskId);
    }
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
