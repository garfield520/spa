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
        },
        stateMap = { $container : null},
        jqueryMap = {},

        setJqueryMap, configModule, initModule;
    //---------------------- END 模块作用域变量 ----------------------

    //---------------------- BEGIN 工具方法 ----------------------
    //---------------------- END 工具方法 ----------------------

    //---------------------- BEGIN DOM方法 ----------------------
    //  BEGIN DOM方法 setJqueryMap
    setJqueryMap = function (){
        var $container = stateMap.$container;
        jqueryMap = {
            $container : $container
        }
    }
    //  END DOM方法 setJqueryMap
    //---------------------- END DOM方法 ----------------------

    //---------------------- BEGIN 事件处理 ----------------------
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