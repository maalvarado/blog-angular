import { Component, OnInit, Inject, PLATFORM_ID  } from '@angular/core';
import { isPlatformServer } from '@angular/common';
import { TransferState, makeStateKey } from '@angular/platform-browser';

import { AngularFireDatabase } from 'angularfire2/database';

import { SeoService } from '../seo.service';

@Component({
  selector: 'blog-page-not-found',
  templateUrl: './page-not-found.component.html',
  styleUrls: ['./page-not-found.component.scss']
})
export class PageNotFoundComponent implements OnInit {

  page: any;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private db: AngularFireDatabase,
    private seo: SeoService,
    private transferState : TransferState) { }

  ngOnInit() {
    const PAGE_KEY = makeStateKey('page');

    if( !this.transferState.hasKey(PAGE_KEY) ){

      this.db.object(`pages/page-not-found`).valueChanges()
              .subscribe( ( page : any ) => {
                if( page ){
                  this.seo.generateTags({
                    title: page.title, 
                    description: page.summary, 
                    image: page.featured_image,
                    slug: '404',
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