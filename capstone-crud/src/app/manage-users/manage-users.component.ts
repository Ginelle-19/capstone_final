import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';


@Component({
  selector: 'app-manage-users',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule
  ],
  templateUrl: './manage-users.component.html',
  styleUrl: './manage-users.component.css'
})
export class ManageUsersComponent {

  users: any[] = [];
  AccessLevels: any[] = [];
  isResultLoaded = false;
  isUpdateFormActive = false;

  currentUser: any = {
    UserName: '',
    Password: '',
    LastName: '',
    FirstName: '',
    Birthdate: '',
    StudentNum: '',
    AccessLevelID: '',
    isActive: false
  };

  constructor(private http: HttpClient) {
    this.getAllUsers();
    this.loadAccessLevels();
  }

  getAllUsers() {
    this.http.get("http://localhost:8085/api/users")
      .subscribe((resultData: any) => {
        this.isResultLoaded = true;
        console.log(resultData.data);
        this.users = resultData.data;
      });
    }

  addUser() {
    this.http.post("http://localhost:8085/api/users/add", this.currentUser)
      .subscribe((resultData: any) => {
        console.log(resultData);
        alert("User Added Successfully!");
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
      console.error('currentUser is undefined or does not have an isActive property');
    }
  }
  UpdateRecords(currentUser:any){
    let bodyData = {
      "UserName" : currentUser.UserName,
      "Password" : currentUser.Password,
      "LastName" : currentUser.LastName,
      "FirstName" : currentUser.FirstName,
      "Birthdate" : currentUser.Birthdate,
      "StudentNum" : currentUser.StudentNum,
      "isActive" : currentUser.isActive,
      "AccessLevelID" :currentUser.AccessLevelID
    };
  
    this.http.put("http://localhost:8085/api/users/update" + "/" + currentUser.AccountID, bodyData)
      .subscribe((resultData: any) =>{
        console.log(resultData);
        alert("User Updated Successfully!")
        this.getAllUsers();
      });
  }
  
  save(){
    if(this.currentUser.AccountID == ''){
      this.addUser();
    } else {
      this.UpdateRecords(this.currentUser);
    }
  }

  deleteUser(user: any) {
    this.http.delete("http://localhost:8085/api/users/delete/" + user.AccountID)
      .subscribe(
        () => {
          console.log("User Deleted Successfully!");
          this.getAllUsers(); // Update the user list after deletion
        },
        (error) => {
          console.error("Error deleting user:", error);
          alert("Failed to delete user. Please try again later.");
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
      isActive: false
    };
    this.isUpdateFormActive = false;
  }
  loadAccessLevels(){
    this.http.get("http://localhost:8085/api/access")
    .subscribe((resultData: any) => {
      this.isResultLoaded = true;
      console.log(resultData.data);
      this.AccessLevels = resultData.data;
    });
  }
  updateAccessLevel(currentUser: any) {
    this.UpdateRecords(currentUser); // Call your existing method to update the user's record
  }
}
