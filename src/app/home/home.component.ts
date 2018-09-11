import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformServer } from '@angular/common';
import { TransferState, makeStateKey } from '@angular/platform-browser';

import { AngularFireDatabase } from 'angularfire2/database';

import { SeoService } from '../seo.service';

@Component({
  selector: 'blog-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  top: any;
  last: any;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private db: AngularFireDatabase,
    private seo: SeoService,
    private transferState : TransferState) { }

  ngOnInit() {
    const TOP_KEY = makeStateKey('top');
    const LAST_KEY = makeStateKey('last');

    this.db.object(`pages/home`).valueChanges()
              .subscribe( ( page: any ) => {
                this.seo.generateTags({
                  title: page.title, 
                  description: page.summary, 
                  image: page.featured_image,
                  slug: '',
                  type: 'website'
                })
              });
    
    if( !this.transferState.hasKey(TOP_KEY) ){
      this.db.list(`categories/top/items`, ref => ref.orderByChild('time').limitToLast( 3 ) ).valueChanges()
                .subscribe( ( items : any[] ) => {
                  this.top = items;

                  if( isPlatformServer( this.platformId ) ) {
                    this.transferState.set<any[]>(TOP_KEY, items);
                  }
                });
                
      this.db.list(`posts`, ref => ref.orderByChild('time').limitToLast( 7 ) ).valueChanges()
                .subscribe( ( items : any[] ) => {
                  this.last = items;

                  if( isPlatformServer( this.platformId ) ) {
                    this.transferState.set<any[]>(LAST_KEY, items);
                  }
                });
    } else {
      this.top = this.transferState.get<any[]>(TOP_KEY, null);
      this.last = this.transferState.get<any[]>(LAST_KEY, null);
      this.transferState.remove(TOP_KEY);
      this.transferState.remove(LAST_KEY);
    }   
  }

}