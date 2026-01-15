import { colorByKey } from '../theme/utils';

// returns color depending of percentage
// used to color circles (for achieved and predicted)
// fixed prop shows default green
// color variants defined here: https://gitlab.com/nexoya/ui-webapp/issues/472#note_286519704
// red 0-20%
// yellow 21-48%
// blue 49-74%
// green 75-100%

export default function getColorVariant(percent: number, fixed = false) {
  if (fixed) {
    return colorByKey('greenTeal');
  }
  if (percent < 21) {
    return colorByKey('orangeyRed');
  } else if (percent >= 21 && percent < 49) {
    return colorByKey('dandelion');
  } else if (percent >= 49 && percent < 75) {
    return colorByKey('azure');
  } else return colorByKey('greenTeal');
}
