/**
 * Created by Administrator on 2017/3/10.
 * spa.chat.js
 */
/* global $, spa */
spa.chat = (function (){
    //---------------------- BEGIN 模块作用域变量 ----------------------
    var
        configMap = {
            main_html :
            '<div class="spa-chat">'+
            '		<div class="spa-chat-head">'+
            '			<div class="spa-chat-head-toggle"></div>'+
            '			<div class="spa-chat-head-title">聊天</div>'+
            '		</div>'+
            '		<div class="spa-chat-closer">X</div>'+
            '		<div class="spa-chat-sizer">'+
            '			<div class="spa-chat-msgs"></div>'+
            '			<div class="spa-chat-box">'+
            '				<input type="text"/>'+
            '				<div>send</div>'+
            '			</div>'+
            '		</div>'+
            '	</div>',
            settable_map : {
                slider_open_time : true,
                slider_close_time : true,
                slider_opened_em : true,
                slider_closed_em : true,
                slider_opened_title : true,
                slider_closed_title : true,

                chat_model : true,
                people_model : true,
                set_chat_anchor : true
            },
            slider_open_time :　250,
            slider_close_time : 250,
            slider_opened_em : 16,
            slider_closed_em : 2,
            slider_opened_title : '点击关闭',
            slider_closed_title : '点击展开',

            chat_model : null,
            people_model : null,
            set_chat_anchor : null
        },
        stateMap = {
            $append_target : null,
            position_type : 'closed',
            px_per_em : 0,
            slider_hidden_px : 0,
            slider_closed_px : 0,
            slider_opened_px : 0
        },
        jqueryMap = {},

        setJqueryMap,
        getEmSize, setPxSizes, setSliderPosition, onClickToggle
        configModule, initModule;
    //---------------------- END 模块作用域变量 ----------------------

    //---------------------- BEGIN 工具方法 ----------------------
    //
    getEmSize = function ( elem ){
        return Number(getComputedStyle( elem, '').fontSize.match(/\d*.?\d*/)[0]);
    }
    //---------------------- END 工具方法 ----------------------

    //---------------------- BEGIN DOM方法 ----------------------
    //  BEGIN DOM方法 setJqueryMap
    setJqueryMap = function (){
        var
            $appen_target = stateMap.$append_target,
            $slider = $appen_target.find('.spa-chat');
        jqueryMap = {
            $slider : $slider,
            $head : $slider.find( '.spa-chat-head' ),
            $toggle : $slider.find( '.spa-chat-head-toggle' ),
            $title : $slider.find( '.spa-chat-head-title' ),
            $sizer : $slider.find( '.spa-chat-sizer' ),
            $msgs : $slider.find( '.spa-chat-msgs' ),
            $box : $slider.find( '.spa-chat-box' ),
            $input : $slider.find( '.spa-chat-input input[type=text]' )
        }
    }
    //  END DOM方法 setJqueryMap

    //  BEGIN DOM方法 setPxSize
    //
    setPxSizes = function (){
        var
            px_per_em, opened_height_em;
        px_per_em = getEmSize( jqueryMap.$slider.get(0) );
        opened_height_em = configMap.slider_opened_em;

        stateMap.px_per_em = px_per_em;
        stateMap.slider_closed_px = configMap.slider_closed_em * px_per_em;
        stateMap.slider_opened_px = opened_height_em * px_per_em;
        jqueryMap.$sizer.css({
            height : ( opened_height_em - 2 ) * px_per_em
        });
    }
    //  END setPxSize

    //  START setSliderPosition
    setSliderPosition = function ( position_type, callback ){
        var
            height_px, animate_time, slider_title, toggle_text;
        //  如果滑块已经在请求位置，返回true
        if( stateMap.position_type === position_type ){
            return true;
        }

        //  准备动画参数
        switch ( position_type ){
            case 'opened':
                height_px = stateMap.slider_opened_px;
                animate_time = configMap.slider_open_time;
                slider_title = configMap.slider_opened_title;
                toggle_text = '=';
                break;
            case 'hidden':
                height_px = 0;
                animate_time = configMap.slider_open_time;
                slider_title = '';
                toggle_text = '+';
                break;
            case 'closed':
                height_px = stateMap.slider_closed_px;
                animate_time = configMap.slider_close_time;
                slider_title = configMap.slider_closed_title;
                toggle_text = '+';
                break;
            //  未知位置
            default :
                return false;
        }

        //  滑块位置动画变化
        stateMap.position_type = '';
        jqueryMap.$slider.animate(
            { height : height_px },
            animate_time,
            function (){
                jqueryMap.$toggle.prop( 'title', slider_title );
                jqueryMap.$toggle.text( toggle_text );
                stateMap.position_type = position_type;
                if( callback ){ callback( jqueryMap.$slider ) }
            }
        );
        return false;
    }
    //  END setSliderPosition
    //---------------------- END DOM方法 ----------------------

    //---------------------- BEGIN 事件处理 ----------------------
    onClickToggle = function ( event ){
        var set_chat_anchor = configMap.set_chat_anchor;
        if( stateMap.position_type === 'opened' ){
            set_chat_anchor( 'closed' );
        } else if ( stateMap.position_type === 'closed' ){
            set_chat_anchor( 'opened' );
        }
        return false;
    }
    //---------------------- END 事件处理 ----------------------

    //---------------------- BEGIN 公共方法 ----------------------
    //  BEGIN 公共方法 configModule
    //目的：创建configModule方法，每当功能模块接收设置（settings）时，总是使用相同的方法名和同一个spa.util.setConfigMap工具方法
    //参数：可设置键值对映射
    //    *   color_name      color to use
    //配置：configMap.settable_map 声明中允许的key
    //返回：true
    //抛出：none
    configModule = function ( input_map ){
        spa.util.setConfigMap({
            input_map : input_map,
            settable_map : configMap.settable_map,
            config_map : configMap
        });
        return true;
    }
    //  END 公共方法 configModule



    //  BEGIN 公共方法 configModule
    //     例子：spa.chat.configModule({ slider_open_em : 18 });
    //     目的：配置之前初始化
    //     参数：
    //         *       set_chat_anchor     修改锚点来记录打开或者关闭状态，如果请求状态不能被设置，必须返回false
    //         *       chat_model          提供即时消息互动方法的聊天模块对象
    //         *       poeple_model        people模块对象，提供管理模块people列表的方法
    //         *       slider_*            mapConfig.settable_map查看完整列表
    //                 example：slider_open_em 是em为单位的打开高度
    //     行为：根据提供的参数更新内部数据结构，无其他行为
    //     返回：true
    //     抛出：js error对象、不可执行或丢失的对象堆栈路径
    initModule = function ( $container ){
        $container.html( configMap.main_html );
        stateMap.$container = $container;
        setJqueryMap();

        return true;
    }
    //  END 公共方法 configModule
    //---------------------- END 公共方法 ----------------------

    return {
        configModule : configModule,
        initModule : initModule
    }

})();