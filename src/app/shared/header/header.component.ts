import { Component, Input } from '@angular/core';
import { CustomContentItem } from 'src/app/core/models/CustomContentItem';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  @Input() title: string = '';
  @Input() customContent: CustomContentItem[] = [];
}
