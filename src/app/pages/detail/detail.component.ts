import { Component, OnInit } from '@angular/core';
import { OlympicService } from 'src/app/core/services/olympic.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss'],
})
export class DetailComponent implements OnInit {
  public countryId!: number;
  public countryName!: string;
  public numParticipations!: number;
  public totalMedals!: number;
  public totalAthletes!: number;

  public chartData!: any[];

  constructor(private olympicService: OlympicService,private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.countryId = +params['id'];
    });

    /** The code take all country including the number of participations, total medals, total athletes, and chart data
     * for that country to make an chartData objet for the line chart.
     */
    this.olympicService.getCountryData(this.countryId).subscribe((info) => {
      if (info) {
        this.countryName = info.name;
        this.numParticipations = info.numParticipations;
        this.totalMedals = info.totalMedals;
        this.totalAthletes = info.totalAthletes;

        if (info.name) {
          this.chartData = [
            {
              name: info.name,
              series: info.chartData.map((participation) => ({
                name: participation.year.toString(),
                value: participation.medalsCount,
              })),
            },
          ];
        }
      }
    });
  }
}
