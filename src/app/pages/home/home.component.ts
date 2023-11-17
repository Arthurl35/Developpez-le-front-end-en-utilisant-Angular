import { Component, OnInit } from '@angular/core';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CustomContentItem } from 'src/app/core/models/CustomContentItem';
import { Olympic } from 'src/app/core/models/Olympic';
import { OlympicService } from 'src/app/core/services/olympic.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  public olympics$!: Observable<Olympic[] | null>;
  public numberJOs$!: Observable<number | null>;
  public homeCustomContent: CustomContentItem[] = [];

  constructor(private olympicService: OlympicService) {}

  ngOnInit(): void {
    this.olympics$ = this.olympicService.getOlympics();
    this.numberJOs$ = this.olympicService.getNumberJo();

    combineLatest([this.numberJOs$, this.olympics$]).pipe(
      map(([numberJOs, olympics]) => {
        if (numberJOs !== null && olympics !== null) {
          return [
            { label: 'Number of JOs', value: numberJOs },
            { label: 'Number of countries', value: olympics.length },
          ];
        }
        return [];
      })
    ).subscribe((content) => {
      this.homeCustomContent = content;
    });
  }
}
