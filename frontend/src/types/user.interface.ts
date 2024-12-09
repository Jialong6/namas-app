export interface IUser {
  email: string;
  first_name: string;
  last_name: string;
}

export interface ILogin {
  email: string;
  password: string;
}

export interface IError {
  [key: string]: string[];
}

export interface IRegistration extends IUser {
  password: string;
  confirm_password: string;
}

export interface IResponse {
  success: boolean;
  message: string;
  errors: IError | null;
}

export interface IUserResponse extends IResponse {
  user: IUser | null;
}
