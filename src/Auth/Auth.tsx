export function setAuth(token: string, role: string) {
  localStorage.setItem('token', token);
  localStorage.setItem('role', role);
}

// Pobierz token
export function getToken(): string | null {
  return localStorage.getItem('token');
}

// Pobierz rolę
export function getRole(): string | null {
  return localStorage.getItem('role');
}

// Usuń token i rolę (np. przy wylogowaniu)
export function clearAuth() {
  localStorage.removeItem('token');
  localStorage.removeItem('role');
}