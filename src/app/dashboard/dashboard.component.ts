import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { DataService } from '../services/data.service';
import { AuthService } from '../services/auth.service';
import { Router, RouterModule } from '@angular/router';
import { TaskListComponent } from './task-list/task-list.component';
import { CalendarComponent } from './calendar/calendar.component';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatButtonModule,
    MatExpansionModule,
    RouterModule,
    TaskListComponent,
    CalendarComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  tasks: any[] = [];
  userId: string | null = null;

  constructor(
    public authService: AuthService,
    private dataService: DataService,
    private router: Router,
  ) {}

  ngOnInit() {
    this.authService.getUser().subscribe(user => {
      if (user) {
        this.userId = user.uid;
        this.loadTasks();
      } else {
        this.router.navigate(['/login']);
      }
    });
  }

  loadTasks() {
    if (this.userId) {
      this.dataService.getTasks(this.userId).subscribe(tasks => {
        if (tasks) {
          this.tasks = tasks
            .filter(task => task.status !== 'completed' && task.status !== 'overdue')
            .map(task => ({
              ...task,
              startDate: task.startDate ? task.startDate.toDate() : null,
              endDate: task.endDate ? task.endDate.toDate() : null
            }));
        }
      });
    }
  }
}
