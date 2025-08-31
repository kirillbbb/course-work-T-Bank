import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { DataService } from '../services/data.service';
import { AuthService } from '../services/auth.service';
import { User } from 'firebase/auth';
import { Chart, registerables } from 'chart.js';
import { Subscription } from 'rxjs';

Chart.register(...registerables);

interface Task {
  title: string;
  description: string;
  startDate: any;
  endDate: any;
  priority: 'low' | 'medium' | 'high';
  notes: string;
  progress: number;
  completed: boolean;
  status: 'in-progress' | 'completed' | 'overdue';
  createdAt: any;
  id: string;
}

@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatListModule,
    MatIconModule
  ],
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.css']
})
export class AnalyticsComponent implements OnInit, OnDestroy {
  tasks: Task[] = [];
  userId: string | null = null;
  totalTasks: number = 0;
  completedTasks: number = 0;
  overdueTasks: number = 0;
  inProgressTasks: number = 0;
  completedPercentage: number = 0;

  priorityLow: number = 0;
  priorityMedium: number = 0;
  priorityHigh: number = 0;

  private tasksSubscription!: Subscription;
  private pieChart: Chart | undefined;
  private barChart: Chart | undefined;

  constructor(
    private dataService: DataService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.authService.getUser().subscribe((user: User | null) => {
      if (user) {
        this.userId = user.uid;
        this.loadTasks();
      }
    });
  }

  ngOnDestroy(): void {
    if (this.tasksSubscription) {
      this.tasksSubscription.unsubscribe();
    }
    if (this.pieChart) {
      this.pieChart.destroy();
    }
    if (this.barChart) {
      this.barChart.destroy();
    }
  }

  loadTasks() {
    if (this.userId) {
      this.tasksSubscription = this.dataService.getTasks(this.userId).subscribe((tasks: Task[]) => {
        if (tasks) {
          this.tasks = tasks;
          this.calculateMetrics();
          this.createCharts();
        }
      });
    }
  }

  calculateMetrics() {
    this.totalTasks = this.tasks.length;
    this.completedTasks = this.tasks.filter(t => t.status === 'completed').length;
    this.overdueTasks = this.tasks.filter(t => t.status === 'overdue').length;
    this.inProgressTasks = this.tasks.filter(t => t.status === 'in-progress').length;

    this.priorityLow = this.tasks.filter(t => t.priority === 'low').length;
    this.priorityMedium = this.tasks.filter(t => t.priority === 'medium').length;
    this.priorityHigh = this.tasks.filter(t => t.priority === 'high').length;

    this.completedPercentage = this.totalTasks > 0
      ? Math.round((this.completedTasks / this.totalTasks) * 100)
      : 0;
  }

  createCharts() {
    if (this.pieChart) {
      this.pieChart.destroy();
    }
    const pieCtx = document.getElementById('tasks-pie-chart') as HTMLCanvasElement;
    if (pieCtx) {
      this.pieChart = new Chart(pieCtx, {
        type: 'doughnut',
        data: {
          labels: ['Выполнено', 'Просрочено', 'В процессе'],
          datasets: [{
            data: [this.completedTasks, this.overdueTasks, this.inProgressTasks],
            backgroundColor: ['#4CAF50', '#F44336', '#FFC107'],
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
        }
      });
    }

    if (this.barChart) {
      this.barChart.destroy();
    }
    const barCtx = document.getElementById('priority-bar-chart') as HTMLCanvasElement;
    if (barCtx) {
      this.barChart = new Chart(barCtx, {
        type: 'bar',
        data: {
          labels: ['Низкий', 'Средний', 'Высокий'],
          datasets: [{
            label: 'Количество задач',
            data: [this.priorityLow, this.priorityMedium, this.priorityHigh],
            backgroundColor: ['#4CAF50', '#FFC107', '#F44336'],
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                stepSize: 1
              }
            }
          }
        }
      });
    }
  }
}
