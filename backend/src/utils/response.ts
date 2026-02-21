import { Response } from 'express';

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
}

export const sendResponse = <T>(
  res: Response,
  statusCode: number,
  payload: ApiResponse<T>
): Response => {
  return res.status(statusCode).json(payload);
};
