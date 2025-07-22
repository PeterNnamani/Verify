interface PasswordCredential extends Credential {
  readonly type: 'password';
  readonly id: string;
  readonly password: string;
}
