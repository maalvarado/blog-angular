import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { CategoryComponent } from './category/category.component';
import { PostComponent } from './post/post.component';
import { PageComponent } from './page/page.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: '404', component: PageNotFoundComponent },
  { path: 'categoria', redirectTo: '/categoria/top', pathMatch: 'full' },
  { path: 'categoria/:id', component: CategoryComponent },
  { path: 'privacidad', component: PageComponent },
  { path: 'conocenos', component: PageComponent },
  { path: 'contacto', component: PageComponent },
  { path: ':id', component: PostComponent }
];

@NgModule({
  imports: [ RouterModule.forRoot( routes ) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }