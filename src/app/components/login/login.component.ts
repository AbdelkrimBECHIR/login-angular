// src/app/components/login/login.component.ts
import { Component } from '@angular/core';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../../services/auth.services';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  LoginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(8) /*, Validators.pattern('(?=.*\\d)(?=.*[a-z])(?=.*[A-Z]).{8,}')*/])
  });

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  emailError(): string {
    const emailControl = this.LoginForm.get('email');
    if (!emailControl) return '';

    if (emailControl.hasError('required') && emailControl.touched) {
      return 'L\'email est requis';
    }
    if (emailControl.hasError('email') && emailControl.touched) {
      return 'Veuillez entrer une adresse email valide';
    }
    return '';
  }

  passwordError(): string {
    const passwordControl = this.LoginForm.get('password');
    if (!passwordControl) return '';

    if (passwordControl.hasError('required') && passwordControl.touched) {
      return 'Le mot de passe est requis';
    }
    if (passwordControl.hasError('minlength') && passwordControl.touched) {
      return 'Le mot de passe doit contenir au moins 8 caractères';
    }
    if (passwordControl.hasError('pattern') && passwordControl.touched) {
      return 'Le mot de passe doit contenir au moins une majuscule, une minuscule et un chiffre';
    }
    return '';
  }

  submitLoginForm() {
    if (this.LoginForm.valid) {
      const loginData = {
        email: this.LoginForm.get('email')?.value || '',
        password: this.LoginForm.get('password')?.value || ''
      };

      this.authService.login(loginData).subscribe({
        next: (response) => {
          console.log('Connexion réussie', response);
          this.router.navigate(['/home']);
        },
        error: (error) => {
          console.error('Erreur de connexion:', error);
          // Gérer l'erreur (afficher un message à l'utilisateur par exemple)
        }
      });
    } else {
      this.markFormGroupTouched(this.LoginForm);
    }
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();

      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }
}
