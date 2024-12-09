import {
  Button,
  Dialog,
  Card,
  CardBody,
  CardFooter,
  Typography,
  Input,
  Checkbox,
} from '@material-tailwind/react';
import {
  ChevronLeftIcon,
  EnvelopeIcon,
  EyeIcon,
  EyeSlashIcon,
} from '@heroicons/react/24/outline';
import { useEffect, useState } from 'react';
import { ILogin, IRegistration } from 'types/user.interface';
import { login, register } from '@services/userService';

// Select Sign In Method Page
function SelectSignInMethod({
  setEmailSignIn,
}: {
  setEmailSignIn: (value: boolean) => void;
}) {
  return (
    <>
      {/* OAuth Google */}
      <Button
        size="lg"
        variant="outlined"
        color="blue-gray"
        className="flex items-center gap-3 justify-center"
        onClick={() => {
          window.location.href = `${import.meta.env.VITE_BACKEND_URL}/oauth/login/google-oauth2/`;
        }}
      >
        <img src="/icons/google.svg" alt="google" className="h-6 w-6" />
        Continue with Google
      </Button>
      {/* Sign In */}
      <Button
        size="lg"
        variant="outlined"
        color="blue-gray"
        className="flex items-center gap-3 justify-center"
        onClick={() => setEmailSignIn(true)}
      >
        <EnvelopeIcon className="h-6 w-6" />
        Continue with Email
      </Button>
    </>
  );
}

// Email Sign In Page
function EmailSignIn({
  setEmailSignIn,
}: {
  setEmailSignIn: (value: boolean) => void;
}) {
  const [showPassword, setShowPassword] = useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = useState('');
  const [passwordErrorMessage, setPasswordErrorMessage] = useState('');
  const [nonFieldErrorMessage, setNonFieldErrorMessage] = useState('');
  const [loginData, setLoginData] = useState<ILogin>({
    email: '',
    password: '',
  });

  const handleLogin = async () => {
    const response = await login(loginData);
    if (response.success) {
      // Show bottom alert
      window.dispatchEvent(
        new CustomEvent('show-bottom-alert', {
          detail: {
            message: 'Login successful.',
            timeout: 2000,
          },
        }),
      );
      // Reload the page
      window.location.reload();
    } else {
      // Reset all error messages
      setEmailErrorMessage('');
      setPasswordErrorMessage('');
      setNonFieldErrorMessage('');

      if (!response.errors) {
        setNonFieldErrorMessage(response.message);
      } else {
        // Iterate through the errors and set the error message
        Object.entries(response.errors).forEach(([field, messages]) => {
          switch (field) {
            case 'email':
              setEmailErrorMessage(messages[0]);
              break;
            case 'password':
              setPasswordErrorMessage(messages[0]);
              break;
            default:
              setNonFieldErrorMessage(messages[0]);
          }
        });
      }
    }
  };

  return (
    <>
      <button
        className="flex items-center absolute top-4"
        onClick={() => setEmailSignIn(false)}
      >
        <ChevronLeftIcon className="h-5 w-5" />
        Back
      </button>
      <Typography className="font-normal mt-8" variant="paragraph" color="gray">
        Enter your email and password to sign in.
      </Typography>
      {/* Email Input Field */}
      <div className="flex flex-col gap-1 w-full">
        <Input
          className="mb-3"
          label="Email"
          size="lg"
          crossOrigin={undefined}
          value={loginData.email}
          onChange={(e) =>
            setLoginData({ ...loginData, email: e.target.value })
          }
        />
        {/* Email Error Message */}
        <div className="ml-4 text-sm text-red-500">{emailErrorMessage}</div>
      </div>
      {/* Password Input Field */}
      <div className="flex flex-col gap-1 w-full">
        <Input
          label="Password"
          size="lg"
          crossOrigin={undefined}
          type={showPassword ? 'text' : 'password'}
          icon={
            <div
              onClick={() => setShowPassword(!showPassword)}
              className="cursor-pointer"
            >
              {showPassword ? (
                <EyeSlashIcon className="h-5 w-5" />
              ) : (
                <EyeIcon className="h-5 w-5" />
              )}
            </div>
          }
          value={loginData.password}
          onChange={(e) =>
            setLoginData({ ...loginData, password: e.target.value })
          }
        />
        {/* Password Error Message */}
        <div className="ml-4 text-sm text-red-500">{passwordErrorMessage}</div>
      </div>
      {/* <div className="-ml-2.5 -mt-3">
        <Checkbox label="Remember Me" crossOrigin={undefined} />
      </div> */}
      <Button variant="filled" fullWidth onClick={() => void handleLogin()}>
        Sign In
      </Button>
      {/* Non Field Error Message */}
      <div className="ml-1 text-sm text-red-500">{nonFieldErrorMessage}</div>
    </>
  );
}

// Sign Up Page
function SignUp({ setSignUp }: { setSignUp: (value: boolean) => void }) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [nonFieldErrorMessage, setNonFieldErrorMessage] = useState('');
  const [firstNameErrorMessage, setFirstNameErrorMessage] = useState('');
  const [lastNameErrorMessage, setLastNameErrorMessage] = useState('');
  const [emailErrorMessage, setEmailErrorMessage] = useState('');
  const [passwordErrorMessage, setPasswordErrorMessage] = useState('');
  const [confirmPasswordErrorMessage, setConfirmPasswordErrorMessage] =
    useState('');
  const [registrationData, setRegistrationData] = useState<IRegistration>({
    email: '',
    first_name: '',
    last_name: '',
    password: '',
    confirm_password: '',
  });

  const handleRegister = async () => {
    const response = await register(registrationData);
    if (response?.success) {
      // Show bottom alert
      window.dispatchEvent(
        new CustomEvent('show-bottom-alert', {
          detail: {
            message: 'You are successfully registered.',
            timeout: 2000,
          },
        }),
      );
      // Reload the page
      window.location.reload();
    } else {
      // Reset all error messages
      setFirstNameErrorMessage('');
      setLastNameErrorMessage('');
      setEmailErrorMessage('');
      setPasswordErrorMessage('');
      setConfirmPasswordErrorMessage('');
      setNonFieldErrorMessage('');

      if (!response.errors) {
        setNonFieldErrorMessage(response.message);
      } else {
        // Iterate through the errors and set the error message
        Object.entries(response.errors).forEach(([field, messages]) => {
          switch (field) {
            case 'first_name':
              setFirstNameErrorMessage(messages[0]);
              break;
            case 'last_name':
              setLastNameErrorMessage(messages[0]);
              break;
            case 'email':
              setEmailErrorMessage(messages[0]);
              break;
            case 'password':
              setPasswordErrorMessage(messages[0]);
              break;
            case 'confirm_password':
              setConfirmPasswordErrorMessage(messages[0]);
              break;
            default:
              setNonFieldErrorMessage(messages[0]);
          }
        });
      }
    }
  };

  return (
    <>
      <button
        className="flex items-center absolute top-4"
        onClick={() => setSignUp(false)}
      >
        <ChevronLeftIcon className="h-5 w-5" />
        Back
      </button>
      <Typography
        className="font-normal mt-8 ml-1"
        variant="paragraph"
        color="gray"
      >
        Create your account
      </Typography>
      {/* First Name Input Field */}
      <div className="flex flex-col gap-1 w-full">
        <Input
          label="First Name"
          size="md"
          crossOrigin={undefined}
          value={registrationData.first_name}
          onChange={(e) =>
            setRegistrationData({
              ...registrationData,
              first_name: e.target.value,
            })
          }
        />
        {/* First Name Error Message */}
        <div className="ml-4 text-sm text-red-500">{firstNameErrorMessage}</div>
      </div>
      {/* Last Name Input Field */}
      <div className="flex flex-col gap-1 w-full">
        <Input
          label="Last Name"
          size="md"
          crossOrigin={undefined}
          value={registrationData.last_name}
          onChange={(e) =>
            setRegistrationData({
              ...registrationData,
              last_name: e.target.value,
            })
          }
        />
        {/* Last Name Error Message */}
        <div className="ml-4 text-sm text-red-500">{lastNameErrorMessage}</div>
      </div>
      {/* Email Input Field */}
      <div className="flex flex-col gap-1 w-full">
        <Input
          className="mb-3"
          label="Email"
          size="lg"
          crossOrigin={undefined}
          value={registrationData.email}
          onChange={(e) =>
            setRegistrationData({ ...registrationData, email: e.target.value })
          }
        />
        {/* Email Error Message */}
        <div className="ml-4 text-sm text-red-500">{emailErrorMessage}</div>
      </div>
      {/* Password Input Field */}
      <div className="flex flex-col gap-1 w-full">
        <Input
          label="Password"
          size="lg"
          crossOrigin={undefined}
          type={showPassword ? 'text' : 'password'}
          icon={
            <div
              onClick={() => setShowPassword(!showPassword)}
              className="cursor-pointer h-5 w-5"
            >
              {showPassword ? (
                <EyeSlashIcon className="h-5 w-5" />
              ) : (
                <EyeIcon className="h-5 w-5" />
              )}
            </div>
          }
          value={registrationData.password}
          onChange={(e) =>
            setRegistrationData({
              ...registrationData,
              password: e.target.value,
            })
          }
        />
        {/* Password Error Message */}
        <div className="ml-4 text-sm text-red-500">{passwordErrorMessage}</div>
      </div>
      {/* Confirm Password Input Field */}
      <div className="flex flex-col gap-1 w-full">
        <Input
          className="mb-3"
          label="Confirm Password"
          size="lg"
          crossOrigin={undefined}
          type={showConfirmPassword ? 'text' : 'password'}
          icon={
            <div
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="cursor-pointer"
            >
              {showConfirmPassword ? (
                <EyeSlashIcon className="h-5 w-5" />
              ) : (
                <EyeIcon className="h-5 w-5" />
              )}
            </div>
          }
          value={registrationData.confirm_password}
          onChange={(e) =>
            setRegistrationData({
              ...registrationData,
              confirm_password: e.target.value,
            })
          }
        />
        {/* Confirm Password Error Message */}
        <div className="ml-4 text-sm text-red-500">
          {confirmPasswordErrorMessage}
        </div>
      </div>
      <Button
        variant="filled"
        fullWidth
        className="mt-4"
        onClick={() => void handleRegister()}
      >
        Sign Up
      </Button>
      {/* Error Message */}
      <div className="ml-1 text-sm text-red-500">{nonFieldErrorMessage}</div>
    </>
  );
}

export default function AuthDialog() {
  const [open, setOpen] = useState(false);
  const [emailSignIn, setEmailSignIn] = useState(false);
  const [signUp, setSignUp] = useState(false);

  // Listen for custom event 'show-auth-dialog'
  useEffect(() => {
    window.addEventListener('show-auth-dialog', () => setOpen(true));
    return () =>
      window.removeEventListener('show-auth-dialog', () => setOpen(false));
  }, [setOpen]);

  return (
    <>
      <Dialog
        size="xs"
        open={open}
        handler={() => setOpen(false)}
        className="bg-transparent shadow-none"
      >
        <Card className="mx-auto w-full max-w-[24rem]">
          <CardBody className="flex flex-col gap-3">
            {/* Select Sign In Method */}
            {!emailSignIn && !signUp && (
              <SelectSignInMethod setEmailSignIn={setEmailSignIn} />
            )}
            {/* Email Sign In */}
            {emailSignIn && !signUp && (
              <EmailSignIn setEmailSignIn={setEmailSignIn} />
            )}
            {/* Sign Up */}
            {signUp && <SignUp setSignUp={setSignUp} />}
          </CardBody>
          {/* Sign Up Footer */}
          {!signUp && (
            <CardFooter className="pt-0 flex flex-col gap-1 -mt-2">
              <Typography variant="small" className="flex justify-center">
                Don&apos;t have an account?
                <Typography
                  as="a"
                  href="#signup"
                  variant="small"
                  color="blue-gray"
                  className="ml-1 font-bold"
                  onClick={() => setSignUp(true)}
                >
                  Sign up
                </Typography>
              </Typography>
            </CardFooter>
          )}
        </Card>
      </Dialog>
    </>
  );
}
