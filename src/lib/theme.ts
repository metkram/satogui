import { get, writable } from 'svelte/store';

export const theme = writable<'light' | 'dark'>();

export function toggleDarkMode(newTheme?: 'light' | 'dark') {
	console.log({ newTheme });
	if (newTheme) {
		theme.set(newTheme);
		console.log('new');
		localStorage.setItem('theme', newTheme);
		return;
	} else {
		console.log('not new');
		const _theme = get(theme) === 'light' ? 'dark' : 'light';
		theme.set(_theme);
		localStorage.setItem('theme', _theme);
		// toggle classlist
		const html = document.querySelector('html');
		if (html) html.classList.toggle('dark');
	}
}
