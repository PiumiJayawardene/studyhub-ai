"use client";

import * as React from "react";
import {
  Controller,
  FormProvider,
  useFormContext,
  type ControllerProps,
  type FieldPath,
  type FieldValues,
} from "react-hook-form";

export const Form = FormProvider;

type FormFieldContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> = {
  name: TName;
};

const FormFieldContext =
  React.createContext<FormFieldContextValue>(
    {} as FormFieldContextValue
  );

export function FormField<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>
>({
  ...props
}: ControllerProps<TFieldValues, TName>) {
  return (
    <FormFieldContext.Provider value={{ name: props.name }}>
      <Controller {...props} />
    </FormFieldContext.Provider>
  );
}

export function useFormField() {
  const fieldContext = React.useContext(FormFieldContext);
  const { getFieldState, formState } = useFormContext();

  const fieldState = getFieldState(fieldContext.name, formState);

  return {
    ...fieldState,
    name: fieldContext.name,
  };
}

export function FormItem({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={className} {...props} />
  );
}

export function FormLabel(
  props: React.LabelHTMLAttributes<HTMLLabelElement>
) {
  return <label {...props} />;
}

export function FormControl({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

export function FormMessage() {
  const { error } = useFormField();

  if (!error) return null;

  return (
    <p className="text-sm text-destructive">
      {String(error.message)}
    </p>
  );
}