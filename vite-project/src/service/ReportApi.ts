import axios from "axios";
import { baseUrl } from "@/utils/AppInfo";

export interface ReportPayload {
  reason: string;
  detail?: string;
  targetType: "COMMENT" | "ARTICLE" | string;
  targetId: string;
}

export const reportTarget = async (payload: ReportPayload) => {
  const token = localStorage.getItem("token");
  const response = await axios.post(
    `${baseUrl}/reports`,
    {
      reason: payload.reason,
      detail: payload.detail,
      targetType: payload.targetType,
      targetId: payload.targetId,
    },
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
}; 