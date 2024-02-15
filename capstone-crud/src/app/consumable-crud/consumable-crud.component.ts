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
      .get('http://localhost:8085/api/consumables')
      .subscribe((resultData: any) => {
        this.isResultLoaded = true;
        console.log(resultData.data);
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
      .post('http://localhost:8085/api/consumables/add', bodyData)
      .subscribe((resultData: any) => {
        console.log(resultData);
        alert('Consumable Added Successfully!');
        this.getAllConsumables();
      });
  }
  //-------------------------------------------------
  // search(){
  //   this.http.get("/api/equipments/:id"+ "/" + this.currentID)
  //   .subscribe((resultData:any) => {
  //     console.log(resultData);
  //     this.getAllEquipments();
  //   });
  // }
  //---------------------------------------------------
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
        'http://localhost:8085/api/consumables/update' + '/' + this.currentID,
        bodyData
      )
      .subscribe((resultData: any) => {
        console.log(resultData);
        alert('Consumable Updated Successfully!');
        this.getAllConsumables();
      });
  }

  save() {
    if (this.currentID == '') {
      this.register();
    } else {
      this.UpdateRecords();
    }
  }

  setDelete(data: any) {
    const confirmation = window.confirm(
      'Are you sure you want to delete this record?'
    );

    if (confirmation) {
      this.http
        .delete(
          'http://localhost:8085/api/consumables/delete' +
            '/' +
            data.ConsumableID
        )
        .subscribe(
          (resultData: any) => {
            console.log(resultData);
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

    // Check if email should be sent and if it hasn't been sent already
    if (
      (status === 'Low-on-Stock' || status === 'Not-Available') &&
      !this.emailSent
    ) {
      this.sendEmailOnLowStockOrNotAvailable(); // Trigger email sending
      this.emailSent = true; // Set emailSent flag to true
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

    // Check if there are any low stock items or items that are not available
    if (
      (lowStockItems.length > 0 || notAvailableItems.length > 0) &&
      !this.emailSent
    ) {
      // Construct the email content
      let emailContent = `Consumables Status Alert:\n\n`;

      if (lowStockItems.length > 0) {
        emailContent += `Low on Stock:\n${this.formatItems(lowStockItems)}\n\n`;
      }

      if (notAvailableItems.length > 0) {
        emailContent += `Not Available:\n${this.formatItems(
          notAvailableItems
        )}\n\n`;
      }

      // Now, make an HTTP request to your server-side endpoint to send the email
      this.http
        .post('http://localhost:8085/send-email', { content: emailContent })
        .subscribe(
          (response) => {
            console.log('Email sent successfully!', response);
            this.emailSent = true; // Set the flag to true after the email is sent
          },
          (error) => {
            console.error('Error sending email:', error);
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
    // Manually trigger change detection to update the UI
    this.changeDetectorRef.detectChanges();
    this.filterConsumables();
  }

  filterConsumables(): void {
    if (this.SelectedCourseID !== null) {
      this.dataService
        .getConsumablesByCourseId(this.SelectedCourseID)
        .subscribe(
          (response: any) => {
            console.log(response);
            this.ConsumableArray = response.data;
          },
          (error) => {
            console.error('Error connecting to API: ', error);
          }
        );
    } else {
      // If SelectedCourseID is null, fetch all consumables
      this.http.get('http://localhost:8085/api/consumables').subscribe(
        (response: any) => {
          console.log(response);
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