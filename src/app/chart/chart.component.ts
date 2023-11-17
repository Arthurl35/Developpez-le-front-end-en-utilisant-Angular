import { Component, OnInit } from '@angular/core';
import { OlympicService } from 'src/app/core/services/olympic.service';
import { Observable, Subscription  } from 'rxjs';
import { Olympic } from 'src/app/core/models/Olympic';
import { Router } from '@angular/router';
import { PieChartData } from '../core/models/ChartData';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss']
})
export class ChartComponent implements OnInit {
  public olympics$: Observable<Olympic[]>;
  public pieChartData!: PieChartData[];

  private olympicsSubscription!: Subscription;


  constructor(private olympicService: OlympicService, private router: Router) {
    this.olympics$ = this.olympicService.getOlympics();
  }

/**
 * The function subscribes to the olympics$ observable and extracts chart data from the
 * emitted olympics data.
 */
  ngOnInit(): void {
    this.olympicsSubscription = this.olympics$.subscribe((olympics) => {
      if (olympics) {
        this.pieChartData = this.extractChartData(olympics);
      }
    });
  }

/**
 * The ngOnDestroy function checks if there is an active subscription and unsubscribes from it if it
 * exists.
 */
  ngOnDestroy(): void {
    if (this.olympicsSubscription) {
      this.olympicsSubscription.unsubscribe();
    }
  }

/**
 * The function extractChartData takes an array of Olympic objects and returns an array of
 * PieChartData objects.
 * @param {Olympic[]} olympics - An array of Olympic objects. Each Olympic object has the following
 * properties:
 * @returns The function `extractChartData` returns an array of `PieChartData` objects.
 */
  extractChartData(olympics: Olympic[]): PieChartData[] {
    const data = olympics.map((o) => {
    const totalMedalsCount = o.participations.reduce((accumulator, participation) => accumulator + participation.medalsCount, 0);
      
      return {
        id: o.id,
        name: o.country,
        value: totalMedalsCount
      };
    });
    return data;
  }

/**
 * The function onPieChartSelect navigates to a detail page based on the selected data from a pie
 * chart.
 * @param event - An object containing the following properties:
 */
  onPieChartSelect(event: { id: number, name: string, value: number }): void {
    const selectedData = this.pieChartData.find((data) => data.name === event.name && data.value === event.value);

    if (selectedData) {
      const selectedId = selectedData.id;
      this.router.navigate(['/detail', selectedId]); 
    }
  }
}
