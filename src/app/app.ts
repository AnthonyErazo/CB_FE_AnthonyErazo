import { Component } from '@angular/core';
import { AccountView } from './features/account/account';

@Component({
  selector: 'app-root',
  imports: [AccountView],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {}
