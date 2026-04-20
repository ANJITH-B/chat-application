import { Toaster } from 'react-hot-toast'

const Toast = () => {
  return (
    <Toaster
      toastOptions={{
        className: '',
        style: {
          border: '1px solid #713200',
          padding: '16px',
          color: '#713200',
        },
      }}
    />
  )
}

export default Toast