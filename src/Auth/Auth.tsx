export function setAuth(token: string, role: string, id:string) {
  sessionStorage.setItem('token', token);
  sessionStorage.setItem('role', role);
  sessionStorage.setItem('id', id);
}

// Pobierz token
export function getToken(): string | null {
  return sessionStorage.getItem('token');
}

// Pobierz rolę
export function getRole(): string | null {
  return sessionStorage.getItem('role');
}

export function getEmail(): string | null {
  return sessionStorage.getItem("email");
}
export function getId(): string | null {
  return sessionStorage.getItem('id');
}

// Usuń token i rolę (np. przy wylogowaniu)
export function clearAuth() {
  sessionStorage.removeItem('token');
  sessionStorage.removeItem('role');
  sessionStorage.removeItem('id');
}
