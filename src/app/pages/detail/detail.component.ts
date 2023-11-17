import { Component, OnInit } from '@angular/core';
import { OlympicService } from 'src/app/core/services/olympic.service';
import { ActivatedRoute } from '@angular/router';
import { CountryData } from 'src/app/core/models/CountryData';
import { Observable } from 'rxjs';

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
  public countryData$!: Observable<CountryData>;

  constructor(
    private olympicService: OlympicService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.countryId = +params['id'];
    });

    this.countryData$ = this.olympicService.getCountryData(this.countryId);

    this.countryData$.subscribe((info) => {
      if (info) {
        this.countryName = info.name;
        this.numParticipations = info.numParticipations;
        this.totalMedals = info.totalMedals;
        this.totalAthletes = info.totalAthletes;

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
    });
  }
}
