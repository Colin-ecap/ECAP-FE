'use client';

import { Button } from '@/components/ui/button';
import type { ButtonProps } from '@/components/ui/button';
import { DayPicker } from '@/components/ui/day-picker';
import { FormError } from '@/components/ui/form-error';
import { Input, type InputProps } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn, formatTrackDateWithShortMonth } from '@/utils';
import type { LabelProps } from '@radix-ui/react-label';
import { usePathname } from 'next/navigation';
import { useRouter } from 'next/navigation';
import type { ChangeEvent } from 'react';
interface InputWithButtonProps extends React.PropsWithChildren<{}> {
  onSubmit: (data: any) => Promise<void>;
  button: ButtonProps;
  fields: {
    label: LabelProps;
    input: InputProps;
    error?: string;
  }[];
  className?: string;
}

export const InputWithButton = ({
  children,
  fields,
  button,
  onSubmit,
  className,
}: InputWithButtonProps) => {
  return (
    <form className={cn('space-y-2 text-lg', className)} onSubmit={onSubmit}>
      {fields.map((field) => (
        <>
          <Label key={`${field.label.htmlFor}label`} className="p-2" {...field.label} />
          <Input key={field.input.id} {...field.input} />
          <DatePikerWrapper field={field} key={`${field.input.id}date-picker`} />
          {field.error && (
            <FormError
              key={`${field.input.id}error`}
              id={`${field.input.id}error`}
              message={field.error}
              className="text-wrap"
            />
          )}
        </>
      ))}
      {children}
      <Button className="w-full" type="submit" {...button} />
    </form>
  );
};

const DatePikerWrapper = ({
  field,
}: {
  field: { input: InputProps; error?: string };
}) => {
  if (field.input.type === 'date') {
    return (
      <DayPicker
        value={field.input.value ? new Date(field.input.value as string) : undefined}
        onChange={(date) => {
          if (field.input.onChange) {
            field.input.onChange({
              target: {
                name: field.input.name,
                value: date,
              },
            } as unknown as ChangeEvent<HTMLInputElement>);
          }
        }}
        format={formatTrackDateWithShortMonth}
        fromDate={field.input.min ? new Date(field.input.min) : undefined}
        toDate={field.input.max ? new Date(field.input.max) : undefined}
      />
    );
  }
  return null;
};

interface ActionsProps extends React.PropsWithChildren<{}> {
  edit: ButtonProps;
  deletе: ButtonProps;
}

export const Actions = ({ edit, deletе }: ActionsProps) => {
  return (
    <>
      <Button children="Edit" {...edit} />
      <Button children="Delete" {...deletе} />
    </>
  );
};

export type NextButtonProps = {
  currentStep: number;
  isNextAllowed: boolean;
  isLastStep?: boolean;
  backButton?: ButtonProps;
};

export const NextButton = ({
  currentStep,
  isNextAllowed,
  backButton,
  isLastStep = false,
}: NextButtonProps) => {
  const router = useRouter();
  const pathname = usePathname();

  const handleNext = () => {
    router.push(`${pathname}?step=${currentStep + 1}`);
  };

  const handleBack = () => {
    router.push(`${pathname}?step=${currentStep - 1}`);
  };

  return (
    <div className="flex w-full justify-between">
      <Button children="Back" disabled={currentStep === 0} onClick={handleBack} {...backButton} />
      {!backButton && (
        <Button disabled={!isNextAllowed || isLastStep} children="Next" onClick={handleNext} />
      )}
    </div>
  );
};
