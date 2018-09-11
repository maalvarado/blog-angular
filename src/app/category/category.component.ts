import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformServer } from '@angular/common';
import { TransferState, makeStateKey } from '@angular/platform-browser';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';


import { AngularFireDatabase } from 'angularfire2/database';

import { SeoService } from '../seo.service';

@Component({
  selector: 'blog-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit {
  items: any;
  id: string;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private route: ActivatedRoute,
    private router: Router,
    private db: AngularFireDatabase,
    private seo: SeoService,
    private transferState : TransferState) { }

  ngOnInit() {
    const CATEGORY_KEY = makeStateKey('category');

    this.route.paramMap.subscribe((params: ParamMap) => {
      this.id = params.get('id');

      this.db.object(`pages/${this.id}`).valueChanges()
              .subscribe( ( page: any ) => {
                this.seo.generateTags({
                  title: page.title, 
                  description: page.summary, 
                  image: page.featured_image,
                  slug: 'categoria/' + page.id,
                  type: 'website'
                })
              });
      
      if( !this.transferState.hasKey(CATEGORY_KEY) ){
        this.db.list(`categories/${this.id}/items`, ref => ref.orderByChild('time').limitToLast( 12 ) ).valueChanges()
                  .subscribe( ( items : any ) => {
                    if( items.length === 0){
                      this.router.navigateByUrl('/404');
                    } else {
                      this.items = items;

                      if( isPlatformServer( this.platformId ) ) {
                        this.transferState.set<any[]>(CATEGORY_KEY, items);
                      }
                    }
                  });
      } else {
        this.items = this.transferState.get<any[]>(CATEGORY_KEY, null);
        this.transferState.remove(CATEGORY_KEY);
      }
    });
  }

}