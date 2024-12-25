import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../../services/auth.services';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit, OnDestroy {
  isMenuOpen = false;
  isProfileMenuOpen = false;
  private tokenSubscription: Subscription | null = null;

  constructor(
    public authService: AuthService,
    private router: Router
  ) {
    console.log('HeaderComponent constructed');
  }

  ngOnInit() {
    console.log('HeaderComponent initialized');
    // Subscribe to token changes
    this.tokenSubscription = this.authService.token$.subscribe({
      next: (token) => {
        console.log('Token subscription updated:', !!token);
      },
      error: (error) => {
        console.error('Token subscription error:', error);
      }
    });
  }

  ngOnDestroy() {
    if (this.tokenSubscription) {
      this.tokenSubscription.unsubscribe();
      this.tokenSubscription = null;
    }
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
    if (this.isMenuOpen) {
      this.isProfileMenuOpen = false;
    }
  }

  toggleProfileMenu() {
    this.isProfileMenuOpen = !this.isProfileMenuOpen;
    if (this.isProfileMenuOpen) {
      this.isMenuOpen = false;
    }
  }

  logout() {
    console.log('Logout clicked');
    this.authService.logout();
    this.isProfileMenuOpen = false;
    this.router.navigate(['/login']);
  }
}
