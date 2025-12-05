import type { ColorError, ColorErrorType } from './types'

const MIN_MESSAGE_LENGTH = 15

export function createError(
  type: ColorErrorType,
  code: string,
  message: string,
  field?: string,
): ColorError {
  const normalizedMessage = message.length >= MIN_MESSAGE_LENGTH
    ? message
    : `${message}${'.'.repeat(MIN_MESSAGE_LENGTH - message.length)}`

  return {
    type,
    code,
    field,
    message: normalizedMessage,
  }
}

export function throwError(
  type: ColorErrorType,
  code: string,
  message: string,
  field?: string,
): never {
  throw createError(type, code, message, field)
}
