export function radiusAdapter(_, target, key) {
  switch (key) {
    case 'cornerRadiusTopLeft':
    case 'cornerRadiusTopRight':
      return target.dataItem.valueY < 0 ? 0 : 5;

    case 'cornerRadiusBottomLeft':
    case 'cornerRadiusBottomRight':
      return target.dataItem.valueY < 0 ? 5 : 0;

    default:
      return 0;
  }
}
