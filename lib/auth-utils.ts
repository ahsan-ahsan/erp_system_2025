export function getRedirectPathByRole(role: string): string {
  switch (role.toUpperCase()) {
    case 'ADMIN':
      return '/'
    case 'MANAGER':
      return '/'
    case 'EMPLOYEE':
      return '/hr'
    case 'VIEWER':
      return '/'
    default:
      return '/'
  }
}

export function getRoleDisplayName(role: string): string {
  switch (role.toUpperCase()) {
    case 'ADMIN':
      return 'Administrator'
    case 'MANAGER':
      return 'Manager'
    case 'EMPLOYEE':
      return 'Employee'
    case 'VIEWER':
      return 'Viewer'
    default:
      return 'User'
  }
}
