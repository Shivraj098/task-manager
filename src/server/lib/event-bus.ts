type Callback = () => void;

let listeners: Callback[] = [];

export function subscribe(cb: Callback) {
  listeners.push(cb);
  return () => {
    listeners = listeners.filter((l) => l !== cb);
  };
}

export function notify() {
  listeners.forEach((cb) => cb());
}