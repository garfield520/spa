/**
 * Created by Administrator on 2017/3/10.
 * spa.chat.js
 */
/* global $, spa */
spa.chat = (function (){
    //---------------------- BEGIN 模块作用域变量 ----------------------
    var
        configMap = {
            main_html : '<h1>hello chat!</h1>',
            settable_map : {}
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
    //目的：初始化模块
    //参数：
    //    *   jquery元素$container
    //返回：true
    //抛出：none
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