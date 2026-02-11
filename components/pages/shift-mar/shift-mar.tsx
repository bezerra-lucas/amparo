'use client';

import { useMemo, useState } from 'react';

import { ActionBar } from '@/components/common/action-bar/action-bar';
import { FormField } from '@/components/common/form-field/form-field';
import { Badge } from '@/components/ui/badge/badge';
import { Button } from '@/components/ui/button/button';
import { Card } from '@/components/ui/card/card';
import { Select } from '@/components/ui/select/select';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle
} from '@/components/ui/sheet/sheet';
import { Textarea } from '@/components/ui/textarea/textarea';
import { Toast } from '@/components/ui/toast/toast';

export type ShiftMarStatus = 'pending' | 'given' | 'notGiven';

type ShiftMarItem = {
  id: string;
  time: string;
  medication: string;
  dose: string;
  status: ShiftMarStatus;
  reason?: string;
};

type ShiftMarReasonOption = {
  value: string;
  label: string;
};

type ShiftMarLabels = {
  time: string;
  medication: string;
  dose: string;
  status: string;
  reason: string;
  statuses: {
    pending: string;
    given: string;
    notGiven: string;
  };
  actions: {
    given: string;
    notGiven: string;
    save: string;
  };
  reasonSheet: {
    title: string;
    description: string;
    reasonLabel: string;
    noteLabel: string;
    confirm: string;
    cancel: string;
  };
  toast: {
    savedTitle: string;
    savedDescription: string;
  };
};

function StatusIcon({ status }: { status: ShiftMarStatus }) {
  const iconClass = 'h-3.5 w-3.5';

  if (status === 'given') {
    return (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden className={iconClass}>
        <path
          d="M5 12.5L9.5 17L19 7.5"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  if (status === 'notGiven') {
    return (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden className={iconClass}>
        <path
          d="M7 7L17 17M17 7L7 17"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden className={iconClass}>
      <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M12 8V12L14.5 13.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function statusVariant(status: ShiftMarStatus): 'danger' | 'success' | 'muted' {
  if (status === 'given') {
    return 'success';
  }

  if (status === 'notGiven') {
    return 'danger';
  }

  return 'muted';
}

export function ShiftMar({
  items,
  labels,
  reasonOptions
}: {
  items: ShiftMarItem[];
  labels: ShiftMarLabels;
  reasonOptions: ShiftMarReasonOption[];
}) {
  const [marItems, setMarItems] = useState(items);
  const [activeItemId, setActiveItemId] = useState<string | null>(null);
  const [isReasonSheetOpen, setIsReasonSheetOpen] = useState(false);
  const [reasonValue, setReasonValue] = useState(reasonOptions[0]?.value ?? '');
  const [reasonNote, setReasonNote] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  const statusLabels = useMemo(
    () => ({
      pending: labels.statuses.pending,
      given: labels.statuses.given,
      notGiven: labels.statuses.notGiven
    }),
    [labels.statuses.given, labels.statuses.notGiven, labels.statuses.pending]
  );

  function setItemStatus(id: string, status: ShiftMarStatus, reason?: string) {
    setMarItems((currentItems) =>
      currentItems.map((item) => {
        if (item.id !== id) {
          return item;
        }

        return {
          ...item,
          status,
          reason
        };
      })
    );
  }

  function handleMarkGiven(id: string) {
    setItemStatus(id, 'given');
    setIsSaved(false);
  }

  function openReasonSheet(id: string) {
    setActiveItemId(id);
    setReasonValue(reasonOptions[0]?.value ?? '');
    setReasonNote('');
    setIsReasonSheetOpen(true);
    setIsSaved(false);
  }

  function handleConfirmReason() {
    if (!activeItemId) {
      return;
    }

    const selectedReasonLabel =
      reasonOptions.find((reason) => reason.value === reasonValue)?.label ??
      reasonValue;

    const reasonSummary = reasonNote.trim()
      ? `${selectedReasonLabel}: ${reasonNote.trim()}`
      : selectedReasonLabel;

    setItemStatus(activeItemId, 'notGiven', reasonSummary);
    setIsReasonSheetOpen(false);
  }

  function handleSave() {
    setIsSaved(true);
  }

  return (
    <>
      <div className="space-y-3 pb-28 sm:pb-0">
        {isSaved ? (
          <Toast
            variant="success"
            title={labels.toast.savedTitle}
            description={labels.toast.savedDescription}
          />
        ) : null}

        {marItems.map((item) => {
          const statusLabel = statusLabels[item.status];

          return (
            <Card
              key={item.id}
              data-testid={`mar-item-${item.id}`}
              className="space-y-3"
            >
              <div className="flex items-center justify-between gap-2">
                <strong>
                  {labels.time}: {item.time}
                </strong>
                <Badge
                  variant={statusVariant(item.status)}
                  aria-label={`${labels.status}: ${statusLabel}`}
                  className="gap-1"
                >
                  <StatusIcon status={item.status} />
                  <span>{statusLabel}</span>
                </Badge>
              </div>

              <div className="grid gap-2 text-sm text-ink-muted sm:grid-cols-2">
                <div>
                  <strong>{labels.medication}:</strong> {item.medication}
                </div>
                <div>
                  <strong>{labels.dose}:</strong> {item.dose}
                </div>
              </div>

              {item.reason ? (
                <p className="text-sm text-ink-muted">
                  <strong>{labels.reason}:</strong> {item.reason}
                </p>
              ) : null}

              <div className="grid gap-2 sm:grid-cols-2">
                <Button type="button" onClick={() => handleMarkGiven(item.id)}>
                  {labels.actions.given}
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => openReasonSheet(item.id)}
                >
                  {labels.actions.notGiven}
                </Button>
              </div>
            </Card>
          );
        })}
      </div>

      <ActionBar className="bottom-[4.75rem]" contentClassName="sm:hidden">
        <Button type="button" className="w-full" onClick={handleSave}>
          {labels.actions.save}
        </Button>
      </ActionBar>

      <Sheet open={isReasonSheetOpen} onOpenChange={setIsReasonSheetOpen}>
        <SheetContent
          side="bottom"
          className="rounded-t-2xl border-t border-line bg-canvas px-4 pb-5 pt-4"
        >
          <div className="space-y-3">
            <div className="space-y-1">
              <SheetTitle className="font-heading text-lg text-ink-strong">
                {labels.reasonSheet.title}
              </SheetTitle>
              <SheetDescription className="text-sm text-ink-muted">
                {labels.reasonSheet.description}
              </SheetDescription>
            </div>

            <FormField id="mar-reason" label={labels.reasonSheet.reasonLabel}>
              <Select
                id="mar-reason"
                value={reasonValue}
                onChange={(event) => setReasonValue(event.target.value)}
              >
                {reasonOptions.map((reason) => (
                  <option key={reason.value} value={reason.value}>
                    {reason.label}
                  </option>
                ))}
              </Select>
            </FormField>

            <FormField
              id="mar-reason-note"
              label={labels.reasonSheet.noteLabel}
            >
              <Textarea
                id="mar-reason-note"
                value={reasonNote}
                onChange={(event) => setReasonNote(event.target.value)}
              />
            </FormField>

            <div className="grid gap-2 sm:grid-cols-2">
              <Button type="button" onClick={handleConfirmReason}>
                {labels.reasonSheet.confirm}
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => setIsReasonSheetOpen(false)}
              >
                {labels.reasonSheet.cancel}
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
