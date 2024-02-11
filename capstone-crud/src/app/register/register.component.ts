import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { RegisterService } from '../services/register.service';
import { Router, RouterModule } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatIconModule,
    RouterModule
  ]
})
export class RegisterComponent implements OnInit {
  public registerForm!: FormGroup;
  public isRegistering: boolean = false;

  constructor(private registerService: RegisterService, private router: Router, private snackBar: MatSnackBar) {}

  ngOnInit() {
    this.registerForm = new FormGroup({
      FirstName: new FormControl('', Validators.required),
      LastName: new FormControl('', Validators.required),
      Birthdate: new FormControl('', Validators.required),
      StudentNum: new FormControl('', Validators.required)
      // Add other form controls as needed...
    });
  }

  onSubmit() {
    if (this.registerForm.invalid) {
      // If the form is invalid, prevent registration and show a message to the user
      this.snackBar.open('Please fill in all required fields.', 'Close', {
        duration: 5000,
        panelClass: 'error-snackbar'
      });
      return;
    }

    const FirstName = this.registerForm.get('FirstName')!.value;
    const LastName = this.registerForm.get('LastName')!.value;
    const Birthdate = this.registerForm.get('Birthdate')!.value;
    const StudentNum = this.registerForm.get('StudentNum')!.value;

    const UserName = StudentNum;
    const Password = this.formatPassword(Birthdate);

    // Check if the student number is already registered
    this.registerService.checkStudentNumber(StudentNum).subscribe(
      (isRegistered) => {
        if (isRegistered) {
          this.snackBar.open('Student number is already registered.', 'Close', {
            duration: 5000,
            panelClass: 'error-snackbar'
          });
        } else {
          // If the student number is not registered, proceed with registration
          this.isRegistering = true; // Set flag to indicate registration is in progress
          this.registerService.register(UserName, Password, FirstName, LastName, Birthdate, StudentNum).subscribe(
            (response) => {
              console.log('Registration successful:', response);
              this.snackBar.open('Registration successful!', 'Close', {
                duration: 5000,
                panelClass: 'success-snackbar'
              });
              this.router.navigate(['']);
            },
            (error) => {
              console.error('Registration error:', error);
            }
          ).add(() => {
            this.isRegistering = false; // Reset the flag when registration completes (whether success or failure)
          });
        }
      },
      (error) => {
        console.error('Error checking student number:', error);
      }
    );
  }

  private formatPassword(birthdate: string): string {
    const dateParts = birthdate.split('-');
    const month = dateParts[1];
    const day = dateParts[2];
    const year = dateParts[0];
    return month + day + year;
  }
}
