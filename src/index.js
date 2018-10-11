/**
 * @description 主调用
 * @createdAt on 2018-10-11 10:39:57
 */

const {
  datetimeFormat,
} = require('./tools');

// 局部变量封装
const GLO = {
  TIME_FORMAT: 'YYYY-MM-DD HH:mm:ss.SSS',
};

class Logger {
  //   constructor() {}


  /**
   * 初始化记录器
   * @param {string} appId 服务标记，亦即房间编号
   */
  init(appId, server) {
    this.appId = appId;
    this.server = server;
    this.localMomeryCache = []; // 本地缓存
  }

  /**
   * 配置信息
   */
  setttings(config = {}) {
    this.momeryCacheSize = 'size' in config ? config.size : 1000; // 本地缓存大小
    /**
     * 日志发送模式
     * realtime 实时发送
     * length 达到length长度时发送
     */
    this.logMode = 'logMode' in config && config.logMode.indexOf(['realtime', 'length']) ?
      config.logMode :
      'realtime';
    this.logLength = 'logLength' in config ? config.logLength : 10; // 默认缓存超过10条开始发送日志
    this.token = 'token' in config ? config.token : ''; // 认证标记
    this.dateTime = 'dateTime' in config ? config.dateTime : false; // 是否显示时间
    this.dateFormat = 'dateFormat' in config ? config.dateFormat : GLO.TIME_FORMAT; // 时间格式化
  }

  /**
   * 实际抛出日志
   * @param {string} message
   */
  log(message) {
    this.localMomeryCache.push(message);
  }

  // TODO:定时或长度达到length值，开启发送log到socket server
  listener() {
    const self = this;
    setInterval(() => {
      console.info(self.localMomeryCache);
    }, 1000);
  }
}

module.exports = (appId, server, config) => {
  const logger = new Logger();
  logger.init(appId, server);
  logger.setttings(config);
  logger.listener();
  return (ctx, next) => {
    ctx.ilog = message => logger.log(message);
    next();
  };
};
