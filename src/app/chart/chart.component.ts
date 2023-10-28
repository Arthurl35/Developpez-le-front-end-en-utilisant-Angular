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

  constructor(private olympicService: OlympicService) {
    this.olympics$ = this.olympicService.getOlympics();
  }

  ngOnInit(): void {
    this.olympics$.subscribe((olympics) => {
      if (olympics) {
        this.createChart(olympics);
      }
    });
  }

  createChart(olympics: Olympic[]) {
    const ctx = document.getElementById('myChart') as HTMLCanvasElement;

    // Extraire les données nécessaires du modèle Olympic pour le graphique
    const countries = olympics.map((o) => o.country);
    const medalsCount = olympics.map((o) => o.participations[0].medalsCount);

    new Chart(ctx, {
      type: 'pie',
      data: {
        labels: countries,
        datasets: [{
          label: 'Medals Count',
          data: medalsCount,
          backgroundColor: [
            '#956065', '#B8CBE7', '#89A1DB', '#793D52', '#9780A1', '#956065'
            // Ajoutez d'autres couleurs si nécessaire
          ]
        }]
      }
    });
  }
}
