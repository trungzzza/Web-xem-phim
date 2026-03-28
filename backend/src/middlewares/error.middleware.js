export function notFoundHandler(req, res) {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  })
}

export function errorHandler(err, req, res, _next) {
  const status = err?.response?.status || err?.status || 500
  const message =
    err?.response?.data?.status_message ||
    err?.message ||
    'Internal server error'

  if (status >= 500) {
    console.error('[ERROR]', err)
  }

  res.status(status).json({
    success: false,
    message,
  })
}
