import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { AngularFireDatabase } from 'angularfire2/database';

@Component({
  selector: 'blog-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches)
    );
  
  categories: Observable<any[]>;

  constructor(
    private breakpointObserver: BreakpointObserver,
    private router: Router,
    private db: AngularFireDatabase) {}

  ngOnInit() {

    this.categories = this.db.list('categories').valueChanges();

    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
          return;
      }
      const contentContainer = document.querySelector('.mat-sidenav-content') || window;
      contentContainer.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth'
      })
    });
  }
}
