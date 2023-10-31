import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OlympicService } from '../services/olympic.service';
import { Olympic } from '../core/models/Olympic';

@Component({
  selector: 'app-chart-list',
  templateUrl: './chart-list.component.html',
  styleUrls: ['./chart-list.component.scss'],
})
export class ChartListComponent implements OnInit {
  public countryId!: number; // L'ID du pays sélectionné

  public numParticipations!: number; // Nombre de participations aux JO
  public totalMedals!: number; // Nombre total de médailles obtenues
  public totalAthletes!: number; // Nombre total d'athlètes présentés aux JO


  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private olympicService: Olympic
  ) {}

  ngOnInit(): void {
    // Récupérer l'ID du pays à partir des paramètres de l'URL
    this.route.params.subscribe((params) => {
      this.countryId = params['id']; // Convertir en nombre
    });

    // Utiliser l'ID pour récupérer les informations
    this.olympicService.getCountryInfo(this.countryId).subscribe((info) => {
      if (info) {
        this.numParticipations = info.numParticipations;
        this.totalMedals = info.totalMedals;
        this.totalAthletes = info.totalAthletes;
      }
    });
  }
}
