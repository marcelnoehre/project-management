import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent {
  hidePassword = true;
  hidePasswordRepeat = true;
  registrationForm!: FormGroup;

  constructor(
    private router: Router,
    private _storage: StorageService
    ) { }

  ngOnInit(): void {
    this.createForm();
  }

  private createForm(): void {
    this.registrationForm = new FormGroup(
      {
        usernameFormControl: new FormControl('', {validators: [Validators.required] }),
        passwordFormControl: new FormControl('', { validators: [Validators.required] }), 
        passwordRepeatFormControl: new FormControl('', { validators: [Validators.required] })
      },
      {}
    );
  }

  public userValid(): boolean {
		return this.registrationForm.controls['usernameFormControl'].valid;
	}

	public passwordValid(): boolean {
		return this.registrationForm.controls['passwordFormControl'].valid;
	}

  public passwordRepeatValid(): boolean {
		return this.registrationForm.controls['passwordRepeatFormControl'].valid;
	}

  register() {
    throw new Error('Method not implemented!');
  }

}
