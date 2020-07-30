// Service Worker

// imports
importScripts('js/sw-utils.js');

const STATIC_CACHE = 'static-v2';
const DYNAMIC_CACHE = 'dynamic-v1';
const INMUTABLE_CACHE = 'inmutable-v1';

// APP SHELL: Contendrá todo lo requerido de la página
const APP_SHELL = [
    '/',
    'index.html',
    'css/style.css',
    'img/favicon.ico',
    'img/avatars/hulk.jpg',
    'img/avatars/ironman.jpg',
    'img/avatars/spiderman.jpg',
    'img/avatars/thor.jpg',
    'img/avatars/wolverine.jpg',
    'js/app.js'
];

const APP_SHELL_INMUITABLE = [
    'https://fonts.googleapis.com/css?family=Quicksand:300,400',
    'https://fonts.googleapis.com/css?family=Lato:400,300',
    'https://use.fontawesome.com/releases/v5.3.1/css/all.css',
    'css/animate.css',
    'js/libs/jquery.js'
]

// Instalación de SW
self.addEventListener('install', e =>{
   
    const cacheStatic = caches.open( STATIC_CACHE ).then( cache => 
        cache.addAll( APP_SHELL ));
    
    const cacheInmutable = caches.open( INMUTABLE_CACHE ).then( cache => 
        cache.addAll( APP_SHELL_INMUITABLE ));
    
    e.waitUntil( Promise.all([ cacheStatic, cacheInmutable ]) );
});

// Eliminar caches anteriores
self.addEventListener('activate', e => {
    
       const respuesta = caches.keys().then( keys =>{
        
       keys.forEach( key =>{
        
           if( key != STATIC_CACHE && key.includes('static') ){
               
               return caches.delete( key );
           }           
       }) 
        
    });
   
    
    e.waitUntil( respuesta );     
});

// Estrategia del cache
self.addEventListener('fetch', e => {
    
   const respuesta = caches.match( e.request).then( res => {
      
      if(res){
          return res;
      } else {
          
          return fetch( e.request ).then( newResp => {
             
              return updateCacheDynamic( DYNAMIC_CACHE, e.request, newResp );
          });          
      }
       
   }); 
    
    e.respondWith( respuesta );
    
});