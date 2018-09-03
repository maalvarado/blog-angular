import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';

import { Observable } from 'rxjs';

import { AngularFireDatabase } from 'angularfire2/database';

import { SeoService } from '../seo.service';

@Component({
  selector: 'blog-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit {
  items$: Observable<any[]>;
  id: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private db: AngularFireDatabase,
    private seo: SeoService) { }

  ngOnInit() {
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.id = params.get('id');
      this.items$  = this.db.list(`categories/${this.id}/items`, ref => ref.orderByChild('time').limitToLast( 12 ) ).valueChanges();

      this.items$.subscribe( s => {
        if(s.length === 0){
          this.router.navigateByUrl('/404');
        }
      });

      this.db.object(`pages/${this.id}`).valueChanges().subscribe( ( page: any ) => {
        this.seo.generateTags({
          title: page.title, 
          description: page.summary, 
          image: page.featured_image,
          slug: 'categoria/' + page.id,
          type: 'website'
        })
      });
    });
  }

}
