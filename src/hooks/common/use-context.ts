import { inject, provide } from 'vue';
import type { InjectionKey } from 'vue';

const sharedInjectKeyMap: { [key: string]: InjectionKey<any> } = {};

/** 创建共享上下文状态 */
export default function useContext<T>(contextName = 'context') {
	if (!sharedInjectKeyMap[contextName]) {
		sharedInjectKeyMap[contextName] = Symbol(contextName);
	}

	const injectKey: InjectionKey<T> = sharedInjectKeyMap[contextName];

	function useProvide(context: T) {
		provide(injectKey, context);
		return context;
	}

	function useInject() {
		return inject(injectKey) as T;
	}

	return {
		useProvide,
		useInject
	};
}
