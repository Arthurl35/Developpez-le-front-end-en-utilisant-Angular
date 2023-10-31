import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators'; // Assurez-vous que 'map' provienne de 'rxjs/operators'
import { Olympic } from '../models/Olympic';
import { CountryData } from './../models/CountryData';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class OlympicService {
  private olympicUrl = './assets/mock/olympic.json';
  private olympics$ = new BehaviorSubject<Olympic[] | null>(null);

  constructor(private http: HttpClient) {}

  loadInitialData() {
    return this.http.get<any>(this.olympicUrl).pipe(
      tap((value) => this.olympics$.next(value)),
      catchError((error, caught) => {
        // TODO: improve error handling
        console.error(error);
        // can be useful to end loading state and let the user know something went wrong
        this.olympics$.next(null);
        return caught;
      })
    );
  }

  getOlympics() {
    return this.olympics$.asObservable();
  }

  getNumberJo() {
    return this.olympics$.pipe(
      map((olympics: Olympic[] | null) => {
        if (olympics) {
          // Utilisez un ensemble pour éviter les années en double
          const uniqueYears = new Set<number>();
          olympics.forEach((o) => {
            o.participations.forEach((p) => {
              uniqueYears.add(p.year);
            });
          });
          // Retourne la taille de l'ensemble (nombre d'années uniques)
          return uniqueYears.size;
        }
        return 0; // Ou une autre valeur par défaut si les données ne sont pas disponibles
      })
    );
  }

  getCountryData(countryId: number): Observable<CountryData> {
    return this.olympics$.pipe(
      map((olympics: Olympic[] | null) => {
        if (olympics) {
          const country = olympics.find((o) => o.id == countryId);

          if (country) {
            const numParticipations = country.participations.length;
            const totalMedals = country.participations.reduce(
              (sum, participation) => sum + participation.medalsCount,
              0
            );
            const totalAthletes = country.participations.reduce(
              (sum, participation) => sum + participation.athleteCount,
              0
            );

            return {
              id: country.id,
              numParticipations,
              totalMedals,
              totalAthletes,
            };
          }
        }
        return {
          id: 0,
          numParticipations: 0,
          totalMedals: 0,
          totalAthletes: 0,
        };
      })
    );
  }
}

