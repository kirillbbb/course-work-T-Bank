import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SortingService {
  constructor() { }

  sortBy(tasks: any[], criteria: string, direction: 'asc' | 'desc'): void {
    tasks.sort((a, b) => {
      let comparison = 0;

      if (criteria === 'priority') {
        const priorityOrder: { [key: string]: number } = { 'high': 3, 'medium': 2, 'low': 1 };
        comparison = priorityOrder[a.priority] - priorityOrder[b.priority];
      } else if (criteria === 'progress') {
        comparison = a.progress - b.progress;
      } else if (criteria === 'endDate') {
        const dateA = a.endDate ? a.endDate.getTime() : 0;
        const dateB = b.endDate ? b.endDate.getTime() : 0;
        comparison = dateA - dateB;
      } else { // 'createdAt' и 'title'
        const valA = a[criteria] ? a[criteria].toString().toLowerCase() : '';
        const valB = b[criteria] ? b[criteria].toString().toLowerCase() : '';
        comparison = valA.localeCompare(valB);
      }

      return direction === 'asc' ? comparison : -comparison;
    });
  }
}
