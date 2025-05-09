import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { baseUrlAI } from '../../environments/enviroment.local';
import { Observable, timer, of, throwError, EMPTY } from 'rxjs';
import { map, switchMap, filter, take, catchError } from 'rxjs/operators';

import { DiseaseResponse } from '../interface/dlmodel';

@Injectable({
  providedIn: 'root',
})
export class AIService {
  constructor(private _HttpClient: HttpClient) {}
  baseUrlDotNet = 'http://localhost:5001/plants/';
  // baseUrlDotNet = 'http://localhost:5001/';
  getDLPredection = (formData: FormData): Observable<DiseaseResponse> => {
    return this._HttpClient.post<DiseaseResponse>(
      this.baseUrlDotNet + 'PlantDetection/predict-image/',
      formData
    );
  };

  getCVImagePrediction = (formData: FormData): Observable<any> => {
    return this._HttpClient.post<any>(
      this.baseUrlDotNet + 'WeedDetection/predict-image/',
      formData
    );
  };

  getCVImagePrediction2 = (formData: FormData): Observable<any> => {
    return this._HttpClient.post<any>(
      this.baseUrlDotNet + 'PestDetection/predict-image/',
      formData
    );
  };

  getCVVideoPredection(
    formData: FormData
  ): Observable<{ message: string; filename: string }> {
    return this._HttpClient.post<{ message: string; filename: string }>(
      this.baseUrlDotNet + 'WeedDetection/predict-video/',
      formData
    );
  }

  getCVVideoPredection2(
    formData: FormData
  ): Observable<{ message: string; filename: string }> {
    return this._HttpClient.post<{ message: string; filename: string }>(
      this.baseUrlDotNet + 'PestDetection/predict-video/',
      formData
    );
  }

  getVideoStatusCV(
    filename: string
  ): Observable<'processing' | 'ready' | 'not_found'> {
    return this._HttpClient.get<{ status: 'processing' | 'ready' | 'not_found' }>(
        `${this.baseUrlDotNet}WeedDetection/status-video/${filename}`
      )
      .pipe(map(resp => resp.status),
            catchError(() => of<'processing' | 'ready' | 'not_found'>('not_found'))
      );
  }

  getVideoStatusCV2(
    filename: string
  ): Observable<'processing' | 'ready' | 'not_found'> {
    return this._HttpClient.get<{ status: 'processing' | 'ready' | 'not_found' }>(
        `${this.baseUrlDotNet}PestDetection/status-video/${filename}`
      )
      .pipe(map(resp => resp.status),
            catchError(() => of<'processing' | 'ready' | 'not_found'>('not_found'))
      );
  }

  fetchProcessedVideoCV(file: File): Observable<Blob> {
    const fd = new FormData();
    fd.append('file', file, file.name);
    return this._HttpClient.post(
      `${this.baseUrlDotNet}WeedDetection/get-result-video/`,
      fd,
      { responseType: 'blob' }
    );
  }

  fetchProcessedVideoCV2(file: File): Observable<Blob> {
    const fd = new FormData();
    fd.append('file', file, file.name);
    return this._HttpClient.post(
      `${this.baseUrlDotNet}PestDetection/get-result-video/`,
      fd,
      { responseType: 'blob' }
    );
  }

  pollForProcessedImageCV(
    file: any,
    maxAttempts = 15,
    intervalMs = 10000
  ): Observable<Blob> {
    let attempts = 0;
    return new Observable<Blob>((observer) => {
      const poll = () => {
        const formData = new FormData();
        formData.append('file', file, file.name);
        this._HttpClient.post(
            `${this.baseUrlDotNet}WeedDetection/get-result-image/`, formData,
            {
            responseType: 'blob',
          })
          .subscribe({
            next: (blob: Blob) => {
              observer.next(blob);
              observer.complete(); // stop polling on success
            },
            error: () => {
              if (++attempts < maxAttempts) {
                setTimeout(poll, intervalMs); // retry
              } else {
                observer.error('Processing timeout or failed.');
              }
            },
          });
      };
      poll();
    });
  }

  pollForProcessedImageCV2(
    file: any,
    maxAttempts = 15,
    intervalMs = 10000
  ): Observable<Blob> {
    let attempts = 0;
    return new Observable<Blob>((observer) => {
      const poll = () => {
        const formData = new FormData();
        formData.append('file', file, file.name);
        this._HttpClient
          .post(`${this.baseUrlDotNet}PestDetection/get-result-image/`, formData, {
            responseType: 'blob',
          })
          .subscribe({
            next: (blob: Blob) => {
              observer.next(blob);
              observer.complete(); // stop polling on success
            },
            error: () => {
              if (++attempts < maxAttempts) {
                setTimeout(poll, intervalMs); // retry
              } else {
                observer.error('Processing timeout or failed.');
              }
            },
          });
      };
      poll();
    });
  }

  pollForProcessedVideoCV(
    file: any,
    maxAttempts = 25,
    intervalMs = 20000
  ): Observable<Blob> {
    const filename = file.name;
    return timer(0, intervalMs).pipe(
      take(maxAttempts),                         // give up after N polls
      switchMap(() => this.getVideoStatusCV(filename)),
      filter(status => status === 'ready'),      // only proceed once ready
      take(1),                                   // then complete this stream
      switchMap(() => this.fetchProcessedVideoCV(file)),
      catchError(err => throwError(() => new Error('Video processing failed or timed out')))
    );
  }

  pollForProcessedVideoCV2(
    file: any,
    maxAttempts = 25,
    intervalMs = 20000
  ): Observable<Blob> {
    const filename = file.name;
    return timer(0, intervalMs).pipe(
      take(maxAttempts),                         // give up after N polls
      switchMap(() => this.getVideoStatusCV2(filename)),
      filter(status => status === 'ready'),      // only proceed once ready
      take(1),                                   // then complete this stream
      switchMap(() => this.fetchProcessedVideoCV2(file)),
      catchError(err => throwError(() => new Error('Video processing failed or timed out')))
    );
  }

  pollForProcessedImageDL(
    file: any,
    maxAttempts = 15,
    intervalMs = 10000
  ): Observable<Blob> {
    let attempts = 0;
    return new Observable<Blob>((observer) => {
      const poll = () => {
        const formData = new FormData();
        formData.append('file', file, file.name);
        this._HttpClient.post(
            `${this.baseUrlDotNet}PlantDetection/get-result-image/`
            ,formData, {
            responseType: 'blob',
          })
          .subscribe({
            next: (blob: Blob) => {
              observer.next(blob);
              observer.complete(); // stop polling on success
            },
            error: () => {
              if (++attempts < maxAttempts) {
                setTimeout(poll, intervalMs); // retry
              } else {
                observer.error('Processing timeout or failed.');
              }
            },
          });
      };
      poll();
    });
  }
}
