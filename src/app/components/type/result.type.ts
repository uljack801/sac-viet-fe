export type RegisterResponse = {
    data?: {
      confirm_access: string;
      message: string;
    };
    status: number;
    error?: string;
  }

  export type RegisterSuccessResponse = {
    data?: {
      access_token: string;
      message: string;
    };
    status: number;
    error?: string;
  }