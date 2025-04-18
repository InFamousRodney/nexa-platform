export interface CallbackParams {
  status: 'success' | 'error';
  error?: string;
  org_id?: string;
}

export interface ToastProps {
  title: string;
  description: string;
  variant?: 'default' | 'destructive';
}

export const MESSAGES = {
  SUCCESS_TITLE: 'Connection Successful',
  SUCCESS_DESCRIPTION: 'Your Salesforce org has been connected successfully.',
  ERROR_TITLE: 'Connection Failed',
  LOADING_TITLE: 'Processing Salesforce callback...',
  LOADING_DESCRIPTION: 'Please wait while we complete the connection.',
  COMPLETE_DESCRIPTION: 'Callback processed. Redirecting...'
} as const;
