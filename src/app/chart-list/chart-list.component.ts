import { Component, Input, OnInit } from '@angular/core';
import { Olympic } from '../core/models/Olympic';

@Component({
  selector: 'app-chart-list',
  templateUrl: './chart-list.component.html',
  styleUrls: ['./chart-list.component.scss']
})
export class ChartListComponent implements OnInit {
  @Input() selectedChartData!: Olympic;
  totalParticipations: number = 0;
  totalMedals: number = 0;
  totalAthletes: number = 0;

  ngOnInit() {
    if (this.selectedChartData) {
      // Calcul du nombre total de participations, médailles et athlètes
      this.selectedChartData.participations.forEach(participation => {
        this.totalParticipations++;
        this.totalMedals += participation.medalsCount;
        this.totalAthletes += participation.athleteCount;
      });
    }
  }
}
