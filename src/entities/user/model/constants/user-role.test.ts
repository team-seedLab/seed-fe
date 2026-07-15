import { describe, expect, it } from "vitest";

import { USER_ROLE } from "./user-role";

describe("USER_ROLE", () => {
  it("백엔드 역할값과 동일한 값을 제공한다", () => {
    expect(USER_ROLE).toEqual({
      MENTEE: "ROLE_USER",
      MENTOR: "ROLE_MENTOR",
    });
  });
});
