<template>
	<el-input v-model="textarea" autosize type="textarea" placeholder="Please input" />
	<el-input v-model="input" placeholder="Please input" />
	<el-button type="primary" @click="sendMsg">send</el-button>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import * as base64 from 'base-64';
import CryptoJs from 'crypto-js';
const textarea = ref('');
const input = ref('');

const config = {
	APPID: '1288b463',
	APISecret: 'YjExNmM2ODAyMmEyNzU1ZTVlMDFhNDJj',
	APIKey: 'bc22669633ed221cd5d15c36a9e15eb7',
	Uid: 'lirh42',
	sparkResult: ''
};

async function sendMsg() {
	// 获取请求地址
	let myUrl = await getWebsocketUrl();
	// 获取输入框中的内容
	let inputVal = input.value;
	addMsgToTextarea(input.value + '\n');
	// 每次发送问题 都是一个新的websocketqingqiu
	let socket = new WebSocket(myUrl as string | URL);

	// 监听websocket的各阶段事件 并做相应处理
	socket.addEventListener('open', (event) => {
		console.log('开启连接！！', event);
		// 发送消息
		let params = {
			header: {
				app_id: config.APPID,
				uid: 'lirh42'
			},
			parameter: {
				chat: {
					domain: 'generalv2',
					temperature: 0.5,
					max_tokens: 1024
				}
			},
			payload: {
				message: {
					// 如果想获取结合上下文的回答，需要开发者每次将历史问答信息一起传给服务端，如下示例
					// 注意：text里面的所有content内容加一起的tokens需要控制在8192以内，开发者如有较长对话需求，需要适当裁剪历史信息
					text: [
						{ role: 'user', content: '你是谁' }, //# 用户的历史问题
						{ role: 'assistant', content: '我是AI助手' }, //# AI的历史回答结果
						// ....... 省略的历史对话
						{ role: 'user', content: inputVal } //# 最新的一条问题，如无需上下文，可只传最新一条问题
					]
				}
			}
		};
		console.log('发送消息');
		socket.send(JSON.stringify(params));
	});
	socket.addEventListener('message', (event) => {
		let data = JSON.parse(event.data);
		console.log('收到消息！！', data);
		config.sparkResult += data.payload.choices.text[0].content;
		if (data.header.code !== 0) {
			console.log('出错了', data.header.code, ':', data.header.message);
			// 出错了"手动关闭连接"
			socket.close();
		}
		if (data.header.code === 0) {
			// 对话已经完成
			if (data.payload.choices.text && data.header.status === 2) {
				config.sparkResult += data.payload.choices.text[0].content;
				setTimeout(() => {
					// "对话完成，手动关闭连接"
					socket.close();
				}, 1000);
			}
		}
		addMsgToTextarea(data.payload.choices.text[0].content);
	});
	socket.addEventListener('close', (event) => {
		console.log('连接关闭！！', event);
		// 对话完成后socket会关闭，将聊天记录换行处理
		config.sparkResult = config.sparkResult + '\n';
		addMsgToTextarea('\n');
		// 清空输入框
		input.value = '';
	});
	socket.addEventListener('error', (event) => {
		console.log('连接发送错误！！', event);
	});
}

const getWebsocketUrl = () => {
	return new Promise((resovle) => {
		let url = 'wss://spark-api.xf-yun.com/v2.1/chat';
		let host = 'spark-api.xf-yun.com/v2.1/chat';
		let apiKeyName = 'api_key';
		let date = new Date().toUTCString();
		let algorithm = 'hmac-sha256';
		let headers = 'host date request-line';
		let signatureOrigin = `host: ${host}\ndate: ${date}\nGET /v2.1/chat HTTP/1.1`;
		let signatureSha = CryptoJs.HmacSHA256(signatureOrigin, config.APISecret);
		let signature = CryptoJs.enc.Base64.stringify(signatureSha);

		let authorizationOrigin = `${apiKeyName}="${config.APIKey}", algorithm="${algorithm}", headers="${headers}", signature="${signature}"`;

		let authorization = base64.encode(authorizationOrigin);

		// 将空格编码
		url = `${url}?authorization=${authorization}&date=${encodeURI(date)}&host=${host}`;

		resovle(url);
	});
};

const addMsgToTextarea = (text: string) => {
	textarea.value += text;
};
</script>
