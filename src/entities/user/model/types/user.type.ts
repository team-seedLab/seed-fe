import { USER_ROLE } from "../constants/user-role";

export type UserRole = (typeof USER_ROLE)[keyof typeof USER_ROLE];
