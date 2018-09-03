import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { AngularFireDatabase } from 'angularfire2/database';

import { SeoService } from '../seo.service';

@Component({
  selector: 'blog-page-not-found',
  templateUrl: './page-not-found.component.html',
  styleUrls: ['./page-not-found.component.scss']
})
export class PageNotFoundComponent implements OnInit {

  page$: Observable<any>;

  constructor(
    private db: AngularFireDatabase,
    private seo: SeoService) { }

  ngOnInit() {
    this.page$ = this.db.object(`pages/page-not-found`).valueChanges();

    this.page$.subscribe( ( page: any ) => {
      this.seo.generateTags({
        title: page.title, 
        description: page.summary, 
        image: page.featured_image,
        slug: '404',
        type: 'website'
      })
    });
  }

}
