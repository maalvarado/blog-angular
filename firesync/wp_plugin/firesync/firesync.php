<?php
/**
 * @package FireSync Blog
 * @version 1.0
 */
/*
Plugin Name: FireSync Blog
Plugin URI: https://wordpress.org/plugins/firesync-blog/
Description: Este plugin esta diseñado para enviar los datos de la DB de Wordpress a una API, la cual los procesa para insertarlos a Firebase.
Author: Mike Alvarado
Version: 1.0
Author URI: https://www.mikealvarado.me/
Text Domain: firesync-blog
*/

function fireSync( $post_ID, $post, $update ){

	//Modify to your firebase function endpoint
	$webhook = 'https://ENDPOINT.cloudfunctions.net/webhook';
    
	$hook->post_type = $post->post_type;
	$hook->post_status = $post->post_status;
	$hook->id = $post->post_name;
	$hook->title = $post->post_title;
	$hook->time = $post->post_date;
	$hook->time_modified = $post->post_modified;
	$hook->author = get_the_author_meta( 'nickname', $post->post_author );
	$hook->categories = get_the_category( $post_ID );
	$hook->post_name = str_replace('__trashed','', $post->post_name);
	$hook->featured_image = get_the_post_thumbnail_url( $post_ID, 'large' );
	$hook->featured_image_sm = get_the_post_thumbnail_url( $post_ID, 'medium' );
	$hook->summary = $post->post_excerpt;
	$hook->content = apply_filters( 'the_content', $post->post_content );
	$hook->contentLength = str_word_count( strip_tags( $post->post_content ) );

	$response = wp_remote_post( $webhook, array(
		'body'  => array( 'hook' => $hook,
                          'site'  => get_bloginfo( 'name' ) ) // The site name must be the exact match for 'https://NAME.firebaseio.com' on your db firebase
	) );
}

add_action( 'save_post', 'fireSync', 10, 3 );