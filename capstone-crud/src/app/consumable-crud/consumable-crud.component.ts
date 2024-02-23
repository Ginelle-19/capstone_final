import { Component, ChangeDetectorRef } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Data, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AppComponent } from '../app.component';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { EquipmentCrudComponent } from '../equipment-crud/equipment-crud.component';
// ===================
import { CourseCrudComponent } from '../course-crud/course-crud.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { DataService } from '../data.service';
import { MatIconModule } from '@angular/material/icon';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-consumable-crud',
  standalone: true,
  imports: [
    HttpClientModule,
    RouterOutlet,
    CommonModule,
    AppComponent,
    FormsModule,
    RouterModule,
    EquipmentCrudComponent,
    CourseCrudComponent,
    NgxPaginationModule,
    MatIconModule,
  ],
  templateUrl: './consumable-crud.component.html',
  styleUrl: './consumable-crud.component.css',
  providers: [DatePipe],
})
export class ConsumableCrudComponent {
  ConsumableArray: any[] = [];
  CourseArray: any[] = [];
  isResultLoaded = false;
  isUpdateFormActive = false;

  currentID = '';
  CourseID!: number;
  ConsumableName: string = '';
  Quantity?: number;
  ConsumableStat: string = '';
  ExpirationDate: Date | null = null;

  SelectedCourseID: number | null = null;

  minDate: string;

  p: number = 1;
  itemsPerPage: number = 7;

  private emailSent = false;

  constructor(
    private http: HttpClient,
    private dataService: DataService,
    private datePipe: DatePipe,
    private changeDetectorRef: ChangeDetectorRef
  ) {
    this.getAllConsumables();

    const today = new Date();
    this.minDate = today.toISOString().split('T')[0];
  }

  ngOnInit(): void {
    this.loadCourses();
  }

  getAllConsumables() {
    this.http
      .get('https://ccjeflabsolutions.online:3000/api/consumables')
      .subscribe((resultData: any) => {
        this.isResultLoaded = true;
        this.ConsumableArray = resultData.data;
      });
  }

  register() {
    let bodyData = {
      ConsumableName: this.ConsumableName,
      Quantity: this.Quantity,
      ExpirationDate: this.ExpirationDate || null,
      CourseID: this.CourseID,
    };

    this.http
      .post('https://ccjeflabsolutions.online:3000/api/consumables/add', bodyData)
      .subscribe((resultData: any) => {
        alert('Consumable Added Successfully!');
        this.getAllConsumables();
      });
    this.clearInputs();
  }

  setUpdate(data: any) {
    this.ConsumableName = data.ConsumableName;
    this.Quantity = data.Quantity;
    this.ExpirationDate = data.ExpirationDate;
    this.CourseID = data.CourseID;
    this.currentID = data.ConsumableID;
  }

  UpdateRecords() {
    let bodyData = {
      ConsumableName: this.ConsumableName,
      Quantity: this.Quantity,
      ExpirationDate: this.datePipe.transform(
        this.ExpirationDate,
        'yyyy-MM-dd'
      ),
      CourseID: this.CourseID,
    };

    this.http
      .put(
        'https://ccjeflabsolutions.online:3000/api/consumables/update' + '/' + this.currentID,
        bodyData
      )
      .subscribe((resultData: any) => {
        alert('Consumable Updated Successfully!');
        this.getAllConsumables();
      });
    this.clearInputs();
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
    this.CourseID = 0;
    this.ConsumableName = '';
    this.Quantity = 0;
    this.ExpirationDate = null;
  }

  setDelete(data: any) {
    const confirmation = window.confirm(
      'Are you sure you want to delete this record?'
    );

    if (confirmation) {
      this.http
        .delete(
          'https://ccjeflabsolutions.online:3000/api/consumables/delete' +
            '/' +
            data.ConsumableID
        )
        .subscribe(
          (resultData: any) => {
            alert('Record Deleted');
            this.getAllConsumables();
          },
          (error) => {
            console.error('Error deleting record: ', error);
          }
        );
    }
  }

  getStatusClass(Quantity: number): string {
    let status = '';

    if (Quantity <= 0) {
      status = 'Not-Available';
    } else if (Quantity < 5) {
      status = 'Low-on-Stock';
    } else {
      status = 'Available';
    }


    if (
      (status === 'Low-on-Stock' || status === 'Not-Available') &&
      !this.emailSent
    ) {
      this.sendEmailOnLowStockOrNotAvailable();
      this.emailSent = true;
    }

    return status;
  }

  getStatusString(Quantity: number): string {
    if (Quantity <= 0) {
      return 'Not Available';
    } else if (Quantity < 5) {
      return 'Low on Stock';
    } else {
      return 'Available';
    }
  }

  sendEmailOnLowStockOrNotAvailable() {
    const lowStockItems = this.ConsumableArray.filter(
      (item) => item.Quantity < 5
    );
    const notAvailableItems = this.ConsumableArray.filter(
      (item) => item.Quantity <= 0
    );


    if (
      (lowStockItems.length > 0 || notAvailableItems.length > 0) &&
      !this.emailSent
    ) {
      let emailContent = `Consumables Status Alert:\n\n`;

      if (lowStockItems.length > 0) {
        emailContent += `Low on Stock:\n${this.formatItems(lowStockItems)}\n\n`;
      }

      if (notAvailableItems.length > 0) {
        emailContent += `Not Available:\n${this.formatItems(
          notAvailableItems
        )}\n\n`;
      }

      this.http
        .post('https://ccjeflabsolutions.online:3000/send-email', { content: emailContent })
        .subscribe(
          (response) => {
            this.emailSent = true; 
          },
          (error) => {
            // console.error('Error sending email:', error);
          }
        );
    }
  }

  formatItems(items: any[]): string {
    return items
      .map((item) => `ID: ${item.ConsumableID}, Name: ${item.ConsumableName}`)
      .join('\n');
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

  clearFilter(): void {
    this.SelectedCourseID = null;
    this.changeDetectorRef.detectChanges();
    this.filterConsumables();
  }

  filterConsumables(): void {
    if (this.SelectedCourseID !== null) {
      this.dataService
        .getConsumablesByCourseId(this.SelectedCourseID)
        .subscribe(
          (response: any) => {
            this.ConsumableArray = response.data;
          },
          (error) => {
            console.error('Error connecting to API: ', error);
          }
        );
    } else {
      this.http.get('https://ccjeflabsolutions.online:3000/api/consumables').subscribe(
        (response: any) => {
          this.ConsumableArray = response.data;
        },
        (error) => {
          console.error('Error connecting to API: ', error);
        }
      );
    }
  }

  assignCourse(): void {
    if (this.SelectedCourseID !== null) {
      this.dataService
        .getConsumablesByCourseId(this.SelectedCourseID)
        .subscribe(
          (response: any) => {
            this.ConsumableArray = response.data;
          },
          (error) => {
            console.error('Error connecting to API: ', error);
          }
        );
    }
  }
}