import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformServer } from '@angular/common';
import { TransferState, makeStateKey } from '@angular/platform-browser';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';

import { AngularFireDatabase } from 'angularfire2/database';

import { SeoService } from '../seo.service';

@Component({
  selector: 'blog-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss']
})
export class PostComponent implements OnInit {

  post: any;
  last: any;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private route: ActivatedRoute,
    private router: Router,
    private db: AngularFireDatabase,
    private seo: SeoService,
    private transferState : TransferState) { }

  ngOnInit() {
    const POST_KEY = makeStateKey('post');

    this.route.paramMap.subscribe((params: ParamMap) => {
      const id = params.get('id');

      if( !this.transferState.hasKey(POST_KEY) ){
        this.db.object(`posts/${id}`).valueChanges()
                .subscribe( ( post : any ) => {
                  if(!post){
                    this.router.navigateByUrl('/404');
                  } else {
                    this.seo.generateTags({
                      title: post.title, 
                      description: post.summary, 
                      image: post.featured_image,
                      slug: post.id,
                      type: 'article'
                    })

                    this.post = post;

                    if( isPlatformServer( this.platformId ) ) {
                      this.transferState.set<any[]>(POST_KEY, post);
                    }
                  }
                });
      } else {
        this.post = this.transferState.get<any[]>(POST_KEY, null);
        this.transferState.remove(POST_KEY);
      }

      this.db.list(`posts`, ref => ref.orderByChild('time').limitToLast( 7 ) ).valueChanges()
              .subscribe( ( items : any ) => {
                this.last = items;
              });
    });
  }
}