import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';

import { Observable } from 'rxjs';

import { AngularFireDatabase } from 'angularfire2/database';

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
    private db: AngularFireDatabase) { }

  ngOnInit() {
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.id = params.get('id');
      this.items$  = this.db.list(`categories/${this.id}/items`, ref => ref.orderByChild('time').limitToLast( 12 ) ).valueChanges();

      this.items$.subscribe( s => {
        if(s.length === 0){
          this.router.navigateByUrl('/404');
        }
      });
    });
  }

}
