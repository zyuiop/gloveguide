import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login-component',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(public auth: AuthService) { }

  ngOnInit(): void {
  }

  tryLogin() {
    const pwd = prompt('Password?');

    this.auth.tryLogin(pwd)
      .subscribe(
        ok => Swal.fire('Login success', 'You are not logged in as an admin :)', 'success'),
        err => Swal.fire('Login failure', 'Cannot log in for the moment. Are you sure the password was correct?', 'error')
      );
  }
}
