import { CSSProperties } from 'react';
import { cn } from '../lib/utils';

interface Props {
  title: string;
  subtitle: string;
  icon?: JSX.Element;
  style?: CSSProperties;
  wrapperClassName?: CSSProperties;
}

function NoSelection({ title, subtitle, icon, wrapperClassName }: Props) {
  return (
    <div
      className={cn(
        'flex min-h-80 flex-col items-center justify-center rounded-md border border-neutral-100 bg-white',
        wrapperClassName,
      )}
    >
      <div className="flex flex-col gap-2 p-6">
        <div className="flex items-center gap-1.5">
          <h4 className="font-semibold text-neutral-500">{title}</h4>
          <div>{icon}</div>
        </div>
        <span className="max-w-md font-medium text-neutral-400">{subtitle}</span>
      </div>
    </div>
  );
}

export default NoSelection;
