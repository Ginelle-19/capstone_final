import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService } from '../data.service';
import { HttpClient } from '@angular/common/http';
import { NgxPaginationModule } from 'ngx-pagination';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-user-equipment',
  standalone: true,
  imports: [

    NgxPaginationModule,
    FormsModule,
    CommonModule,
    RouterModule
  ],
  templateUrl: './user-equipment.component.html',
  styleUrl: './user-equipment.component.css'
})
export class UserEquipmentComponent {

  EquipmentArray: any[] = [];
  CourseArray: any[] = [];

  
  // currentID = "";
  EquipmentName : string = "";
  Quantity : string = "";
  CourseID! : number;

  SelectedCourseID: number | null = null;

  isResultLoaded = false;

  p:number = 1;
  itemsPerPage: number = 10;

  constructor(private http: HttpClient, private dataService: DataService) {
    this.getAllEquipments();
  }

  ngOnInit(): void {
    this.loadCourses();
  }

  getAllEquipments() {
    this.http.get("http://localhost:8085/api/equipments/")
      .subscribe((resultData: any) => {
        this.isResultLoaded = true;
        console.log(resultData.data);
        // Only retrieve EquipmentName and Quantity
        this.EquipmentArray = resultData.data.map((item: any) => ({ EquipmentName: item.EquipmentName, Quantity: item.Quantity }));
      });
  }

  filterEquipments(): void {
    if (this.SelectedCourseID !== null) {
      this.dataService.getEquipmentsByCourseId(this.SelectedCourseID)
        .subscribe((response: any) => {
          console.log(response);
          // Only retrieve EquipmentName and Quantity
          this.EquipmentArray = response.data.map((item: any) => ({ EquipmentName: item.EquipmentName, Quantity: item.Quantity }));
        },
          (error) => {
            console.error('Error connecting to API: ', error);
          }
        );
    }
  }

  // get courses for dropdown
  loadCourses(): void {
    this.dataService.getCourses().subscribe(
      (response: any) => {
        this.CourseArray = response.data;
      },
      (error) => {
        console.error('Error fetching courses:', error);
      }
    );
  }

}
