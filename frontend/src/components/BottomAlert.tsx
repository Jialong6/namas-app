import { Alert } from '@material-tailwind/react';
import { useState, useEffect } from 'react';
export default function BottomAlert() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Add event listener for custom event 'show-bottom-alert'
    window.addEventListener('show-bottom-alert', ((
      event: CustomEvent<{ message: string; timeout: number }>,
    ) => {
      // Open the alert
      setOpen(true);
      // Set the message and timeout
      setMessage(event.detail?.message || '');
      const timeout = event.detail?.timeout || 2000;
      // Set the timeout to close the alert
      setTimeout(() => {
        setOpen(false);
      }, timeout);
    }) as EventListener);
    // Remove the event listener when the component unmounts
    return () => {
      window.removeEventListener(
        'show-bottom-alert',
        (() => {
          setOpen(false);
        }) as EventListener,
      );
    };
  }, []);

  return (
    <>
      <Alert
        variant="outlined"
        open={open}
        animate={{
          mount: { y: 0 },
          unmount: { y: 100 },
        }}
        className="fixed bottom-2 right-1 md:w-1/2 w-11/12 bg-white z-50"
      >
        <div className="flex items-center justify-center">
          <span>{message}</span>
        </div>
      </Alert>
    </>
  );
}
