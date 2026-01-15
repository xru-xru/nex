import React, { useEffect, useState } from 'react';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../../../../components-ui/AlertDialog';
import dayjs from 'dayjs';
import Divider from '../../../../components/Divider';
import Button from '../../../../components/Button';
import styled from 'styled-components';
import Checkbox from '../../../../components/Checkbox';
import { ScrollArea } from '../../../../components-ui/ScrollArea';

export const DuplicateEventsDialog = ({ duplicates, isOpen, onClose, onConfirm, numberOfImportedEvents }) => {
  const [selectedEvents, setSelectedEvents] = useState<number[]>([]);

  // Reset state when dialog closes or when unmounted
  useEffect(() => {
    if (!isOpen) {
      setSelectedEvents([]);
    }
  }, [isOpen]);

  const handleSelectEvent = (portfolioEventId: number) => {
    setSelectedEvents((prev) =>
      prev.includes(portfolioEventId) ? prev.filter((id) => id !== portfolioEventId) : [...prev, portfolioEventId],
    );
  };

  const handleKeepExisting = () => {
    const selections = Object.fromEntries(duplicates.map((id) => [id, 'keep_existing']));
    onConfirm(selections);
    setSelectedEvents([]); // Reset state after confirmation
  };

  const handleReplaceWithNew = () => {
    const selections = Object.fromEntries(selectedEvents.map((id) => [id, 'replace_with_new']));
    onConfirm(selections);
    setSelectedEvents([]); // Reset state after confirmation
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {duplicates?.length} of {numberOfImportedEvents} events cannot be imported
          </AlertDialogTitle>
          <div className="text-sm font-normal text-neutral-400">
            The remaining {duplicates?.length} events with the following names already exist in your events menu.
          </div>
        </AlertDialogHeader>

        <ScrollArea className="flex max-h-[50vh] flex-col items-start justify-start">
          {duplicates.map((duplicate, index) => (
            <React.Fragment key={duplicate?.portfolioEventId}>
              <div className="w-full">
                <StyledCheckbox
                  checked={selectedEvents.includes(duplicate?.portfolioEventId)}
                  onChange={() => handleSelectEvent(duplicate?.portfolioEventId)}
                  value={duplicate?.portfolioEventId.toString()}
                  name="duplicateEvent"
                  className="w-full"
                  label={
                    <div className="flex flex-row items-center justify-between text-sm">
                      <span className="font-medium text-neutral-500">{duplicate?.name}</span>
                      <span className="text-xs text-neutral-400">
                        {dayjs(duplicate?.start).format('MMM D, YYYY')} - {dayjs(duplicate?.end).format('MMM D, YYYY')}
                      </span>
                    </div>
                  }
                />
                {index < duplicates.length - 1 && <Divider className="!m-1" />}
              </div>
            </React.Fragment>
          ))}
        </ScrollArea>

        <div className="text-sm font-normal text-neutral-400">What do you want to do?</div>
        <AlertDialogFooter>
          <div className="flex gap-2">
            <Button variant="contained" color="secondary" size="small" onClick={handleKeepExisting}>
              Keep existing events
            </Button>
            <Button
              variant="contained"
              size="small"
              color="primary"
              disabled={selectedEvents.length === 0}
              onClick={handleReplaceWithNew}
            >
              Replace selected
            </Button>
          </div>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

const StyledCheckbox = styled(Checkbox)`
  .label {
    justify-content: flex-start;
    label {
      width: 100%;
    }
  }
`;
