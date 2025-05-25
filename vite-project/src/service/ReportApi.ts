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

export const fetchReports = async({
  page = 0,
  limit = 10,
  sortBy = "createdAt",
  search,
  targetType,
  startDate, 
  endDate,
  status
}: {
  page?: number;
  limit?: number;
  sortBy?: string;
    search?: string;
    targetType?: string;
    startDate?: string;
    endDate?: string;
    status?: 'PENDING' | 'RESOLVED' | string;
}) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${baseUrl}/reports`, {
      params: {
        page,
        limit,
        sortBy,
        search,
        targetType,
        startDate: startDate ?  new Date(startDate || "").toISOString().replace(/Z$/, '') : undefined,
        endDate: endDate ? new Date(endDate || "").toISOString().replace(/Z$/, '') : undefined,
        status: status || undefined,
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.result;
  } catch (error) {
    console.error("Error fetching reports:", error);
    throw error;
  }
}

export const updateReportStatus = async (reportId: string, status: "PENDING" | "UNRESOLVED" | string, adminNote : string) => {

  try {
    const token = localStorage.getItem("token");
    const response = await axios.put(
      `${baseUrl}/reports/${reportId}`,
      { status, adminNote },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  }catch(error) {
    console.error("Error updating report status:", error);
    throw error;
  }
}


export async function deleteReport(reportId: string) {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.delete(`${baseUrl}/reports/${reportId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.result;
  } catch (error) {
    console.error("Error deleting report:", error);
    throw error;
  }
}