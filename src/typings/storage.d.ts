declare namespace StorageInterface {
  /** localStorage的存储数据的类型 */
  interface Session {
    demoKey: string;
  }

  /** localStorage的存储数据的类型 */
  interface Local {
    /** 主题颜色 */
    themeColor: string;
    /** 用户token */
    token: string;
    /** 用户刷新token */
    refreshToken: string;
    /** 用户信息 */
    userInfo: Auth.UserInfo;
		/** 用户密码 */
		pwd: string;
		/** 记住用户账密*/
		upInfo: Auth.UpInfoType,
    /** 主题配置 */
    themeSettings: Theme.Setting;
    /** 多页签路由信息 */
    multiTabRoutes: App.GlobalTabRoute[];
    /** 本地语言缓存 */
    lang: I18nType.langType;
		/** 问答数据源配置信息 */
		wdConfigInfo: [];
		/* 会话列表 */
		chatbotList: Robot.ChatbotItemType[];
		/* 选中会话id */
		chatbotId: string;
		/* 会话记录 */
		chatbotRecords: Robot.ChatbotRecordsType[];

  }
}
