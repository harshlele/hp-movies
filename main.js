Vue.component('title-text',{
    props:['title'],
    template : '<h1 id="title">{{title}}</h1>'
});

Vue.component('movie-item',{
    props: ['title','year','poster'],
    template: `
            <div class="item">
                <img id="item-poster" v-bind:src="poster">
                <div id="item-details">
                    <div id="item-title">{{title}}</div>
                    <div id="item-year">{{year}}</div>
                </div>
                
            </div>
            `
});

Vue.component('btn-loadmore',{
    template: `<div id="btn-loadmore">Load More</div>`
});

var app = new Vue({
    el: ".container",
    data:{
        title:"Movies",
        movies:[],
        allLoaded: false,
        currentPage: 1
    },

    methods:{
        loadMovies: function(){
            
            var req = new XMLHttpRequest();
            req.open("GET","http://www.omdbapi.com?apikey=e0620bd4&s=harry potter" + "&page=" + this.currentPage, true);
            req.onreadystatechange = function(){
            
                if(this.readyState == 4 && this.status == 200){
            
                    let results = JSON.parse(this.responseText);
                    results.Search.forEach(element => {
                        app.movies.push({
                            title: element.Title,
                            poster: element.Poster,
                            year: element.Year
                        })
            
                        if(app.movies.length == results.totalResults){
                            app.allLoaded = true;
                        }
                        
                    });
                }   
        
            }
            req.send();
        },

        onLoadMoreClick: function(event){
            app.currentPage += 1;
            this.loadMovies();
        }
    },

    mounted(){
        this.loadMovies();
    },
});


