
import { Component, ChangeDetectorRef } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AppComponent } from '../app.component';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ConsumableCrudComponent } from '../consumable-crud/consumable-crud.component';
import { MatIconModule } from '@angular/material/icon';
// =============
import { CourseCrudComponent } from '../course-crud/course-crud.component';
import { DataService } from '../data.service';
// import { MatPaginatorModule} from '@angular/material/paginator';
import { DatePipe } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';

@Component({
  selector: 'app-equipment-crud',
  standalone: true,
  imports: [
    HttpClientModule,
    RouterOutlet,
    CommonModule,
    AppComponent,
    FormsModule,
    RouterModule,
    ConsumableCrudComponent,
    CourseCrudComponent,
    NgxPaginationModule,
    MatIconModule,
  ],
  providers: [HttpClientModule, DatePipe],
  templateUrl: './equipment-crud.component.html',
  styleUrl: './equipment-crud.component.css',
})
export class EquipmentCrudComponent {
  EquipmentArray: any[] = [];
  CourseArray: any[] = [];

  SelectedCourseID: number | null = null;

  searchValue: string = '';
  searchResult: any[] = [];

  isResultLoaded = false;
  isUpdateFormActive = false;

  currentID = '';
  EquipmentName: string = '';
  Quantity: string = '';
  CourseID!: number;
  CalibrationSchedule: Date | null = null;

  minDate: string;

  p: number = 1;
  itemsPerPage: number = 7;

  constructor(
    private http: HttpClient,
    private dataService: DataService,
    private datePipe: DatePipe,
    private changeDetectorRef: ChangeDetectorRef
  ) {
    this.getAllEquipments();

    const today = new Date();
    this.minDate = today.toISOString().split('T')[0];
  }

  ngOnInit(): void {
    this.loadCourses();
  }

  getAllEquipments() {
    this.http
      .get('https://ccjeflabsolutions.online:3000/api/equipments/')
      .subscribe((resultData: any) => {
        this.isResultLoaded = true;
        this.EquipmentArray = resultData.data;
      });
  }

  register() {
    let bodyData = {
      EquipmentName: this.EquipmentName,
      Quantity: this.Quantity,
      CalibrationSchedule: this.datePipe.transform(
        this.CalibrationSchedule,
        'yyyy-MM-dd'
      ),
      CourseID: this.CourseID,
    };

    this.http
      .post('https://ccjeflabsolutions.online:3000/api/equipments/add', bodyData)
      .subscribe((resultData: any) => {
        alert('Equipment Added Successfully!');
        this.getAllEquipments();
      });
    this.clearInputs();
  }

  setUpdate(data: any) {
    this.EquipmentName = data.EquipmentName;
    this.Quantity = data.Quantity;
    this.CalibrationSchedule = data.CalibrationSchedule;
    this.CourseID = data.CourseID;
    this.currentID = data.EquipmentID;
  }

  UpdateRecords() {
    let bodyData = {
      EquipmentName: this.EquipmentName,
      Quantity: this.Quantity,
      CalibrationSchedule: this.datePipe.transform(
        this.CalibrationSchedule,
        'yyyy-MM-dd'
      ),
      CourseID: this.CourseID,
    };

    this.http
      .put(
        'https://ccjeflabsolutions.online:3000/api/equipments/update' + '/' + this.currentID,
        bodyData
      )
      .subscribe((resultData: any) => {
        alert('Equipment Updated Successfully!');
        this.getAllEquipments();
      });
  }

  save() {
    if (this.currentID == '') {
      this.register();
    } else {
      this.UpdateRecords();
    }
    this.clearInputs();
  }

  clearInputs() {
    this.EquipmentName = '';
    this.Quantity = '';
    this.CourseID = 0;
    this.CalibrationSchedule = null;
  }

  setDelete(data: any) {
    const confirmation = window.confirm(
      'Are you sure you want to delete this record?'
    );

    if (confirmation) {
      this.http
        .delete(
          'https://ccjeflabsolutions.online:3000/api/equipments/delete' + '/' + data.EquipmentID
        )
        .subscribe(
          (resultData: any) => {
            alert('Record Deleted');
            this.getAllEquipments();
          },
          (error) => {
            console.error('Error deleting record: ', error);
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

  filterEquipments(): void {
    if (this.SelectedCourseID !== null) {
      this.dataService.getEquipmentsByCourseId(this.SelectedCourseID).subscribe(
        (response: any) => {
          this.EquipmentArray = response.data;
        },
        (error) => {
          console.error('Error connecting to API: ', error);
        }
      );
    }
  }

  clearFilter(): void {
    this.SelectedCourseID = null;
    // Manually trigger change detection to update the UI
    this.changeDetectorRef.detectChanges();
    this.filterEquipment();
  }

  filterEquipment(): void {
    if (this.SelectedCourseID !== null) {
      this.dataService
        .getConsumablesByCourseId(this.SelectedCourseID)
        .subscribe(
          (response: any) => {
            this.EquipmentArray = response.data;
          },
          (error) => {
            console.error('Error connecting to API: ', error);
          }
        );
    } else {
      // If SelectedCourseID is null, fetch all consumables
      this.http.get('https://ccjeflabsolutions.online:3000/api/equipments').subscribe(
        (response: any) => {
          this.EquipmentArray = response.data;
        },
        (error) => {
          console.error('Error connecting to API: ', error);
        }
      );
    }
  }

  assignCourse(): void {
    if (this.SelectedCourseID !== null) {
      this.dataService.getEquipmentsByCourseId(this.SelectedCourseID).subscribe(
        (response: any) => {
          this.EquipmentArray = response.data;
        },
        (error) => {
          console.error('Error connecting to API: ', error);
        }
      );
    }
  }
}