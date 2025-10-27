export const getCurrentUser = () => {
  const user = localStorage.getItem('user');
  const parsedUser = user ? JSON.parse(user) : null;
  console.log('Current user:', parsedUser);
  return parsedUser;
};

export const isAdmin = () => {
  const user = getCurrentUser();
  return user && user.role === 'ADMIN';
};

export const isSalesRep = () => {
  const user = getCurrentUser();
  return user && user.role === 'SALES_REP';
};

export const isAnalyst = () => {
  const user = getCurrentUser();
  return user && user.role === 'ANALYST';
};

export const logout = () => {
  localStorage.removeItem('user');
};

export const hasPermission = (action) => {
  const user = getCurrentUser();
  if (!user) {
    console.log('No user found for permission check:', action);
    return false;
  }
  
  console.log(`Checking permission '${action}' for user role '${user.role}'`);
  
  switch (action) {
    case 'VIEW_CUSTOMERS':
      return true; // All roles can view customers
    case 'CREATE_CUSTOMER':
      return user.role === 'ADMIN' || user.role === 'SALES_REP';
    case 'UPDATE_CUSTOMER':
      return user.role === 'ADMIN' || user.role === 'SALES_REP';
    case 'DELETE_CUSTOMER':
      return user.role === 'ADMIN'; // Only ADMIN can delete
    case 'VIEW_INTERACTIONS':
      return true; // All roles can view interactions
    case 'CREATE_INTERACTION':
      return user.role === 'ADMIN' || user.role === 'SALES_REP';
    case 'UPDATE_INTERACTION':
      return user.role === 'ADMIN' || user.role === 'SALES_REP';
    case 'DELETE_INTERACTION':
      return user.role === 'ADMIN';
    case 'VIEW_CHARTS':
      return user.role === 'ADMIN' || user.role === 'ANALYST'; // SALES_REP cannot view analytics
    case 'MANAGE_USERS':
      return false; // No role can manage users
    default:
      return false;
  }
};