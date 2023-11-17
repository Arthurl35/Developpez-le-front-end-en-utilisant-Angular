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
  public olympics$!: Observable<Olympic[]>;
  public numberJOs$!: Observable<number>;
  public homeCustomContent: CustomContentItem[] = [];

  private olympicsSubscription!: Subscription;
  private numberJOsSubscription!: Subscription;

  constructor(private olympicService: OlympicService) {}

  ngOnInit(): void {
    this.olympics$ = this.olympicService.getOlympics();
    this.numberJOs$ = this.olympicService.getNumberJo();

    this.numberJOsSubscription = this.numberJOs$.subscribe((count: number) => {
      if (count !== null && count > 0) {
        this.homeCustomContent.push({ label: 'Number of JOs', value: count });
      }
    });

    this.olympicsSubscription = this.olympics$.subscribe((data: Olympic[]) => {
      if (data && data.length > 0) {
        this.homeCustomContent.push({ label: 'Number of countries', value: data.length });
      }
    });
  }

  ngOnDestroy(): void {
    this.olympicsSubscription.unsubscribe();
    this.numberJOsSubscription.unsubscribe();
  }
}

