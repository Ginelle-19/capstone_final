import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { NgxPaginationModule } from 'ngx-pagination';

@Component({
  selector: 'app-manage-users',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatIconModule,
    NgxPaginationModule,
  ],
  templateUrl: './manage-users.component.html',
  styleUrl: './manage-users.component.css',
})
export class ManageUsersComponent {
  users: any[] = [];
  AccessLevels: any[] = [];
  isResultLoaded = false;
  isUpdateFormActive = false;
  p: number = 1;
  itemsPerPage: number = 7;

  currentUser: any = {
    UserName: '',
    Password: '',
    LastName: '',
    FirstName: '',
    Birthdate: '',
    StudentNum: '',
    AccessLevelID: '',
    isActive: false,
  };

  constructor(private http: HttpClient) {
    this.getAllUsers();
    this.loadAccessLevels();
  }

  getAllUsers() {
    this.http
      .get('http://localhost:8085/api/users')
      .subscribe((resultData: any) => {
        this.isResultLoaded = true;
        console.log(resultData.data);
        this.users = resultData.data;
        this.users.forEach(user => {
          user.editingPassword = false;
        });
      });
  }

  addUser() {
    this.http
      .post('http://localhost:8085/api/users/add', this.currentUser)
      .subscribe((resultData: any) => {
        console.log(resultData);
        alert('User Added Successfully!');
        this.getAllUsers();
      });
  }
  setUpdate(user: any) {
    // Set currentUser to the selected user for editing
    this.currentUser = { ...user }; // Copy user object to prevent reference mutation
    this.isUpdateFormActive = true;
  }

  toggleActive(currentUser: any) {
    if (currentUser && currentUser.isActive !== undefined) {
      currentUser.isActive = currentUser.isActive === 1 ? 0 : 1; // Toggle isActive value
      this.UpdateRecords(currentUser); // Update the record with the new isActive value
    } else {
      console.error(
        'currentUser is undefined or does not have an isActive property'
      );
    }
  }
  UpdateRecords(currentUser: any) {
    let bodyData = {
      UserName: currentUser.UserName,
      Password: currentUser.Password,
      LastName: currentUser.LastName,
      FirstName: currentUser.FirstName,
      Birthdate: currentUser.Birthdate,
      StudentNum: currentUser.StudentNum,
      isActive: currentUser.isActive,
      AccessLevelID: currentUser.AccessLevelID,
    };

    this.http
      .put(
        'http://localhost:8085/api/users/update' + '/' + currentUser.AccountID,
        bodyData
      )
      .subscribe((resultData: any) => {
        console.log(resultData);
        alert('User Updated Successfully!');
        this.getAllUsers();
      });
  }

  toggleEditPassword(user: any) {
    user.editingPassword = !user.editingPassword;
  }
  

  // save() {
  //   if (this.currentUser.AccountID == '') {
  //     this.addUser();
  //   } else {
  //     this.UpdateRecords(this.currentUser);
  //   }
  // }
  save() {
    // Check if the password editing mode is enabled
    if (!this.currentUser.editingPassword) {
      // Password editing mode is not enabled, proceed with saving
      if (this.currentUser.AccountID == '') {
        this.addUser();
      } else {
        this.UpdateRecords(this.currentUser);
      }
    } else {
      // Password editing mode is enabled, do not save
      console.log("Cannot save while editing password.");
    }
  }

  deleteUser(user: any) {
    this.http
      .delete('http://localhost:8085/api/users/delete/' + user.AccountID)
      .subscribe(
        () => {
          console.log('User Deleted Successfully!');
          this.getAllUsers(); // Update the user list after deletion
        },
        (error) => {
          console.error('Error deleting user:', error);
          alert('Failed to delete user. Please try again later.');
        }
      );
  }

  setCurrentUser(user: any) {
    this.currentUser = { ...user }; // copy user object to prevent reference mutation
    this.isUpdateFormActive = true;
  }

  cancelUpdate() {
    this.currentUser = {
      UserName: '',
      Password: '',
      LastName: '',
      FirstName: '',
      Birthdate: '',
      StudentNum: '',
      isActive: false,
    };
    this.isUpdateFormActive = false;
  }
  loadAccessLevels() {
    this.http
      .get('http://localhost:8085/api/access')
      .subscribe((resultData: any) => {
        this.isResultLoaded = true;
        console.log(resultData.data);
        this.AccessLevels = resultData.data;
      });
  }
  updateAccessLevel(currentUser: any) {
    this.UpdateRecords(currentUser); // Call your existing method to update the user's record
  }

  cancelEditPassword(user: any) {
    // Reset the user's password to its original value
    user.Password = this.users.find(u => u.AccountID === user.AccountID)?.Password;
    // Set editingPassword back to false to exit editing mode
    user.editingPassword = false;
  }
}