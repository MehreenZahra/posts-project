import React from 'react'

const LoaderButton = () => {
  return (
    <div className="flex flex-col items-center">
      <div className="h-6 w-6 animate-spin rounded-full border-2 border-gray-300 border-t-gray-900 dark:border-gray-600 dark:border-t-gray-50" />
    </div>
  )
}

export default LoaderButton