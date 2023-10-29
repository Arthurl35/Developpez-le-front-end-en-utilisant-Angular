import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { OlympicService } from 'src/app/core/services/olympic.service';
import { Observable } from 'rxjs';
import { Olympic } from 'src/app/core/models/Olympic';
import { Chart } from 'chart.js/auto';
import annotationPlugin from 'chartjs-plugin-annotation';
import datalabelsPlugin from 'chartjs-plugin-datalabels';


Chart.register(annotationPlugin);
Chart.register(datalabelsPlugin);

// Importez les types d'annotation spécifiques du plugin



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
    const totalMedals = this.medalsCount.reduce((a, b) => a + b, 0); // Total des médailles

    const annotations: Record<string, any> = {}; // Définissez un type pour les annotations
    const radius = 120; // Rayon du camembert

    let currentAngle = 11;

    for (let i = 0; i < this.countries.length; i++) {
      const label = `label${i + 1}`;
      const angle = (Math.PI * 2 * (this.medalsCount[i] / totalMedals));

      // Calculez les coordonnées en utilisant l'angle actuel
      const xValue = radius * Math.cos(currentAngle + angle / 2);
      const yValue = radius * Math.sin(currentAngle + angle / 2);

      // Calculez les coordonnées pour le callout au bord du camembert
      const calloutX = (radius + 30) * Math.cos(currentAngle + angle / 2);
      const calloutY = (radius + 30) * Math.sin(currentAngle + angle / 2);

      annotations[label] = {
        type: 'label',
        xValue: xValue,
        yValue: yValue,
        xAdjust: calloutX, // Ajustez pour le callout
        yAdjust: calloutY, // Ajustez pour le callout
        content: [`${this.countries[i]}`],
        textAlign: 'start',
        font: {
          size: 18
        },
        callout: {
          display: true,
          side: 0, // Mettez le callout au bord du camembert
          borderWidth: 2,
          borderColor: this.getBackgroundColor(i), // Utilisez la couleur du secteur
        },
      };

      currentAngle += angle;
    }

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
          ],
        }],
      },
      options: {
        plugins: {
          legend: {
            display: false,
          },
          annotation: {
            annotations: annotations // Utilisation de l'objet annotations dynamique
          }
        },
        //hover: {
        //  mode: 'x', // Désactivez le mode de survol
        //},
      }
    });
  }

  // Fonction pour obtenir la couleur du secteur du camembert
  getBackgroundColor(index: number) {
    const dataset = this.medalsCount[index];
    const backgroundColors = [
      '#956065', '#B8CBE7', '#89A1DB', '#793D52', '#9780A1', '#956065'
      // Ajoutez d'autres couleurs si nécessaire
    ];

    return backgroundColors[index % backgroundColors.length];
  }

















}
