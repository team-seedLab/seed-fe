export const USER_ROLE = {
  MENTEE: "ROLE_USER",
  MENTOR: "ROLE_MENTOR",
} as const;

export const isUserRole = (
  value: unknown,
): value is (typeof USER_ROLE)[keyof typeof USER_ROLE] => {
  return value === USER_ROLE.MENTEE || value === USER_ROLE.MENTOR;
};
