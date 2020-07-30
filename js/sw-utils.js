
// Guardar en el cache dinámico
function updateCacheDynamic( dynamicCache, req, res ){
    
    if( res.ok ){
        
        // Si ok hay datos
        return caches.open( dynamicCache ).then( cache => {
           
            cache.put( req, res.clone() );
            return res.clone();
        });
    
    } else {
        
        // Si no hay datos
        return res;
    }   
    
}