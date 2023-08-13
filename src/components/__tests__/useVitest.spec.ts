import { describe, it, expect } from 'vitest';

import { mount } from '@vue/test-utils';
import HelloWorld from '../useVitest.vue';

describe('useVitest', () => {
	it('renders properly', () => {
		const wrapper = mount(HelloWorld, { props: { msg: 'Hello Vitest' } });
		expect(wrapper.text()).toContain('Hello Vitest');
	});
});
