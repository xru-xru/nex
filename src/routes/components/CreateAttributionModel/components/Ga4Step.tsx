import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../../components-ui/Select';
import { Button } from '../../../../components-ui/Button';
import { LabelLight } from '../../../../components/InputLabel/styles';
import { CirclePlus, Trash2 } from 'lucide-react';
import { Ga4State } from '../types';
import { startCase } from 'lodash';
import SvgWarningTwo from '../../../../components/icons/WarningTwo';
import { Link } from 'react-router-dom';
import { PATHS } from '../../../../routes/paths';

type Ga4StepProps = {
  ga4State: Ga4State;
  utmDimensionOptions: string[];
  isGa4Connected: boolean;
  onAddDimension: () => void;
  onUpdateDimension: (index: number, value: string) => void;
  onDeleteDimension: (index: number) => void;
};

export function Ga4Step({
  ga4State,
  utmDimensionOptions,
  isGa4Connected,
  onAddDimension,
  onUpdateDimension,
  onDeleteDimension,
}: Ga4StepProps) {
  return (
    <div className="flex flex-col gap-8">
      {!isGa4Connected && (
        <div className="max-w-2xl rounded-md border border-neutral-100 bg-[#FEFAE8] p-2">
          <div className="mb-1 flex items-center gap-2">
            <SvgWarningTwo warningCircleColor="#FCF1BA" warningColor="#F5CF0F" style={{ height: 20, width: 20 }} />
            <div className="text-md font-medium text-neutral-800">Turn on Google Analytics 4 to enable tracking</div>
          </div>
          <p className="ml-6 font-normal text-neutral-600">
            GA4 is currently set to disabled. Enable it in{' '}
            <Link
              to={PATHS.APP.SETTINGS_INTEGRATIONS}
              className="cursor-pointer text-[14px] font-medium leading-[150%] tracking-[0.36px] text-purple-400 underline"
            >
              Integrations
            </Link>{' '}
            to be able to use GA4 Tracking in this model.
          </p>
        </div>
      )}
      <div>
        <div className="text-md font-semibold text-neutral-700">UTM Parameters</div>
        <p className="mt-1 text-sm font-normal text-neutral-500">Configure dimensions for your UTM Parameters.</p>
      </div>

      <div className="flex max-w-2xl flex-col gap-6">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-1">
              <LabelLight>DIMENSION</LabelLight>
              <p className="text-xs text-neutral-400">Configure dimensions for your UTM Parameters.</p>
            </div>
            <Button
              onClick={onAddDimension}
              size="sm"
              variant="secondary"
              disabled={!isGa4Connected || ga4State.dimensions.length >= 5}
              className="h-8"
            >
              <CirclePlus className="mr-2 h-4 w-4" />
              Add Dimension
            </Button>
          </div>

          <div className="flex flex-col gap-4">
            {ga4State.dimensions.map((dimension, index) => (
              <React.Fragment key={index}>
                <div className="flex items-start gap-3">
                  <div className="flex-1">
                    <LabelLight style={{ fontSize: 11 }}>DIMENSION</LabelLight>
                    <Select
                      value={dimension.value || undefined}
                      onValueChange={(value) => onUpdateDimension(index, value)}
                      disabled={!isGa4Connected}
                    >
                      <SelectTrigger
                        className="mt-1 border-neutral-100 bg-white p-2 shadow-sm"
                        disabled={!isGa4Connected}
                      >
                        <SelectValue placeholder={`[Default Dimension${index + 1}]`} />
                      </SelectTrigger>
                      <SelectContent>
                        {utmDimensionOptions.map((option) => (
                          <SelectItem key={option} value={option}>
                            {startCase(option)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => onDeleteDimension(index)}
                    disabled={!isGa4Connected}
                    className="mt-6 h-10 w-10"
                  >
                    <Trash2 className="h-5 w-5 text-neutral-300" />
                  </Button>
                </div>
                {index < ga4State.dimensions.length - 1 && (
                  <div className="flex items-center gap-2">
                    <div className="h-[1px] w-6 border-t-2 border-dotted border-neutral-100"></div>
                    <span className="text-xs text-neutral-400">AND</span>
                    <div className="h-[1px] flex-1 border-t-2 border-dotted border-neutral-100"></div>
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
