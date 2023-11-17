import { Component, OnInit, OnDestroy} from '@angular/core';
import { OlympicService } from 'src/app/core/services/olympic.service';
import { ActivatedRoute, Router } from '@angular/router';
import {CountryData, LineChartData } from 'src/app/core/models/ChartData';
import { Observable, Subscription } from 'rxjs';
import { CustomContentItem } from 'src/app/core/models/CustomContentItem';

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
  public lineChartData!: LineChartData[];
  public countryData$!: Observable<CountryData>;
  public detailCustomContent: CustomContentItem[] = [];

  private countryDataSubscription!: Subscription;

  constructor(
    private olympicService: OlympicService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.countryId = +params['id'];
    });

    this.countryData$ = this.olympicService.getCountryData(this.countryId);

    this.countryDataSubscription = this.countryData$.subscribe((info) => {
     
      if (!info.name) {
        // Si les données sont vides ou non valides, redirige vers NotFoundComponent
        this.router.navigate(['/not-found']);
        return;
      }

        this.countryName = info.name;
        this.numParticipations = info.numParticipations;
        this.totalMedals = info.totalMedals;
        this.totalAthletes = info.totalAthletes;

        this.lineChartData = [
          {
            name: info.name,
            series: info.chartData.map((participation) => ({
              name: participation.year.toString(),
              value: participation.medalsCount,
            })),
          },
        ];

        
        this.detailCustomContent = [
          { label: 'Number of entries', value: this.numParticipations },
          { label: 'Total number medals', value: this.totalMedals },
          { label: 'Total number of athletes', value: this.totalAthletes },
        ];
      }
    );
  }

  ngOnDestroy(): void {
    if (this.countryDataSubscription) {
      this.countryDataSubscription.unsubscribe();
    }
  }
}
