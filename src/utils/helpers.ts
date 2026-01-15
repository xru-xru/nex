import { ShareItemTypes } from '../types/types.custom';

export function createChainedFunction(...funcs: ((...args: Array<any>) => any)[]) {
  return funcs.reduce(
    (acc, func) => {
      if (func == null) {
        return acc;
      }

      // warning(
      //   typeof func === 'function',
      //   'Material-UI: invalid Argument Type, must only provide functions, undefined, or null.',
      // );
      return function chainedFunction(...args: any[]) {
        acc.apply(this, args);
        func.apply(this, args);
      };
    },
    () => {}
  );
}
export function getHasTransition(props: any) {
  return props.children ? props.children.props.hasOwnProperty('in') : false;
}
export function getShareUrl(id: number, type: ShareItemTypes): string {
  const baseUrl = window.location.origin.toString() || '';
  return `${baseUrl}/${type}s/${id}`;
}
export function checkOverflow(elem: HTMLElement): boolean {
  return elem ? elem.clientWidth < elem.scrollWidth || elem.clientHeight < elem.scrollHeight : false;
}

export function copyToClipboard(value: string | number) {
  if (typeof value === 'number') value = value.toString();
  // if navigator is undefined (https issue), then use hack to manually
  // insert content to be copied in the page, and remove it after
  if (navigator.clipboard && window.isSecureContext) {
    return navigator.clipboard.writeText(value);
  } else {
    const textArea = document.createElement('textarea');
    textArea.value = value;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    document.execCommand('copy');
    textArea.remove();
  }
}
