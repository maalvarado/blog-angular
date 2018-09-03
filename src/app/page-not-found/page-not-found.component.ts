import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { AngularFireDatabase } from 'angularfire2/database';

@Component({
  selector: 'blog-page-not-found',
  templateUrl: './page-not-found.component.html',
  styleUrls: ['./page-not-found.component.scss']
})
export class PageNotFoundComponent implements OnInit {

  page$: Observable<any>;

  constructor(
    private db: AngularFireDatabase) { }

  ngOnInit() {
    this.page$ = this.db.object(`pages/page-not-found`).valueChanges();
  }

}
