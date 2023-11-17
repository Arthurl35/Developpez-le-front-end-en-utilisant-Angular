import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';
import { Olympic } from '../models/Olympic';
import { CountryData } from './../models/CountryData';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class OlympicService {
  private olympicUrl = './assets/mock/olympic.json';
  private olympics$ = new BehaviorSubject<Olympic[]>([]);

  constructor(private http: HttpClient) {}

/**
 * The function loadInitialData make an HTTP GET request to retrieve Olympic data.
 * @returns an observable of type Olympic[].
 */
  loadInitialData(): Observable<Olympic[]> {
    return this.http.get<Olympic[]>(this.olympicUrl).pipe(
      tap((value) => this.olympics$.next(value)),
      catchError((error, caught) => {
        console.error(error);
        // return empty array
        this.olympics$.next([]);
        return caught;
      })
    );
  }

/**
 * @returns an observable of the Olympics data.
 */
  getOlympics(): Observable<Olympic[]> {
    return this.olympics$.asObservable();
  }

/**
 * @returns an Observable that emits the number of unique years in
 * the participations array of the olympics object.
 */
  getNumberJo(): Observable<number> {
    return this.olympics$.pipe(
      map((olympics: Olympic[]) => {
        if (olympics) {
          const uniqueYears = new Set<number>();
          olympics.forEach((o) => {
            o.participations.forEach((p) => {
              uniqueYears.add(p.year);
            });
          });
          return uniqueYears.size;
        }
        return 0;
      })
    );
  }

  /**
   * The function getCountryData takes a country ID as input that emits the country data,
   *  including the number of participations, total medals, total athletes, and chart data for that country.
   * @param {number} countryId - The countryId parameter is a number that represents the unique
   * identifier of a country.
   * @returns an observable of type CountryData.
   */
  getCountryData(countryId: number): Observable<CountryData> {
    return this.olympics$.pipe(
      map((olympics: Olympic[]) => {
        if (olympics) {
          const country = olympics.find((o) => o.id === countryId);

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

            const chartData = country.participations.map(participation => {
              return {
                year: participation.year,
                medalsCount: participation.medalsCount,
                athleteCount: participation.athleteCount
              };
            });

            return {
              id: country.id,
              name: country.country,
              numParticipations,
              totalMedals,
              totalAthletes,
              chartData: chartData 
            };
          }
        }
        return {
          id: 0,
          name: '',
          numParticipations: 0,
          totalMedals: 0,
          totalAthletes: 0,
          chartData: []
        };
      })
    );
  }
}

