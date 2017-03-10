/**
 * Created by Administrator on 2017/3/10.
 * spa.util.js
 * 通用js工具模块
 */
spa.util = (function (){
    var makeError, setConfigMap;

    //  公共方法 makeError
    //  目的：一个创建错误对象的常规包
    //  参数：
    //      *       name_text       错误名字
    //      *       msg_text        错误详细信息
    //      *       data            错误对象可选择的数据
    //  返回：新构造的错误对象
    //  抛出：none
    //
    makeError = function ( name_text, msg_text, data ){
        var error = new Error();
        error.name = name_text;
        error.message = msg_text;
        if( data ){ error.data = data; }
        return error;
    }

    //  公共方法 setConfigMap
    //  目的：配置模块中的配置项
    //  参数：
    //      *       input_map       配置中要设置的key-value映射
    //      *       settable_map    允许设置的键映射
    //      *       config_map      应用设置的映射
    //  返回：true
    //  抛出：如果key值不允许，抛出异常
    //
    setConfigMap = function ( arg_map ){
        var input_map = arg_map.input_map,
            settable_map = arg_map.settable_map,
            config_map = arg_map.configMap,
            key_name, error;
        for( key_name in input_map ){
            if( input_map.hasOwnProperty( key_name ) ){
                if( settable_map.hasOwnProperty( key_name ) ){
                    config_map[key_name] = input_map[key_name];
                } else {
                    error = makeError( 'Bad input', 'Setting config key |' + key_name + '| is not supported' );
                    throw error;
                }
            }
        }
    }

    return {
        makeError : makeError,
        setConfigMap : setConfigMap
    }

})();























