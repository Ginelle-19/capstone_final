import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppComponent } from '../app.component';
import { FormsModule } from '@angular/forms';
import { Data, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';
import { DataService } from '../data.service';
// import { EquipmentCrudComponent } from '../equipment-crud/equipment-crud.component';
// import { CourseCrudComponent } from '../course-crud/course-crud.component';

@Component({
  selector: 'app-user-consumable',
  standalone: true,
  imports: [FormsModule, RouterModule, CommonModule, NgxPaginationModule],
  templateUrl: './user-consumable.component.html',
  styleUrl: './user-consumable.component.css'
})
export class UserConsumableComponent {

  ConsumableArray: any[] = [];
  CourseArray: any[] = [];

  isResultLoaded = false;
  currentID = "";
  ConsumableName: string = "";
  Quantity?: number;
  ConsumableStat: string = "";
  // ExpirationDate: string = "";

  SelectedCourseID: number | null = null;

  p:number = 1;
  itemsPerPage: number = 10;

  constructor(private http: HttpClient, private dataService:DataService) {
    this.getAllConsumables();
  }

  ngOnInit(): void {
    this.loadCourses();
  }

  getAllConsumables() {
    this.http.get("http://localhost:8085/api/consumables")
      .subscribe((resultData: any) => {
        this.isResultLoaded = true;
        console.log(resultData.data);
        this.ConsumableArray = resultData.data;
      });
  }

  setUpdate(data: any) {
    this.ConsumableName = data.ConsumableName;
    this.Quantity = data.Quantity;
    // this.ExpirationDate = data.ExpirationDate;

    this.currentID = data.ConsumableID;
  }

  getStatusClass(Quantity: number): string {
    if (Quantity <= 0) {
      return 'Not-Available';
    } else if (Quantity < 5) {
      return 'Low-on-Stock';
    } else {
      return 'Available';
    }
  }
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

  filterConsumables(): void{
    if (this.SelectedCourseID !== null){
      this.dataService.getConsumablesByCourseId(this.SelectedCourseID)
      .subscribe((response: any) => {
        console.log(response);
        this.ConsumableArray = response.data;
      },
      (error) => {
        console.error('Error connecting to API: ', error)
      }
      )
    }
  }

  assignCourse(): void{
    if (this.SelectedCourseID !== null) {
      this.dataService.getConsumablesByCourseId(this.SelectedCourseID)
        .subscribe((response: any) => {
          console.log(response);
          this.ConsumableArray = response.data;
        },
        (error) => {
          console.error('Error connecting to API: ', error);
        }
      );
    }
  }
}
