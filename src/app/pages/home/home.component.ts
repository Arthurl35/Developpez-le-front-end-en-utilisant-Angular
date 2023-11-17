import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { CustomContentItem } from 'src/app/core/models/CustomContentItem';
import { Olympic } from 'src/app/core/models/Olympic';
import { OlympicService } from 'src/app/core/services/olympic.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
  public olympics$!: Observable<Olympic[] | null>;
  public numberJOs$!: Observable<number | null>;
  public homeCustomContent!: CustomContentItem[];

  private olympicsSubscription!: Subscription;
  private numberJOsSubscription!: Subscription;

  constructor(private olympicService: OlympicService) {}

  ngOnInit(): void {
    this.olympics$ = this.olympicService.getOlympics();
    this.numberJOs$ = this.olympicService.getNumberJo();

    /* The code block you provided is subscribing to two observables (numberJOs$ and olympics$) and
    updating the homeCustomContent array based on the values received from these observables. */
    this.numberJOsSubscription = this.numberJOs$.subscribe((numberJOs) => {
      if (numberJOs !== null) {
        this.numberJOsSubscription?.unsubscribe();

        this.olympicsSubscription = this.olympics$.subscribe((olympics) => {
          if (olympics !== null) {
            this.olympicsSubscription?.unsubscribe();

            this.homeCustomContent = [
              { label: 'Number of JOs', value: numberJOs },
              { label: 'Number of countries', value: olympics.length },
            ];
          }
        });
      }
    });
  }

  ngOnDestroy(): void {
    this.olympicsSubscription.unsubscribe();
    this.numberJOsSubscription.unsubscribe();
  }
}
