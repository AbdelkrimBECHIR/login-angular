import { Component } from '@angular/core';
import {ReactiveFormsModule,FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {

  RegisterForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(3)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.minLength(8) , Validators.pattern('(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}')]),
    confirmPassword: new FormControl('', [Validators.minLength(8) , Validators.pattern('(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}')]),
 });

  // Validation pour le nom
  nameError(): string {
    const nameControl = this.RegisterForm.get('name');
    if (!nameControl) return '';

    if (nameControl.hasError('required') && nameControl.touched) {
      return 'Le nom est requis';
    }
    if (nameControl.hasError('minlength') && nameControl.touched) {
      return 'Le nom doit contenir au moins 3 caractères';
    }
    return '';
  }

  // Validation pour l'email
  emailError(): string {
    const emailControl = this.RegisterForm.get('email');
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
    const passwordControl = this.RegisterForm.get('password');
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

  // Validation pour la confirmation du mot de passe
  confirmPasswordError(): string {
    const confirmPasswordControl = this.RegisterForm.get('confirmPassword');
    if (!confirmPasswordControl) return '';

    if (confirmPasswordControl.hasError('required') && confirmPasswordControl.touched) {
      return 'La confirmation du mot de passe est requise';
    }
    if (this.checkPassword()) {
      return 'Les mots de passe ne correspondent pas';
    }
    return '';
  }

  // Vérification de la correspondance des mots de passe
  checkPassword(): boolean {
    const password = this.RegisterForm.get('password')?.value;
    const confirmPassword = this.RegisterForm.get('confirmPassword')?.value;
    return password !== confirmPassword && !!this.RegisterForm.get('confirmPassword')?.touched;
  }

  // Soumission du formulaire
  submitRegisterForm() {
    if (this.RegisterForm.valid) {
      console.log('Formulaire soumis avec succès:', this.RegisterForm.value);
      // Ajouter ici la logique pour envoyer les données au serveur
    } else {
      this.markFormGroupTouched(this.RegisterForm);
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
