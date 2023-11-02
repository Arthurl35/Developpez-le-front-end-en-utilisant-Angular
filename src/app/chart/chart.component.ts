import { Component, OnInit } from '@angular/core';
import { OlympicService } from 'src/app/core/services/olympic.service';
import { Observable } from 'rxjs';
import { Olympic } from 'src/app/core/models/Olympic';
import { Router } from '@angular/router';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss']
})
export class ChartComponent implements OnInit {
  public olympics$: Observable<Olympic[] | null>;
  public chartData: any[] = []; // Tableau des données pour le Pie Chart

  constructor(private olympicService: OlympicService, private router: Router) {
    this.olympics$ = this.olympicService.getOlympics();
  }

  ngOnInit(): void {
    this.olympics$.subscribe((olympics) => {
      if (olympics) {
        // Extraire les données nécessaires du modèle Olympic pour le graphique
        this.chartData = this.extractChartData(olympics);
      }
    });
  }

  extractChartData(olympics: Olympic[]): any[] {
    // Créez un tableau de données pour le "Pie Chart" au format requis
    const data = olympics.map((o) => {
      return {
        id: o.id,
        name: o.country,
        value: o.participations[0].medalsCount
      };
    });
    return data;
  }

  onPieChartSelect(event: any): void {
    // Récupérez l'ID correspondant en fonction du nom et de la valeur
    const selectedData = this.chartData.find((data) => data.name === event.name && data.value === event.value);

    if (selectedData) {
      const selectedId = selectedData.id;
      this.router.navigate(['/chart-list', selectedId]); // "event.id" est l'ID de la part sélectionnée
    }
  }

}
