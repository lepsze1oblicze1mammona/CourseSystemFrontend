export function setAuth(token: string, role: string, id:string) {
  localStorage.setItem('token', token);
  localStorage.setItem('role', role);
  localStorage.setItem('id', id);
}

// Pobierz token
export function getToken(): string | null {
  return localStorage.getItem('token');
}

// Pobierz rolę
export function getRole(): string | null {
  return localStorage.getItem('role');
}

export function getId(): string | null {
  return localStorage.getItem('id');
}

// Usuń token i rolę (np. przy wylogowaniu)
export function clearAuth() {
  localStorage.removeItem('token');
  localStorage.removeItem('role');
  localStorage.removeItem('id');
}