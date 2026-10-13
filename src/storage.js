const PREFIX='pynault:v1:';
export function read(key, fallback){try {const s=localStorage.getItem(PREFIX+key);if(!s)return fallback;const data=JSON.parse(s);return data===null?fallback:data;}catch{return fallback}}
export function write(key, value){try{localStorage.setItem(PREFIX+key,JSON.stringify(value))}catch(e){console.warn('Pynault could not persist',key,e)}}
