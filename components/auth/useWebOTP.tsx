import { useEffect } from 'react';

interface OTPCredential {
    code: string;
}

interface CredentialRequestOptions {
    otp?: {
        transport: string[];
    },
    signal?: AbortSignal;
}

const useWebOTP = (onOtpReceived: (otp: string) => void) => {
    useEffect(() => {
        if ('OTPCredential' in window) {
            const input = document.querySelector('input[autocomplete="one-time-code"]');
            if (!input) return;

            const ac = new AbortController();
            const form = input.closest('form');

            if (form) {
                form.addEventListener('submit', () => {
                    ac.abort();
                });
            }

            navigator.credentials.get({
                otp: { transport: ['sms'] },
                signal: ac.signal
            } as CredentialRequestOptions)
                .then((value) => {
                    const otp = value as unknown as OTPCredential;
                    (input as HTMLInputElement).value = otp.code;
                    if (onOtpReceived) onOtpReceived(otp.code); // Callback to parent component
                    if (form) form.submit();
                })
                .catch(err => {
                    console.error('WebOTP error:', err);
                });

            return () => ac.abort(); // Cleanup on unmount
        }
    }, [onOtpReceived]);
};

export default useWebOTP;
