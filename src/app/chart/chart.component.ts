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
  public chartData!: any[];

  constructor(private olympicService: OlympicService, private router: Router) {
    this.olympics$ = this.olympicService.getOlympics();
  }

/**
 * The function subscribes to the olympics$ observable and extracts chart data from the
 * emitted olympics data.
 */
  ngOnInit(): void {
    this.olympics$.subscribe((olympics) => {
      if (olympics) {
        this.chartData = this.extractChartData(olympics);
      }
    });
  }

/**
 * The function extractChartData takes an array of Olympic objects and returns an array of objects
 * containing the country id, name, and the total number of medals they have won.
 * @param {Olympic[]} olympics - An array of Olympic objects. Each Olympic object has the following
 * properties:
 * @returns an array of objects. Each object in the array
 * represents an Olympic country 
 */
  extractChartData(olympics: Olympic[]): any[] {
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
 * The function onPieChartSelect takes an event object and navigates to a detail page.
 * @param {any} event - The event parameter is an object that contains information about the selected
 * data point on the pie chart. 
 */
  onPieChartSelect(event: any): void {
    const selectedData = this.chartData.find((data) => data.name === event.name && data.value === event.value);

    if (selectedData) {
      const selectedId = selectedData.id;
      this.router.navigate(['/detail', selectedId]); 
    }
  }
}
