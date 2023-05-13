export function generateNotice(type, message) {
  return {
    type,
    message,
    expires: new Date().getTime() + 3000,
  };
}

