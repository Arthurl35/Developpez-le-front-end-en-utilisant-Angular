import { Component, OnInit } from '@angular/core';
import { OlympicService } from 'src/app/core/services/olympic.service';
import { Observable } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss'],
})
export class DetailComponent implements OnInit {
  public countryId!: number; // L'ID du pays sélectionné
  public countryName!: string;
  public numParticipations!: number; // Nombre de participations aux JO
  public totalMedals!: number; // Nombre total de médailles obtenues
  public totalAthletes!: number; // Nombre total d'athlètes présentés aux JO

  public chartData: any[] = []; // Tableau des données pour le graphique

  constructor(
    private olympicService: OlympicService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Récupérer l'ID du pays à partir des paramètres de l'URL
    this.route.params.subscribe((params) => {
      this.countryId = +params['id']; // Convertir en nombre
    });

    // Utiliser l'ID pour récupérer les informations
    this.olympicService.getCountryData(this.countryId).subscribe((info) => {
      if (info) {
        this.countryName = info.name;
        this.numParticipations = info.numParticipations;
        this.totalMedals = info.totalMedals;
        this.totalAthletes = info.totalAthletes;

        // Réorganisez vos données en un format compatible avec ngx-charts
        this.chartData = [
          {
            name: info.name,
            series: info.chartData.map(participation => ({
              name: participation.year.toString(),
              value: participation.medalsCount
            }))
          }
        ];



        console.log(this.chartData);



      }
    });
  }
}
