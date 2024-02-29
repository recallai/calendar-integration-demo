import { v4 as uuidv4 } from "uuid";
import { useEffect, useState } from "react";

const USER_ID_KEY = "_recall_cal_integration_userid";

export default function useLocalUser() {
  const [id, setId] = useState<string | null>(
    localStorage.getItem(USER_ID_KEY)
  );

  useEffect(() => {
    if (id) {
      return;
    }

    const userId: string = uuidv4();
    localStorage.setItem(USER_ID_KEY, userId);
    setId(userId);
  }, []);

  return {
    id,
  };
}
