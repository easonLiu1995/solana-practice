export function numberInput(val: string) {
  return val.replace(/[^0-9.]/g, '').replace(/(\..*?)\..*/g, '$1')
}
