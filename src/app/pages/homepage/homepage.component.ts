import { Component, OnInit } from '@angular/core';
import { NewsAPIService } from 'src/app/services/news-api.service';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss']
})
export class HomepageComponent implements OnInit {

  topStories: any[] = []; // Array che conterrà le storie principali
  cardsLoaded: boolean = false;

  ngOnInit(): void {
    this.getTopStories(); // Richiama la funzione per ottenere le storie principali all'inizializzazione del componente
  }

  constructor(private api: NewsAPIService) {} // Inietta il servizio NewsAPIService nel componente

  /**
   * Ottiene le storie principali dal servizio API
   */
  getTopStories() {
    this.api.getTopStories().subscribe((data: any) => {
      this.cardsLoaded = false;
      this.topStories = data; // Assegna i dati ottenuti alle storie principali
      this.cardsLoaded = true;
    });
  }

  /**
   * Carica ulteriori storie principali
   */
  loadMore() {
    this.api.getMoreStories().subscribe((data: any) => {
      this.topStories = this.topStories.concat(data); // Aggiunge le storie ottenute alla lista corrente delle storie principali
    });
  }

  /**
   * Converte un timestamp Unix in una data leggibile
   * @param timestamp Il timestamp Unix da convertire
   * @returns La data formattata nel formato "dd/MM/yyyy"
   */
  convertUnixTimestamp(timestamp: number): string {
    const date = new Date(timestamp * 1000); // Moltiplica per 1000 per convertire in millisecondi

    // Formatta la data nel formato desiderato
    const formattedDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;

    return formattedDate;
  }
}
