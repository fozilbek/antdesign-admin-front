export function setToken(token: string): void {

  localStorage.setItem('token', token);
}

export function getToken(): string {

  const tk = localStorage.getItem('token');

  if (tk) {
    return tk as string;
  }
  return '';
}
