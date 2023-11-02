import { request } from './../request/index';

/**
 * 创建对话
 * @param input
 */

export function fetchCreateTalk(input: string) {
	return request.post<DID.CreateTalkRes>(
		'/d-id/talks',
		{
			source_url: 'https://clips-presenters.d-id.com/rian/pbMoTzs7an/vmcS2q23Kk/image.png',
			script: {
				type: 'text',
				input,
				provider: {
					type: 'microsoft',
					voice_id: 'zh-CN-YunxiNeural',
					voice_config: {
						style: 'Default'
					}
				}
			}
		},
		{
			headers: {
				Authorization: 'Basic NzI0MDYxMzYwQHFxLmNvbQ:2Xk1AV5ojae7y273bNVEe'
			}
		}
	);
}

/**
 * 获取对话视频
 * @param input
 */

export function fetchGetTalkById(id: string) {
	return request.get<DID.GetTalkRes>(`/d-id/talks/${id}`, {
		headers: {
			Authorization: 'Basic NzI0MDYxMzYwQHFxLmNvbQ:2Xk1AV5ojae7y273bNVEe'
		}
	});
}
