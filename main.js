Vue.component('title-text',{
    props:['title','numResults'],
    template : `
            <div id="title">
                <h1>{{title}}</h1>
                <h4>{{numResults}} Results</h4>
            </div>
            `
});

Vue.component('movie-item',{
    props: ['title','year','poster'],
    template: `
            <div class="item">
                <img id="item-poster" v-bind:src="poster">
                <div id="item-details">
                    <div class="row">
                        <div id="item-title">{{title}}</div>
                        <div id="item-year">{{year}}</div>
                        <div id="btn" v-on:click="$emit('summary-btn-click')">Show Summary</div>
                    </div>
                </div>
            </div>
            `
});

Vue.component('summary-modal',{
    props:["title","summary"],
    template:`
            <!-- The Modal -->
            <div id="myModal" class="modal">

                <!-- Modal content -->
                <div class="modal-content">
                <div class="modal-header">
                    <span class="close" v-on:click="$emit('close-btn-click')">&times;</span>
                    <h2 id="movie-title">{{title}}</h2>
                </div>
                <div class="modal-body">
                    <p id="movie-summary">{{summary}}</p>      
                </div>
                </div>
            
            </div>
            `
})

Vue.component('btn-loadmore',{
    template: `<div id="btn">Load More</div>`
});

var app = new Vue({
    el: ".container",
    data:{
        title:"Movies",
        movies:[],
        allLoaded: false,
        currentPage: 1,
        totalResults: 0,
        showingSummary: false,
        summaryTitle: "",
        summaryText: ""
    },

    methods:{
        loadMovies: function(){
            
            var req = new XMLHttpRequest();
            req.open("GET","http://www.omdbapi.com?apikey=e0620bd4&s=harry potter" + "&page=" + this.currentPage, true);
            req.onreadystatechange = function(){
            
                if(this.readyState == 4 && this.status == 200){
            
                    var results = JSON.parse(this.responseText);
                    
                    app.totalResults = results.totalResults;
                    
                    
                    results.Search.forEach(element => {
                        app.movies.push({
                            title: element.Title,
                            poster: element.Poster != "N/A" ? element.Poster : "poster.png",
                            year: element.Year,
                            id: element.imdbID,
                            summary:""
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
        },

        onItemClick: function(movie){
            
            if(movie.summary == "" || movie.summary == null){

                var req = new XMLHttpRequest();
                req.open("GET","http://www.omdbapi.com?apikey=e0620bd4&plot=full&i=" + movie.id,true);
                req.onreadystatechange = function(){
                    if(this.readyState == 4 && this.status == 200){
                        var response = JSON.parse(this.responseText);
                        movie.summary = response.Plot;
            
                        app.showingSummary = true;
                        app.summaryTitle = movie.title;
                        app.summaryText = movie.summary;

                    }
                }
                req.send();
            }
            else{
                app.showingSummary = true;
                app.summaryTitle = movie.title;
                app.summaryText = movie.summary;
            }
            console.log(movie);
            
        },

        onSummaryCloseBtnClick: function(){
            app.showingSummary = false;
            app.summaryText = "";
            app.summaryTitle = "";
        }
    },

    mounted(){
        this.loadMovies();
        
    },
});


