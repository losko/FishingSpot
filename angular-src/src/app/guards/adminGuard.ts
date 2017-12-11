import { Injectable} from "@angular/core"
import { Router, CanActivate } from "@angular/router"
import { AuthService } from "../services/auth.service"

@Injectable()
export class AdminGuard implements CanActivate{
  isAdmin: Boolean;
  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    this.isAdmin = false;
  }

  canActivate() {
    if(localStorage.getItem('user')) {
      let user = JSON.parse(localStorage.getItem('user'));
      this.isAdmin = user.isAdmin;
    }
    if(this.authService.loggedIn() && this.isAdmin) {
      return true;
    } else {
      this.router.navigate(['/']);
      return false;
    }
  }
}
