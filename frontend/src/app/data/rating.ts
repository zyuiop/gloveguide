export enum Rating {
  GOOD = 'Good', MEDIUM = 'Medium', PASSABLE = 'Passable', POOR = 'Poor'
}

export const Ratings = [Rating.GOOD, Rating.MEDIUM, Rating.PASSABLE, Rating.GOOD];

export function strToRating(str: string | Rating): Rating {
  if (typeof str === 'string') {
    switch (str) {
      case 'Good':
        return Rating.GOOD;
      case 'Medium':
        return Rating.MEDIUM;
      case 'Passable':
        return Rating.PASSABLE;
      case 'Poor':
        return Rating.POOR;
      default:
        return undefined;
    }
  } else {
    return str as Rating;
  }
}
