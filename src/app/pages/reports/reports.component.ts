import { Component, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ReportsService } from '../service/reports.service';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { Router } from '@angular/router';
import { Carousel, CarouselModule } from 'primeng/carousel';
import { TagModule } from 'primeng/tag';

@Component({
  selector: 'app-reports',
  imports: [CommonModule, ButtonModule, Carousel, TagModule],
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.scss'
})
export class ReportsComponent {

  reports$!: Observable<any>;
  private reportsService = inject(ReportsService);
  private router = inject(Router);

  ngOnInit() {
    this.reports$ = this.reportsService.getFilteredReportsForCurrentUser();
    this.reports$.subscribe((val)=>{
      console.log(val);
      
    })
  }


  navigateToReport(report: any) {
    this.router.navigate([`/pages/reports/${report?.id}`])
  }

}
