import { NexoyaAttributionModelStatus } from '../../types';
import React from 'react';

export const getStatusLabel = (status: NexoyaAttributionModelStatus) => {
  switch (status) {
    case NexoyaAttributionModelStatus.Draft:
      return 'Draft';
    case NexoyaAttributionModelStatus.Running:
      return 'In Progress';
    case NexoyaAttributionModelStatus.InReview:
      return 'Ready For Review';
    case NexoyaAttributionModelStatus.Approved:
      return 'Accepted';
    case NexoyaAttributionModelStatus.Rejected:
      return 'Rejected';
    case NexoyaAttributionModelStatus.Cancelled:
      return 'Discarded';
    default:
      return status;
  }
};

export const getStatusColor = (status: NexoyaAttributionModelStatus) => {
  switch (status) {
    case NexoyaAttributionModelStatus.Draft:
      return 'bg-neutral-200 text-neutral-900';
    case NexoyaAttributionModelStatus.Running:
      return 'bg-yellow-200 text-neutral-900';
    case NexoyaAttributionModelStatus.InReview:
      return 'bg-green-200 text-neutral-900';
    case NexoyaAttributionModelStatus.Approved:
      return 'bg-lightBlue-200 text-neutral-900';
    case NexoyaAttributionModelStatus.Rejected:
      return 'bg-red-200 text-neutral-900';
    case NexoyaAttributionModelStatus.Cancelled:
      return 'bg-purple-200 text-neutral-900';
    default:
      return 'bg-neutral-200 text-neutral-900';
  }
};

export const StatusBadge = ({ status }: { status: NexoyaAttributionModelStatus }) => {
  return (
    <span
      className={`inline-flex w-32 items-center justify-center rounded-full px-2 py-0.5 text-xs font-medium ${getStatusColor(status)}`}
    >
      {getStatusLabel(status)}
    </span>
  );
};
