import type { protocols } from "./constants";

export type BaseDestinationFormValues = {
    enabled: boolean;
    name: string;
    type: keyof typeof protocols;
    host?: string;
    port?: number;
};

export type RootFormValues = {
    root: string;
};

export type LocalDestinationFormValues = BaseDestinationFormValues & RootFormValues & {
    type: 'local';
    auth_type: undefined;
    username?: never;
    password?: never;
    confirm_password?: never;
    private_key?: never;
    passphrase?: never;
};

export type FTPDestinationFormValues = BaseDestinationFormValues & RootFormValues &  {
    type: 'ftp';
    auth_type?: never;
    username: string;
    password: string;
    confirm_password: string;
};

export type SFTPDestinationPasswordFormValues = BaseDestinationFormValues & {
    type: 'sftp';
    auth_type: 'password';
    username: string;
    password: string;
    confirm_password: string;
};

export type SFTPDestinationKeyFormValues = BaseDestinationFormValues & {
    type: 'sftp';
    auth_type: 'key';
    username: string;
    private_key: string;
    passphrase: string;
};

export type SFTPDestinationFormValues = SFTPDestinationPasswordFormValues | SFTPDestinationKeyFormValues & RootFormValues;

export type DestinationFormValues = LocalDestinationFormValues | FTPDestinationFormValues | SFTPDestinationFormValues;
