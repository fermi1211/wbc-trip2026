import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TripService, DayItinerary } from '../../services/trip.service';
import { TransitCard} from '../../components/transit-card/transit-card';

@Component({
  selector: 'app-day-detail',
  imports: [CommonModule, TransitCard],
  templateUrl: './day-detail.html',
  styleUrl: './day-detail.css',
})
export class DayDetail implements OnInit {
  dayData?: DayItinerary;

  constructor(
    private route: ActivatedRoute,
    private tripService: TripService
  ) {}

  ngOnInit() {
    // 監聽網址變化 (e.g. 從 /day/1 變到 /day/2)
    this.route.paramMap.subscribe(params => {
      const id = Number(params.get('id'));
      this.dayData = this.tripService.getDayById(id);
    });
  }
}
