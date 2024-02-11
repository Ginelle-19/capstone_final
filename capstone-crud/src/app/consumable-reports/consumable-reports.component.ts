import {
  Component,
  ChangeDetectorRef,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ConsumableReportService } from '../services/consumable-reports.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { NgxPrintModule } from 'ngx-print';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import html2canvas from 'html2canvas';
import { NgxPaginationModule } from 'ngx-pagination';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-consumable-reports',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NgxPrintModule,
    NgxPaginationModule,
    MatIconModule,
  ],
  providers: [DatePipe, HttpClientModule],
  templateUrl: './consumable-reports.component.html',
  styleUrl: './consumable-reports.component.css',
})
export class ConsumableReportsComponent {
  TransactionArray: any[] = [];
  CourseArray: any[] = [];
  ConsumableArray: any[] = [];
  AccountsArray: any[] = [];

  TransactionConsumeID: number | null = null;
  CourseID: number | null = null;
  ConsumableID: number | null = null;
  AccountID: number | null = null;
  Quantity: number | null = null;
  DateCreated: Date = new Date();

  currentID = '';
  minDate!: string;
  SelectedCourseID: number | null = null;
  ConsumableArrayForSelectedCourse: any[] = [];

  isResultLoaded = false;

  p: number = 1;
  itemsPerPage: number = 7;

  @ViewChild('content') content!: ElementRef;
  // TransactionConsumeID: any;
  public SavePDF(): void {
    const content = this.content.nativeElement;
    const doc = new jsPDF();
    const title = 'Monthly Consumable Requisition Report';
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().split('T')[0];

    doc.text(title, 14, 10); // Adjust coordinates for title
    doc.text(`Generated on: ${formattedDate}`, 14, 18); // Adjust coordinates for date

    autoTable(doc, {
      html: content,
      margin: { top: 30 },
      // other options...
    });

    doc.save('reports.pdf');
  }

  printTable(): void {
    window.print();
  }

  constructor(
    private http: HttpClient,
    private ConsumableReportService: ConsumableReportService,
    private datePipe: DatePipe,
    private cdr: ChangeDetectorRef
  ) {
    this.fetchTransactions();

    const today = new Date();
    this.minDate = today.toISOString().split('T')[0];
  }

  ngOnInit(): void {
    this.loadCourses();
    this.loadConsumables();
    this.loadUsers();
  }

  fetchTransactions() {
    this.http
      .get('http://localhost:8085/api/consumableTrans/')
      .subscribe((resultData: any) => {
        this.isResultLoaded = true;
        console.log(resultData.data);
        this.TransactionArray = resultData.data;
        this.TransactionArray.forEach((transaction: any) => {
          transaction.CourseName = this.getCourseName(transaction.CourseID);
          transaction.ConsumableName = this.getConsumableName(
            transaction.ConsumableID
          );
          transaction.AccountName = this.getAccountName(transaction.AccountID);
          const accountDetails = this.getAccountDetails(transaction.AccountID);
          if (accountDetails) {
            transaction.StudentNum = accountDetails.StudentNum;
          } else {
            transaction.StudentNum = '';
          }
        });
      });
  }

  register() {
    let bodyData = {
      CourseID: this.CourseID,
      ConsumableID: this.ConsumableID,
      AccountID: this.AccountID,
      Quantity: this.Quantity,
      DateCreated: this.datePipe.transform(this.DateCreated, 'yyyy-MM-dd'),
      // "DateReturned": this.datePipe.transform(this.DateReturned, 'yyyy-MM-dd'),
    };

    this.http
      .post('http://localhost:8085/api/consumableTrans/add', bodyData)
      .subscribe((resultData: any) => {
        console.log(resultData);
        alert('Transaction Created!');
        this.fetchTransactions();
        this.clearDropdownSelections();
      });
  }
  clearDropdownSelections() {
    this.CourseID = null;
    this.ConsumableID = null;
    this.AccountID = null;
    this.Quantity = null;
    // this.DateReturned = null;
  }
  // -------------------------------------
  setUpdate(data: any) {
    this.TransactionConsumeID = data.TransactionConsumeID;
    this.CourseID = data.CourseID;
    this.ConsumableID = data.ConsumableID;
    this.AccountID = data.AccountID;
    this.Quantity = data.Quantity;
    this.DateCreated = data.DateCreated;
    this.currentID = data.TransactionConsumeID;
  }

  UpdateRecords() {
    let bodyData = {
      TransactionConsumeID: this.TransactionConsumeID,
      CourseID: this.CourseID,
      ConsumableID: this.ConsumableID,
      AccountID: this.AccountID,
      Quantity: this.Quantity,
      DateCreated: this.datePipe.transform(this.DateCreated, 'yyyy-MM-dd'),
      // "DateReturned": this.datePipe.transform(this.DateReturned, 'yyyy-MM-dd'),
    };
    this.http
      .put(
        'http://localhost:8085/api/consumableTrans/update' +
          '/' +
          this.currentID,
        bodyData
      )
      .subscribe((resultData: any) => {
        console.log(resultData);
        alert('Transaction Updated Successfully!');
        this.fetchTransactions();
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
    this.http
      .delete(
        'http://localhost:8085/api/consumableTrans/delete' +
          '/' +
          data.TransactionConsumeID
      )
      .subscribe((resultData: any) => {
        console.log(resultData);
        alert('Record Deleted');
        this.fetchTransactions();
      });
  }

  // get courses for dropdown
  loadCourses(): void {
    this.ConsumableReportService.getCourses().subscribe(
      (response: any) => {
        console.log('Courses:', response);
        this.CourseArray = response.data;
      },
      (error) => {
        console.error('Error fetching courses:', error);
      }
    );
  }
  // onCourseChange(): void {
  //   this.reportService.getConsumablessByCourseId(this.CourseID).subscribe(
  //     (response: any) => {
  //       this.EquipmentArray = response.data; // Assuming the response has a 'data' property
  //       this.cdr.detectChanges(); // Manually trigger change detection
  //     },
  //     (error) => {
  //       console.error('Error fetching equipments by course:', error);
  //     }
  //   );
  // }
  onCourseChange(): void {
    if (this.CourseID) {
      // Check if a course is selected
      this.ConsumableReportService.getConsumablesByCourseId(
        this.CourseID
      ).subscribe(
        (response: any) => {
          // Assign the equipment for the selected course to a separate array
          this.ConsumableArrayForSelectedCourse = response.data;
          this.cdr.detectChanges(); // Manually trigger change detection if needed
        },
        (error) => {
          console.error('Error fetching consumables by course:', error);
        }
      );
    }
  }
  // get equipments for dropdown
  loadConsumables(): void {
    this.ConsumableReportService.getConsumables().subscribe(
      (response: any) => {
        this.ConsumableArray = response.data;
      },
      (error) => {
        console.error('Error fetching equipment:', error);
      }
    );
  }
  // get users for dropdown
  loadUsers(): void {
    this.ConsumableReportService.getUsers().subscribe(
      (response: any) => {
        this.AccountsArray = response.data;
        this.AccountsArray.forEach((user: any) => {
          user.FullName = `${user.LastName} ${user.FirstName}`;
        });
      },
      (error) => {
        console.error('Error fetching Users:', error);
      }
    );
  }
  getCourseName(CourseID: number): string {
    const course = this.CourseArray.find((c) => c.CourseID === CourseID);
    return course ? course.CourseName : '';
  }

  getConsumableName(ConsumableID: number): string {
    const equipment = this.ConsumableArray.find(
      (e) => e.ConsumableID === ConsumableID
    );
    return equipment ? equipment.ConsumableName : '';
  }

  getAccountName(AccountID: number): string {
    const account = this.AccountsArray.find((a) => a.AccountID === AccountID);
    return account ? `${account.FirstName} ${account.LastName}` : '';
  }

  getAccountDetails(AccountID: number): any {
    const account = this.AccountsArray.find((a) => a.AccountID === AccountID);
    return account
      ? {
          name: `${account.FirstName} ${account.LastName}`,
          StudentNum: account.StudentNum,
        }
      : null;
  }
  // downloadPDF(): void {
  //   const pdfElement = document.getElementById('pdf-content'); // replace 'pdf-content' with the ID of the element containing your printable content

  //   if (pdfElement) {
  //     html2canvas(pdfElement).then((canvas) => {
  //       const pdf = new jsPDF('p', 'mm', 'a4');
  //       const imgData = canvas.toDataURL('image/png');
  //       pdf.addImage(imgData, 'PNG', 0, 0, pdf.internal.pageSize.getWidth(), pdf.internal.pageSize.getHeight());
  //       pdf.save('downloaded-pdf.pdf');
  //     });
  //   }
  // }
}