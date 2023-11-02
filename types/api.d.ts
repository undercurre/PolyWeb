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

declare namespace DID {
	interface CreateTalkRes {
		id: string;
		create_at: string;
		craete_by: string;
		status: string;
		object: string;
	}

	interface GetTalkRes {
		user: {
			features: (string | null)[];
			stripe_plan_group: string;
			authorizer: string;
			owner_id: string;
			id: string;
			plan: string;
			email: string;
		};
		script: {
			length: number;
			ssml: boolean;
			subtitles: boolean;
			type: string;
			provider: {
				type: string;
				voice_id: string;
				voice_config: {
					style: string;
				};
			};
		};
		metadata: {
			driver_url: string;
			mouth_open: boolean;
			num_faces: number;
			num_frames: number;
			processing_fps: number;
			resolution: [number, number];
			size_kib: number;
		};
		audio_url: string;
		created_at: string;
		face: {
			mask_confidence: number;
			detection: [number, number, number, number];
			overlap: string;
			size: number;
			top_left: [number, number];
			face_id: number;
			detect_confidence: number;
		};
		config: {
			stitch: boolean;
			align_driver: boolean;
			sharpen: boolean;
			normalization_factor: number;
			result_format: string;
			fluent: boolean;
			pad_audio: number;
			reduce_noise: boolean;
			auto_match: boolean;
			show_watermark: boolean;
			logo: {
				url: string;
				position: [number, number];
			};
			motion_factor: number;
			align_expand_factor: number;
		};
		source_url: string;
		created_by: string;
		status: string;
		driver_url: string;
		modified_at: string;
		user_id: string;
		subtitles: boolean;
		id: string;
		duration: number;
		started_at: string;
		result_url: string;
	}
}
