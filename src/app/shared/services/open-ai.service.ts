import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OpenAIService {
  private apiUrl = 'https://api.openai.com/v1/completions';  // Use the endpoint you need

  constructor(private http: HttpClient) { }

  generateText(prompt: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer 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`
    });

    const body = {
      model: 'gpt-3.5-turbo-instruct',
      prompt: prompt,
      max_tokens: 100,
      temperature: 0.7
    };

    return this.http.post<any>(this.apiUrl, body, { headers });
  }
}
