import { Component } from '@angular/core';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';

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
    password: new FormControl('', [Validators.required, Validators.minLength(8), Validators.pattern('(?=.*\\d)(?=.*[a-z])(?=.*[A-Z]).{8,}')])
  });

  // Validation pour l'email
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

  // Validation pour le mot de passe
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

  // Soumission du formulaire
  submitLoginForm() {
    if (this.LoginForm.valid) {
      console.log('Formulaire de connexion soumis:', this.LoginForm.value);
      // Ajouter ici la logique pour envoyer les données au serveur
    } else {
      this.markFormGroupTouched(this.LoginForm);
    }
  }

  // Utilitaire pour marquer tous les champs comme touchés
  private markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();

      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }
}
