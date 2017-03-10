/**
 * Created by Administrator on 2017/3/10.
 * spa.chat.js
 */
/* global $, spa */
spa.chat = (function (){
    //---------------------- BEGIN ģ����������� ----------------------
    var
        configMap = {
            main_html : '<h1>hello chat!</h1>',
            settable_map : {}
        },
        stateMap = { $container : null},
        jqueryMap = {},

        setJqueryMap, configModule, initModule;
    //---------------------- END ģ����������� ----------------------

    //---------------------- BEGIN ���߷��� ----------------------
    //---------------------- END ���߷��� ----------------------

    //---------------------- BEGIN DOM���� ----------------------
    //  BEGIN DOM���� setJqueryMap
    setJqueryMap = function (){
        var $container = stateMap.$container;
        jqueryMap = {
            $container : $container
        }
    }
    //  END DOM���� setJqueryMap
    //---------------------- END DOM���� ----------------------

    //---------------------- BEGIN �¼����� ----------------------
    //---------------------- END �¼����� ----------------------

    //---------------------- BEGIN �������� ----------------------
    //  BEGIN �������� configModule
    //Ŀ�ģ�����configModule������ÿ������ģ��������ã�settings��ʱ������ʹ����ͬ�ķ�������ͬһ��spa.util.setConfigMap���߷���
    //�����������ü�ֵ��ӳ��
    //    *   color_name      color to use
    //���ã�configMap.settable_map �����������key
    //���أ�true
    //�׳���none
    configModule = function ( input_map ){
        spa.util.setConfigMap({
            input_map : input_map,
            settable_map : configMap.settable_map,
            config_map : configMap
        });
        return true;
    }
    //  END �������� configModule

    //  BEGIN �������� configModule
    //Ŀ�ģ���ʼ��ģ��
    //������
    //    *   jqueryԪ��$container
    //���أ�true
    //�׳���none
    initModule = function ( $container ){
        $container.html( configMap.main_html );
        stateMap.$container = $container;
        setJqueryMap();

        return true;
    }
    //  END �������� configModule
    //---------------------- END �������� ----------------------

    return {
        configModule : configModule,
        initModule : initModule
    }

})();