const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();
var blogApp;

exports.webhook = functions.https.onRequest((rq, rs) => {
  
  if( !blogApp ) {
    blogApp = admin.initializeApp({
                databaseURL: 'https://' + rq.body.site + '.firebaseio.com'
              }, rq.body.site );
  }

  const database = admin.database( blogApp );

  if (rq.method === 'POST') {

    let body = rq.body.hook;

    if (body.post_type === 'page') {
        
        if ( body.post_status === 'publish' ) {
          
          database.ref('pages/'+body.post_name).set(body);

        } else if ( body.post_status === 'trash' ) {

          database.ref('pages/'+body.post_name).remove();
        }

        return rs.send("Completed");
        
    } else if ( body.post_type === 'post' ) {

      return database.ref('posts/'+body.post_name).once('value').then( snapshot => {
        
        let post = snapshot.val();

        if ( post && post.categories ) {
          
          post.categories.forEach( category => {

            database.ref('categories/' + category.slug + '/items/' + body.post_name).remove();
   
          });
        }

        return;
      }).then( () => {
        if (body.post_status === 'publish') {
        
          body.categories.forEach( category => {
            
            database.ref('categories/' + category.slug + '/items/' + body.post_name).set(body);
            database.ref('categories/' + category.slug + '/metadata/').set({name: category.slug, title: category.name});
          });        
  
          database.ref('posts/'+body.post_name).set(body);

        } else if ( body.post_status === 'trash' ) {

          database.ref('posts/'+body.post_name).remove();
        }

        return rs.send("Completed");
      });
    }
  } else {
    rs.send("It doesn't work :/");
  }
});