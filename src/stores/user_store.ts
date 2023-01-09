import { derived, writable, type Writable } from "svelte/store";

type Nullable<T> = T | undefined | null;

export const is_authenticated: Writable<boolean> = writable(false);
export const jwt_token: Writable<Nullable<string>> = writable();
export const sub: Writable<Nullable<string>> = writable();
export const exp: Writable<Nullable<string>> = writable();
export const iss: Writable<Nullable<string>> = writable();
export const email: Writable<Nullable<string>> = writable();
export const name: Writable<Nullable<string>> = writable();
export const popup_opened: Writable<boolean> = writable(false);

export const user_id = derived(sub, ($sub) => $sub);
