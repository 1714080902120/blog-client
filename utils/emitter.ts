import mitt from 'mitt'

const emitter = mitt();


export function eventOn(id: string, cb: Function) {
  // @ts-ignore
  emitter.on(id, cb)
}

export function eventEmit(id: string, data?: any) {
  emitter.emit(id, data)
}
