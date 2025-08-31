import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FileStorageService {
  private cloudinaryUrl = 'https://api.cloudinary.com/v1_1/dxnscrtp5/upload';
  private uploadPreset = 'my_unsigned_upload';

  constructor(private http: HttpClient) { }

  uploadFile(file: File): Observable<string> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', this.uploadPreset);

    return this.http.post(this.cloudinaryUrl, formData).pipe(
      map((response: any) => response.secure_url)
    );
  }
}
