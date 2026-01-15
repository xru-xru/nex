interface BudgetDetails_V1 {
  budget: number;
  spent: number;
  left: number;
  percentage: number;
}

export default function getBudgetDetails(activities: any[]): BudgetDetails_V1 {
  const total = activities
    ? activities.reduce(
        (prev, next) => {
          prev.budget += next.budget;
          prev.spent += next.spent;
          prev.left += next.left;
          return prev;
        },
        {
          budget: 0,
          spent: 0,
          left: 0,
          percentage: 0,
        },
      )
    : {
        budget: 0,
        spent: 0,
        left: 0,
        percentage: 0,
      };

  total.percentage = (total.spent / total.budget) * 100;

  return {
    ...total,
  };
}
