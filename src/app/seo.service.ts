import { Injectable } from '@angular/core';
import { Meta } from '@angular/platform-browser';

@Injectable()
export class SeoService {

  constructor(
    private meta: Meta) { }

  generateTags(config) {
    config = { 
      title: config.title ? config.title : 'Blog', 
      description: config.description ? config.description : 'Blog', 
      image: config.image ? config.image : 'https://www.SITE.com/assets/icons/icon-128x128.png',
      slug: config.slug ? config.slug : '',
      type: config.type ? config.type : 'website'
    }

    this.meta.updateTag({ name: 'twitter:card', content: 'summary' });
    this.meta.updateTag({ name: 'twitter:site', content: '@blog' });
    this.meta.updateTag({ name: 'twitter:title', content: config.title });
    this.meta.updateTag({ name: 'twitter:description', content: config.description });
    this.meta.updateTag({ name: 'twitter:image', content: config.image });

    this.meta.updateTag({ property: 'og:type', content: config.type });
    this.meta.updateTag({ property: 'og:site_name', content: 'Blog' });
    this.meta.updateTag({ property: 'og:title', content: config.title });
    this.meta.updateTag({ property: 'og:description', content: config.description });
    this.meta.updateTag({ property: 'og:image', content: config.image });
    this.meta.updateTag({ property: 'og:url', content: 'https://www.SITE.com/' + config.slug });
  }

}