import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule
  ],
  standalone: true,
  providers: [
    DatePipe
  ]
})
export class ProfileComponent implements OnInit {

  currentUser: any;

  constructor(private authService: AuthService, private http: HttpClient, private datePipe:DatePipe) { }

  ngOnInit(): void {
    this.loadUserData();
    this.refreshUserData();
  }
  userArray: any[] = [];
  isResultLoaded = false;
  isEditMode = false;

  LastName: string = "";
  FirstName: string = "";
  Birthdate: string = "";
  StudentNum: string = "";
  UserName: string = "";
  Password: string = "";
  AccountID!: number;


  
  // loadUserData(): void {
  //   this.http.get("http://localhost:8085/api/users/" + this.AccountID)
  //     .subscribe((userData: any) => {
  //       this.currentUser = userData;
  //       this.LastName = userData.LastName;
  //       this.FirstName = userData.FirstName;
  //       this.Birthdate = userData.Birthdate;
  //       this.StudentNum = userData.StudentNum;
  //       this.UserName = userData.UserName;
  //       this.Password = userData.Password;
  //     });
  // }
  // loadUserData(): void {
  //   if (!this.currentUser || !this.currentUser.AccountID) {
  //     console.error('No valid current user or AccountID');
  //     return;
  //   }
  //   this.authService.getUserByAccountID(this.currentUser.AccountID).subscribe(
  //     userData => {
  //       this.currentUser = userData;
  //     },
  //     error => {
  //       console.error('Error fetching user data:', error);
  //     }
  //   );
  // }
   loadUserData(): void {
    this.authService.getCurrentUser(this.AccountID).subscribe(
      userData => {
        this.currentUser = userData;
        
      },
      error => {
        console.error('Error fetching user data:', error);
      }
    );
  }
  
  
  
  
  getAllUsers(): void {
    this.http.get("http://localhost:8085/api/users")
      .subscribe((resultData: any) => {
        this.isResultLoaded = true;
        console.log(resultData);
        this.userArray = resultData.data;
        // Find the current user in the fetched user data
        const currentUserData = this.userArray.find((user: any) => user.AccountID === this.AccountID);
        if (currentUserData) {
          // Update currentUser with the latest data
          this.currentUser = currentUserData;
          // Update the input fields with the latest data
          this.LastName = currentUserData.LastName;
          this.FirstName = currentUserData.FirstName;
          this.Birthdate = currentUserData.Birthdate;
          this.StudentNum = currentUserData.StudentNum;
          this.UserName = currentUserData.UserName;
          this.Password = currentUserData.Password;
        }
      });
  }

  toggleEditMode() {
    this.isEditMode = !this.isEditMode;
  }

  enterEditMode(currentUser: any) {
    this.setUpdate(currentUser);
    this.isEditMode = true;
  }

  setUpdate(currentUser: any) {
    this.LastName = currentUser.LastName;
    this.FirstName = currentUser.FirstName;
    this.Birthdate = this.datePipe.transform(currentUser.Birthdate, 'dd-MM-yyyy') || '';
    this.StudentNum = currentUser.StudentNum;
    this.UserName = currentUser.UserName;
    this.Password = currentUser.Password;
    this.AccountID = currentUser.AccountID;
  }

  UpdateProfile() {
    if (!this.AccountID) {
      console.error('AccountID is undefined.');
      return;
    }
  
    let bodyData = {
      "LastName": this.LastName,
      "FirstName": this.FirstName,
      "Birthdate": this.Birthdate,
      "StudentNum": this.StudentNum,
      "UserName": this.UserName,
      "Password": this.Password,
      "isActive": this.currentUser.isActive,
      "AccessLevelID": this.currentUser.AccessLevelID
    };
  
    this.http.put("http://localhost:8085/api/users/update/" + this.currentUser.AccountID, bodyData)
      .subscribe((resultData: any) => {
        console.log(resultData);
        alert("Profile Updated Successfully!");
  
        // Update the currentUser object with the updated data
        // this.currentUser = { ...this.currentUser, ...bodyData };        
        this.authService.updateCurrentUser(bodyData);
        // Call the refreshUserData function to display the updated version from the database
        this.refreshUserData();
  
        this.toggleEditMode();
      });
  }
  

  refreshUserData(): void {
    if (!this.currentUser || !this.currentUser.AccountID) {
      console.error('No valid current user or AccountID');
      return;
    }
  
    // Call the service method to fetch the updated user data using currentUser's AccountID
    this.authService.getCurrentUser(this.currentUser.AccountID).subscribe(
      userData => {
        console.log('User data fetched successfully:', userData);
        this.currentUser = userData;
        // Update the input fields with the fetched data
        this.LastName = userData.LastName || '';
        this.FirstName = userData.FirstName || '';
        this.Birthdate = this.datePipe.transform(userData.Birthdate, 'dd-MM-yyyy') || '';
        this.StudentNum = userData.StudentNum || '';
        this.UserName = userData.UserName || '';
        this.Password = userData.Password || '';
        this.http.get("http://localhost:8085/api/users/" + this.currentUser.AccountID)
        .subscribe((resultData: any) => {
          this.isResultLoaded = true;
          console.log(resultData);
          this.userArray = resultData.data;
          // Find the current user in the fetched user data
          const currentUserData = this.userArray.find((user: any) => user.AccountID === this.AccountID);
          if (currentUserData) {
            // Update currentUser with the latest data
            this.currentUser = currentUserData;
            // Update the input fields with the latest data
            this.LastName = currentUserData.LastName;
            this.FirstName = currentUserData.FirstName;
            this.Birthdate = currentUserData.Birthdate;
            this.StudentNum = currentUserData.StudentNum;
            this.UserName = currentUserData.UserName;
            this.Password = currentUserData.Password;
          }
        });
  
        console.log('After updating input fields with current user data:', this.currentUser);
      },
      error => {
        console.error('Error fetching user data:', error);
        // Handle the error appropriately, e.g., show a message to the user
      }
    );
  }
}
