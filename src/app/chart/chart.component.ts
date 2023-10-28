import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Chart } from 'chart.js/auto';
import { OlympicService } from 'src/app/core/services/olympic.service';
import { Observable } from 'rxjs';
import { Olympic } from 'src/app/core/models/Olympic';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss']
})
export class ChartComponent implements OnInit {
  public olympics$: Observable<Olympic[] | null>;
  public countries: string[] = []; // Tableau des noms des pays
  public medalsCount: number[] = []; // Tableau des comptages de médailles

  constructor(private olympicService: OlympicService) {
    this.olympics$ = this.olympicService.getOlympics();
  }

  ngOnInit(): void {
    this.olympics$.subscribe((olympics) => {
      if (olympics) {
        // Extraire les données nécessaires du modèle Olympic pour le graphique
        this.countries = olympics.map((o) => o.country);
        this.medalsCount = olympics.map((o) => o.participations[0].medalsCount);
        this.createChart();
      }
    });
  }

  createChart() {
    const ctx = document.getElementById('myChart') as HTMLCanvasElement;

    new Chart(ctx, {
      type: 'pie',
      data: {
        labels: this.countries,
        datasets: [{
          label: 'Medals Count',
          data: this.medalsCount,
          backgroundColor: [
            '#956065', '#B8CBE7', '#89A1DB', '#793D52', '#9780A1', '#956065'
            // Ajoutez d'autres couleurs si nécessaire
          ]
        }]
      }
    });
  }
}
