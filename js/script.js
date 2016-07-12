/* ====== DEFAULT SCRIPTS ====== */


/* ======
DEFAULT SCRIPTS
  - BASE JS
  - SCROLLED
====== */



(function(){
  
    var $ = jQuery.noConflict();
  $(document).ready(function(){

    /*================================================================================
    $ BASE JS
    ================================================================================*/

    var today = new Date();
    var year = today.getFullYear();
    $('#year').html(year);

    activeSections();

    //Hide show menu
    $( ".tabs nav li" ).on( "click", function(e) { 
      e.preventDefault();
      var $this = $(this);
      var target = '#' + $this.find('a').attr('class');

      $(".tabs li").not(this).removeClass("active");
      $this.addClass('active');

      $(".tab").not(target).removeClass("active");
      $(target).addClass('active');
      
    });   
     
   $('.tab').flexslider({
      animation: 'slide',
      animationLoop: true,
      slideshow: false,
      slideshowSpeed: 7000,
      animationSpeed: 800,
      itemMargin: 20,
      minItems: getNumNewsItems(),
      maxItems: getNumNewsItems(),
      itemWidth: 350,
      directionNav: true,
      controlNav: false,
      start: function( slider ){
           $('body').addClass('loaded');
      }
    });

    $('#about').flexslider({
      animation: 'fade',
      animationLoop: true,
      slideshow: false,
      slideshowSpeed: 7000,
      animationSpeed: 800,
      minItems: 1,
      maxItems: 1,     
      directionNav: true,
      controlNav: false,
    });
   

   //Hide show menu
    $( ".more-menu" ).on( "click", function(e) { 
      e.preventDefault();
      $( 'body' ).toggleClass('noscroll nav-is-visible');
    }); 

    /*================================================================================
    $ FETCH TWITTER FEED JS
    ================================================================================*/
   var tweet_ids = $('#tweet_ids').text();
   if( tweet_ids ){
      $.ajax({
          type: "GET",
          //url: "//talis.com/wp-content/themes/talis/scripts/tweets_to_file.php",
          url:"http://talis.stagingbda.co.uk/wp-content/themes/talis/scripts/tweets_to_file.php",
          //url: "scripts/tweets_to_file.php",
          data: { tweet_ids },

        }).done(function(data){

          if (data) {
            var result = jQuery.parseJSON(data);

            if( !result ){
              return
            }

            var latest = result['latest'];
            var others = result['other'];


            if( others ){
              $('#catchup .intro').after('<div id="other-posts" class="all-posts"><ul></ul></div>');
              for (var post in others) {
                if (others.hasOwnProperty(post)) {
                  $('#other-posts ul').append(others[post]);
                }
              }
            }

            if( latest ){
              //$('#latest-post').html(latest);
              $('#catchup .intro').after('<div id="latest-post" class="featured-post">' + latest + '</div>');
            }
          }
        });
      }

    /*================================================================================
    $ SCROLL TO JS
    ================================================================================*/

    $('.main a, .side-pagination a').click(function(e){
      e.preventDefault();
      e.stopPropagation();

      // get the href attribute of the link
      var link = $(this).attr('href');
      var linkClass = '.'+$(this).attr('href').replace("#", "");
     
      var target = $(link).offset().top;     
      var header_height = getWindowheight('header');  

      //Adjust to cater for fixed header
      var target = target - header_height;

      // animate page scroll to the variable 'target'
      $('body, html').stop().animate({ scrollTop: target+"px" }, 1500);
      $('.main a, .side-pagination a').removeClass('active');  
      $(this).addClass('active');     
      $( 'body' ).removeClass('noscroll nav-is-visible');
     })

    setSectionHeight();     

  });



  /*================================================================================
  $ SCROLLED JS
  ================================================================================*/

  // var timer;
  // var lastScrollTop = 0;

  // $(window).scroll(function(){   
    
  //   if( $(window).width() > 768 ){
    
  //     //Script to smooth the sroll check
  //     if(timer) {
  //         window.clearTimeout(timer);
  //     }

  //     timer = window.setTimeout(function() {
         
  //         // actual callback
  //         activeSections();
        
  //         //Script to check scroll up or down
  //         var st = $(this).scrollTop();
  //         if (st > lastScrollTop){
  //            $('body').addClass('scroll-down')
  //         } else {
  //           $('body').removeClass('scroll-down')
  //         }

  //         lastScrollTop = st;

  //     }, 10);
  // }
    

    

  //});

  /*================================================================================
  $ RESIZE JS
  ================================================================================*/

  $(window).on('resize', function() {
    
      var numNewsItems = getNumNewsItems();

      $( ".tab" ).each(function() {
        $(this).data('flexslider').vars.minItems = numNewsItems;
        $(this).data('flexslider').vars.maxItems = numNewsItems;   

      });

      setSectionHeight();

  });

  function activeSections(){

    var sections = $('.sections-wrapper > section');
    
    sections.each( function (){

      if( $(this).attr('id') ){

          var sectionId = '#'+$(this).attr('id');
         
          if( isScrolledIntoView(sectionId) ){
            $('.side-pagination').attr( 'id',sectionId.replace("#", "") );
            $('.side-pagination a').removeClass('active');
            $('a[href$="' + sectionId +'"]').addClass('active');
          }         
       }

    });
  }

  function setSectionHeight(){
    var window_height = getWindowheight();
    var window_width = $(window).width();
    var header_height = getWindowheight('header');  
    var section_height = window_height - header_height;
    var sections = $('.sections-wrapper > section.fh');

    if( window_width > 768 & window_height > 500 ){
      sections.css( 'height', section_height );
    } else {
      sections.css( 'height', 'auto' );
    }
    
  }

  //tiny helper function to add breakpoints
    function getNumNewsItems() {     

      if( window.innerWidth < 700 ){
        count = 1;
      } else if( window.innerWidth < 1050 ){
        count = 2;
      } else if( window.innerWidth < 1400 ){
        count = 3;
      } else if( window.innerWidth < 1750 ){
        count = 4;
      } else {
        count = 5;
      }

      return count;
    }

    function setHeights (parentElm, childElm) {
      var windowWidth = window.innerWidth;    
      items = $(parentElm).find(childElm);
      items.css( 'height', 'auto' );
      var maxHeight = 0;
      var count = 0;
      var itemHeight = 0;
      var cutOff = 600;  

      if( windowWidth < cutOff ){
        items.css( 'height', 'auto' );
        return
      }

      items.each( function(){
          count ++;
          var itemHeight = parseInt( $( this ).outerHeight() );        
          $(this).addClass(count);
          if ( itemHeight > maxHeight ) maxHeight = itemHeight;
      });

      items.css( 'height', maxHeight );
    }


    /*================================================================================
    $ GET ELEMENT HEIGHT JS
    ================================================================================*/
    
    function getWindowheight (elementclass){

        var elementClass = elementclass; 

        //If a class is specified it will return the  width of that class
        if (elementClass) {

          return $(elementClass).height();
        
        //Else if now width is specifed get full window width
        } else {
          
          return  $(window).height();

        };

    };

    function isScrolledIntoView(elem) {
        var $elem = $(elem);
        var $window = $(window);

        var docViewTop = $window.scrollTop();
        var docViewBottom = docViewTop + $window.height();

        var elemTop = $elem.offset().top;
        var elemBottom = elemTop + $elem.height();

        return ((elemBottom <= docViewBottom) && (elemTop >= docViewTop));
    }


   

})();