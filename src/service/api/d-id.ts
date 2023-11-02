import { request } from './../request/index';

/**
 * 创建对话
 * @param input
 */

export function fetchCreateTalk(input: string) {
	return request.post<DID.CreateTalkRes>(
		'/d-id/talks',
		{
			source_url:
				'https://create-images-results.d-id.com/google-oauth2%7C108172079718571280845/upl_24lwx7q8nrCSVEySLVBo_/image.jpeg',
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
				Authorization: 'Basic MTU5MTM2MDk4MjF1bmRlcmN1cnJlQGdtYWlsLmNvbQ:lZRWK3xuvtM-LYt-Cd4Q1'
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
			Authorization: 'Basic MTU5MTM2MDk4MjF1bmRlcmN1cnJlQGdtYWlsLmNvbQ:lZRWK3xuvtM-LYt-Cd4Q1'
		}
	});
}
