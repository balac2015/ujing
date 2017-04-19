/**
 * @file 自定义事件，用来与原生底座交互
 * @author <liping.ye@midea.com.cn>
 * @copyright Midea Co.Ltd 1968-2015
 * @license Released under the Commercial license.
 * @since 1.0.1
 * @version 1.0.2 - 2016/6/12
 */

/**
 * 全局接受原生调用h5触发函数
 * 用处: 定义事件名称，事件传播信息，注册在document，全局变量
 * @param {string} value 自定义参数
 */
function mideaDeviceUnbindMsg(value) {
    var event = document.createEvent('HTMLEvents');
    // initEvent接受3个参数：事件类型，是否冒泡，是否阻止浏览器的默认行为
    event.initEvent('mideaDeviceUnbindMsg', true, true);
    event.message = value;
    // 触发document上绑定的自定义事件
    document.dispatchEvent(event);
}
