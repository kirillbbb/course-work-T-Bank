import { Component, Input, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions, EventInput } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { MatExpansionModule } from '@angular/material/expansion';
import { Schedule } from '../../services/data.service';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [
    CommonModule,
    FullCalendarModule,
    MatExpansionModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule
  ],
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnChanges {
  @Input() tasks: any[] = [];
  @Input() schedules: Schedule[] = [];
  @Output() dateClick: EventEmitter<Date> = new EventEmitter<Date>(); // 💡 Событие для передачи даты

  calendarOptions: CalendarOptions;

  constructor() {
    this.calendarOptions = {
      initialView: 'dayGridMonth',
      plugins: [dayGridPlugin, interactionPlugin],
      weekends: true,
      events: [],
      dateClick: this.handleDateClick.bind(this),
      // 💡 Эта опция полностью убирает отображение времени для всех событий.
      eventTimeFormat: () => '',
    };
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ((changes['tasks'] && this.tasks) || (changes['schedules'] && this.schedules)) {
      this.updateCalendarEvents();
    }
  }

  updateCalendarEvents() {
    const priorityColors: { [key: string]: string } = {
      'low': '#4CAF50',
      'medium': '#FFC107',
      'high': '#F44336'
    };

    const taskEvents: EventInput[] = this.tasks.map(task => ({
      title: task.title,
      start: task.startDate,
      end: task.endDate,
      color: priorityColors[task.priority] || '#3788d8'
    }));

    const scheduleEvents: EventInput[] = this.schedules.map(schedule => ({
      title: schedule.title,
      start: schedule.startDate,
      end: schedule.endDate,
      color: '#00B0FF'
    }));

    this.calendarOptions.events = [...taskEvents, ...scheduleEvents];
  }

  handleDateClick(arg: any) {
    this.dateClick.emit(new Date(arg.date));
  }
}
