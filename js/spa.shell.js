/**
 *	spa.shell.js
 * 	SPA SHELL MODULE
 */
spa.shell = (function (){
	//	把静态配置放在configMap变量中
	//	------------------ START 模块作用域变量 ------------------
	var	
		configMap = {
			anchor_schema_map : {
				chat : {
					open : true,
					closed : true
				}
			},
			main_html : 
				'<div class="spa-shell-head">'+
		'			<div class="spa-shell-head-logo"></div>'+
		'			<div class="spa-shell-head-acct"></div>'+
		'			<div class="spa-shell-head-search"></div>'+
		'		</div>'+
		'		<div class="spa-shell-main">'+
		'			<div class="spa-shell-main-nav"></div>'+
		'			<div class="spa-shell-main-content"></div>'+
		'		</div>'+
		'		<div class="spa-shell-foot"></div>'+
		'		<div class="spa-shell-chat"></div>'+
		'		<div class="spa-shell-modal"></div>',
			chat_extend_time : 1000,
			chat_retract_time : 1000,
			chat_extend_height : 450,
			chat_retract_height : 15,
			chat_extend_title : '点击收起',
			chat_retract_title : '点击展开'
		},
		//	将在整个模块中共享的动态信息放在stateMap中
		stateMap = {
			$container : null,
			anchor_map : {},
			is_chat_retracted : true	//	在stateMap里面添加is_chat_retracted，在stateMap里面列出所有会用到的键是一种很好的做法，容易找到和查看。
		},

		//	jquery集合缓存
		jqueryMap = {},

		//	此部分声明所有模块作用域内的变量，很多在之后赋值
		copyAnchorMap, setJqueryMap, toggleChat,
		changeAnchorPart, onHashchange,
		onClickChat, initModule;
	//	------------------ END 模块作用域变量 ------------------

	//	------------------ BEGIN 公共方法 ------------------
	//	返回存储的anchor map的复制对象，最大限度减少开销
	copyAnchorMap = function (){
		return $.extend( true, {}, stateMap.anchor_map );
	}
	//	------------------ END 公共方法 ------------------

	//	------------------ START DOM方法 ------------------
	//	DOM方法，setJqueryMap
	setJqueryMap = function (){
		var $container = stateMap.$container;
		jqueryMap = {
			$container : $container,
			//	将聊天滑块的jQuery集合缓存到jqueryMap中
			$chat : $container.find( '.spa-shell-chat' )
		}
	}

	//	BEGIN DOM方法，toggleChat
	//	目的：展开或者收起聊天滑块
	//	参数：
	//		*	do_extend		如果为true，展开滑块，否则收起
	//		*	callback		可选择方法，在动画结束后执行
	//	配置：
	//		*	chat_extend_time, chat_retract_time
	//		*	chat_extend_height, chat_retract_height
	//	返回：Boolean
	//		*	true	滑块动画正在执行
	//		*	false	滑块动画未执行
	//	状态：设置setateMap.is_chat_retracted
	//		*	true	滑块是收起状态
	//		*	false 	滑块是展开状态
	//
	toggleChat = function ( do_extend, callback ){
		var
			px_chat_ht = jqueryMap.$chat.height();		//	获取当前滑块高度
			is_open = px_chat_ht === configMap.chat_extend_height,		//	如果当前滑块高度和配置中展开高度相等，则此时为展开状态
			is_closed = px_chat_ht === configMap.chat_retract_height;	//	如果当前滑块高度和配置中收起高度相等，则此时为收起状态
			is_sliding = ! is_open && ! is_closed;						//	如果既非展开状态，也非收起状态，则滑块处于运动过程中

		//	避免竞争条件：既滑块可能同时在展开和收起
		if( is_sliding ){ return false; }

		//	开始展开聊天滑块
		if( do_extend ){
			jqueryMap.$chat.animate({
				height : configMap.chat_extend_height
			}, configMap.chat_extend_time, function (){
				//	在展开动画结束后，将$chat的title设置为“点击收起”
				jqueryMap.$chat.attr('title', configMap.chat_extend_title);
				//	将stateMap中is_chat_retracted变量设置为false（is_chat_retracted : 是否为收起状态）
				stateMap.is_chat_retracted = false;
				if( callback ){
					callback( jqueryMap.$chat );
				}
			});
			return true;
		}
		//	END 展开滑块

		//	START 收起滑块
		jqueryMap.$chat.animate({
			height : configMap.chat_retract_height
		}, configMap.chat_retract_time, function (){
			//	在收起动画结束后，将$chat的title设置为“点击展开”
			jqueryMap.$chat.attr('title', configMap.chat_retract_title);
			//	将stateMap中is_chat_retracted变量设置为true（is_chat_retracted : 是否为收起状态）
			stateMap.is_chat_retracted = true;
			if( callback ){
				callback( jqueryMap.$chat );
			}
		});
		return true;
		//	END 收起滑块
	}
	//	END DOM方法，toggleChat

	//	BEGIN DOM方法，changeAnchorPart
	/*
		目的：改变URI锚组件部分
		参数：
			*		arg_map		我们想改变的URI部分映射的描述
		返回值：boolean
			*		true		URI的锚状态更新
			*		false		URI的锚状态不能更新
		行为：
			当前锚的名字存储在 stateMap.anchor_map中
			关于uriAnchor编码的讨论
			这个方法
				*	使用copyAnchorMap为这个映射创建一个副本
				*	使用arg_map修改key-values
				*	在encoding中管理独立的值和以来的值的区别
				*	尝试用uriAnchor来改变URI
				*	成功返回true 失败返回false
	*/
	changeAnchorPart = function ( arg_map ){
		var
			anchor_map_revise = copyAnchorMap(),
			bool_return = true,
			key_name, key_name_dep;

		//	开始合并变化到anchor映射中
		KEYVAL:
		for( key_name in arg_map ){
			if( arg_map.hasOwnProperty( key_name ) ){
				//	遍历的时候跳过继承的键
				if( key_name.indexOf( '_' ) === 0 ){ continue KEYVAL; }

				//	更新独立的键值
				anchor_map_revise[key_name] = arg_map[key_name];

				//	更新匹配到的关联键值
				key_name_dep = '_' + key_name;
				if( arg_map[key_name_dep] ){
					anchor_map_revise[key_name_dep] = arg_map[key_name_dep];
				} else {
					delete anchor_map_revise[key_name_dep];
					delete anchor_map_revise['_s' + key_name_dep];
				}
			}
		}
		//	END 合并
		//	开始 尝试着去更新URI 如果失败回到最初状态
		try {
			$.uriAnchor.setAnchor( anchor_map_revise );
		} catch ( error ){
			//	用已存在的状态替换URI
			$.uriAnchor.setAnchor( stateMap.anchor_map, null, true );
			bool_return = false;
		}
		//	END 更新URI
		return bool_return;
	}
	//	END DOM方法 changeAnchorPart

	//	BEGIN DOM方法 onHashchange
	//	目的：hashchange事件处理程序
	//	参数：
	//		*	event		jQuery事件对象
	//	配置：none
	//	返回：false
	//	行为：
	//		*	解析URI锚组件
	//		*	比较目标应用状态和当前状态
	//		*	根据目标状态和已存在状态的不同调整应用
	onHashchange = function (){
		var anchor_map_previous = copyAnchorMap(),
			anchor_map_proposed,
			_s_chat_previous, _s_chat_proposed,
			s_chat_proposed;
		//	解析anchor
		try {
			anchor_map_proposed = $.uriAnchor.makeAnchorMap();
		} catch ( error ){
			$.uriAnchor.setAnchor( anchor_map_previous, null, true );
			return false;
		}
		stateMap.anchor_map = anchor_map_proposed;
		//	方便变量
		_s_chat_previous = anchor_map_previous._s_chat;
		_s_chat_proposed = anchor_map_proposed._s_chat;

		//	如果改变，调整chat组件
		if( !anchor_map_previous || _s_chat_previous !== _s_chat_proposed ){
			s_chat_proposed = anchor_map_proposed.chat;
			switch ( s_chat_proposed ){
				case 'open':
					toggleChat( true );
					break;
				case 'closed':
					toggleChat( false );
					break;
				default :
					toggleChat( false );
					delete anchor_map_proposed.chat;
					$.uriAnchor.setAnchor( anchor_map_proposed, null, true );
			}
		}
		return false;
	}
	//	END DOM方法 onHashchange
	//	------------------ END DOM方法 ------------------

	//	------------------ START 事件处理 ------------------
	onClickChat = function ( event ){
		changeAnchorPart({
			chat : ( stateMap.is_chat_retracted ? 'open' : 'closed' )
		});
		return false;
	}
	//	------------------ END 事件处理 ------------------

	//	------------------ START 公共方法 ------------------
	initModule = function ( $container ){
		//	加载html和jQuery集合
		stateMap.$container = $container;
		$container.html( configMap.main_html );
		setJqueryMap();

		$.uriAnchor.configModule({
			schema_map : configMap.anchor_schema_map
		})

		//	配置并初始化功能模块
		spa.chat.configModule({});
		spa.chat.initModule( jqueryMap.$chat );

		//	初始化滑块绑定事件处理程序
		stateMap.is_chat_retracted = true;
		jqueryMap.$chat
			.attr( 'title', configMap.chat_retract_title )
			.click( onClickChat );

		$(window)
			.bind( 'hashchange', onHashchange )
			.trigger( 'hashchange' );
	}

	return {
		initModule : initModule
	}
})();
