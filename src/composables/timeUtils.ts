const formatDate = (
  dateString: string,
  locale: string = 'en-US',
  options?: Intl.DateTimeFormatOptions
): string => {
  const date = new Date(dateString)
  const defaultOptions: Intl.DateTimeFormatOptions = options ?? {
    weekday: 'long',
    month: 'long',
    day: 'numeric'
  }
  return date.toLocaleDateString(locale, defaultOptions)
}

export { formatDate }
