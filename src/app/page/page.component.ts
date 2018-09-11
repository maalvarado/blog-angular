import { Component, OnInit, Inject, PLATFORM_ID  } from '@angular/core';
import { isPlatformServer } from '@angular/common';
import { TransferState, makeStateKey } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';

import { AngularFireDatabase } from 'angularfire2/database';

import { SeoService } from '../seo.service';

@Component({
  selector: 'blog-page',
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.scss']
})
export class PageComponent implements OnInit {
  
  page: any;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private route: ActivatedRoute,
    private db: AngularFireDatabase,
    private seo: SeoService,
    private transferState : TransferState) { }

  ngOnInit() {
    const PAGE_KEY = makeStateKey('page');

    if( !this.transferState.hasKey(PAGE_KEY) ){
    
      const id = this.route.snapshot.url[0].path;
      this.db.object(`pages/${id}`).valueChanges()
              .subscribe( ( page : any ) => {
                if( page ){

                  this.seo.generateTags({
                    title: page.title, 
                    description: page.summary, 
                    image: page.featured_image,
                    slug: page.id,
                    type: 'website'
                  })

                  this.page = page;

                  if( isPlatformServer( this.platformId ) ) {
                    this.transferState.set<any[]>(PAGE_KEY, page);
                  }
                  
                }
              });

    } else {
      this.page = this.transferState.get<any[]>(PAGE_KEY, null);
      this.transferState.remove(PAGE_KEY);
    }
    
  }

}
