import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Observable } from 'rxjs';

import { AngularFireDatabase } from 'angularfire2/database';

import { SeoService } from '../seo.service';

@Component({
  selector: 'blog-page',
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.scss']
})
export class PageComponent implements OnInit {
  
  page$: Observable<any>;

  constructor(
    private route: ActivatedRoute,
    private db: AngularFireDatabase,
    private seo: SeoService) { }

  ngOnInit() {
    const id = this.route.snapshot.url[0].path;
    this.page$ = this.db.object(`pages/${id}`).valueChanges();

    this.page$.subscribe( ( page: any ) => {
      this.seo.generateTags({
        title: page.title, 
        description: page.summary, 
        image: page.featured_image,
        slug: page.id,
        type: 'website'
      })
    });
  }

}
