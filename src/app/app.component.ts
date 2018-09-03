import { Component } from '@angular/core';
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
    private db: AngularFireDatabase) {}

  ngOnInit() {

    this.categories = this.db.list('categories').valueChanges();
  }
}
