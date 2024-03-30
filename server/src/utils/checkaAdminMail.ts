const ADMIN = process.env.ADMIN;

export const checkAdminMail = (email: string) => {
  if (email === ADMIN) {
    return true;
  } else {
    return false;
  }
};
