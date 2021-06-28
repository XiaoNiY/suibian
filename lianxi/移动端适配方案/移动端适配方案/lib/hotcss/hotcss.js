(function( window , document ){

	'use strict';

	//给hotcss开辟个命名空间，别问我为什么，我要给你准备你会用到的方法，免得用到的时候还要自己写。
	var hotcss = {};

	hotcss.mresize = function(){
		//对，这个就是核心方法了，给HTML设置font-size。
		var innerWidth = document.documentElement.getBoundingClientRect().width || window.innerWidth;

        if( hotcss.maxWidth && (innerWidth/hotcss.dpr > hotcss.maxWidth) ){
            innerWidth = hotcss.maxWidth*hotcss.dpr;
        }

		if( !innerWidth ){ return false;}

		document.documentElement.style.fontSize = ( innerWidth*20/375 ) + 'px';

        hotcss.callback && hotcss.callback();

	};

	hotcss.mresize(); 
	//直接调用一次

	window.addEventListener( 'resize' , function(){
		clearTimeout( hotcss.tid );
		hotcss.tid = setTimeout( hotcss.mresize , 33 );
	} , false ); 
	//绑定resize的时候调用

	window.addEventListener( 'load' , hotcss.mresize , false ); 
	//防止不明原因的bug。load之后再调用一次。


	setTimeout(function(){
		hotcss.mresize(); 
		//防止某些机型怪异现象，异步再调用一次
	},333)

	window.hotcss = hotcss; 
	//命名空间暴露给你，控制权交给你，想怎么调怎么调。


})( window , document );
