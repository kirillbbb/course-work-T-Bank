import { Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
  collectionData,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';

// 💡 Новый интерфейс для расписания
export interface Schedule {
  id: string;
  title: string;
  notes: string;
  startDate: any;
  endDate: any;
  location: string;
  createdAt: any;
}

@Injectable({
  providedIn: 'root',
})
export class DataService {
  constructor(private firestore: Firestore) {}

  async addTask(userId: string, task: any): Promise<any> {
    const tasksCollection = collection(this.firestore, `users/${userId}/tasks`);
    return await addDoc(tasksCollection, task);
  }

  getTasks(userId: string): Observable<any[]> {
    const tasksCollection = collection(this.firestore, `users/${userId}/tasks`);
    return collectionData(tasksCollection, { idField: 'id' });
  }

  updateTask(userId: string, taskId: string, task: any): Promise<void> {
    const taskDoc = doc(this.firestore, `users/${userId}/tasks`, taskId);
    return updateDoc(taskDoc, task);
  }

  deleteTask(userId: string, taskId: string): Promise<void> {
    const taskDoc = doc(this.firestore, `users/${userId}/tasks`, taskId);
    return deleteDoc(taskDoc);
  }


}
