// 后端接口返回的数据类型

/** 后端返回的用户权益相关类型 */
declare namespace ApiAuth {
	/** 返回的token和刷新token */
	interface Token {
		token: string;
		refreshToken: string;
	}
	/** 返回的用户信息 */
	type UserInfo = {
		/** 用户id */
		userId: string;
		/** 用户名 */
		userName: string;
	};
}

/** 后端返回的路由相关类型 */
declare namespace ApiRoute {
	/** 后端返回的路由数据类型 */
	interface Route {
		/** 动态路由 */
		routes: AuthRoute.Route[];
		/** 路由首页对应的key */
		home: AuthRoute.AllRouteKey;
	}
}

declare namespace ApiCommon {
	/** http请求头的content-type类型 */
	type ContentType =
		| 'application/json'
		| 'application/x-www-form-urlencoded'
		| 'multipart/form-data';

	/**
	 * 验证状态
	 * - 0: 否
	 * - 1: 是
	 */
	type VerifiedStatus = 0 | 1;

	/**
	 * 分页列表
	 */
	type PageList<T> = {
		/**
		 * 列表数据
		 */
		records: T[];
		/**
		 * 总数
		 */
		total: number;
		/**
		 * 每页条数
		 */
		size: number;
		/**
		 * 当前页码
		 */
		current: number;
		/**
		 * 总页数
		 */
		pages: number;
	};

	/**
	 * 分页列表查询参数
	 */
	type PageListParams<T> = {
		/**
		 * 当前页码
		 */
		page?: number;
		/**
		 * 每页条数
		 */
		pageSize?: number;
		/**
		 * 查询参数
		 */
		data?: T;
	};

	/**
	 * 列表通用属性
	 */
	type ListCommonConf = {
		/**
		 * ID
		 */
		id: number;
		/**
		 * 创建id
		 */
		createId?: number;
		/**
		 * 创建人
		 */
		createBy?: string;
		/**
		 * 创建时间
		 */
		createTime?: string;
		/**
		 * 更新人
		 */
		updateBy?: string;
		/**
		 * 更新时间
		 */
		updateTime?: string;
	};
}

declare namespace ApiSys {
	/**
	 * 系统用户
	 */
	type SysUser = ApiCommon.ListCommonConf & {
		/**
		 * 账号
		 */
		username: string;
		/**
		 * 密码
		 */
		password: string;
		/**
		 * 手机号码
		 */
		phone: string;
	};

	/**
	 * 系统用户分页列表
	 */
	type PageSysUser = ApiCommon.PageList<SysUser>;
}
