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

declare namespace ApiCommon {
	/** http请求头的content-type类型 */
	type ContentType =
		| 'application/json'
		| 'application/x-www-form-urlencoded'
		| 'multipart/form-data';
}
