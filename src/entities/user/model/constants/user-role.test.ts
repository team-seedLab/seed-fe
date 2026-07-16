import { describe, expect, it } from "vitest";

import { USER_ROLE, isUserRole } from "./user-role";

describe("USER_ROLE", () => {
  it("백엔드 역할값과 동일한 값을 제공한다", () => {
    expect(USER_ROLE).toEqual({
      MENTEE: "ROLE_USER",
      MENTOR: "ROLE_MENTOR",
    });
  });

  it.each([USER_ROLE.MENTEE, USER_ROLE.MENTOR])(
    "%s를 지원하는 역할로 판단한다",
    (role) => {
      expect(isUserRole(role)).toBe(true);
    },
  );

  it.each([undefined, "MENTOR", "ROLE_ADMIN"])(
    "%s를 지원하지 않는 역할로 판단한다",
    (role) => {
      expect(isUserRole(role)).toBe(false);
    },
  );
});
