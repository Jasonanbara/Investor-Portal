const mockUser = {
  id: 'usr_001',
  name: 'James Richardson',
  email: 'james.richardson@example.com',
  role: 'Investor' as const,
};

export function useCurrentUser() {
  return {
    user: mockUser,
    isLoading: false,
    isAuthenticated: true,
  };
}
