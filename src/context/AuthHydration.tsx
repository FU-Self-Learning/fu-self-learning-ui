"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setLoading, setUser } from "@/providers/auth/reducer/authSlice";
import { getStorageData } from "@/shared/store";
import { isObjectEmpty } from "@/utils/isObjectEmpty";

export default function AuthHydration() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setLoading(true));
    const raw = getStorageData("user");
    try {
      if (raw && !isObjectEmpty(raw)) {
        dispatch(setUser(raw));
      }
    } catch (e) {
      console.error("Failed to hydrate user from localStorage", e);
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  return null;
}
