import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

@Component({
  selector: 'app-facility-crud',
  templateUrl: './facility-crud.component.html',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule
  ],
  styleUrls: ['./facility-crud.component.css'],
  standalone: true
})
export class FacilityCrudComponent {
  RoomsArray: any[] = [];
  isResultLoaded = false;
  isUpdateFormActive = false;

  RoomName: string = "";
  RoomDesc: string = "";
  RoomStatus!: number;
  RoomID! : '';
  currentRoom: any;

  constructor(private http: HttpClient) {
    this.getAllRooms();
  }

  getAllRooms() {
    this.http.get("http://localhost:8085/api/room")
      .subscribe((resultData: any) => {
        this.isResultLoaded = true;
        console.log(resultData);
        this.RoomsArray = resultData.data;
      });
  }

  addRooms() {
    let bodyData = {
      "RoomName": this.RoomName,
      "RoomDesc": this.RoomDesc,
      "RoomStatus": this.RoomStatus
    };

    this.http.post("http://localhost:8085/api/room/add", bodyData)
      .subscribe((resultData: any) => {
        console.log(resultData);
        alert("Room Added Successfully!");
        this.getAllRooms();
      });
  }

  setUpdate(data: any) {
    this.RoomName = data.RoomName;
    this.RoomDesc = data.RoomDesc;
    this.RoomStatus = data.RoomStatus;
    this.RoomID = data.RoomID;
  }

  UpdateRecords(data: any) {
    let bodyData = {
      "RoomName": data.RoomName,
      "RoomDesc": data.RoomDesc,
      "RoomStatus": data.RoomStatus,
      "RoomID": data.RoomID
    };
    
  
    this.http.put("http://localhost:8085/api/room/update" + "/" + data.RoomID, bodyData)
      .subscribe((resultData: any) => {
        console.log(resultData);
        alert("Room Updated Successfully!");
        this.getAllRooms();
      });
  }

  toggleActive(data: any) {
    if (data && data.RoomStatus !== undefined) {
      data.RoomStatus = data.RoomStatus === 1 ? 0 : 1;
      this.UpdateRecords(data);
    } else {
      console.error('currentRoom is undefined or does not have an RoomStatus property');
    }
  }

  
  save() {
    if (this.RoomID && this.RoomID !== '') {
      // Construct an object with the necessary room data
      const roomData = {
        RoomName: this.RoomName,
        RoomDesc: this.RoomDesc,
        RoomStatus: this.RoomStatus,
        RoomID: this.RoomID
      };
      this.UpdateRecords(roomData);
    } else {
      this.addRooms();
    }
  }

  deleteRoom(room: any) {
    this.http.delete("http://localhost:8085/api/room/delete/" + room.RoomID)
      .subscribe(
        () => {
          console.log("Room Deleted Successfully!");
          this.getAllRooms();
        },
        (error) => {
          console.error("Error deleting room:", error);
          alert("Failed to delete room. Please try again later.");
        }
      );
  }
}
