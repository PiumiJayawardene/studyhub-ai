"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import {
  subjectSchema,
  type SubjectFormValues,
} from "@/lib/validations/subject";

import {
  colorOptions,
  iconOptions,
  subjectIcons,
} from "@/config/subject-options";

import { cn } from "@/lib/utils";
import type { Subject } from "@/types/subject";

type SubjectFormProps = {
  subject?: Subject;
  onSubmit: (
    values: SubjectFormValues
  ) => Promise<{ error?: string; success?: boolean }>;
  onSuccess: () => void;
};

export function SubjectForm({
  subject,
  onSubmit,
  onSuccess,
}: SubjectFormProps) {
  const [isPending, startTransition] = useTransition();
  const [serverError, setServerError] = useState<string | null>(null);

  const form = useForm<SubjectFormValues>({
    resolver: zodResolver(subjectSchema),
    defaultValues: {
      name: subject?.name ?? "",
      color: subject?.color ?? colorOptions[0],
      icon: subject?.icon ?? iconOptions[0],
    },
  });

  function handleSubmit(values: SubjectFormValues) {
    setServerError(null);

    startTransition(async () => {
      const result = await onSubmit(values);

      if (result.error) {
        setServerError(result.error);
      } else {
        onSuccess();
      }
    });
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="flex flex-col gap-4"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Subject name</FormLabel>

              <FormControl>
                <Input
                  placeholder="e.g. Data Structures"
                  {...field}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="color"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Color</FormLabel>

              <FormControl>
                <div className="flex flex-wrap gap-2">
                  {colorOptions.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => field.onChange(color)}
                      className={cn(
                        "h-8 w-8 rounded-full border-2",
                        field.value === color
                          ? "border-foreground"
                          : "border-transparent"
                      )}
                      style={{
                        backgroundColor: color,
                      }}
                    />
                  ))}
                </div>
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="icon"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Icon</FormLabel>

              <FormControl>
                <div className="flex flex-wrap gap-2">
                  {iconOptions.map((iconKey) => {
                    const Icon = subjectIcons[iconKey];

                    return (
                      <button
                        key={iconKey}
                        type="button"
                        onClick={() => field.onChange(iconKey)}
                        className={cn(
                          "flex h-9 w-9 items-center justify-center rounded-md border",
                          field.value === iconKey
                            ? "border-foreground bg-muted"
                            : "border-input"
                        )}
                      >
                        <Icon className="h-4 w-4" />
                      </button>
                    );
                  })}
                </div>
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        {serverError && (
          <p className="text-sm text-destructive">
            {serverError}
          </p>
        )}

        <Button
          type="submit"
          disabled={isPending}
        >
          {isPending
            ? "Saving..."
            : subject
            ? "Save changes"
            : "Create subject"}
        </Button>
      </form>
    </Form>
  );
}