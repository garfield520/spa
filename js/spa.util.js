/**
 * Created by Administrator on 2017/3/10.
 * spa.util.js
 * ͨ��js����ģ��
 */
spa.util = (function (){
    var makeError, setConfigMap;

    //  �������� makeError
    //  Ŀ�ģ�һ�������������ĳ����
    //  ������
    //      *       name_text       ��������
    //      *       msg_text        ������ϸ��Ϣ
    //      *       data            ��������ѡ�������
    //  ���أ��¹���Ĵ������
    //  �׳���none
    //
    makeError = function ( name_text, msg_text, data ){
        var error = new Error();
        error.name = name_text;
        error.message = msg_text;
        if( data ){ error.data = data; }
        return error;
    }

    //  �������� setConfigMap
    //  Ŀ�ģ�����ģ���е�������
    //  ������
    //      *       input_map       ������Ҫ���õ�key-valueӳ��
    //      *       settable_map    �������õļ�ӳ��
    //      *       config_map      Ӧ�����õ�ӳ��
    //  ���أ�true
    //  �׳������keyֵ�������׳��쳣
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























