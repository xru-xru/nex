import { format } from '../utils/dates';

export const pdfStyles = {
  pageInfo: {
    fontSize: 9,
    color: '#bbb',
  },
  title: {
    fontSize: 28,
    bold: true,
  },
  description: {
    fontSize: 11,
  },
  h2: {
    fontSize: 16,
    bold: true,
  },
  text: {
    fontSize: 11,
  },
  th1: {
    fontSize: 12,
    bold: true,
    opacity: 1,
  },
  th2: {
    fontSize: 8,
    opacity: 0.5, // alignment: 'left',
  },
  tc1: {},
  tc2: {
    // alignment: 'left',
    fontSize: 10,
  },
};
export function getHeader(name: string, logoImg: string): Record<string, any> {
  return {
    columns: [
      {
        text: name,
        margin: [0, 7, 0, 0],
      },
      {
        image: logoImg,
        width: 80,
      },
    ],
    style: 'pageInfo',
    margin: [40, 15, 40],
  };
}
export function getFooter(): Record<string, any> {
  return function (currentPage: number, pageCount: number) {
    return {
      columns: [
        {
          text: currentPage.toString() + ' of ' + pageCount,
        },
        {
          text: `generated at ${format(new Date())}`,
          alignment: 'right',
        },
      ],
      style: 'pageInfo',
      margin: [40, 15, 40, 15],
    };
  };
}
export function getTableLayout(): Record<string, any> {
  return {
    hLineWidth: function (i) {
      return i === 0 ? 0 : 0.5;
    },
    vLineWidth: function (i, node) {
      return i === 0 || i === node.table.widths.length ? 0 : 0;
    },
    hLineColor: function () {
      return '#bbb';
    },
    vLineColor: function () {
      return 'none';
    },
    paddingBottom: () => {
      return 10;
    },
  };
}
