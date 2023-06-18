import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NewsAPIService {
  idList: any; // Lista degli ID delle storie principali
  counterId: number = 0; // Contatore per tenere traccia dell'ID corrente

  constructor(private http: HttpClient) {}

  topStoriesURL = "https://hacker-news.firebaseio.com/v0/topstories.json";

  /**
   * Ottiene gli ID delle storie principali
   * @returns Un Observable contenente la lista degli ID
   */
  getTopStoriesIDs(): Observable<any> {
    return this.http.get(this.topStoriesURL);
  }

  /**
   * Ottiene le storie principali
   * @returns Un Observable contenente le storie principali
   */
  getTopStories(): Observable<any[]> {
    return this.getTopStoriesIDs().pipe(
      switchMap((response) => {
        this.idList = response as any[];
        const storyObservables: Observable<any>[] = [];

        // Ottiene le prime 10 storie principali
        for (let i = 0; i < 10; i++) {
          const storyId = this.idList[i];
          const storyUrl = `https://hacker-news.firebaseio.com/v0/item/${storyId}.json`;

          storyObservables.push(this.http.get(storyUrl));
          this.counterId++;
        }

        // Combina le richieste in parallelo e restituisce l'Observable risultante
        return forkJoin(storyObservables);
      })
    );
  }

  /**
   * Ottiene ulteriori storie principali
   * @returns Un Observable contenente ulteriori storie principali
   */
  getMoreStories(): Observable<any[]> {
    const storyObservables: Observable<any>[] = [];

    // Ottiene le storie principali successive in base al contatore corrente
    for (let i = this.counterId; i < this.counterId + 10; i++) {
      const storyId = this.idList[i];
      const storyUrl = `https://hacker-news.firebaseio.com/v0/item/${storyId}.json`;

      storyObservables.push(this.http.get(storyUrl));
    }

    this.counterId += 10; // Aggiorna il contatore

    // Combina le richieste in parallelo e restituisce l'Observable risultante
    return forkJoin(storyObservables);
  }
}
