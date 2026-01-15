import React, { useRef, useState } from 'react';
import { Button } from '../../../../components-ui/Button';
import { Check, CirclePlus, GripVertical, Pencil, X } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger } from '../../../../components-ui/Select';
import TextField from '../../../../components/TextField';
import { NexoyaFunnelStepType, NexoyaFunnelStepV2 } from '../../../../types';
import Typography from '../../../../components/Typography';
import { capitalize } from 'lodash';
import ButtonIcon from '../../../../components/ButtonIcon';
import { useDialogState } from '../../../../components/Dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../../../../components-ui/AlertDialog';
import ButtonAsync from '../../../../components/ButtonAsync';
import { useDrag, useDrop } from 'react-dnd';
import styled from 'styled-components';
import Tooltip from '../../../../components/Tooltip';
import { FUNNEL_CONFIG, FUNNEL_STEP_WIDTHS_PERCENTAGES } from '../Funnel/utils/funnel';
import { FunnelChannelStyled, FunnelStepStyled } from '../Funnel/styles';
import { nexyColors } from '../../../../theme';
import SvgEllipsisV from '../../../../components/icons/EllipsisV';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../../../../components-ui/DropdownMenu';
import SvgTarget from '../../../../components/icons/Target';
import { v4 as uuidv4 } from 'uuid';
import { ConfirmationDialog } from './ConfirmationDialog';
import usePortfolioMetaStore from '../../../../store/portfolio-meta';

const FUNNEL_STEP_TYPES = [
  { key: NexoyaFunnelStepType.Awareness, value: 'Awareness' },
  { key: NexoyaFunnelStepType.Consideration, value: 'Consideration' },
  { key: NexoyaFunnelStepType.Conversion, value: 'Conversion' },
  { key: NexoyaFunnelStepType.ConversionValue, value: 'Conversion value' },
  { key: NexoyaFunnelStepType.Other, value: 'Other' },
];

const DRAG_TYPE = 'FUNNEL_STEP';

const IndividualFunnelEdit = ({
  index,
  lastIndex,
  funnelStep,
  setFunnelStepMeta,
  moveFunnelStep,
  addFunnelStep,
  deleteFunnelStep,
  setTargetFunnelStep,
  isTarget,
}: {
  index: number;
  lastIndex: boolean;
  funnelStep: NexoyaFunnelStepV2;
  setFunnelStepMeta: (funnelStep: { type?: NexoyaFunnelStepType; title: string; isAttributed: boolean }) => void;
  moveFunnelStep: (dragIndex: number, hoverIndex: number) => void;
  addFunnelStep: (funnelStep: { title: string; type?: NexoyaFunnelStepType; position: number }) => void;
  deleteFunnelStep: (index: number) => void;
  setTargetFunnelStep: () => void;
  isTarget: boolean;
}) => {
  const { portfolioMeta } = usePortfolioMetaStore();

  const [addFunnelStepAtLastPosition, setAddFunnelStepAtLastPosition] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const [isEditing, setIsEditing] = useState(false);
  const [originalTitle] = useState(funnelStep.title); // Store the original title

  const [newFunnelStep, setNewFunnelStep] = useState({
    title: '',
    type: null,
  });
  const { isOpen, closeDialog, openDialog } = useDialogState();
  const { isOpen: isOpenChangeAttribution, closeDialog: closeChangeAttribution } = useDialogState();

  const handleChangeFunnelStepAttribution = () => {
    setFunnelStepMeta({
      ...funnelStep,
      isAttributed: true,
    });
  };
  const [, drop] = useDrop({
    accept: DRAG_TYPE,
    hover(item: any, monitor) {
      if (!ref.current) return;

      const dragIndex = item.index;
      const hoverIndex = index;

      if (dragIndex === hoverIndex) return;

      const hoverBoundingRect = ref.current?.getBoundingClientRect();
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;

      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) return;
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) return;

      moveFunnelStep(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: DRAG_TYPE,
    item: {
      index,
      id: funnelStep.funnelStepId || uuidv4(),
      type: DRAG_TYPE,
    },
    end: (item, monitor) => {
      if (!monitor.didDrop()) {
        // Reset if drag cancelled
        moveFunnelStep(item.index, index);
      }
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  drag(drop(ref));

  return (
    <div ref={ref} className={`${isDragging ? 'opacity-0' : 'opacity-100'}`}>
      <div className="flex items-center gap-2">
        <div className="h-[1px] w-full bg-neutral-100"></div>
        <Tooltip content="Add a new funnel step" variant="dark" placement="bottom-end">
          <ButtonIcon onClick={() => openDialog()} style={{ marginRight: 8 }}>
            <CirclePlus className="h-5 w-5 text-neutral-300" />
          </ButtonIcon>
        </Tooltip>
      </div>

      <div className="flex items-center gap-28">
        <div className="flex-none">
          <Button variant="ghost" className={isDragging ? 'cursor-grabbing' : 'cursor-grab'} size="sm">
            <GripVertical className="h-5 w-5" />
          </Button>
        </div>

        <div className="flex w-44 items-center justify-center">
          <FunnelStepStyled
            roundedBasedOnPosition={false}
            width={FUNNEL_CONFIG?.width}
            key={funnelStep.funnelStepId}
            className={index === 0 ? 'rounded-t-md' : lastIndex ? 'rounded-b-md' : ''}
            style={{
              width: FUNNEL_CONFIG?.width * FUNNEL_STEP_WIDTHS_PERCENTAGES[index],
              marginTop: index !== 0 ? '-8px' : '6px',
            }}
          >
            <FunnelChannelStyled
              style={{
                flex: 1,
                backgroundColor: nexyColors.azure,
                opacity: 0.6,
              }}
            />
          </FunnelStepStyled>
        </div>

        <div className="flex w-full flex-col gap-6">
          <div className="flex max-w-96 items-center gap-2">
            {isTarget && (
              <div className="ml-[-40px]">
                <SvgTarget style={{ width: 32, height: 32 }} />
              </div>
            )}
            {isEditing ? (
              <StyledTextField
                value={funnelStep.title}
                onChange={(e) =>
                  setFunnelStepMeta({
                    ...funnelStep,
                    title: e.target.value,
                  })
                }
                className="text-lg font-semibold"
              />
            ) : (
              <Typography
                withEllipsis={false}
                style={{ fontSize: 16, fontWeight: 500, whiteSpace: 'pre', width: 'fit-content' }}
              >
                {funnelStep.title}{' '}
                <span className="text-sm text-neutral-400">{funnelStep?.isAttributed ? '(attributed)' : ''}</span>
              </Typography>
            )}
            {isEditing ? (
              <div className="flex gap-1">
                <Tooltip content="Discard" variant="dark" size="small">
                  <Button
                    className="rounded-full"
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setFunnelStepMeta({
                        ...funnelStep,
                        title: originalTitle,
                      });
                      setIsEditing(false);
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </Tooltip>
                <Tooltip content="Save changes" variant="dark" size="small">
                  <Button className="rounded-full" variant="ghost" size="sm" onClick={() => setIsEditing(false)}>
                    <Check className="h-4 w-4" />
                  </Button>
                </Tooltip>
              </div>
            ) : (
              <div className="flex w-full justify-between">
                <Button className="rounded-full" variant="ghost" size="sm" onClick={() => setIsEditing(!isEditing)}>
                  <Pencil className="h-4 w-4" />
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button className="rounded-full" variant="ghost" size="sm">
                      <SvgEllipsisV
                        style={{
                          fontSize: 18,
                        }}
                      />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-72 font-normal" align="start">
                    <DropdownMenuItem
                      disabled={isTarget || funnelStep.funnelStepId < 0 || portfolioMeta?.isAttributed}
                      onSelect={setTargetFunnelStep}
                    >
                      Set as portfolio target
                    </DropdownMenuItem>
                    {/*divider */}

                    <DropdownMenuItem disabled={funnelStep?.isAttributed} onSelect={() => deleteFunnelStep(index)}>
                      <span className="text-red-400">Delete funnel step</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}
          </div>
          <div className="flex w-full flex-col gap-2">
            <Typography variant="subtitlePill">FUNNEL STEP TYPE</Typography>
            <div className="w-full">
              <Select
                value={capitalize(funnelStep.type)}
                onValueChange={(value) =>
                  setFunnelStepMeta({
                    ...funnelStep,
                    type: value as NexoyaFunnelStepType,
                  })
                }
              >
                <SelectTrigger
                  style={{
                    boxShadow: '0px 2px 3px -1px rgba(136, 138, 148, 0.12',
                  }}
                  className="text-md max-w-96 justify-between rounded-[5px] border-neutral-100 bg-white px-4 py-3 text-neutral-400 shadow-sm"
                >
                  {capitalize(funnelStep.type?.replace('_', ' '))}
                </SelectTrigger>
                <SelectContent>
                  {FUNNEL_STEP_TYPES.map((type) => (
                    <SelectItem className="flex justify-between px-2 py-1.5" key={type.key} value={type.key.toString()}>
                      <span>{type.value}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>
      <ConfirmationDialog
        isOpen={isOpenChangeAttribution}
        onConfirm={() => {
          handleChangeFunnelStepAttribution();
          closeChangeAttribution();
        }}
        onCancel={closeChangeAttribution}
        type="apply"
        description="This will change the funnel step to a attributed funnel step. This action is irreversible, do you want to proceed?"
      />
      <AlertDialog open={isOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Add new funnel step</AlertDialogTitle>
            <AlertDialogDescription>
              <span className="mt-1 text-sm font-normal leading-5 text-neutral-400">
                Give the funnel step a name and define its type
              </span>
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="mt-[-16px]">
            <div className="mt-6 flex flex-col gap-2">
              <TextField
                label="Name"
                placeholder="Enter this funnel step’s name"
                className="my-2 !w-full"
                value={newFunnelStep.title}
                name="name"
                id="new-funnel-step-title"
                labelVariant="light"
                onChange={(e) => setNewFunnelStep({ ...newFunnelStep, title: e.target.value })}
              />
              <div>
                <div className="mb-2 text-xs uppercase text-blueyGrey">Type</div>
                <Select
                  value={newFunnelStep.type}
                  onValueChange={(value) => setNewFunnelStep({ ...newFunnelStep, type: value })}
                >
                  <SelectTrigger
                    style={{
                      boxShadow: '0px 2px 3px -1px rgba(136, 138, 148, 0.12',
                    }}
                    className="text-md h-full w-full justify-between rounded-[5px] border-neutral-100 bg-white px-4 py-3 text-neutral-400 shadow-sm"
                    placeholder="Select a funnel step type"
                  >
                    <div className="text-sm">
                      {newFunnelStep.type
                        ? capitalize(FUNNEL_STEP_TYPES.find((fst) => fst.key === newFunnelStep.type)?.value)
                        : 'Select a funnel step type'}
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    {FUNNEL_STEP_TYPES.map((type) => (
                      <SelectItem className="flex justify-between py-1.5" key={type.key} value={type.key.toString()}>
                        <span>{type.value}</span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <AlertDialogFooter>
            <AlertDialogAction
              onClick={() => {
                setNewFunnelStep({ title: '', type: '' });
                closeDialog();
              }}
            >
              <ButtonAsync variant="contained" color="secondary" size="small">
                Cancel
              </ButtonAsync>
            </AlertDialogAction>

            <AlertDialogAction>
              <ButtonAsync
                disabled={!newFunnelStep.title || !newFunnelStep.type}
                onClick={() => {
                  addFunnelStep({ ...newFunnelStep, position: addFunnelStepAtLastPosition ? index + 1 : index });
                  setNewFunnelStep({ title: '', type: '' });
                  setAddFunnelStepAtLastPosition(false);
                  closeDialog();
                }}
                variant="contained"
                color="primary"
                size="small"
              >
                Add funnel step
              </ButtonAsync>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      {lastIndex ? (
        <div className="flex items-center gap-2">
          <div className="h-[1px] w-full bg-neutral-100"></div>
          <Tooltip content="Add a new funnel step" variant="dark" placement="bottom-end">
            <ButtonIcon
              onClick={() => {
                openDialog();
                setAddFunnelStepAtLastPosition(true);
              }}
              style={{ marginRight: 8 }}
            >
              <CirclePlus className="h-5 w-5 text-neutral-300" />
            </ButtonIcon>
          </Tooltip>
        </div>
      ) : null}
    </div>
  );
};

const StyledTextField = styled(TextField)`
  .NEXYInputWrap {
    padding: 4px 16px;
  }
`;

export default IndividualFunnelEdit;
