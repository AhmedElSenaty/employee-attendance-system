export interface ILoginCredentials {
  email: string;
  password: string;
  rememberMe: boolean;
}
export interface IResetPassword {
  newPassword: string;
  confirmPass: string;
  mail: string;
  token:string
}

export interface ILoginResponse {
  status: number
  message: string
  data: {
    token: string,
    lock: ILockObj
    attempts: IAttemptsObj
    isLocked: boolean,
    isBlocked: boolean
    imageUrl: null | string;
  },
  errors?: string[];
}

interface ILockObj {
  lockDuration: string,
  remainingLockDuration: string,
};

interface IAttemptsObj {
  attemptCount: number,
  availableAttempts: number,
}

export const initialLoginResponse: ILoginResponse = {
  status: 0,
  message: "",
  data: {
    token: "",
    lock: {
      lockDuration: "00:00:00",
      remainingLockDuration: "00:00:00",
    },
    attempts: {
      attemptCount: 0,
      availableAttempts: 0
    },
    isLocked: false,
    isBlocked: false,
    imageUrl: null
  },
  errors: []
}