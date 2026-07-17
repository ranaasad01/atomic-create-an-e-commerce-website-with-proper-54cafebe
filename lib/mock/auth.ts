export interface MockUser {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

const DEMO_USER: MockUser = {
  id: "user-demo-001",
  name: "Alex Johnson",
  email: "alex@example.com",
};

export function getMockUser(): MockUser {
  return DEMO_USER;
}

export function isAuthenticated(): boolean {
  return true;
}

export function signIn(_email: string, _password: string): Promise<MockUser> {
  return Promise.resolve(DEMO_USER);
}

export function signUp(_name: string, _email: string, _password: string): Promise<MockUser> {
  return Promise.resolve({ ...DEMO_USER, name: _name, email: _email });
}

export function signOut(): Promise<void> {
  return Promise.resolve();
}