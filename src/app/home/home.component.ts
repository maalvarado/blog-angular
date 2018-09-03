import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { AngularFireDatabase } from 'angularfire2/database';

import { SeoService } from '../seo.service';

@Component({
  selector: 'blog-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  top$: Observable<any[]>;
  last$: Observable<any[]>;

  constructor(
    private db: AngularFireDatabase,
    private seo: SeoService) { }

  ngOnInit() {
    this.db.object(`pages/home`).valueChanges().subscribe( ( page: any ) => {
      this.seo.generateTags({
        title: page.title, 
        description: page.description, 
        image: page.featured_image,
        slug: '',
        type: 'website'
      })
    });
    
    this.top$ = this.db.list(`categories/top/items`, ref => ref.orderByChild('time').limitToLast( 3 ) ).valueChanges();
    this.last$ = this.db.list(`posts`, ref => ref.orderByChild('time').limitToLast( 7 ) ).valueChanges();
  }

}
