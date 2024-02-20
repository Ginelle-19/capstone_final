import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgxPaginationModule } from 'ngx-pagination';

@Component({
  selector: 'app-user-facility',
  standalone: true,
  imports: [CommonModule, RouterModule, NgxPaginationModule],
  templateUrl: './user-facility.component.html',
  styleUrl: './user-facility.component.css',
})
export class UserFacilityComponent {
  FacilityArray: any[] = [];
  RoomsArray: any[] = [];
  isResultLoaded = false;
  p: number = 1;
  itemsPerPage: number = 10;
  constructor(private http: HttpClient) {
    this.getAllFacilities();
  }

  getAllFacilities() {
    this.http
      .get('http://89.116.21.168:3000/api/room')
      .subscribe((resultData: any) => {
        this.isResultLoaded = true;
        this.RoomsArray = resultData.data;
      });
  }
}