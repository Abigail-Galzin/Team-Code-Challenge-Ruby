import { apiClient } from "./apiClient";
import type { CommentResponse, CreateCommentPayload } from "../types";

export function createComment(supportRequestId: number, payload: CreateCommentPayload) {
  return apiClient
    .post<CommentResponse>(`/v1/support_requests/${supportRequestId}/comments`, { comment: payload })
    .then((response) => response.data);
}
