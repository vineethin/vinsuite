export const isQARole = (role, adminActingAs) => {
  return ['qa', 'tester'].includes(role) || adminActingAs === 'tester';
};
