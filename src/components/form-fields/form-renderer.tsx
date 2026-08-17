'use client'

import React, { useState } from 'react'

import type { Form } from '@/payload-types'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type FormField = NonNullable<Form['fields']>[number]

type SubmissionEntry = { field: string; value: string }

type Status = 'idle' | 'submitting' | 'error' | 'success'

const ACCEPTED_FILES = '.pdf,.step,.stp,.igs,.iges,.dxf,.dwg,.stl,.zip,.jpg,.jpeg,.png,.heic'
const MAX_FILE_BYTES = 10 * 1024 * 1024

const inputClasses =
  'w-full hairline bg-graphite-900/60 px-4 py-3 text-sm text-steel-50 placeholder:text-steel-300/60 transition-colors focus:border-ember'

const labelClasses = 'mb-2 block text-[11px] uppercase tracking-[0.18em] text-steel-300'

function fieldWidth(width?: number | null) {
  if (!width || width >= 100) return 'sm:col-span-2'
  return 'sm:col-span-1'
}

export function FormRenderer({ form }: { form: Form }) {
  const [status, setStatus] = useState<Status>('idle')
  const [error, setError] = useState<string | null>(null)

  const fields = (form.fields ?? []) as FormField[]

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setStatus('submitting')
    setError(null)

    const formElement = event.currentTarget
    const data = new FormData(formElement)
    const submissionData: SubmissionEntry[] = []

    try {
      for (const field of fields) {
        if (!('name' in field) || !field.name) continue

        if (field.blockType === 'fileUpload') {
          const file = data.get(field.name)
          if (!(file instanceof File) || file.size === 0) {
            if ('required' in field && field.required) {
              throw new Error(`${field.label || field.name} is required.`)
            }
            continue
          }
          if (file.size > MAX_FILE_BYTES) {
            throw new Error('That file is larger than 10MB. Email it to us instead and we’ll pick it up from there.')
          }

          // Upload first, then submit the resulting document id as the answer:
          // the form-builder stores every answer as a string.
          const upload = new FormData()
          upload.append('file', file)
          upload.append(
            '_payload',
            JSON.stringify({ submittedBy: String(data.get('email') ?? 'unknown') }),
          )

          const uploadResponse = await fetch('/api/quote-attachments', {
            method: 'POST',
            body: upload,
          })
          if (!uploadResponse.ok) throw new Error('That file could not be uploaded.')

          const uploaded = await uploadResponse.json()
          const doc = uploaded?.doc ?? uploaded
          submissionData.push({
            field: field.name,
            value: doc?.url ? `${doc.filename} — ${doc.url}` : String(doc?.id ?? ''),
          })
          continue
        }

        const value = data.get(field.name)
        if (value === null) continue

        if (field.blockType === 'checkbox') {
          submissionData.push({ field: field.name, value: value === 'on' ? 'Yes' : 'No' })
          continue
        }

        submissionData.push({ field: field.name, value: String(value) })
      }

      const response = await fetch('/api/form-submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ form: form.id, submissionData }),
      })

      if (!response.ok) {
        const body = await response.json().catch(() => null)
        throw new Error(body?.errors?.[0]?.message ?? 'Something went wrong. Please try again.')
      }

      setStatus('success')
      formElement.reset()
    } catch (submitError) {
      setStatus('error')
      setError(submitError instanceof Error ? submitError.message : 'Something went wrong.')
    }
  }

  if (status === 'success') {
    return (
      <div className="hairline bg-graphite-850 p-8">
        <p className="flex items-center gap-3 text-[11px] uppercase tracking-[0.18em] text-ember">
          <span className="inline-block h-px w-8 bg-ember" aria-hidden="true" />
          Received
        </p>
        <p className="mt-4 font-display text-2xl font-bold uppercase tracking-wide text-steel-50">
          {form.confirmationMessage ? 'Thanks — we’ve got it.' : 'Thanks — we’ve got it.'}
        </p>
        <p className="mt-3 text-sm leading-relaxed text-steel-300">
          We review every request by hand and come back with pricing and a lead time. If it’s
          urgent, call us and we’ll pull it forward.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="grid gap-5 sm:grid-cols-2">
      {fields.map((field, index) => {
        if (!('name' in field) || !field.name) {
          // The `message` field type carries rich text and no input.
          return null
        }

        const key = `${field.name}-${index}`
        const required = 'required' in field ? Boolean(field.required) : false
        const label = 'label' in field ? field.label : undefined
        const width = 'width' in field ? field.width : undefined

        const labelNode = label ? (
          <label htmlFor={field.name} className={labelClasses}>
            {label}
            {required && <span className="ml-1 text-ember">*</span>}
          </label>
        ) : null

        switch (field.blockType) {
          case 'textarea':
            return (
              <div key={key} className="sm:col-span-2">
                {labelNode}
                <textarea
                  id={field.name}
                  name={field.name}
                  required={required}
                  rows={5}
                  defaultValue={field.defaultValue ?? undefined}
                  className={cn(inputClasses, 'resize-y')}
                />
              </div>
            )

          case 'select':
            return (
              <div key={key} className={fieldWidth(width)}>
                {labelNode}
                <select
                  id={field.name}
                  name={field.name}
                  required={required}
                  defaultValue={field.defaultValue ?? ''}
                  className={inputClasses}
                >
                  <option value="">Select…</option>
                  {(field.options ?? []).map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            )

          case 'checkbox':
            return (
              <div key={key} className="flex items-start gap-3 sm:col-span-2">
                <input
                  id={field.name}
                  name={field.name}
                  type="checkbox"
                  required={required}
                  defaultChecked={Boolean(field.defaultValue)}
                  className="mt-1 size-4 accent-[var(--ember)]"
                />
                <label htmlFor={field.name} className="text-sm text-steel-200">
                  {label}
                </label>
              </div>
            )

          case 'fileUpload':
            return (
              <div key={key} className="sm:col-span-2">
                {labelNode}
                <input
                  id={field.name}
                  name={field.name}
                  type="file"
                  required={required}
                  accept={ACCEPTED_FILES}
                  className={cn(
                    inputClasses,
                    'file:mr-4 file:border-0 file:bg-graphite-700 file:px-4 file:py-2 file:font-display file:text-xs file:uppercase file:tracking-wider file:text-steel-50 hover:file:bg-graphite-600',
                  )}
                />
                {'helpText' in field && field.helpText && (
                  <p className="mt-2 text-xs text-steel-300">{field.helpText}</p>
                )}
              </div>
            )

          default: {
            const type =
              field.blockType === 'email'
                ? 'email'
                : field.blockType === 'number'
                  ? 'number'
                  : 'text'

            return (
              <div key={key} className={fieldWidth(width)}>
                {labelNode}
                <input
                  id={field.name}
                  name={field.name}
                  type={type}
                  required={required}
                  defaultValue={
                    'defaultValue' in field && field.defaultValue != null
                      ? String(field.defaultValue)
                      : undefined
                  }
                  className={inputClasses}
                />
              </div>
            )
          }
        }
      })}

      {error && (
        <p role="alert" className="sm:col-span-2 hairline border-ember/50 bg-ember/10 px-4 py-3 text-sm text-steel-50">
          {error}
        </p>
      )}

      <div className="sm:col-span-2">
        <Button type="submit" size="lg" disabled={status === 'submitting'}>
          {status === 'submitting' ? 'Sending…' : (form.submitButtonLabel ?? 'Send')}
        </Button>
      </div>
    </form>
  )
}
