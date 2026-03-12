import { FunctionsHttpError } from "@supabase/supabase-js";

import { supabase } from "@/shared";

type WaitlistSubmitResult = {
  success: boolean;
  errorMessage?: string;
};

export const useWaitList = () => {
  const submit = async (email: string): Promise<WaitlistSubmitResult> => {
    try {
      const { error } = await supabase.functions.invoke("notify-waitlist", {
        body: { email },
      });

      if (error) {
        let message = "오류가 발생했습니다. 잠시 후 다시 시도해주세요.";
        try {
          if (error instanceof FunctionsHttpError) {
            const body = await error.context.json();
            if (body?.error) message = body.error;
          }
        } catch (e) {
          console.error("Error parsing error message:", e);
        }
        return { success: false, errorMessage: message };
      }

      return { success: true };
    } catch (e) {
      console.error("useWaitList submit 중 예기치 않은 오류 발생:", e);
      return {
        success: false,
        errorMessage: "오류가 발생했습니다. 잠시 후 다시 시도해주세요.",
      };
    }
  };

  return { submit };
};
