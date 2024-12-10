import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';

interface WeatherData {
  name: string;
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
    pressure: number;
  };
  weather: Array<{
    description: string;
    icon: string;
    main: string;
  }>;
  wind: {
    speed: number;
    deg: number;
  };
  sys: {
    sunrise: number;
    sunset: number;
  };
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  template: `
    <div class="weather-container">
      <h1>Météo Globale</h1>
      
      <div class="search-bar">
        <input 
          type="text" 
          [(ngModel)]="cityName"
          (keyup.enter)="rechercherMeteo()"
          placeholder="Entrez le nom d'une ville"
        >
        <button (click)="rechercherMeteo()">
          🔍 Rechercher
        </button>
      </div>

      <div *ngIf="chargement" class="loader">
        Chargement en cours...
      </div>

      <div *ngIf="meteo" class="weather-details">
        <div class="ville-info">
          <h2>{{ meteo.name }}</h2>
          <img 
            [src]="'https://openweathermap.org/img/wn/' + meteo.weather[0].icon + '@2x.png'"
            [alt]="meteo.weather[0].description"
          >
        </div>

        <div class="temperature-principale">
          <span>{{ meteo.main.temp | number:'1.0-0' }}°C</span>
          <small>Ressenti {{ meteo.main.feels_like | number:'1.0-0' }}°C</small>
        </div>

        <div class="details-supplementaires">
          <div class="detail">
            <span>💧 Humidité</span>
            <strong>{{ meteo.main.humidity }}%</strong>
          </div>
          <div class="detail">
            <span>💨 Vent</span>
            <strong>{{ meteo.wind.speed }} km/h</strong>
          </div>
          <div class="detail">
            <span>☁️ Conditions</span>
            <strong>{{ meteo.weather[0].description }}</strong>
          </div>
        </div>
      </div>

      <div *ngIf="erreur" class="message-erreur">
        {{ erreur }}
      </div>
    </div>
  `,
  styles: [`
    .weather-container {
      max-width: 450px;
      margin: 20px auto;
      padding: 20px;
      background-color: #f0f4f8;
      border-radius: 15px;
      box-shadow: 0 4px 15px rgba(0,0,0,0.1);
      text-align: center;
      font-family: 'Arial', sans-serif;
    }

    .search-bar {
      display: flex;
      margin-bottom: 20px;
    }

    .search-bar input {
      flex-grow: 1;
      padding: 10px;
      font-size: 16px;
      border: 1px solid #ddd;
      border-radius: 5px 0 0 5px;
    }

    .search-bar button {
      padding: 10px 15px;
      background-color: #4a90e2;
      color: white;
      border: none;
      border-radius: 0 5px 5px 0;
      cursor: pointer;
    }

    .ville-info h2 {
      margin-bottom: 10px;
      color: #333;
    }

    .temperature-principale {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin: 15px 0;
    }

    .temperature-principale span {
      font-size: 3em;
      font-weight: bold;
      color: #4a90e2;
    }

    .details-supplementaires {
      display: flex;
      justify-content: space-around;
      background-color: white;
      padding: 15px;
      border-radius: 10px;
      box-shadow: 0 2px 5px rgba(0,0,0,0.1);
    }

    .detail {
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .detail span {
      font-size: 14px;
      color: #777;
      margin-bottom: 5px;
    }

    .detail strong {
      color: #333;
    }

    .loader, .message-erreur {
      margin-top: 20px;
      color: #4a90e2;
    }

    .message-erreur {
      color: #e74c3c;
    }
  `]
})
export class AppComponent implements OnInit {
  cityName: string = 'Paris';
  meteo: WeatherData | null = null;
  erreur: string = '';
  chargement: boolean = false;

  private apiKey = '02f50d7e563cba03634989e61f3292a5'; //  clé API
  private apiUrl = 'https://api.openweathermap.org/data/2.5/weather';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.rechercherMeteo();
  }

  rechercherMeteo() {
    if (!this.cityName) {
      this.erreur = 'Veuillez saisir un nom de ville';
      return;
    }

    this.chargement = true;
    this.erreur = '';
    this.meteo = null;

    this.http.get<WeatherData>(`${this.apiUrl}?q=${this.cityName}&appid=${this.apiKey}&units=metric&lang=fr`)
      .subscribe({
        next: (donnees) => {
          this.meteo = donnees;
          this.chargement = false;
        },
        error: (erreur) => {
          this.erreur = 'Ville non trouvée ou problème de connexion';
          this.chargement = false;
          console.error('Erreur lors de la récupération des données météo', erreur);
        }
      });
  }
}
